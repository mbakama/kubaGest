import { Component } from '@angular/core';
import { PLATFORM_MENU } from './platform-menu';
import { PlatformSidebarMenu } from './platform-sidebar-menu';

@Component({
  selector: 'app-platform-sidebar',
  imports: [PlatformSidebarMenu],
  templateUrl: './platform-sidebar.html',
  styleUrl: './platform-sidebar.scss',
})
export class PlatformSidebar {
  readonly menuItems = PLATFORM_MENU;
}
