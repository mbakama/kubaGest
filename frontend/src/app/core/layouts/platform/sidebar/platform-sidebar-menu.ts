import { Component, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import type { LayoutMenuItem } from '../../layout-menu.model';

@Component({
  selector: 'app-platform-sidebar-menu',
  imports: [RouterLink, RouterLinkActive, PlatformSidebarMenu],
  templateUrl: './platform-sidebar-menu.html',
  styleUrl: './platform-sidebar-menu.scss',
})
export class PlatformSidebarMenu {
  readonly items = input.required<LayoutMenuItem[]>();
  readonly depth = input(0);

  readonly expanded = signal<Record<string, boolean>>({});

  hasChildren(item: LayoutMenuItem): boolean {
    return (item.children?.length ?? 0) > 0;
  }

  isExpanded(id: string): boolean {
    return this.expanded()[id] ?? false;
  }

  toggleGroup(id: string): void {
    this.expanded.update((state) => ({ ...state, [id]: !state[id] }));
  }

  linkExact(link: string | undefined): boolean {
    return link === '/';
  }
}
