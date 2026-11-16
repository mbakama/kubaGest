import { Injectable, inject } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import * as i0 from "@angular/core";
/** Façade Promise autour de `ConfirmationService` + `p-confirmDialog`. */
export class AppDialogService {
    confirmation = inject(ConfirmationService);
    confirm(options) {
        return new Promise((resolve) => {
            this.confirmation.confirm({
                header: options.header ?? 'Confirmation',
                message: options.message,
                icon: options.icon ?? 'pi pi-question-circle',
                acceptLabel: options.acceptLabel ?? 'Confirmer',
                rejectLabel: options.rejectLabel ?? 'Annuler',
                closable: false,
                accept: () => resolve(true),
                reject: () => resolve(false),
            });
        });
    }
    alert(options) {
        return new Promise((resolve) => {
            this.confirmation.confirm({
                header: options.header ?? 'Information',
                message: options.message,
                icon: options.icon ?? 'pi pi-info-circle',
                acceptLabel: options.acceptLabel ?? 'Fermer',
                rejectVisible: false,
                closable: false,
                dismissableMask: true,
                accept: () => resolve(),
                reject: () => resolve(),
            });
        });
    }
    static ɵfac = function AppDialogService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AppDialogService)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: AppDialogService, factory: AppDialogService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AppDialogService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
