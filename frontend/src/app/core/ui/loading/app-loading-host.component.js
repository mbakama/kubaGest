import { Component, computed, inject } from '@angular/core';
import { AppLoadingService } from './app-loading.service';
import * as i0 from "@angular/core";
function AppLoadingHostComponent_Conditional_0_For_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElement(0, "div");
} }
function AppLoadingHostComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
    i0.ɵɵrepeaterCreate(3, AppLoadingHostComponent_Conditional_0_For_4_Template, 1, 0, "div", null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(5, "p", 3);
    i0.ɵɵtext(6);
    i0.ɵɵdomElementEnd()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵattribute("aria-busy", true)("aria-label", ctx_r0.label());
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r0.dots);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r0.label());
} }
export class AppLoadingHostComponent {
    loading = inject(AppLoadingService);
    dots = Array.from({ length: 8 }, (_, i) => i);
    label = computed(() => {
        const raw = this.loading.loading_message();
        return raw?.trim() ? raw.trim() : 'Chargement en cours ...';
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
    static ɵfac = function AppLoadingHostComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AppLoadingHostComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AppLoadingHostComponent, selectors: [["app-loading-host"]], decls: 1, vars: 1, consts: [["role", "status", "aria-live", "polite", 1, "app-loading"], [1, "app-loading__panel"], ["aria-hidden", "true", 1, "lds-roller"], [1, "app-loading__text"]], template: function AppLoadingHostComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵconditionalCreate(0, AppLoadingHostComponent_Conditional_0_Template, 7, 3, "div", 0);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.loading.loading_state() ? 0 : -1);
        } }, styles: [".app-loading[_ngcontent-%COMP%] {\r\n  position: fixed;\r\n  inset: 0;\r\n  z-index: 99999999;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  background-color: rgb(246 246 246 / 0.8);\r\n  color: #909090;\r\n  -webkit-backdrop-filter: blur(1.5px);\r\n  backdrop-filter: blur(1.5px);\r\n}\r\n\r\n.app-loading__panel[_ngcontent-%COMP%] {\r\n  width: 200px;\r\n  text-align: center;\r\n}\r\n\r\n.app-loading__text[_ngcontent-%COMP%] {\r\n  margin: 0.75rem 0 0;\r\n  font-size: 0.9rem;\r\n  line-height: 1.4;\r\n}\r\n\r\n.lds-roller[_ngcontent-%COMP%], \r\n.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%], \r\n.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]::after {\r\n  box-sizing: border-box;\r\n}\r\n\r\n.lds-roller[_ngcontent-%COMP%] {\r\n  display: inline-block;\r\n  position: relative;\r\n  width: 80px;\r\n  height: 80px;\r\n}\r\n\r\n.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\r\n  animation: _ngcontent-%COMP%_app-loading-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;\r\n  transform-origin: 40px 40px;\r\n}\r\n\r\n.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]::after {\r\n  position: absolute;\r\n  display: block;\r\n  width: 7.2px;\r\n  height: 7.2px;\r\n  margin: -3.6px 0 0 -3.6px;\r\n  border-radius: 50%;\r\n  background: currentColor;\r\n  content: ' ';\r\n}\r\n\r\n.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(1) {\r\n  animation-delay: -0.036s;\r\n}\r\n\r\n.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(1)::after {\r\n  top: 62.62742px;\r\n  left: 62.62742px;\r\n}\r\n\r\n.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(2) {\r\n  animation-delay: -0.072s;\r\n}\r\n\r\n.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(2)::after {\r\n  top: 67.71281px;\r\n  left: 56px;\r\n}\r\n\r\n.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(3) {\r\n  animation-delay: -0.108s;\r\n}\r\n\r\n.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(3)::after {\r\n  top: 70.90963px;\r\n  left: 48.28221px;\r\n}\r\n\r\n.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(4) {\r\n  animation-delay: -0.144s;\r\n}\r\n\r\n.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(4)::after {\r\n  top: 72px;\r\n  left: 40px;\r\n}\r\n\r\n.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(5) {\r\n  animation-delay: -0.18s;\r\n}\r\n\r\n.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(5)::after {\r\n  top: 70.90963px;\r\n  left: 31.71779px;\r\n}\r\n\r\n.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(6) {\r\n  animation-delay: -0.216s;\r\n}\r\n\r\n.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(6)::after {\r\n  top: 67.71281px;\r\n  left: 24px;\r\n}\r\n\r\n.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(7) {\r\n  animation-delay: -0.252s;\r\n}\r\n\r\n.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(7)::after {\r\n  top: 62.62742px;\r\n  left: 17.37258px;\r\n}\r\n\r\n.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(8) {\r\n  animation-delay: -0.288s;\r\n}\r\n\r\n.lds-roller[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(8)::after {\r\n  top: 56px;\r\n  left: 12.28719px;\r\n}\r\n\r\n@keyframes _ngcontent-%COMP%_app-loading-roller {\r\n  0% {\r\n    transform: rotate(0deg);\r\n  }\r\n\r\n  100% {\r\n    transform: rotate(360deg);\r\n  }\r\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AppLoadingHostComponent, [{
        type: Component,
        args: [{ selector: 'app-loading-host', template: `
    @if (loading.loading_state()) {
      <div
        class="app-loading"
        role="status"
        aria-live="polite"
        [attr.aria-busy]="true"
        [attr.aria-label]="label()"
      >
        <div class="app-loading__panel">
          <div class="lds-roller" aria-hidden="true">
            @for (i of dots; track i) {
              <div></div>
            }
          </div>
          <p class="app-loading__text">{{ label() }}</p>
        </div>
      </div>
    }
  `, styles: [".app-loading {\r\n  position: fixed;\r\n  inset: 0;\r\n  z-index: 99999999;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  background-color: rgb(246 246 246 / 0.8);\r\n  color: #909090;\r\n  -webkit-backdrop-filter: blur(1.5px);\r\n  backdrop-filter: blur(1.5px);\r\n}\r\n\r\n.app-loading__panel {\r\n  width: 200px;\r\n  text-align: center;\r\n}\r\n\r\n.app-loading__text {\r\n  margin: 0.75rem 0 0;\r\n  font-size: 0.9rem;\r\n  line-height: 1.4;\r\n}\r\n\r\n.lds-roller,\r\n.lds-roller div,\r\n.lds-roller div::after {\r\n  box-sizing: border-box;\r\n}\r\n\r\n.lds-roller {\r\n  display: inline-block;\r\n  position: relative;\r\n  width: 80px;\r\n  height: 80px;\r\n}\r\n\r\n.lds-roller div {\r\n  animation: app-loading-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;\r\n  transform-origin: 40px 40px;\r\n}\r\n\r\n.lds-roller div::after {\r\n  position: absolute;\r\n  display: block;\r\n  width: 7.2px;\r\n  height: 7.2px;\r\n  margin: -3.6px 0 0 -3.6px;\r\n  border-radius: 50%;\r\n  background: currentColor;\r\n  content: ' ';\r\n}\r\n\r\n.lds-roller div:nth-child(1) {\r\n  animation-delay: -0.036s;\r\n}\r\n\r\n.lds-roller div:nth-child(1)::after {\r\n  top: 62.62742px;\r\n  left: 62.62742px;\r\n}\r\n\r\n.lds-roller div:nth-child(2) {\r\n  animation-delay: -0.072s;\r\n}\r\n\r\n.lds-roller div:nth-child(2)::after {\r\n  top: 67.71281px;\r\n  left: 56px;\r\n}\r\n\r\n.lds-roller div:nth-child(3) {\r\n  animation-delay: -0.108s;\r\n}\r\n\r\n.lds-roller div:nth-child(3)::after {\r\n  top: 70.90963px;\r\n  left: 48.28221px;\r\n}\r\n\r\n.lds-roller div:nth-child(4) {\r\n  animation-delay: -0.144s;\r\n}\r\n\r\n.lds-roller div:nth-child(4)::after {\r\n  top: 72px;\r\n  left: 40px;\r\n}\r\n\r\n.lds-roller div:nth-child(5) {\r\n  animation-delay: -0.18s;\r\n}\r\n\r\n.lds-roller div:nth-child(5)::after {\r\n  top: 70.90963px;\r\n  left: 31.71779px;\r\n}\r\n\r\n.lds-roller div:nth-child(6) {\r\n  animation-delay: -0.216s;\r\n}\r\n\r\n.lds-roller div:nth-child(6)::after {\r\n  top: 67.71281px;\r\n  left: 24px;\r\n}\r\n\r\n.lds-roller div:nth-child(7) {\r\n  animation-delay: -0.252s;\r\n}\r\n\r\n.lds-roller div:nth-child(7)::after {\r\n  top: 62.62742px;\r\n  left: 17.37258px;\r\n}\r\n\r\n.lds-roller div:nth-child(8) {\r\n  animation-delay: -0.288s;\r\n}\r\n\r\n.lds-roller div:nth-child(8)::after {\r\n  top: 56px;\r\n  left: 12.28719px;\r\n}\r\n\r\n@keyframes app-loading-roller {\r\n  0% {\r\n    transform: rotate(0deg);\r\n  }\r\n\r\n  100% {\r\n    transform: rotate(360deg);\r\n  }\r\n}"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AppLoadingHostComponent, { className: "AppLoadingHostComponent", filePath: "src/app/core/ui/loading/app-loading-host.component.ts", lineNumber: 28 }); })();
