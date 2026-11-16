import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DatePicker } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';
import { finalize, forkJoin, interval, type Observable } from 'rxjs';
import { ApiService } from '../../../core/api/api.service';
import type {
  MemberPermission,
  MemberPermissionBadgeTone,
  MemberPermissionCatalogItem,
  MemberPermissionGroup,
  MemberSession,
  TenantAuditEntry,
  TenantMember,
  TenantMemberRole,
  UserSex,
} from '../../../core/api/tenant-users.types';
import { AuthSessionService } from '../../../core/auth/auth-session.service';
import { AppDialogService } from '../../../core/ui/dialog';
import { AppLoadingService } from '../../../core/ui/loading';
import {
  formatRdcPhoneLocalDisplay,
  formatTelephoneWithCountryCode,
  rdcPhoneErrorMessage,
  rdcPhoneValidator,
  rdcPhoneValueFromInput,
} from '../../../core/utils/rdc-phone.util';

type RoleTemplateId = 'cashier_standard' | 'cashier_delegate' | 'stock_receiver';

interface RoleTemplate {
  id: RoleTemplateId;
  title: string;
  subtitle: string;
  roles: TenantMemberRole[];
  targets: Record<string, boolean>;
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Button,
    Card,
    DatePicker,
    DialogModule,
    InputGroup,
    InputGroupAddon,
    InputText,
    Select,
    TableModule,
    Tooltip,
  ],
  selector: 'app-utilisateurs-droits',
  styleUrl: './utilisateurs-droits.scss',
  templateUrl: './utilisateurs-droits.html',
})
export class UtilisateursDroits implements OnInit {
  private static readonly AUDIT_POLL_MS = 30_000;

