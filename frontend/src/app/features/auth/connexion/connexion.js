import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ApiService } from '../../../core/api/api.service';
import * as i0 from "@angular/core";
export class Connexion {
    api = inject(ApiService);
    destroyRef = inject(DestroyRef);
    state = signal('idle', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "state" }] : /* istanbul ignore next */ []));
    check() {
        if (this.state() === 'loading')
            return;
        this.state.set('loading');
    }
    static ɵfac = function Connexion_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || Connexion)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: Connexion, selectors: [["app-connexion"]], decls: 2, vars: 0, template: function Connexion_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "p");
            i0.ɵɵtext(1, "connexion works!");
            i0.ɵɵdomElementEnd();
        } }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(Connexion, [{
        type: Component,
        args: [{ imports: [], selector: 'app-connexion', template: "<p>connexion works!</p>\n" }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(Connexion, { className: "Connexion", filePath: "src/app/features/auth/connexion/connexion.ts", lineNumber: 10 }); })();
