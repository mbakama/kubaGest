import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiService } from '../../../core/api/api.service';
import type { MemberSession } from '../../../core/api/tenant-users.types';
import { AuthSessionService } from '../../../core/auth/auth-session.service';
import { AppDialogService } from '../../../core/ui/dialog';

const TENANT_ROLE_LABELS: Record<string, string> = {
  owner: 'Gérant principal',
  cashier: 'Caissier',
  stock_manager: 'Responsable stocks',
};

@Component({
  imports: [RouterLink, DatePipe],
  selector: 'app-settings',
  styleUrl: './settings.scss',
  templateUrl: './settings.html',
})
export class Settings implements OnInit {
  private readonly api = inject(ApiService);
  private readonly authSession = inject(AuthSessionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(AppDialogService);

  readonly session = this.authSession.session;
  readonly authSessions = signal<MemberSession[]>([]);
  readonly sessionsLoading = signal(true);
  readonly sessionsError = signal<string | null>(null);
  readonly sessionsSaving = signal(false);

  readonly displayName = computed(() => {
    const user = this.session()?.user;
    if (!user) return 'Utilisateur';
    const full = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
    return full || user.email.split('@')[0] || user.email;
  });

  readonly initials = computed(() => {
    const user = this.session()?.user;
    if (!user) return '?';
    const first = user.firstName?.trim().charAt(0) ?? '';
    const last = user.lastName?.trim().charAt(0) ?? '';
    const fromName = `${first}${last}`.toUpperCase();
    if (fromName) return fromName;
    return user.email.charAt(0).toUpperCase();
  });

  readonly roleLabel = computed(() => {
    const role = this.session()?.context?.role;
    if (!role) return 'Collaborateur';
    return TENANT_ROLE_LABELS[role] ?? role.replaceAll('_', ' ');
  });

  readonly tenantName = computed(() => this.session()?.context?.tenantName ?? 'Établissement');

  readonly isOwner = computed(() => this.session()?.context?.role === 'owner');

  readonly activeAuthSessions = computed(() =>
    this.authSessions().filter((item) => !item.revokedAt),
  );

  ngOnInit(): void {
    this.loadAuthSessions();
  }

  loadAuthSessions(): void {
    this.sessionsLoading.set(true);
    this.sessionsError.set(null);
    this.api
      .listMyAuthSessions()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.sessionsLoading.set(false)),
      )
      .subscribe({
        next: (sessions) => this.authSessions.set(sessions),
        error: () =>
          this.sessionsError.set('Impossible de charger vos sessions de connexion.'),
      });
  }

  sessionClientLabel(clientType: MemberSession['clientType']): string {
    if (clientType === 'mobile') return 'Application mobile';
    if (clientType === 'desktop') return 'Poste de travail / POS';
    return 'Navigateur web';
  }

  sessionClientIcon(clientType: MemberSession['clientType']): string {
    if (clientType === 'mobile') return 'fa-solid fa-mobile-screen';
    if (clientType === 'desktop') return 'fa-solid fa-desktop';
    return 'fa-solid fa-globe';
  }

  async revokeAuthSession(session: MemberSession): Promise<void> {
    if (session.revokedAt || this.sessionsSaving()) return;
    const confirmed = await this.dialog.confirm({
      header: 'Déconnecter cet appareil',
      message: `Révoquer la session « ${this.sessionClientLabel(session.clientType)} » ? Une nouvelle connexion sera nécessaire sur cet appareil.`,
      acceptLabel: 'Déconnecter',
      rejectLabel: 'Annuler',
      icon: 'fa-solid fa-right-from-bracket',
    });
    if (!confirmed) return;

    this.sessionsSaving.set(true);
    this.api
      .revokeMyAuthSession(session.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.sessionsSaving.set(false)),
      )
      .subscribe({
        next: () => {
          this.authSessions.update((items) =>
            items.map((item) =>
              item.id === session.id ? { ...item, revokedAt: new Date().toISOString() } : item,
            ),
          );
        },
        error: (error: HttpErrorResponse) => {
          void this.dialog.alert({
            header: 'Action impossible',
            message:
              error.status === 404
                ? 'Cette session n’existe plus ou a déjà été fermée.'
                : 'La déconnexion à distance n’a pas pu être effectuée.',
            icon: 'fa-solid fa-circle-exclamation',
          });
        },
      });
  }
}