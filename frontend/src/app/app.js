import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppDialogHostComponent } from './core/ui/dialog';
import { AppLoadingHostComponent } from './core/ui/loading';
import * as i0 from "@angular/core";
export class App {
    static ɵfac = function App_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || App)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: App, selectors: [["app-root"]], decls: 5, vars: 0, consts: [["href", "#content", 1, "sr-only", "focus:not-sr-only", "focus:fixed", "focus:left-4", "focus:top-4", "focus:z-[100]", "focus:rounded-lg", "focus:bg-white", "focus:px-3", "focus:py-2", "focus:shadow-md"]], template: function App_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "a", 0);
            i0.ɵɵtext(1, "Aller au contenu");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(2, "app-dialog-host")(3, "app-loading-host")(4, "router-outlet");
        } }, dependencies: [RouterOutlet, AppDialogHostComponent, AppLoadingHostComponent], encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(App, [{
        type: Component,
        args: [{ selector: 'app-root', imports: [RouterOutlet, AppDialogHostComponent, AppLoadingHostComponent], template: "<a\n  class=\"sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:shadow-md\"\n  href=\"#content\"\n  >Aller au contenu</a\n>\n<app-dialog-host />\n<app-loading-host />\n<router-outlet />\n" }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(App, { className: "App", filePath: "src/app/app.ts", lineNumber: 12 }); })();
