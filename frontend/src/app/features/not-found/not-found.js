import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import * as i0 from "@angular/core";
export class NotFound {
    static ɵfac = function NotFound_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || NotFound)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: NotFound, selectors: [["app-not-found"]], decls: 8, vars: 0, consts: [[1, "eyebrow"], [1, "page-intro"], ["routerLink", "/authentification", 1, "button", "primary"]], template: function NotFound_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "p", 0);
            i0.ɵɵtext(1, "ERREUR 404");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(2, "h1");
            i0.ɵɵtext(3, "Page introuvable");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "p", 1);
            i0.ɵɵtext(5, "Cette adresse ne correspond \u00E0 aucune page de Kubagest.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "a", 2);
            i0.ɵɵtext(7, "Revenir \u00E0 la connexion");
            i0.ɵɵelementEnd();
        } }, dependencies: [RouterLink], encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NotFound, [{
        type: Component,
        args: [{
                selector: 'app-not-found',
                imports: [RouterLink],
                template: `<p class="eyebrow">ERREUR 404</p>
    <h1>Page introuvable</h1>
    <p class="page-intro">Cette adresse ne correspond à aucune page de Kubagest.</p>
    <a class="button primary" routerLink="/authentification">Revenir à la connexion</a>`,
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(NotFound, { className: "NotFound", filePath: "src/app/features/not-found/not-found.ts", lineNumber: 12 }); })();
