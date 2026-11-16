import { Component } from '@angular/core';
import * as i0 from "@angular/core";
export class VerifyOpt {
    static ɵfac = function VerifyOpt_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || VerifyOpt)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: VerifyOpt, selectors: [["app-verify-opt"]], decls: 2, vars: 0, template: function VerifyOpt_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "p");
            i0.ɵɵtext(1, "verify-opt works!");
            i0.ɵɵdomElementEnd();
        } }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(VerifyOpt, [{
        type: Component,
        args: [{ imports: [], selector: 'app-verify-opt', template: "<p>verify-opt works!</p>\n" }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(VerifyOpt, { className: "VerifyOpt", filePath: "src/app/features/auth/verify-opt/verify-opt.ts", lineNumber: 9 }); })();
