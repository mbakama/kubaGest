import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { safeLegalReturnUrl } from '../../core/utils/legal-return.util';
import * as i0 from "@angular/core";
export class PrivacyPolicy {
    route = inject(ActivatedRoute);
    backPath = toSignal(this.route.queryParamMap.pipe(map((params) => safeLegalReturnUrl(params.get('retour')))), { initialValue: safeLegalReturnUrl(null) });
    static ɵfac = function PrivacyPolicy_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PrivacyPolicy)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PrivacyPolicy, selectors: [["app-privacy-policy"]], decls: 26, vars: 1, consts: [["id", "content", "tabindex", "-1", 1, "legal-page"], [1, "legal-page__shell"], [1, "legal-page__back", 3, "routerLink"], ["aria-hidden", "true", 1, "fa-solid", "fa-arrow-left"], [1, "legal-page__updated"]], template: function PrivacyPolicy_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "main", 0)(1, "div", 1)(2, "a", 2);
            i0.ɵɵelement(3, "i", 3);
            i0.ɵɵtext(4, " Retour ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "h1");
            i0.ɵɵtext(6, "Politique de confidentialit\u00E9");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "p", 4);
            i0.ɵɵtext(8, "Derni\u00E8re mise \u00E0 jour\u00A0: novembre 2024");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "article")(10, "h2");
            i0.ɵɵtext(11, "Donn\u00E9es collect\u00E9es");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "p");
            i0.ɵɵtext(13, " Lors de la cr\u00E9ation d\u2019un espace ou de la connexion, KubaGest traite les donn\u00E9es n\u00E9cessaires \u00E0 l\u2019identification du responsable et de l\u2019\u00E9tablissement (nom, pr\u00E9nom, adresse e-mail, t\u00E9l\u00E9phone facultatif, nom commercial, type d\u2019activit\u00E9). ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "h2");
            i0.ɵɵtext(15, "Finalit\u00E9s");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(16, "p");
            i0.ɵɵtext(17, " Ces informations servent \u00E0 l\u2019authentification, la s\u00E9curisation du compte, le support et l\u2019exploitation de votre espace commercial. Elles ne sont pas vendues \u00E0 des tiers. ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "h2");
            i0.ɵɵtext(19, "Conservation et s\u00E9curit\u00E9");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "p");
            i0.ɵɵtext(21, " Les donn\u00E9es sont h\u00E9berg\u00E9es et transmises de fa\u00E7on s\u00E9curis\u00E9e (chiffrement en transit). Elles sont conserv\u00E9es tant que le compte est actif, puis selon les obligations l\u00E9gales applicables en RDC. ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "h2");
            i0.ɵɵtext(23, "Vos droits");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(24, "p");
            i0.ɵɵtext(25, " Vous pouvez demander l\u2019acc\u00E8s, la rectification ou la suppression de vos donn\u00E9es en contactant l\u2019assistance KubaGest depuis votre espace ou par les canaux officiels de support. ");
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("routerLink", ctx.backPath());
        } }, dependencies: [RouterLink], styles: [".legal-page[_ngcontent-%COMP%] {\n  min-height: 100dvh;\n  background: #f8fafc;\n  color: #102033;\n}\n\n.legal-page__shell[_ngcontent-%COMP%] {\n  max-width: 42rem;\n  margin: 0 auto;\n  padding: clamp(1.25rem, 4vw, 2.5rem) clamp(1rem, 3vw, 1.5rem) 3rem;\n}\n\n.legal-page__back[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.45rem;\n  margin-bottom: 1.25rem;\n  font-size: 0.9rem;\n  font-weight: 650;\n  color: #047857;\n  text-decoration: none;\n}\n\n.legal-page__back[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n\n.legal-page[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0 0 0.35rem;\n  font-size: clamp(1.45rem, 3vw, 1.85rem);\n  line-height: 1.2;\n}\n\n.legal-page__updated[_ngcontent-%COMP%] {\n  margin: 0 0 1.5rem;\n  font-size: 0.85rem;\n  color: #64748b;\n}\n\n.legal-page[_ngcontent-%COMP%]   article[_ngcontent-%COMP%] {\n  padding: 1.25rem 1.35rem;\n  border: 1px solid #e2e8f0;\n  border-radius: 0.85rem;\n  background: #fff;\n  font-size: 0.92rem;\n  line-height: 1.65;\n  color: #334155;\n}\n\n.legal-page[_ngcontent-%COMP%]   article[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 1.35rem 0 0.5rem;\n  font-size: 1rem;\n  color: #0f172a;\n}\n\n.legal-page[_ngcontent-%COMP%]   article[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]:first-child {\n  margin-top: 0;\n}\n\n.legal-page[_ngcontent-%COMP%]   article[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0 0 0.85rem;\n}\n\n.legal-page[_ngcontent-%COMP%]   article[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  margin: 0 0 0.85rem;\n  padding-left: 1.25rem;\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PrivacyPolicy, [{
        type: Component,
        args: [{ selector: 'app-privacy-policy', imports: [RouterLink], template: "<main id=\"content\" tabindex=\"-1\" class=\"legal-page\">\n  <div class=\"legal-page__shell\">\n    <a class=\"legal-page__back\" [routerLink]=\"backPath()\">\n      <i class=\"fa-solid fa-arrow-left\" aria-hidden=\"true\"></i>\n      Retour\n    </a>\n    <h1>Politique de confidentialit\u00E9</h1>\n    <p class=\"legal-page__updated\">Derni\u00E8re mise \u00E0 jour&nbsp;: novembre 2024</p>\n    <article>\n      <h2>Donn\u00E9es collect\u00E9es</h2>\n      <p>\n        Lors de la cr\u00E9ation d\u2019un espace ou de la connexion, KubaGest traite les donn\u00E9es n\u00E9cessaires \u00E0\n        l\u2019identification du responsable et de l\u2019\u00E9tablissement (nom, pr\u00E9nom, adresse e-mail, t\u00E9l\u00E9phone\n        facultatif, nom commercial, type d\u2019activit\u00E9).\n      </p>\n      <h2>Finalit\u00E9s</h2>\n      <p>\n        Ces informations servent \u00E0 l\u2019authentification, la s\u00E9curisation du compte, le support et\n        l\u2019exploitation de votre espace commercial. Elles ne sont pas vendues \u00E0 des tiers.\n      </p>\n      <h2>Conservation et s\u00E9curit\u00E9</h2>\n      <p>\n        Les donn\u00E9es sont h\u00E9berg\u00E9es et transmises de fa\u00E7on s\u00E9curis\u00E9e (chiffrement en transit). Elles sont\n        conserv\u00E9es tant que le compte est actif, puis selon les obligations l\u00E9gales applicables en RDC.\n      </p>\n      <h2>Vos droits</h2>\n      <p>\n        Vous pouvez demander l\u2019acc\u00E8s, la rectification ou la suppression de vos donn\u00E9es en contactant\n        l\u2019assistance KubaGest depuis votre espace ou par les canaux officiels de support.\n      </p>\n    </article>\n  </div>\n</main>\n", styles: [".legal-page {\n  min-height: 100dvh;\n  background: #f8fafc;\n  color: #102033;\n}\n\n.legal-page__shell {\n  max-width: 42rem;\n  margin: 0 auto;\n  padding: clamp(1.25rem, 4vw, 2.5rem) clamp(1rem, 3vw, 1.5rem) 3rem;\n}\n\n.legal-page__back {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.45rem;\n  margin-bottom: 1.25rem;\n  font-size: 0.9rem;\n  font-weight: 650;\n  color: #047857;\n  text-decoration: none;\n}\n\n.legal-page__back:hover {\n  text-decoration: underline;\n}\n\n.legal-page h1 {\n  margin: 0 0 0.35rem;\n  font-size: clamp(1.45rem, 3vw, 1.85rem);\n  line-height: 1.2;\n}\n\n.legal-page__updated {\n  margin: 0 0 1.5rem;\n  font-size: 0.85rem;\n  color: #64748b;\n}\n\n.legal-page article {\n  padding: 1.25rem 1.35rem;\n  border: 1px solid #e2e8f0;\n  border-radius: 0.85rem;\n  background: #fff;\n  font-size: 0.92rem;\n  line-height: 1.65;\n  color: #334155;\n}\n\n.legal-page article h2 {\n  margin: 1.35rem 0 0.5rem;\n  font-size: 1rem;\n  color: #0f172a;\n}\n\n.legal-page article h2:first-child {\n  margin-top: 0;\n}\n\n.legal-page article p {\n  margin: 0 0 0.85rem;\n}\n\n.legal-page article ul {\n  margin: 0 0 0.85rem;\n  padding-left: 1.25rem;\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PrivacyPolicy, { className: "PrivacyPolicy", filePath: "src/app/features/legal/privacy-policy.ts", lineNumber: 13 }); })();
