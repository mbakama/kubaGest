import { Injectable, computed, signal } from '@angular/core';
import { finalize } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Overlay global — même logique que eRecettes (`loading_state` + `loading_message`)
 * affiché par `<app-loading-host />` à la racine.
 */
export class AppLoadingService {
    activeCount = signal(0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "activeCount" }] : /* istanbul ignore next */ []));
    loading_message = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "loading_message" }] : /* istanbul ignore next */ []));
    /** Nommage aligné eRecettes / contribuable-new. */
    loading_state = computed(() => this.activeCount() > 0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "loading_state" }] : /* istanbul ignore next */ []));
    /** Alias interne. */
    visible = this.loading_state;
    start(message) {
        this.show(message);
    }
    stop() {
        this.hide();
    }
    show(message) {
        this.activeCount.update((count) => count + 1);
        if (message) {
            this.loading_message.set(message);
        }
        else if (this.activeCount() === 1 && !this.loading_message()) {
            this.loading_message.set('Chargement en cours ...');
        }
    }
    hide() {
        this.activeCount.update((count) => Math.max(0, count - 1));
        if (this.activeCount() === 0) {
            this.loading_message.set(null);
        }
    }
    async run(task, message) {
        this.start(message);
        try {
            return await task();
        }
        finally {
            this.stop();
        }
    }
    track(source, message) {
        this.start(message);
        return source.pipe(finalize(() => this.stop()));
    }
    static ɵfac = function AppLoadingService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AppLoadingService)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: AppLoadingService, factory: AppLoadingService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AppLoadingService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