  private readonly api = inject(ApiService);
  private readonly authSession = inject(AuthSessionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(AppDialogService);
  private readonly fb = inject(FormBuilder);
  private readonly loadingOverlay = inject(AppLoadingService);

  readonly session = this.authSession.session;
  readonly members = signal<TenantMember[]>([]);
  readonly permissionCatalog = signal<MemberPermissionCatalogItem[]>([]);
  readonly memberPermissions = signal<MemberPermission[]>([]);
  readonly memberSessions = signal<MemberSession[]>([]);
  readonly auditEntries = signal<TenantAuditEntry[]>([]);
  readonly selectedMember = signal<TenantMember | null>(null);
  readonly focusedMember = signal<TenantMember | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly confirmingCreate = signal(false);
  readonly error = signal<string | null>(null);
  readonly createOpen = signal(false);
  readonly editOpen = signal(false);
  readonly permissionDraft = signal<{ code: string; allowed: boolean; label: string } | null>(null);
  readonly permissionReasonDraft = signal('');
  readonly createError = signal<string | null>(null);
  readonly search = signal('');
  readonly roleFilter = signal<'all' | TenantMemberRole>('all');
  readonly auditActorFilter = signal('all');
  readonly today = new Date();
  readonly assignableRoleOptions = [
    { label: 'Caissier / Caissière', value: 'cashier' as const },
    { label: 'Responsable des stocks', value: 'stock_manager' as const },
  ];
  readonly membersTablePageSize = 10;
  readonly membersTablePageSizeOptions = [5, 10, 20];
  readonly membersTableStyle = { 'min-width': '47.5rem' };
  readonly auditTablePageSize = 10;
  readonly auditTablePageSizeOptions = [10, 20, 50];
  readonly auditTableStyle = { 'min-width': '52rem' };
  readonly auditTablePageReport =
    '{first}–{last} sur {totalRecords} événement(s) affiché(s)';
  readonly memberFilterRoleOptions: { label: string; value: 'all' | TenantMemberRole }[] = [
    { label: 'Tous les rôles', value: 'all' },
    { label: 'Gérant', value: 'owner' },
    { label: 'Caissier', value: 'cashier' },
    { label: 'Responsable stocks', value: 'stock_manager' },
  ];
  readonly sexOptions = [
    { label: 'Masculin', value: 'male' as const },
    { label: 'Féminin', value: 'female' as const },
  ];

  readonly createForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    sex: ['male' as UserSex, Validators.required],
    phone: ['', rdcPhoneValidator()],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    role: ['cashier' as 'cashier' | 'stock_manager', Validators.required],
  });

  readonly filteredMembers = computed(() => {
    const query = this.search().trim().toLocaleLowerCase('fr');
    const role = this.roleFilter();
    return this.members().filter((member) => {
      const matchesRole = role === 'all' || member.role === role;
      const haystack = `${member.firstName} ${member.lastName} ${member.email}`.toLocaleLowerCase(
        'fr',
      );
      return matchesRole && (!query || haystack.includes(query));
    });
  });

  readonly activeCount = computed(() => this.members().filter((member) => member.isActive).length);
  readonly rosterRoleCounts = computed(() => {
    const members = this.members();
    return {
      all: members.length,
      owner: members.filter((member) => member.role === 'owner').length,
      cashier: members.filter((member) => member.role === 'cashier').length,
      stock_manager: members.filter((member) => member.role === 'stock_manager').length,
    };
  });
  readonly editDialogHeader = computed(() =>
    this.selectedMember() ? 'Gérer le compte collaborateur' : 'Compte collaborateur',
  );

  private readonly permissionHelpText: Record<string, string> = {
    'discount.exceptional':
      'Appliquer une remise au-delà du plafond habituel en caisse (cas exceptionnel).',
    'stock.adjust': 'Corriger manuellement les quantités en stock (entrée ou sortie).',
    'sale.cancel': 'Annuler une vente déjà enregistrée.',
    'sale.refund': 'Enregistrer un remboursement client.',
    'quarantine.release': 'Sortir un lot de quarantaine qualité.',
  };

  private static readonly permissionRoleDefaults: Record<
    TenantMemberRole,
    Record<string, boolean>
  > = {
    owner: {
      'discount.exceptional': true,
      'stock.adjust': true,
      'sale.cancel': true,
      'sale.refund': true,
      'quarantine.release': true,
    },
    cashier: {
      'discount.exceptional': false,
      'stock.adjust': false,
      'sale.cancel': false,
      'sale.refund': false,
      'quarantine.release': false,
    },
    stock_manager: {
      'discount.exceptional': false,
      'stock.adjust': true,
      'sale.cancel': false,
      'sale.refund': false,
      'quarantine.release': true,
    },
  };

  private readonly permissionMatrixGroupsMeta: Record<
    MemberPermissionGroup,
    { title: string; subtitle: string; icon: string; iconShell: string; badgeClass: string }
  > = {
    pos: {
      title: 'Section A : Ventes & Encaissements au Comptoir (POS)',
      subtitle: 'Actions autorisées pendant le cycle de paiement d’un ticket',
      icon: 'fa-cart-shopping text-primary',
      iconShell: 'bg-primary/10',
      badgeClass: 'bg-primary/15 text-primary',
    },
    stock: {
      title: 'Section C : Gestion des Stocks & Traçabilité FEFO',
      subtitle: 'Inventaire, réceptions et lots en quarantaine',
      icon: 'fa-boxes-stacked text-retail-blue',
      iconShell: 'bg-retail-blue/10',
      badgeClass: 'bg-retail-blue/15 text-retail-blue',
    },
  };

  readonly permissionMatrixGroups = computed(() => {
    const order: MemberPermissionGroup[] = ['pos', 'stock'];
    const byGroup = new Map<MemberPermissionGroup, MemberPermissionCatalogItem[]>();
    for (const item of this.permissionCatalog()) {
      const group = item.group ?? 'pos';
      const bucket = byGroup.get(group) ?? [];
      bucket.push(item);
      byGroup.set(group, bucket);
    }
    return order
      .filter((id) => (byGroup.get(id)?.length ?? 0) > 0)
      .map((id) => ({ id, items: byGroup.get(id)! }));
  });

  readonly roleTemplates: RoleTemplate[] = [
    {
      id: 'cashier_standard',
      title: 'Caissier Simple (Standard)',
      subtitle: 'Encaissement strict, aucune dérogation caisse',
      roles: ['cashier'],
      targets: {
        'discount.exceptional': false,
        'sale.cancel': false,
        'sale.refund': false,
        'stock.adjust': false,
        'quarantine.release': false,
      },
    },
    {
      id: 'cashier_delegate',
      title: 'Caissier Senior / Délégué',
      subtitle: 'Remises, annulations et remboursements tracés',
      roles: ['cashier'],
      targets: {
        'discount.exceptional': true,
        'sale.cancel': true,
        'sale.refund': true,
        'stock.adjust': false,
        'quarantine.release': false,
      },
    },
    {
      id: 'stock_receiver',
      title: 'Magasinier & Réceptionnaire',
      subtitle: 'Stocks et quarantaine, sans accès caisse',
      roles: ['stock_manager'],
      targets: {
        'discount.exceptional': false,
        'sale.cancel': false,
        'sale.refund': false,
        'stock.adjust': true,
        'quarantine.release': true,
      },
    },
  ];

  readonly auditActorFilterOptions = computed(() => [
    { label: 'Tous les collaborateurs', value: 'all' },
    ...this.members().map((member) => ({
      label: this.memberName(member),
      value: member.membershipId,
    })),
  ]);

  readonly activeRoleTemplateId = computed((): RoleTemplateId | null => {
    const member = this.focusedMember();
    if (!member || member.role === 'owner') return null;
    const codes = this.permissionCatalog().map((item) => item.code);
    for (const template of this.roleTemplates) {
      if (!template.roles.includes(member.role)) continue;
      const matches = codes.every((code) => {
        const desired = template.targets[code];
        if (desired === undefined) return true;
        return this.permissionEffectiveAllowed(code) === desired;
      });
      if (matches) return template.id;
    }
    return null;
  });

  readonly filteredAuditEntries = computed(() => {
    const actor = this.auditActorFilter();
    const entries = this.auditEntries();
    if (actor === 'all') return entries;
    const member = this.members().find((item) => item.membershipId === actor);
    return entries.filter(
      (entry) =>
        entry.actorMembershipId === actor || (!!member && entry.actorUserId === member.userId),
    );
  });

  private static readonly auditWindowMs = 24 * 60 * 60 * 1000;

  readonly auditLast24hEntries = computed(() => {
    const cutoff = Date.now() - UtilisateursDroits.auditWindowMs;
    return this.auditEntries().filter((entry) => new Date(entry.occurredAt).getTime() >= cutoff);
  });

  readonly auditLast24hCount = computed(() => this.auditLast24hEntries().length);

  readonly auditActors24hCount = computed(() => {
    const actors = new Set<string>();
    for (const entry of this.auditLast24hEntries()) {
      if (entry.actorMembershipId) actors.add(entry.actorMembershipId);
      else if (entry.actorUserId) actors.add(`user:${entry.actorUserId}`);
      else actors.add('system');
    }
    return actors.size;
  });

  readonly auditLatestIn24h = computed(() => {
    const entries = this.auditLast24hEntries();
    if (!entries.length) return null;
    return entries.reduce((latest, entry) =>
      new Date(entry.occurredAt) > new Date(latest.occurredAt) ? entry : latest,
    );
  });

  auditLast24hHeadline(): string {
    const count = this.auditLast24hCount();
    return `${count} action${count > 1 ? 's' : ''}`;
  }

  auditActorName(entry: TenantAuditEntry): string {
    const member = this.members().find(
      (item) => item.membershipId === entry.actorMembershipId || item.userId === entry.actorUserId,
    );
    if (!entry.actorMembershipId && !entry.actorUserId) return 'Système';
    return member ? `${member.firstName} ${member.lastName}` : 'Collaborateur inconnu';
  }

  auditActorInitials(entry: TenantAuditEntry): string {
    const name = this.auditActorName(entry);
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  /** Libellé métier (le code technique reste dans `entry.action`, côté serveur). */
  auditActionLabel(entry: TenantAuditEntry): string {
    return entry.actionLabel?.trim() || 'Action enregistrée';
  }

  auditEntityLabel(entry: TenantAuditEntry): string {
    return entry.entityLabel?.trim() || 'Élément';
  }

  ngOnInit(): void {
    this.load();
    interval(UtilisateursDroits.AUDIT_POLL_MS)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (document.visibilityState === 'visible') this.refreshAuditLog();
      });
  }

  /** Recharge le journal sans bloquer la page (synchronisation automatique). */
  refreshAuditLog(): void {
    this.api
      .listTenantAuditLog()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (audit) => this.auditEntries.set(audit),
      });
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      members: this.api.listTenantMembers(),
      permissions: this.api.getMemberPermissionCatalog(),
      audit: this.api.listTenantAuditLog(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ members, permissions, audit }) => {
          this.members.set(members);
          this.permissionCatalog.set(permissions);
          this.auditEntries.set(audit);
          const selected = this.selectedMember();
          if (selected) {
            const refreshed =
              members.find((item) => item.membershipId === selected.membershipId) ?? null;
            this.selectedMember.set(refreshed);
            if (refreshed) this.focusedMember.set(refreshed);
          } else if (!this.focusedMember() && members.length > 0) {
            this.focusedMember.set(members[0]);
          }
          const focused = this.focusedMember();
          if (focused) {
            const resolved =
              members.find((item) => item.membershipId === focused.membershipId) ?? focused;
            this.focusedMember.set(resolved);
            this.loadMemberDetails(resolved);
          }
          this.loading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.error.set(this.errorMessage(error, 'Impossible de charger les utilisateurs.'));
          this.loading.set(false);
        },
      });
  }

  openCreate(): void {
    this.createForm.reset({
      firstName: '',
      lastName: '',
      sex: 'male',
      phone: '',
      email: '',
      role: 'cashier',
    });
    this.createError.set(null);
    this.createOpen.set(true);
  }

  closeCreate(): void {
    if (!this.saving()) this.createOpen.set(false);
  }

  onCreateDialogVisibleChange(visible: boolean): void {
    if (visible) {
      this.createOpen.set(true);
      return;
    }
    this.closeCreate();
  }

  selectFocusedMember(member: TenantMember): void {
    this.focusedMember.set(member);
    this.cancelPermissionDraft();
    this.loadMemberDetails(member);
  }

  memberStatusLabel(member: TenantMember): string {
    if (member.invitationPending) return 'Invitation en attente';
    if (!member.isActive) return 'Compte suspendu';
    return 'Compte actif';
  }

  shortMembershipId(membershipId: string): string {
    return membershipId.replace(/-/g, '').slice(0, 8).toUpperCase();
  }

  openEdit(member: TenantMember): void {
    this.cancelPermissionDraft();
    this.focusedMember.set(member);
    this.selectedMember.set(member);
    this.editOpen.set(true);
    this.loadMemberDetails(member);
  }

  closeEdit(): void {
    if (!this.saving()) {
      this.editOpen.set(false);
      this.selectedMember.set(null);
      this.memberPermissions.set([]);
      this.memberSessions.set([]);
      this.cancelPermissionDraft();
    }
  }

  onEditDialogVisibleChange(visible: boolean): void {
    if (visible) {
      this.editOpen.set(true);
      return;
    }
    this.closeEdit();
  }

  async createMember(): Promise<void> {
    if (this.saving() || this.confirmingCreate()) return;

    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      queueMicrotask(() => {
        document.querySelector<HTMLElement>('.utilisateurs-dialog .ng-invalid:not(form)')?.focus();
      });
      return;
    }

    const value = this.createForm.getRawValue();
    this.confirmingCreate.set(true);
    const confirmed = await this.dialog.confirm({
      header: 'Confirmer la création',
      message: `Créer le compte de ${value.firstName.trim()} ${value.lastName.trim()} (${this.roleLabel(value.role, value.sex)}) et envoyer le lien d’activation à ${value.email.trim()} ?`,
      acceptLabel: 'Créer',
      rejectLabel: 'Annuler',
      icon: 'fa-solid fa-user-plus',
    });
    this.confirmingCreate.set(false);
    if (!confirmed) return;

    this.saving.set(true);
    this.createError.set(null);
    const phone = formatTelephoneWithCountryCode(value.phone) ?? undefined;
    this.loadingOverlay
      .track(this.api.createTenantMember({ ...value, phone }), 'Création de l’utilisateur…')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.saving.set(false)),
      )
      .subscribe({
        next: (member) => {
          const { invitationEmailSent, invitationUrl, ...created } = member;
          this.members.update((members) => [...members, created]);
          this.refreshAuditLog();
          this.createOpen.set(false);
          queueMicrotask(() => {
            const emailSent = invitationEmailSent === true;
            const inviteLink = invitationUrl?.trim();
            let message: string;
            if (emailSent) {
              message = `L’utilisateur a été créé. Un lien d’activation a été envoyé à ${value.email.trim()}.`;
            } else if (inviteLink) {
              message = `L’utilisateur a été créé, mais l’email n’a pas pu être envoyé. Transmettez ce lien d’activation (valable 48 h) : ${inviteLink}`;
            } else {
              message = `L’utilisateur a été créé. Si l’invité ne reçoit pas l’email sous peu, vérifiez la configuration d’envoi ou transmettez-lui une nouvelle invitation.`;
            }
            void this.dialog.alert({
              header: 'Utilisateur créé',
              message,
              acceptLabel: 'Fermer',
              icon: 'fa-solid fa-circle-check',
            });
          });
        },
        error: (error: HttpErrorResponse) => {
          const message = this.errorMessage(error, "Impossible de créer l'utilisateur.");
          this.createError.set(message);
          queueMicrotask(() => {
            void this.dialog.alert({
              header: 'Création impossible',
              message,
              acceptLabel: 'Réessayer',
              icon: 'fa-solid fa-circle-exclamation',
            });
          });
        },
      });
  }

  fieldInvalid(name: keyof typeof this.createForm.controls): boolean {
    const control = this.createForm.controls[name];
    return control.invalid && (control.touched || control.dirty);
  }

  fieldError(name: 'firstName' | 'lastName' | 'email'): string | null {
    const control = this.createForm.controls[name];
    if (!this.fieldInvalid(name)) return null;
    if (control.hasError('required')) return 'Ce champ est obligatoire.';
    if (control.hasError('email')) return 'Saisissez une adresse e-mail valide.';
    if (control.hasError('minlength')) {
      return 'Saisissez au moins 2 caractères.';
    }
    if (control.hasError('maxlength')) return 'La valeur saisie est trop longue.';
    return 'Valeur invalide.';
  }

  phoneLocalValue(): string {
    return formatRdcPhoneLocalDisplay(this.createForm.controls.phone.value);
  }

  phoneFieldError(): string | null {
    const control = this.createForm.controls.phone;
    if (!control.touched && !control.dirty) return null;
    return rdcPhoneErrorMessage(control.errors);
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const beforeCaret = input.value.slice(0, input.selectionStart ?? input.value.length);
    this.createForm.controls.phone.setValue(rdcPhoneValueFromInput(input.value));
    this.createForm.controls.phone.markAsDirty();
    input.value = this.phoneLocalValue();
    const digitsBeforeCaret = (beforeCaret.match(/\d/g) ?? []).length;
    let position = 0;
    let count = 0;
    while (position < input.value.length && count < digitsBeforeCaret) {
      if (/\d/.test(input.value[position])) count++;
      position++;
    }
    input.setSelectionRange(position, position);
  }

  onPhoneBlur(): void {
    this.createForm.controls.phone.markAsTouched();
  }

  private loadMemberDetails(member: TenantMember): void {
    forkJoin({
      permissions: this.api.listMemberPermissions(member.membershipId),
      sessions: this.api.listMemberSessions(member.membershipId),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ permissions, sessions }) => {
          this.memberPermissions.set(permissions);
          this.memberSessions.set(sessions);
        },
        error: (error: HttpErrorResponse) =>
          this.error.set(this.errorMessage(error, 'Impossible de charger les détails.')),
      });
  }

  async toggleStatus(member: TenantMember): Promise<void> {
    if (member.role === 'owner') return;
    const activate = !member.isActive;
    const confirmed = await this.dialog.confirm({
      header: activate ? 'Réactiver le membre' : 'Suspendre le membre',
      message: activate
        ? `Réactiver l’accès de ${this.memberName(member)} ?`
        : `Suspendre ${this.memberName(member)} et révoquer ses sessions actives ?`,
      acceptLabel: activate ? 'Réactiver' : 'Suspendre',
    });
    if (!confirmed) return;
    this.saving.set(true);
    this.api
      .updateTenantMemberStatus(
        member.membershipId,
        activate,
        activate ? 'Réactivation par le propriétaire' : 'Suspension par le propriétaire',
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => this.replaceMember(updated),
        error: (error) => this.actionFailed(error),
      });
  }

  changeRole(member: TenantMember, role: 'cashier' | 'stock_manager'): void {
    if (member.role === 'owner' || member.role === role) return;
    this.saving.set(true);
    this.api
      .updateTenantMemberRole(member.membershipId, role, 'Changement de rôle par le propriétaire')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => this.replaceMember(updated),
        error: (error) => this.actionFailed(error),
      });
  }

  async resetPassword(member: TenantMember): Promise<void> {
    const password = window.prompt(
      `Nouveau mot de passe temporaire pour ${this.memberName(member)} (8 caractères minimum)`,
    );
    if (!password) return;
    if (password.length < 8) {
      await this.dialog.alert({ message: 'Le mot de passe doit contenir au moins 8 caractères.' });
      return;
    }
    this.saving.set(true);
    this.api
      .resetTenantMemberPassword(
        member.membershipId,
        password,
        'Réinitialisation par le propriétaire',
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: async () => {
          this.saving.set(false);
          this.refreshAuditLog();
          await this.dialog.alert({
            header: 'Accès réinitialisé',
            message: 'Le mot de passe a été remplacé et les sessions ont été révoquées.',
          });
        },
        error: (error) => this.actionFailed(error),
      });
  }

  permissionHelp(code: string): string {
    const fromCatalog = this.permissionCatalog().find((item) => item.code === code)?.description;
    return (
      fromCatalog ??
      this.permissionHelpText[code] ??
      'Droit métier configurable pour ce rôle.'
    );
  }

  permissionRoleDefault(role: TenantMemberRole, code: string): boolean {
    return UtilisateursDroits.permissionRoleDefaults[role][code] ?? false;
  }

  permissionEffectiveAllowed(code: string): boolean {
    const member = this.focusedMember() ?? this.selectedMember();
    if (!member) return false;
    const override = this.permissionValue(code);
    if (override !== null) return override;
    return this.permissionRoleDefault(member.role, code);
  }

  matrixGroupTitle(group: MemberPermissionGroup): string {
    return this.permissionMatrixGroupsMeta[group].title;
  }

  matrixGroupSubtitle(group: MemberPermissionGroup): string {
    return this.permissionMatrixGroupsMeta[group].subtitle;
  }

  matrixGroupIcon(group: MemberPermissionGroup): string {
    return this.permissionMatrixGroupsMeta[group].icon;
  }

  matrixGroupIconShell(group: MemberPermissionGroup): string {
    return this.permissionMatrixGroupsMeta[group].iconShell;
  }

  matrixGroupBadgeClass(group: MemberPermissionGroup): string {
    return this.permissionMatrixGroupsMeta[group].badgeClass;
  }

  matrixGroupAuthorizedSummary(group: MemberPermissionGroup): string {
    const member = this.focusedMember();
    const items =
      this.permissionMatrixGroups().find((entry) => entry.id === group)?.items ?? [];
    if (!member || items.length === 0) return '—';
    if (member.role === 'owner') return `${items.length} / ${items.length} Autorisés`;
    const allowed = items.filter((item) => this.permissionEffectiveAllowed(item.code)).length;
    return `${allowed} / ${items.length} Autorisé${items.length > 1 ? 's' : ''}`;
  }

  permissionBadgeClass(tone: MemberPermissionBadgeTone): string {
    if (tone === 'amber') return 'bg-retail-amber/15 text-retail-amber font-bold';
    if (tone === 'danger') return 'bg-alert-red/15 text-alert-red font-semibold';
    return 'bg-surface-container-highest text-text-muted font-semibold';
  }

  onMatrixPermissionToggle(
    permission: MemberPermissionCatalogItem,
    event: Event,
  ): void {
    const member = this.focusedMember();
    if (!member || member.role === 'owner' || this.saving()) {
      event.preventDefault();
      return;
    }
    const input = event.target as HTMLInputElement;
    const checked = input.checked;
    const current = this.permissionEffectiveAllowed(permission.code);
    if (checked === current) return;

    const roleDefault = this.permissionRoleDefault(member.role, permission.code);
    if (checked === roleDefault) {
      input.checked = current;
      if (this.permissionValue(permission.code) !== null) {
        void this.resetPermissionToRole(permission.code, permission.label);
      }
      return;
    }
    input.checked = current;
    this.beginPermissionChange(permission.code, checked, permission.label);
  }

  permissionRecord(code: string): MemberPermission | undefined {
    return this.memberPermissions().find((permission) => permission.permissionCode === code);
  }

  permissionValue(code: string): boolean | null {
    return this.permissionRecord(code)?.allowed ?? null;
  }

  permissionStateLabel(code: string): string {
    const member = this.focusedMember() ?? this.selectedMember();
    if (member?.role === 'owner') return 'Inclus (gérant)';
    const value = this.permissionValue(code);
    if (value === true) return 'Exception : autorisé';
    if (value === false) return 'Exception : interdit';
    return 'Selon le rôle';
  }

  matrixPermissionsReadOnly(member: TenantMember): boolean {
    return member.role === 'owner';
  }

  memberInitials(member: TenantMember): string {
    const first = member.firstName.trim().charAt(0);
    const last = member.lastName.trim().charAt(0);
    const combined = `${first}${last}`.toUpperCase();
    return combined || member.email.charAt(0).toUpperCase();
  }

  sessionClientLabel(clientType: MemberSession['clientType']): string {
    if (clientType === 'mobile') return 'Application mobile';
    if (clientType === 'desktop') return 'Poste de travail';
    return 'Navigateur web';
  }

  beginPermissionChange(code: string, allowed: boolean, label: string): void {
    this.permissionDraft.set({ code, allowed, label });
    this.permissionReasonDraft.set(this.permissionRecord(code)?.reason?.trim() ?? '');
  }

  cancelPermissionDraft(): void {
    this.permissionDraft.set(null);
    this.permissionReasonDraft.set('');
  }

  submitPermissionDraft(): void {
    const member = this.focusedMember() ?? this.selectedMember();
    const draft = this.permissionDraft();
    const reason = this.permissionReasonDraft().trim();
    if (!member || !draft || member.role === 'owner') return;
    if (reason.length < 3) {
      void this.dialog.alert({
        header: 'Motif obligatoire',
        message: 'Décrivez brièvement pourquoi vous appliquez cette exception (au moins 3 caractères).',
        icon: 'fa-solid fa-pen',
      });
      return;
    }
    this.saving.set(true);
    this.api
      .setMemberPermission(member.membershipId, draft.code, draft.allowed, reason)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.saving.set(false)),
      )
      .subscribe({
        next: () => {
          this.cancelPermissionDraft();
          this.loadMemberDetails(member);
          this.refreshAuditLog();
        },
        error: (error) => this.actionFailed(error),
      });
  }

  async resetPermissionToRole(code: string, label: string): Promise<void> {
    const member = this.focusedMember() ?? this.selectedMember();
    if (!member || this.permissionValue(code) === null) return;
    const confirmed = await this.dialog.confirm({
      header: 'Revenir au rôle',
      message: `Supprimer l’exception sur « ${label} » et appliquer à nouveau les droits du rôle « ${this.roleLabel(member.role, member.sex)} » ?`,
      acceptLabel: 'Supprimer l’exception',
      rejectLabel: 'Annuler',
      icon: 'fa-solid fa-rotate-left',
    });
    if (!confirmed) return;
    this.saving.set(true);
    this.api
      .removeMemberPermission(member.membershipId, code)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.saving.set(false)),
      )
      .subscribe({
        next: () => {
          this.cancelPermissionDraft();
          this.loadMemberDetails(member);
          this.refreshAuditLog();
        },
        error: (error) => this.actionFailed(error),
      });
  }

  async revokeSession(sessionId: string): Promise<void> {
    const member = this.selectedMember();
    if (!member) return;
    const confirmed = await this.dialog.confirm({
      header: 'Déconnecter cet appareil',
      message: `${this.memberName(member)} sera déconnecté(e) sur cette session. Une nouvelle connexion sera nécessaire.`,
      acceptLabel: 'Déconnecter',
      rejectLabel: 'Annuler',
      icon: 'fa-solid fa-right-from-bracket',
    });
    if (!confirmed) return;
    this.saving.set(true);
    this.api
      .revokeMemberSession(member.membershipId, sessionId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.saving.set(false)),
      )
      .subscribe({
        next: () => {
          this.loadMemberDetails(member);
          this.refreshAuditLog();
        },
        error: (error) => this.actionFailed(error),
      });
  }

  roleLabel(role: TenantMemberRole, sex: UserSex | null): string {
    if (role === 'cashier') return sex === 'female' ? 'Caissière' : 'Caissier';
    if (role === 'owner') return sex === 'female' ? 'Gérante principale' : 'Gérant principal';
    return 'Responsable des stocks';
  }

  sexLabel(sex: UserSex | null): string {
    if (sex === 'female') return 'Féminin';
    if (sex === 'male') return 'Masculin';
    return 'Non renseigné';
  }

  memberName(member: TenantMember): string {
    return `${member.firstName} ${member.lastName}`.trim() || member.email;
  }

  private replaceMember(updated: TenantMember): void {
    this.members.update((members) =>
      members.map((member) => (member.membershipId === updated.membershipId ? updated : member)),
    );
    if (this.selectedMember()?.membershipId === updated.membershipId)
      this.selectedMember.set(updated);
    if (this.focusedMember()?.membershipId === updated.membershipId)
      this.focusedMember.set(updated);
    this.saving.set(false);
    this.refreshAuditLog();
  }

  roleTemplateApplyDisabled(template: RoleTemplate): boolean {
    if (this.saving()) return true;
    const member = this.focusedMember();
    if (!member || member.role === 'owner') return true;
    if (!template.roles.includes(member.role)) return true;
    return this.activeRoleTemplateId() === template.id;
  }

  roleTemplateDisabledHint(template: RoleTemplate): string | null {
    const member = this.focusedMember();
    if (!member) return 'Sélectionnez un collaborateur dans la liste.';
    if (member.role === 'owner') return 'Les modèles ne s’appliquent pas au gérant.';
    if (!template.roles.includes(member.role)) {
      const label =
        template.roles[0] === 'cashier'
          ? 'caissiers'
          : template.roles[0] === 'stock_manager'
            ? 'magasiniers'
            : 'ce rôle';
      return `Ce modèle est réservé aux ${label}.`;
    }
    return null;
  }

  async applyRoleTemplate(template: RoleTemplate): Promise<void> {
    const member = this.focusedMember();
    if (!member || member.role === 'owner' || !template.roles.includes(member.role)) {
      const hint = this.roleTemplateDisabledHint(template);
      await this.dialog.alert({
        header: 'Modèle indisponible',
        message: hint ?? 'Choisissez un autre collaborateur.',
        icon: 'fa-solid fa-user-slash',
      });
      return;
    }
    if (this.activeRoleTemplateId() === template.id) return;

    const confirmed = await this.dialog.confirm({
      header: 'Appliquer le modèle',
      message: `Appliquer « ${template.title} » pour ${this.memberName(member)} ? Les dérogations seront alignées sur ce préréglage et enregistrées dans le journal.`,
      acceptLabel: 'Appliquer',
      rejectLabel: 'Annuler',
      icon: 'fa-solid fa-clipboard-check',
    });
    if (!confirmed) return;

    const reason = `Modèle appliqué : ${template.title}`;
    const codes = this.permissionCatalog().map((item) => item.code);
    const requests: Observable<unknown>[] = [];

    for (const code of codes) {
      const desired =
        template.targets[code] ?? this.permissionRoleDefault(member.role, code);
      const roleDefault = this.permissionRoleDefault(member.role, code);
      const override = this.permissionValue(code);

      if (desired === roleDefault) {
        if (override !== null) requests.push(this.api.removeMemberPermission(member.membershipId, code));
        continue;
      }
      if (override === desired) continue;
      requests.push(
        this.api.setMemberPermission(member.membershipId, code, desired, reason),
      );
    }

    if (!requests.length) {
      await this.dialog.alert({
        header: 'Déjà à jour',
        message: 'Ce collaborateur correspond déjà à ce modèle.',
        icon: 'fa-solid fa-circle-check',
      });
      return;
    }

    this.saving.set(true);
    this.cancelPermissionDraft();
    forkJoin(requests)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.saving.set(false)),
      )
      .subscribe({
        next: async () => {
          this.loadMemberDetails(member);
          this.refreshAuditLog();
          await this.dialog.alert({
            header: 'Modèle appliqué',
            message: `Les droits de ${this.memberName(member)} suivent maintenant « ${template.title} ».`,
            icon: 'fa-solid fa-circle-check',
          });
        },
        error: (error) => this.actionFailed(error),
      });
  }

  setRosterRoleFilter(role: 'all' | TenantMemberRole): void {
    this.roleFilter.set(role);
  }

  private actionFailed(error: HttpErrorResponse): void {
    this.error.set(this.errorMessage(error, "L'action n'a pas pu être effectuée."));
    this.saving.set(false);
  }

  private errorMessage(error: HttpErrorResponse, fallback: string): string {
    const message = error.error?.message;
    return Array.isArray(message)
      ? message.join(' ')
      : typeof message === 'string'
        ? message
        : fallback;
  }
}
