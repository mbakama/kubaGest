import { Component } from '@angular/core';
import * as i0 from "@angular/core";
export class PlatformSettings {
    static ɵfac = function PlatformSettings_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PlatformSettings)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PlatformSettings, selectors: [["app-platform-settings"]], decls: 5, vars: 0, consts: [[1, "max-w-3xl"], [1, "text-xl", "font-semibold", "text-platform-ink"], [1, "mt-2", "text-sm", "text-platform-muted"]], template: function PlatformSettings_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "div", 0)(1, "h1", 1);
            i0.ɵɵtext(2, "Param\u00E8tres");
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(3, "p", 2);
            i0.ɵɵtext(4, " Pr\u00E9f\u00E9rences de la console plateforme \u2014 contenu \u00E0 venir. ");
            i0.ɵɵdomElementEnd()();
        } }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PlatformSettings, [{
        type: Component,
        args: [{
                selector: 'app-platform-settings',
                template: `
    <div class="max-w-3xl">
      <h1 class="text-xl font-semibold text-platform-ink">Paramètres</h1>
      <p class="mt-2 text-sm text-platform-muted">
        Préférences de la console plateforme — contenu à venir.
      </p>
    </div>
  `,
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PlatformSettings, { className: "PlatformSettings", filePath: "src/app/features/platform/settings/platform-settings.ts", lineNumber: 14 }); })();
