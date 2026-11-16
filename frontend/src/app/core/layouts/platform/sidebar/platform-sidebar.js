import { Component } from '@angular/core';
import { PLATFORM_MENU } from './platform-menu';
import { PlatformSidebarMenu } from './platform-sidebar-menu';
import * as i0 from "@angular/core";
export class PlatformSidebar {
    menuItems = PLATFORM_MENU;
    static ɵfac = function PlatformSidebar_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PlatformSidebar)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PlatformSidebar, selectors: [["app-platform-sidebar"]], decls: 11, vars: 1, consts: [["aria-label", "Navigation administration", 1, "platform-sidebar"], [1, "platform-sidebar__logo"], [1, "platform-sidebar__logo-mark"], [1, "platform-sidebar__nav"], [3, "items"]], template: function PlatformSidebar_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "aside", 0)(1, "div", 1)(2, "div", 2);
            i0.ɵɵtext(3, "K");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "div")(5, "strong");
            i0.ɵɵtext(6, "KubaGest");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "small");
            i0.ɵɵtext(8, "Administration");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(9, "nav", 3);
            i0.ɵɵelement(10, "app-platform-sidebar-menu", 4);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(10);
            i0.ɵɵproperty("items", ctx.menuItems);
        } }, dependencies: [PlatformSidebarMenu], styles: ["@use '../../layout-shell.scss' as shell;\n@use '../../sidebar-shell.scss' as sidebar;\n\n[_nghost-%COMP%] {\n  display: block;\n}\n\n.platform-sidebar[_ngcontent-%COMP%] {\n  @include shell.shell-sidebar-fixed(shell.$platform-sidebar-width);\n  @include sidebar.app-sidebar-chrome;\n}\n\nhtml.dark[_nghost-%COMP%]   .platform-sidebar[_ngcontent-%COMP%], html.dark   [_nghost-%COMP%]   .platform-sidebar[_ngcontent-%COMP%] {\n  background: var(--%NS%color-surface-container-lowest);\n  border-right: 1px solid var(--%NS%color-border-subtle);\n  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.55);\n  color: var(--%NS%color-sidebar-fg);\n}\n\nhtml.dark[_nghost-%COMP%], html.dark   [_nghost-%COMP%] {\n  .platform-sidebar__logo[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n    color: #f8fafc;\n  }\n\n  .platform-sidebar__logo[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n    color: #94a3b8;\n    opacity: 1;\n  }\n\n  .platform-sidebar__logo-mark[_ngcontent-%COMP%] {\n    border: 1px solid rgba(96, 165, 250, 0.4);\n    box-shadow: 0 0 10px rgba(59, 130, 246, 0.28);\n    color: var(--%NS%color-primary);\n  }\n}\n\n.platform-sidebar__logo[_ngcontent-%COMP%] {\n  @include sidebar.app-sidebar-logo;\n  margin-bottom: 0.5rem;\n  padding-bottom: 1.25rem;\n  @include sidebar.app-sidebar-logo-text;\n}\n\n.platform-sidebar__logo-mark[_ngcontent-%COMP%] {\n  @include sidebar.app-sidebar-logo-mark;\n}\n\n.platform-sidebar__nav[_ngcontent-%COMP%] {\n  @include sidebar.app-sidebar-nav;\n  margin: 0;\n}\n\n@media (max-width: 768px) {\n  .platform-sidebar[_ngcontent-%COMP%] {\n    position: static;\n    width: 100%;\n    height: auto;\n    max-height: none;\n  }\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PlatformSidebar, [{
        type: Component,
        args: [{ selector: 'app-platform-sidebar', imports: [PlatformSidebarMenu], template: "<aside class=\"platform-sidebar\" aria-label=\"Navigation administration\">\n  <div class=\"platform-sidebar__logo\">\n    <div class=\"platform-sidebar__logo-mark\">K</div>\n    <div>\n      <strong>KubaGest</strong>\n      <small>Administration</small>\n    </div>\n  </div>\n\n  <nav class=\"platform-sidebar__nav\">\n    <app-platform-sidebar-menu [items]=\"menuItems\" />\n  </nav>\n</aside>\n", styles: ["@use '../../layout-shell.scss' as shell;\n@use '../../sidebar-shell.scss' as sidebar;\n\n:host {\n  display: block;\n}\n\n.platform-sidebar {\n  @include shell.shell-sidebar-fixed(shell.$platform-sidebar-width);\n  @include sidebar.app-sidebar-chrome;\n}\n\n:host-context(html.dark) .platform-sidebar {\n  background: var(--color-surface-container-lowest);\n  border-right: 1px solid var(--color-border-subtle);\n  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.55);\n  color: var(--color-sidebar-fg);\n}\n\n:host-context(html.dark) {\n  .platform-sidebar__logo strong {\n    color: #f8fafc;\n  }\n\n  .platform-sidebar__logo small {\n    color: #94a3b8;\n    opacity: 1;\n  }\n\n  .platform-sidebar__logo-mark {\n    border: 1px solid rgba(96, 165, 250, 0.4);\n    box-shadow: 0 0 10px rgba(59, 130, 246, 0.28);\n    color: var(--color-primary);\n  }\n}\n\n.platform-sidebar__logo {\n  @include sidebar.app-sidebar-logo;\n  margin-bottom: 0.5rem;\n  padding-bottom: 1.25rem;\n  @include sidebar.app-sidebar-logo-text;\n}\n\n.platform-sidebar__logo-mark {\n  @include sidebar.app-sidebar-logo-mark;\n}\n\n.platform-sidebar__nav {\n  @include sidebar.app-sidebar-nav;\n  margin: 0;\n}\n\n@media (max-width: 768px) {\n  .platform-sidebar {\n    position: static;\n    width: 100%;\n    height: auto;\n    max-height: none;\n  }\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PlatformSidebar, { className: "PlatformSidebar", filePath: "src/app/core/layouts/platform/sidebar/platform-sidebar.ts", lineNumber: 11 }); })();
