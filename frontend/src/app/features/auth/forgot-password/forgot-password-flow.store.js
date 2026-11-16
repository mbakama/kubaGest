import { Injectable, signal } from '@angular/core';
import * as i0 from "@angular/core";
export class ForgotPasswordFlowStore {
    email = signal('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "email" }] : /* istanbul ignore next */ []));
    resetToken = signal('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "resetToken" }] : /* istanbul ignore next */ []));
    reset() {
        this.email.set('');
        this.resetToken.set('');
    }
    static ɵfac = function ForgotPasswordFlowStore_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ForgotPasswordFlowStore)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ForgotPasswordFlowStore, factory: ForgotPasswordFlowStore.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ForgotPasswordFlowStore, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
