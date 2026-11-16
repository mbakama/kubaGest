import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService } from '../../../core/api/api.service';
import type { PlatformAdminProfileResponse } from '../../../core/api/platform-profile.types';
import { AuthSessionService } from '../../../core/auth/auth-session.service';
import { AppDialogService } from '../../../core/ui/dialog';
import { AppLoadingService } from '../../../core/ui/loading';
import {
  RDC_DIAL,
  formatRdcPhoneLocalDisplay,
  formatTelephoneWithCountryCode,
  rdcPhoneErrorMessage,
  rdcPhoneValidator,
  rdcPhoneValueFromInput,
} from '../../../core/utils/rdc-phone.util';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputText } from 'primeng/inputtext';

type ProfileTab = 'general' | 'security' | 'preferences' | 'sessions' | 'activity';

const PROFILE_TABS: { id: ProfileTab; label: string; icon: string }[] = [
  { id: 'general', label: 'Informations générales', icon: 'fa-regular fa-user' },
  { id: 'security', label: 'Sécurité', icon: 'fa-solid fa-lock' },
  { id: 'preferences', label: 'Préférences', icon: 'fa-solid fa-sliders' },
  { id: 'sessions', label: 'Sessions', icon: 'fa-solid fa-desktop' },
  { id: 'activity', label: 'Activité du compte', icon: 'fa-regular fa-clock' },
];

@Component({
  selector: 'app-platform-profile',
  imports: [ReactiveFormsModule, InputText, InputGroup, InputGroupAddon],
  templateUrl: './platform-profile.html',
  styleUrl: './platform-profile.scss',
})
export class PlatformProfile implements OnInit {
  
  private readonly authSession = inject(AuthSessionService);
  private readonly api = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(AppDialogService);
  private readonly loadingOverlay = inject(AppLoadingService);

  readonly rdcDial = RDC_DIAL;

  readonly session = this.authSession.session;
  readonly profile = signal<PlatformAdminProfileResponse | null>(null);
  readonly activeTab = signal<ProfileTab>('general');
  readonly editing = signal(false);
  readonly loading = signal(true);
  readonly saving = signal(false);

