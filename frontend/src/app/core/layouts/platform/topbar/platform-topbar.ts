import { Component, computed, HostListener, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthSessionService } from '../../../auth/auth-session.service';
import { ThemeToggleComponent } from '../../../ui/theme-toggle/theme-toggle';

const profileMenuLinkClass =
  'flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-platform-ink hover:bg-surface-container-high';

@Component({
  selector: 'app-platform-topbar',
  imports: [RouterLink, ThemeToggleComponent],
  templateUrl: './platform-topbar.html',
  styleUrl: './platform-topbar.scss',
})
export class PlatformTopbar {
  readonly profileMenuLinkClass = profileMenuLinkClass;

  private readonly authSession = inject(AuthSessionService);

  readonly userSubtitle = input('Super Administrateur');
  readonly logoutClick = output<void>();

  readonly session = this.authSession.session;
  readonly profileMenuOpen = signal(false);

  readonly displayName = computed(() => {
    const user = this.session()?.user;
    if (!user) {
      return 'Administrateur';
    }
    const full = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
    return full || user.email.split('@')[0] || user.email;
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
    this.onLogout();
  }

  onLogout(): void {
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
