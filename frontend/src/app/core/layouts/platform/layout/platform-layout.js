import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AUTHENTICATION_PATH } from '../../../auth/auth.paths';
import { AuthSessionService } from '../../../auth/auth-session.service';
import { LayoutFooter } from '../../footer/layout-footer';
import { PlatformSidebar } from '../sidebar/platform-sidebar';
import { PlatformTopbar } from '../topbar/platform-topbar';
import * as i0 from "@angular/core";
/**
 * Assemble sidebar + topbar + router-outlet (équivalent `VerticalComponent` eRecettes).
 */
export class PlatformLayout {
    authSession = inject(AuthSessionService);
    router = inject(Router);
    logout() {
        this.authSession.clear();
        void this.router.navigate([AUTHENTICATION_PATH]);
    }
    static ɵfac = function PlatformLayout_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PlatformLayout)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PlatformLayout, selectors: [["app-platform-layout"]], decls: 7, vars: 0, consts: [[1, "platform-shell"], [1, "platform-shell__workspace"], [3, "logoutClick"], [1, "platform-shell__content"]], template: function PlatformLayout_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0);
            i0.ɵɵelement(1, "app-platform-sidebar");
            i0.ɵɵelementStart(2, "div", 1)(3, "app-platform-topbar", 2);
            i0.ɵɵlistener("logoutClick", function PlatformLayout_Template_app_platform_topbar_logoutClick_3_listener() { return ctx.logout(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "main", 3);
            i0.ɵɵelement(5, "router-outlet");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(6, "app-layout-footer");
            i0.ɵɵelementEnd()();
        } }, dependencies: [RouterOutlet, PlatformSidebar, PlatformTopbar, LayoutFooter], styles: ["@use '../../layout-shell.scss' as shell;\n\n[_nghost-%COMP%] {\n  display: block;\n  font-family: Inter, 'Segoe UI', sans-serif;\n}\n\n.platform-shell[_ngcontent-%COMP%] {\n  min-height: 100dvh;\n  background: var(--%NS%color-platform-canvas);\n  color: var(--%NS%color-platform-ink);\n}\n\n.platform-shell__workspace[_ngcontent-%COMP%] {\n  @include shell.shell-workspace-footer;\n  @include shell.shell-workspace-sidebar-offset(shell.$platform-sidebar-width);\n  padding-top: shell.$layout-topbar-height;\n}\n\n.platform-shell__content[_ngcontent-%COMP%] {\n  @include shell.shell-page-content;\n}\n\n@media (max-width: 768px) {\n  .platform-shell__workspace[_ngcontent-%COMP%] {\n    margin-left: 0;\n    width: 100%;\n    padding-top: 0;\n  }\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PlatformLayout, [{
        type: Component,
        args: [{ selector: 'app-platform-layout', imports: [RouterOutlet, PlatformSidebar, PlatformTopbar, LayoutFooter], template: "<div class=\"platform-shell\">\n  <app-platform-sidebar />\n\n  <div class=\"platform-shell__workspace\">\n    <app-platform-topbar (logoutClick)=\"logout()\" />\n    <main class=\"platform-shell__content\">\n      <router-outlet />\n    </main>\n    <app-layout-footer />\n  </div>\n</div>\n", styles: ["@use '../../layout-shell.scss' as shell;\n\n:host {\n  display: block;\n  font-family: Inter, 'Segoe UI', sans-serif;\n}\n\n.platform-shell {\n  min-height: 100dvh;\n  background: var(--color-platform-canvas);\n  color: var(--color-platform-ink);\n}\n\n.platform-shell__workspace {\n  @include shell.shell-workspace-footer;\n  @include shell.shell-workspace-sidebar-offset(shell.$platform-sidebar-width);\n  padding-top: shell.$layout-topbar-height;\n}\n\n.platform-shell__content {\n  @include shell.shell-page-content;\n}\n\n@media (max-width: 768px) {\n  .platform-shell__workspace {\n    margin-left: 0;\n    width: 100%;\n    padding-top: 0;\n  }\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PlatformLayout, { className: "PlatformLayout", filePath: "src/app/core/layouts/platform/layout/platform-layout.ts", lineNumber: 18 }); })();
