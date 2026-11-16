import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import * as i0 from "@angular/core";
import * as i1 from "primeng/confirmdialog";
const _c0 = () => ({ "640px": "95vw" });
function AppDialogHostComponent_ng_template_1_Conditional_0_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 13);
} if (rf & 2) {
    const message_r3 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵclassMap(message_r3.icon + " mt-0.5 text-xl text-primary");
} }
function AppDialogHostComponent_ng_template_1_Conditional_0_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "p-button", 14);
    i0.ɵɵlistener("onClick", function AppDialogHostComponent_ng_template_1_Conditional_0_Conditional_11_Template_p_button_onClick_0_listener() { i0.ɵɵrestoreView(_r4); const onReject_r2 = i0.ɵɵnextContext(2).onReject; return i0.ɵɵresetView(onReject_r2()); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const message_r3 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵproperty("label", message_r3.rejectLabel ?? "Annuler")("outlined", true);
} }
function AppDialogHostComponent_ng_template_1_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 2)(1, "div", 3)(2, "h2", 4);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "button", 5);
    i0.ɵɵlistener("click", function AppDialogHostComponent_ng_template_1_Conditional_0_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r1); const onReject_r2 = i0.ɵɵnextContext().onReject; return i0.ɵɵresetView(onReject_r2()); });
    i0.ɵɵelement(5, "i", 6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "div", 7);
    i0.ɵɵconditionalCreate(7, AppDialogHostComponent_ng_template_1_Conditional_0_Conditional_7_Template, 1, 2, "i", 8);
    i0.ɵɵelementStart(8, "p", 9);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "div", 10);
    i0.ɵɵconditionalCreate(11, AppDialogHostComponent_ng_template_1_Conditional_0_Conditional_11_Template, 1, 2, "p-button", 11);
    i0.ɵɵelementStart(12, "p-button", 12);
    i0.ɵɵlistener("onClick", function AppDialogHostComponent_ng_template_1_Conditional_0_Template_p_button_onClick_12_listener() { i0.ɵɵrestoreView(_r1); const onAccept_r5 = i0.ɵɵnextContext().onAccept; return i0.ɵɵresetView(onAccept_r5()); });
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const message_r3 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵattribute("aria-labelledby", "app-dialog-title")("aria-describedby", "app-dialog-message");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", message_r3.header, " ");
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(message_r3.icon ? 7 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(message_r3.message);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(message_r3.rejectVisible !== false ? 11 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", message_r3.acceptLabel ?? "Confirmer");
} }
function AppDialogHostComponent_ng_template_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵconditionalCreate(0, AppDialogHostComponent_ng_template_1_Conditional_0_Template, 13, 7, "div", 2);
} if (rf & 2) {
    const message_r3 = ctx.$implicit;
    i0.ɵɵconditional(message_r3 ? 0 : -1);
} }
export class AppDialogHostComponent {
    static ɵfac = function AppDialogHostComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AppDialogHostComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AppDialogHostComponent, selectors: [["app-dialog-host"]], decls: 3, vars: 4, consts: [["headless", ""], ["styleClass", "!border-0 !bg-transparent !shadow-none [&_.p-dialog-content]:!p-0", 3, "draggable", "closable", "breakpoints"], ["role", "alertdialog", 1, "w-[min(28rem,95vw)]", "overflow-hidden", "rounded-xl", "border", "border-slate-200", "bg-white", "shadow-[0_12px_40px_rgba(15,23,42,0.12)]"], [1, "flex", "items-start", "justify-between", "gap-3", "border-b", "border-slate-100", "px-5", "py-4"], ["id", "app-dialog-title", 1, "m-0", "text-base", "font-semibold", "text-[#162338]"], ["type", "button", "aria-label", "Fermer", 1, "inline-flex", "size-8", "shrink-0", "items-center", "justify-center", "rounded-md", "text-slate-500", "transition", "hover:bg-slate-100", "hover:text-slate-800", 3, "click"], ["aria-hidden", "true", 1, "pi", "pi-times", "text-sm"], [1, "flex", "items-start", "gap-3", "px-5", "py-4", "text-[#31445f]"], ["aria-hidden", "true", 3, "class"], ["id", "app-dialog-message", 1, "m-0", "text-sm", "leading-relaxed"], [1, "flex", "flex-wrap", "justify-end", "gap-2", "border-t", "border-slate-100", "px-5", "py-4"], ["severity", "secondary", 3, "label", "outlined"], [3, "onClick", "label"], ["aria-hidden", "true"], ["severity", "secondary", 3, "onClick", "label", "outlined"]], template: function AppDialogHostComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "p-confirmDialog", 1);
            i0.ɵɵtemplate(1, AppDialogHostComponent_ng_template_1_Template, 1, 1, "ng-template", null, 0, i0.ɵɵtemplateRefExtractor);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵproperty("draggable", false)("closable", false)("breakpoints", i0.ɵɵpureFunction0(3, _c0));
        } }, dependencies: [ConfirmDialogModule, i1.ConfirmDialog, Button], encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AppDialogHostComponent, [{
        type: Component,
        args: [{
                selector: 'app-dialog-host',
                imports: [ConfirmDialogModule, Button],
                template: `
    <p-confirmDialog
      [draggable]="false"
      [closable]="false"
      styleClass="!border-0 !bg-transparent !shadow-none [&_.p-dialog-content]:!p-0"
      [breakpoints]="{ '640px': '95vw' }"
    >
      <ng-template #headless let-message let-onAccept="onAccept" let-onReject="onReject">
        @if (message) {
          <div
            class="w-[min(28rem,95vw)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.12)]"
            role="alertdialog"
            [attr.aria-labelledby]="'app-dialog-title'"
            [attr.aria-describedby]="'app-dialog-message'"
          >
            <div class="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
              <h2 id="app-dialog-title" class="m-0 text-base font-semibold text-[#162338]">
                {{ message.header }}
              </h2>
              <button
                type="button"
                class="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                (click)="onReject()"
                aria-label="Fermer"
              >
                <i class="pi pi-times text-sm" aria-hidden="true"></i>
              </button>
            </div>

            <div class="flex items-start gap-3 px-5 py-4 text-[#31445f]">
              @if (message.icon) {
                <i [class]="message.icon + ' mt-0.5 text-xl text-primary'" aria-hidden="true"></i>
              }
              <p id="app-dialog-message" class="m-0 text-sm leading-relaxed">{{ message.message }}</p>
            </div>

            <div class="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-5 py-4">
              @if (message.rejectVisible !== false) {
                <p-button
                  [label]="message.rejectLabel ?? 'Annuler'"
                  severity="secondary"
                  [outlined]="true"
                  (onClick)="onReject()"
                />
              }
              <p-button [label]="message.acceptLabel ?? 'Confirmer'" (onClick)="onAccept()" />
            </div>
          </div>
        }
      </ng-template>
    </p-confirmDialog>
  `,
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AppDialogHostComponent, { className: "AppDialogHostComponent", filePath: "src/app/core/ui/dialog/app-dialog-host.component.ts", lineNumber: 61 }); })();
