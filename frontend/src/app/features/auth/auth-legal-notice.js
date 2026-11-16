import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PRIVACY_POLICY_PATH, TERMS_OF_USE_PATH, } from '../../core/auth/auth.paths';
import * as i0 from "@angular/core";
export class AuthLegalNotice {
    router = inject(Router);
    /** Appelé avant ouverture d’une page légale (ex. sauvegarder le brouillon d’inscription). */
    saveDraft = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "saveDraft" }] : /* istanbul ignore next */ []));
    privacyPath = PRIVACY_POLICY_PATH;
    termsPath = TERMS_OF_USE_PATH;
    legalReturnQuery = { retour: this.router.url.split('?')[0] ?? '' };
    beforeLegalNavigate() {
        this.saveDraft()?.();
    }
    static ɵfac = function AuthLegalNotice_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AuthLegalNotice)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AuthLegalNotice, selectors: [["app-auth-legal-notice"]], inputs: { saveDraft: [1, "saveDraft"] }, decls: 13, vars: 4, consts: [["role", "note", 1, "auth-data-privacy"], ["aria-hidden", "true", 1, "fa-solid", "fa-shield-halved", "auth-data-privacy__icon"], [3, "click", "routerLink", "queryParams"]], template: function AuthLegalNotice_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "p", 0);
            i0.ɵɵelement(1, "i", 1);
            i0.ɵɵelementStart(2, "span");
            i0.ɵɵtext(3, " Vos donn\u00E9es personnelles sont trait\u00E9es de mani\u00E8re ");
            i0.ɵɵelementStart(4, "strong");
            i0.ɵɵtext(5, "confidentielle et s\u00E9curis\u00E9e");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(6, ", uniquement pour l\u2019authentification et la gestion de votre espace KubaGest. Consultez notre ");
            i0.ɵɵelementStart(7, "a", 2);
            i0.ɵɵlistener("click", function AuthLegalNotice_Template_a_click_7_listener() { return ctx.beforeLegalNavigate(); });
            i0.ɵɵtext(8, "politique de confidentialit\u00E9");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(9, " et nos ");
            i0.ɵɵelementStart(10, "a", 2);
            i0.ɵɵlistener("click", function AuthLegalNotice_Template_a_click_10_listener() { return ctx.beforeLegalNavigate(); });
            i0.ɵɵtext(11, "conditions d\u2019utilisation");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(12, ". ");
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(7);
            i0.ɵɵproperty("routerLink", ctx.privacyPath)("queryParams", ctx.legalReturnQuery);
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("routerLink", ctx.termsPath)("queryParams", ctx.legalReturnQuery);
        } }, dependencies: [RouterLink], styles: [".auth-data-privacy[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.45rem;\n  margin: 0.75rem 0 0;\n  padding: 0.5rem 0.65rem;\n  border-radius: 0.5rem;\n  border: 1px solid #e2e8f0;\n  background: #f8fafc;\n  font-size: 0.68rem;\n  line-height: 1.4;\n  color: #64748b;\n  text-align: left;\n}\n\n.auth-data-privacy__icon[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  margin-top: 0.05rem;\n  color: var(--%NS%color-primary);\n  font-size: 0.75rem;\n}\n\n.auth-data-privacy[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: var(--%NS%color-primary);\n  font-weight: 600;\n  font-size: inherit;\n  text-underline-offset: 2px;\n}\n\n.auth-data-privacy[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n\n[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AuthLegalNotice, [{
        type: Component,
        args: [{ selector: 'app-auth-legal-notice', imports: [RouterLink], template: `
    <p class="auth-data-privacy" role="note">
      <i class="fa-solid fa-shield-halved auth-data-privacy__icon" aria-hidden="true"></i>
      <span>
        Vos données personnelles sont traitées de manière
        <strong>confidentielle et sécurisée</strong>, uniquement pour l’authentification et la gestion de
        votre espace KubaGest. Consultez notre
        <a
          [routerLink]="privacyPath"
          [queryParams]="legalReturnQuery"
          (click)="beforeLegalNavigate()"
          >politique de confidentialité</a
        >
        et nos
        <a
          [routerLink]="termsPath"
          [queryParams]="legalReturnQuery"
          (click)="beforeLegalNavigate()"
          >conditions d’utilisation</a
        >.
      </span>
    </p>
  `, styles: [".auth-data-privacy {\n  display: flex;\n  gap: 0.45rem;\n  margin: 0.75rem 0 0;\n  padding: 0.5rem 0.65rem;\n  border-radius: 0.5rem;\n  border: 1px solid #e2e8f0;\n  background: #f8fafc;\n  font-size: 0.68rem;\n  line-height: 1.4;\n  color: #64748b;\n  text-align: left;\n}\n\n.auth-data-privacy__icon {\n  flex-shrink: 0;\n  margin-top: 0.05rem;\n  color: var(--color-primary);\n  font-size: 0.75rem;\n}\n\n.auth-data-privacy a {\n  color: var(--color-primary);\n  font-weight: 600;\n  font-size: inherit;\n  text-underline-offset: 2px;\n}\n\n.auth-data-privacy a:hover {\n  text-decoration: underline;\n}\n\n:host {\n  display: block;\n  width: 100%;\n}\n"] }]
    }], null, { saveDraft: [{ type: i0.Input, args: [{ isSignal: true, alias: "saveDraft", required: false }] }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AuthLegalNotice, { className: "AuthLegalNotice", filePath: "src/app/features/auth/auth-legal-notice.ts", lineNumber: 36 }); })();
