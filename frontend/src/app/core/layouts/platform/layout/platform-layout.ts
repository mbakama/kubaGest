import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AUTHENTICATION_PATH } from '../../../auth/auth.paths';
import { AuthSessionService } from '../../../auth/auth-session.service';
import { LayoutFooter } from '../../footer/layout-footer';
import { PlatformSidebar } from '../sidebar/platform-sidebar';
import { PlatformTopbar } from '../topbar/platform-topbar';

/**
 * Assemble sidebar + topbar + router-outlet (équivalent `VerticalComponent` eRecettes).
 */
@Component({
  selector: 'app-platform-layout',
  imports: [RouterOutlet, PlatformSidebar, PlatformTopbar, LayoutFooter],
  templateUrl: './platform-layout.html',
  styleUrl: './platform-layout.scss',
})
export class PlatformLayout {
  private readonly authSession = inject(AuthSessionService);
  private readonly router = inject(Router);

  logout(): void {
    this.authSession.clear();
    void this.router.navigate([AUTHENTICATION_PATH]);
  }
}
