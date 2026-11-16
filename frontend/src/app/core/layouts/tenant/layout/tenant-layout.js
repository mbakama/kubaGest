import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AUTHENTICATION_PATH } from '../../../auth/auth.paths';
import { AuthSessionService } from '../../../auth/auth-session.service';
import { LayoutFooter } from '../../footer/layout-footer';
import { TenantSidebar } from '../sidebar/tenant-sidebar';
import { TenantTopbar } from '../topbar/tenant-topbar';
import * as i0 from "@angular/core";
export class TenantLayout {
    authSession = inject(AuthSessionService);
    router = inject(Router);
    logout() {
        this.authSession.clear();
        void this.router.navigate([AUTHENTICATION_PATH]);
    }
    static ɵfac = function TenantLayout_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || TenantLayout)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: TenantLayout, selectors: [["app-tenant-layout"]], decls: 7, vars: 0, consts: [[1, "tenant-shell"], [1, "tenant-shell__workspace"], [3, "logoutClick"], ["id", "content", "tabindex", "-1", 1, "tenant-shell__content"]], template: function TenantLayout_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0);
            i0.ɵɵelement(1, "app-tenant-sidebar");
            i0.ɵɵelementStart(2, "div", 1)(3, "app-tenant-topbar", 2);
            i0.ɵɵlistener("logoutClick", function TenantLayout_Template_app_tenant_topbar_logoutClick_3_listener() { return ctx.logout(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "main", 3);
            i0.ɵɵelement(5, "router-outlet");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(6, "app-layout-footer");
            i0.ɵɵelementEnd()();
        } }, dependencies: [RouterOutlet, TenantSidebar, TenantTopbar, LayoutFooter], styles: ["@use '../../layout-shell.scss' as shell;\n\n[_nghost-%COMP%] {\n  display: block;\n  font-family: Inter, 'Segoe UI', sans-serif;\n}\n\n.tenant-shell[_ngcontent-%COMP%] {\n  min-height: 100dvh;\n  background: var(--%NS%color-surface);\n  color: var(--%NS%color-on-surface);\n}\n\n.tenant-shell__workspace[_ngcontent-%COMP%] {\n  @include shell.shell-workspace-footer;\n  @include shell.shell-workspace-sidebar-offset(shell.$tenant-sidebar-width);\n  padding-top: shell.$layout-topbar-height;\n}\n\n.tenant-shell__content[_ngcontent-%COMP%] {\n  @include shell.shell-page-content;\n}\n\n@media (max-width: 768px) {\n  .tenant-shell__workspace[_ngcontent-%COMP%] {\n    margin-left: 0;\n    width: 100%;\n    padding-top: 0;\n  }\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TenantLayout, [{
        type: Component,
        args: [{ selector: 'app-tenant-layout', imports: [RouterOutlet, TenantSidebar, TenantTopbar, LayoutFooter], template: "<div class=\"tenant-shell\">\n  <app-tenant-sidebar />\n\n  <div class=\"tenant-shell__workspace\">\n    <app-tenant-topbar (logoutClick)=\"logout()\" />\n    <main class=\"tenant-shell__content\" id=\"content\" tabindex=\"-1\">\n      <router-outlet />\n    </main>\n    <app-layout-footer />\n  </div>\n</div>\n", styles: ["@use '../../layout-shell.scss' as shell;\n\n:host {\n  display: block;\n  font-family: Inter, 'Segoe UI', sans-serif;\n}\n\n.tenant-shell {\n  min-height: 100dvh;\n  background: var(--color-surface);\n  color: var(--color-on-surface);\n}\n\n.tenant-shell__workspace {\n  @include shell.shell-workspace-footer;\n  @include shell.shell-workspace-sidebar-offset(shell.$tenant-sidebar-width);\n  padding-top: shell.$layout-topbar-height;\n}\n\n.tenant-shell__content {\n  @include shell.shell-page-content;\n}\n\n@media (max-width: 768px) {\n  .tenant-shell__workspace {\n    margin-left: 0;\n    width: 100%;\n    padding-top: 0;\n  }\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(TenantLayout, { className: "TenantLayout", filePath: "src/app/core/layouts/tenant/layout/tenant-layout.ts", lineNumber: 15 }); })();
