import { Component, inject } from '@angular/core';
import { ThemeService } from '../theme.service';
import * as i0 from "@angular/core";
function ThemeToggleComponent_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "span", 3);
    i0.ɵɵtext(1, "Jour");
    i0.ɵɵdomElementEnd();
} }
function ThemeToggleComponent_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "span", 3);
    i0.ɵɵtext(1, "Nuit");
    i0.ɵɵdomElementEnd();
} }
/** Segmented Jour / Nuit (maquette stitch 13-11). */
export class ThemeToggleComponent {
    theme = inject(ThemeService);
    setLight() {
        if (!this.theme.dark())
            return;
        this.theme.setLight();
    }
    setDark() {
        if (this.theme.dark())
            return;
        this.theme.setDark();
    }
    static ɵfac = function ThemeToggleComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ThemeToggleComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ThemeToggleComponent, selectors: [["app-theme-toggle"]], decls: 7, vars: 8, consts: [["title", "Basculer le th\u00E8me", "role", "group", "aria-label", "Th\u00E8me de l\u2019interface", 1, "flex", "items-center", "gap-1", "rounded-full", "border", "border-outline-variant/40", "bg-surface-container-low", "p-1", "shadow-inner", "dark:border-white/10", "dark:bg-[#051424]"], ["type", "button", "aria-label", "Mode jour", 1, "flex", "cursor-pointer", "items-center", "justify-center", "gap-1", "rounded-full", "transition-colors", 3, "click"], ["aria-hidden", "true", 1, "fa-solid", "fa-sun", "text-[16px]"], [1, "text-[11px]", "font-medium", "leading-none"], ["type", "button", "aria-label", "Mode nuit", 1, "flex", "cursor-pointer", "items-center", "justify-center", "gap-1", "rounded-full", "transition-all", 3, "click"], ["aria-hidden", "true", 1, "fa-solid", "fa-moon", "text-[16px]"]], template: function ThemeToggleComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "div", 0)(1, "button", 1);
            i0.ɵɵdomListener("click", function ThemeToggleComponent_Template_button_click_1_listener() { return ctx.setLight(); });
            i0.ɵɵdomElement(2, "i", 2);
            i0.ɵɵconditionalCreate(3, ThemeToggleComponent_Conditional_3_Template, 2, 0, "span", 3);
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(4, "button", 4);
            i0.ɵɵdomListener("click", function ThemeToggleComponent_Template_button_click_4_listener() { return ctx.setDark(); });
            i0.ɵɵdomElement(5, "i", 5);
            i0.ɵɵconditionalCreate(6, ThemeToggleComponent_Conditional_6_Template, 2, 0, "span", 3);
            i0.ɵɵdomElementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵclassMap(ctx.theme.dark() ? "p-1.5 text-text-muted hover:text-text-primary" : "border border-primary/40 bg-primary/20 px-2 py-1 text-primary shadow-[0_0_8px] shadow-primary/35");
            i0.ɵɵattribute("aria-pressed", !ctx.theme.dark());
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(!ctx.theme.dark() ? 3 : -1);
            i0.ɵɵadvance();
            i0.ɵɵclassMap(ctx.theme.dark() ? "border border-primary/40 bg-primary/20 px-2 py-1 text-primary shadow-[0_0_8px] shadow-primary/35" : "p-1.5 text-text-muted hover:text-text-primary");
            i0.ɵɵattribute("aria-pressed", ctx.theme.dark());
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.theme.dark() ? 6 : -1);
        } }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ThemeToggleComponent, [{
        type: Component,
        args: [{ selector: 'app-theme-toggle', standalone: true, template: "<div\n  class=\"flex items-center gap-1 rounded-full border border-outline-variant/40 bg-surface-container-low p-1 shadow-inner dark:border-white/10 dark:bg-[#051424]\"\n  title=\"Basculer le th\u00E8me\"\n  role=\"group\"\n  aria-label=\"Th\u00E8me de l\u2019interface\"\n>\n  <button\n    type=\"button\"\n    class=\"flex cursor-pointer items-center justify-center gap-1 rounded-full transition-colors\"\n    [class]=\"\n      theme.dark()\n        ? 'p-1.5 text-text-muted hover:text-text-primary'\n        : 'border border-primary/40 bg-primary/20 px-2 py-1 text-primary shadow-[0_0_8px] shadow-primary/35'\n    \"\n    [attr.aria-pressed]=\"!theme.dark()\"\n    aria-label=\"Mode jour\"\n    (click)=\"setLight()\"\n  >\n    <i class=\"fa-solid fa-sun text-[16px]\" aria-hidden=\"true\"></i>\n    @if (!theme.dark()) {\n      <span class=\"text-[11px] font-medium leading-none\">Jour</span>\n    }\n  </button>\n  <button\n    type=\"button\"\n    class=\"flex cursor-pointer items-center justify-center gap-1 rounded-full transition-all\"\n    [class]=\"\n      theme.dark()\n        ? 'border border-primary/40 bg-primary/20 px-2 py-1 text-primary shadow-[0_0_8px] shadow-primary/35'\n        : 'p-1.5 text-text-muted hover:text-text-primary'\n    \"\n    [attr.aria-pressed]=\"theme.dark()\"\n    aria-label=\"Mode nuit\"\n    (click)=\"setDark()\"\n  >\n    <i class=\"fa-solid fa-moon text-[16px]\" aria-hidden=\"true\"></i>\n    @if (theme.dark()) {\n      <span class=\"text-[11px] font-medium leading-none\">Nuit</span>\n    }\n  </button>\n</div>\n" }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ThemeToggleComponent, { className: "ThemeToggleComponent", filePath: "src/app/core/ui/theme-toggle/theme-toggle.ts", lineNumber: 10 }); })();
