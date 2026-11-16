import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AUTHENTICATION_PATH } from '../../core/auth/auth.paths';
import * as i0 from "@angular/core";
/** Redirection `/` → connexion lorsqu’aucune session n’est active. */
export class GuestHomeRedirect {
    router = inject(Router);
    ngOnInit() {
        void this.router.navigateByUrl(AUTHENTICATION_PATH, { replaceUrl: true });
    }
    static ɵfac = function GuestHomeRedirect_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || GuestHomeRedirect)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: GuestHomeRedirect, selectors: [["app-guest-home-redirect"]], decls: 0, vars: 0, template: function GuestHomeRedirect_Template(rf, ctx) { }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(GuestHomeRedirect, [{
        type: Component,
        args: [{
                selector: 'app-guest-home-redirect',
                template: '',
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(GuestHomeRedirect, { className: "GuestHomeRedirect", filePath: "src/app/features/auth/guest-home-redirect.ts", lineNumber: 10 }); })();
