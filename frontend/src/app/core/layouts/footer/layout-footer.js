import { Component } from '@angular/core';
import * as i0 from "@angular/core";
export class LayoutFooter {
    year = new Date().getFullYear();
    static ɵfac = function LayoutFooter_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LayoutFooter)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: LayoutFooter, selectors: [["app-layout-footer"]], decls: 7, vars: 1, consts: [[1, "layout-footer"], [1, "layout-footer__copy"], [1, "layout-footer__version"], [1, "layout-footer__meta"]], template: function LayoutFooter_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "footer", 0)(1, "p", 1);
            i0.ɵɵtext(2);
            i0.ɵɵdomElementStart(3, "span", 2);
            i0.ɵɵtext(4, "v1.0.0 Pro");
            i0.ɵɵdomElementEnd()();
            i0.ɵɵdomElementStart(5, "p", 3);
            i0.ɵɵtext(6, "KUBAGEST SARL");
            i0.ɵɵdomElementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1(" ", ctx.year, " \u00B7 KubaGest ");
        } }, styles: ["@use '../layout-shell.scss' as shell;\r\n\r\n[_nghost-%COMP%] {\n  display: block;\n  position: relative;\n  flex: 0 0 auto;\n  min-height: 3.75rem;\n}\n\r\n.layout-footer[_ngcontent-%COMP%] {\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  align-items: center;\r\n  justify-content: space-between;\r\n  gap: 0.5rem 1rem;\r\n  min-height: 3.75rem;\n  margin: 0;\n  padding: 0.75rem 1.5rem;\n  background: var(--%NS%color-surface-container-lowest);\r\n  border-top: 1px solid var(--%NS%color-border-subtle);\r\n  box-shadow: 0 -1px 4px rgba(15, 34, 58, 0.08);\r\n  font-size: 0.8rem;\r\n  color: var(--%NS%color-platform-muted);\r\n}\r\n\r\n.layout-footer__copy[_ngcontent-%COMP%] {\r\n  margin: 0;\r\n}\r\n\r\n.layout-footer__version[_ngcontent-%COMP%] {\r\n  margin-left: 0.35rem;\r\n  padding: 0.1rem 0.4rem;\r\n  border-radius: 6px;\r\n  background: var(--%NS%color-surface-container-low);\r\n  font-size: 0.72rem;\r\n}\r\n\r\n.layout-footer__meta[_ngcontent-%COMP%] {\n  margin: 0;\n}\n\n@media (max-width: 520px) {\n  .layout-footer[_ngcontent-%COMP%] {\n    align-content: center;\n    padding-inline: 1rem;\n  }\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LayoutFooter, [{
        type: Component,
        args: [{ selector: 'app-layout-footer', template: "<footer class=\"layout-footer\">\r\n  <p class=\"layout-footer__copy\">\r\n    {{ year }} \u00B7 KubaGest\r\n    <span class=\"layout-footer__version\">v1.0.0 Pro</span>\r\n  </p>\r\n  <p class=\"layout-footer__meta\">KUBAGEST SARL</p>\r\n</footer>\r\n", styles: ["@use '../layout-shell.scss' as shell;\r\n\r\n:host {\n  display: block;\n  position: relative;\n  flex: 0 0 auto;\n  min-height: 3.75rem;\n}\n\r\n.layout-footer {\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  align-items: center;\r\n  justify-content: space-between;\r\n  gap: 0.5rem 1rem;\r\n  min-height: 3.75rem;\n  margin: 0;\n  padding: 0.75rem 1.5rem;\n  background: var(--color-surface-container-lowest);\r\n  border-top: 1px solid var(--color-border-subtle);\r\n  box-shadow: 0 -1px 4px rgba(15, 34, 58, 0.08);\r\n  font-size: 0.8rem;\r\n  color: var(--color-platform-muted);\r\n}\r\n\r\n.layout-footer__copy {\r\n  margin: 0;\r\n}\r\n\r\n.layout-footer__version {\r\n  margin-left: 0.35rem;\r\n  padding: 0.1rem 0.4rem;\r\n  border-radius: 6px;\r\n  background: var(--color-surface-container-low);\r\n  font-size: 0.72rem;\r\n}\r\n\r\n.layout-footer__meta {\n  margin: 0;\n}\n\n@media (max-width: 520px) {\n  .layout-footer {\n    align-content: center;\n    padding-inline: 1rem;\n  }\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(LayoutFooter, { className: "LayoutFooter", filePath: "src/app/core/layouts/footer/layout-footer.ts", lineNumber: 8 }); })();
