import { Component, computed, inject } from '@angular/core';
import { AuthSessionService } from '../../../auth/auth-session.service';
import { TENANT_MENU } from './tenant-menu';
import { TenantSidebarMenu } from './tenant-sidebar-menu';

@Component({
  selector: 'app-tenant-sidebar',
  imports: [TenantSidebarMenu],
  templateUrl: './tenant-sidebar.html',
  styleUrl: './tenant-sidebar.scss',
})
export class TenantSidebar {
  private readonly authSession = inject(AuthSessionService);

  readonly menuItems = TENANT_MENU;

  readonly tenantName = computed(
    () => this.authSession.session()?.context?.tenantName ?? 'Espace établissement',
  );
}
