import { Injectable, signal } from '@angular/core';
import * as i0 from "@angular/core";
const STORAGE_KEY = 'kubagest-theme';
export class ThemeService {
    dark = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "dark" }] : /* istanbul ignore next */ []));
    constructor() {
        this.apply(this.readInitial(), false);
    }
    toggle() {
        this.apply(!this.dark());
    }
    setLight() {
        this.apply(false);
    }
    setDark() {
        this.apply(true);
    }
    readInitial() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored === 'dark')
                return true;
            if (stored === 'light')
                return false;
        }
        catch {
            /* quota / mode privé */
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    apply(dark, persist = true) {
        this.dark.set(dark);
        document.documentElement.classList.toggle('dark', dark);
        document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
        if (persist) {
            try {
                localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
            }
            catch {
                /* ignore */
            }
        }
    }
    static ɵfac = function ThemeService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ThemeService)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ThemeService, factory: ThemeService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ThemeService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [], null); })();
