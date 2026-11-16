import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AUTHENTICATION_PATH } from '../../../auth/auth.paths';
import { AuthSessionService } from '../../../auth/auth-session.service';
import { LayoutFooter } from '../../footer/layout-footer';
import { TenantSidebar } from '../sidebar/tenant-sidebar';
import { TenantTopbar } from '../topbar/tenant-topbar';

@Component({
  selector: 'app-tenant-layout',
  imports: [RouterOutlet, TenantSidebar, TenantTopbar, LayoutFooter],
  templateUrl: './tenant-layout.html',
  styleUrl: './tenant-layout.scss',
})
export class TenantLayout {
  private readonly authSession = inject(AuthSessionService);
  private readonly router = inject(Router);

  logout(): void {
    this.authSession.clear();
    void this.router.navigate([AUTHENTICATION_PATH]);
  }
}
