import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
const STORAGE_KEY = 'kubagest-register-draft';
export class RegisterDraftStore {
    save(draft) {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
        }
        catch {
            /* quota / mode privé */
        }
    }
    load() {
        try {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return null;
            }
            const parsed = JSON.parse(raw);
            if (!parsed?.form || typeof parsed.step !== 'number') {
                return null;
            }
            return parsed;
        }
        catch {
            return null;
        }
    }
    clear() {
        try {
            sessionStorage.removeItem(STORAGE_KEY);
        }
        catch {
            /* ignore */
        }
    }
    static ɵfac = function RegisterDraftStore_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || RegisterDraftStore)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: RegisterDraftStore, factory: RegisterDraftStore.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(RegisterDraftStore, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
