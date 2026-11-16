import { Component, computed, HostListener, inject, OnInit, output, signal } from '@angular/core';
import { ApiService } from '../../../api/api.service';
import { AuthSessionService } from '../../../auth/auth-session.service';
import { ThemeToggleComponent } from '../../../ui/theme-toggle/theme-toggle';
import { formatCdfPerUsdForDisplay } from '../../../utils/exchange-rate-format.util';

const TENANT_ROLE_LABELS: Record<string, string> = {
  owner: 'Gérant principal',
  cashier: 'Caissier',
  stock_manager: 'Responsable stocks',
};

@Component({
  selector: 'app-tenant-topbar',
  standalone: true,
  imports: [ThemeToggleComponent],
  templateUrl: './tenant-topbar.html',
})
export class TenantTopbar implements OnInit {
  private readonly api = inject(ApiService);
  private readonly authSession = inject(AuthSessionService);

  readonly logoutClick = output<void>();

  readonly session = this.authSession.session;
  readonly profileMenuOpen = signal(false);
  readonly cdfPerUsdDisplay = signal<string | null>(null);
  readonly exchangeRateLoading = signal(true);

  readonly bccLabel = computed(() => {
    const fc = this.cdfPerUsdDisplay();
    if (fc) {
      return `1 USD = ${fc} FC`;
    }
    return this.exchangeRateLoading() ? 'Chargement du taux BCC…' : 'Taux BCC non défini';
  });

  ngOnInit(): void {
    this.api.getTenantCurrentExchangeRate().subscribe({
      next: (rate) => {
        this.cdfPerUsdDisplay.set(formatCdfPerUsdForDisplay(rate.cdfPerUsd));
        this.exchangeRateLoading.set(false);
      },
      error: () => {
        this.cdfPerUsdDisplay.set(null);
        this.exchangeRateLoading.set(false);
      },
    });
  }

  readonly displayName = computed(() => {
    const user = this.session()?.user;
    if (!user) {
      return 'Utilisateur';
    }
    const full = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
    return full || user.email.split('@')[0] || user.email;
  });

  readonly roleLabel = computed(() => {
    const role = this.session()?.context?.role;
    if (!role) {
      return 'Établissement';
    }
    return TENANT_ROLE_LABELS[role] ?? role.replaceAll('_', ' ');
  });

  toggleProfileMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.profileMenuOpen.update((open) => !open);
  }

  closeProfileMenu(): void {
    this.profileMenuOpen.set(false);
  }

  logoutFromMenu(): void {
    this.closeProfileMenu();
    this.logoutClick.emit();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeProfileMenu();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeProfileMenu();
  }
}