  readonly personalForm = new FormGroup({
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(80)],
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(80)],
    }),
    phone: new FormControl('', { nonNullable: true, validators: [rdcPhoneValidator()] }),
  });

  readonly displayName = computed(() => {
    const fromProfile = this.profile()?.personal.fullName?.trim();
    if (fromProfile) {
      return fromProfile;
    }
    const user = this.session()?.user;
    return (
      [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() ||
      'Administrateur plateforme'
    );
  });

  readonly initials = computed(() => {
    const value = this.displayName();
    return value
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  });

  readonly memberSince = computed(() => {
    const raw = this.profile()?.identity.memberSince;
    if (raw) {
      return new Date(raw).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
    return '—';
  });

  readonly displayId = computed(() => this.profile()?.identity.displayId ?? this.session()?.user?.id ?? '—');

  readonly userCount = computed(() => this.profile()?.accountSummary.userCount ?? null);
  readonly tenantCount = computed(() => this.profile()?.accountSummary.tenantCount ?? null);
  readonly subscriptionCount = computed(
    () => this.profile()?.accountSummary.activeSubscriptions ?? null,
  );

  readonly formattedPhoneDisplay = computed(() => {
    const raw = this.profile()?.personal.phone ?? this.personalForm.getRawValue().phone;
    if (!raw?.trim()) {
      return 'Non renseigné';
    }
    const local = formatRdcPhoneLocalDisplay(raw);
    return local ? `${RDC_DIAL} ${local}` : raw;
  });

  readonly tabs = PROFILE_TABS;

  readonly identityMeta = computed(() => [
    { label: 'ID utilisateur', icon: 'fa-regular fa-user', value: this.displayId() },
    { label: 'Membre depuis', icon: 'fa-regular fa-calendar', value: this.memberSince() },
    { label: 'Statut', icon: 'fa-solid fa-shield-halved', value: null as string | null },
    { label: 'Espaces gérés', icon: 'fa-regular fa-building', value: String(this.tenantCount() ?? '…') },
  ]);

  readonly accountMetrics = computed(() => [
    { icon: 'fa-solid fa-users', value: String(this.userCount() ?? '…'), label: 'Utilisateurs' },
    {
      icon: 'fa-regular fa-building',
      value: String(this.tenantCount() ?? '…'),
      label: 'Espaces / Entreprises',
    },
    {
      icon: 'fa-solid fa-layer-group',
      value: String(this.subscriptionCount() ?? '…'),
      label: 'Abonnements actifs',
    },
    { icon: 'fa-solid fa-coins', value: '—', label: 'Revenus (ce mois)' },
  ]);

  ngOnInit(): void {
    this.loadProfile();
  }

  selectTab(tab: ProfileTab): void {
    this.activeTab.set(tab);
  }

  phoneLocalValue(): string {
    return formatRdcPhoneLocalDisplay(this.personalForm.getRawValue().phone);
  }

  phoneFieldError(): string | null {
    const control = this.personalForm.controls.phone;
    if (!control.touched && !control.dirty) {
      return null;
    }
    return rdcPhoneErrorMessage(control.errors);
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let beforeCaret = input.value.slice(0, input.selectionStart ?? input.value.length);
    const value = rdcPhoneValueFromInput(input.value);
    this.personalForm.controls.phone.setValue(value, { emitEvent: true });
    this.personalForm.controls.phone.markAsDirty();
    input.value = this.phoneLocalValue();
    const digitsBeforeCaret = (beforeCaret.match(/\d/g) ?? []).length;
    let position = 0;
    let count = 0;
    while (position < input.value.length && count < digitsBeforeCaret) {
      if (/\d/.test(input.value[position])) {
        count++;
      }
      position++;
    }
    input.setSelectionRange(position, position);
  }

  onPhoneBlur(): void {
    this.personalForm.controls.phone.markAsTouched();
  }

  async toggleEditing(): Promise<void> {
    if (this.editing()) {
      if (this.personalForm.invalid) {
        this.personalForm.markAllAsTouched();
        return;
      }
      const confirmed = await this.dialog.confirm({
        header: 'Enregistrer les modifications',
        message: 'Voulez-vous enregistrer vos informations personnelles ?',
        acceptLabel: 'Enregistrer',
        icon: 'pi pi-check-circle',
      });
      if (confirmed) {
        this.savePersonal();
      }
      return;
    }
    this.editing.set(true);
    this.syncFormFromProfile();
  }

  async cancelEditing(): Promise<void> {
    if (this.personalForm.dirty) {
      const confirmed = await this.dialog.confirm({
        header: 'Annuler les modifications',
        message: 'Les changements non enregistrés seront perdus. Voulez-vous continuer ?',
        acceptLabel: 'Oui, annuler',
        rejectLabel: 'Continuer la saisie',
        icon: 'pi pi-exclamation-triangle',
      });
      if (!confirmed) {
        return;
      }
    }
    this.editing.set(false);
    this.syncFormFromProfile();
  }

  private loadProfile(): void {
    this.loading.set(true);
    this.api
      .getPlatformProfile()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (response) => {
          this.profile.set(response);
          this.syncFormFromProfile();
          this.authSession.mergeUser({
            firstName: response.user.firstName,
            lastName: response.user.lastName,
          });
        },
      });
  }

  private phoneToFormValue(stored: string | null | undefined): string {
    if (!stored?.trim()) {
      return '';
    }
    const trimmed = stored.trim();
    if (trimmed.startsWith(RDC_DIAL)) {
      const local = formatRdcPhoneLocalDisplay(trimmed);
      return local ? `${RDC_DIAL} ${local}` : trimmed;
    }
    return trimmed;
  }

  private syncFormFromProfile(): void {
    const data = this.profile();
    const user = data?.user;
    this.personalForm.patchValue({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      phone: this.phoneToFormValue(data?.personal.phone),
    });
    if (!this.editing()) {
      this.personalForm.disable();
    } else {
      this.personalForm.enable();
    }
    this.personalForm.markAsPristine();
  }

  private savePersonal(): void {
    if (this.personalForm.invalid) {
      this.personalForm.markAllAsTouched();
      return;
    }

    const { firstName, lastName, phone } = this.personalForm.getRawValue();
    const normalizedPhone = formatTelephoneWithCountryCode(phone);

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: normalizedPhone,
    };

    this.saving.set(true);
    this.loadingOverlay
      .track(this.api.updatePlatformProfile(payload), 'Enregistrement en cours...')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.saving.set(false)),
      )
      .subscribe({
        next: (response) => {
          this.profile.set(response);
          this.editing.set(false);
          this.personalForm.disable();
          this.authSession.mergeUser({
            firstName: response.user.firstName,
            lastName: response.user.lastName,
          });
          this.syncFormFromProfile();
        },
        error: () => {
          void this.dialog.alert({
            header: 'Enregistrement impossible',
            message: 'La mise à jour n’a pas pu aboutir. Vérifiez les champs et réessayez dans un instant.',
            icon: 'pi pi-times-circle',
            acceptLabel: 'Compris',
          });
        },
      });
  }
}
