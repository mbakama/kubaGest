import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { finalize } from 'rxjs';
import { ApiService } from '../../../core/api/api.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
function UpdatePassword_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "h1", 4);
    i0.ɵɵtext(1, "Votre compte est activ\u00E9");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "p");
    i0.ɵɵtext(3, "Votre mot de passe a \u00E9t\u00E9 enregistr\u00E9. Vous pouvez maintenant vous connecter \u00E0 KubaGest.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "a", 5);
    i0.ɵɵtext(5, "Se connecter");
    i0.ɵɵelementEnd();
} }
function UpdatePassword_Conditional_5_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 6);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.error());
} }
function UpdatePassword_Conditional_5_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small", 12);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.controlError("password"));
} }
function UpdatePassword_Conditional_5_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small", 12);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.controlError("confirmPassword"));
} }
function UpdatePassword_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "h1", 4);
    i0.ɵɵtext(1, "Activez votre compte");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "p");
    i0.ɵɵtext(3, "Choisissez un mot de passe personnel pour accepter l\u2019invitation.");
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(4, UpdatePassword_Conditional_5_Conditional_4_Template, 2, 1, "div", 6);
    i0.ɵɵelementStart(5, "form", 7);
    i0.ɵɵlistener("ngSubmit", function UpdatePassword_Conditional_5_Template_form_ngSubmit_5_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.submit()); });
    i0.ɵɵelementStart(6, "label")(7, "span");
    i0.ɵɵtext(8, "Mot de passe");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "span", 8)(10, "input", 9);
    i0.ɵɵcontrolCreate();
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "button", 10);
    i0.ɵɵlistener("click", function UpdatePassword_Conditional_5_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.showPassword.set(!ctx_r1.showPassword())); });
    i0.ɵɵelement(12, "i", 11);
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(13, UpdatePassword_Conditional_5_Conditional_13_Template, 2, 1, "small", 12);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "label")(15, "span");
    i0.ɵɵtext(16, "Confirmer le mot de passe");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "span", 8)(18, "input", 13);
    i0.ɵɵcontrolCreate();
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "button", 10);
    i0.ɵɵlistener("click", function UpdatePassword_Conditional_5_Template_button_click_19_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.showConfirmation.set(!ctx_r1.showConfirmation())); });
    i0.ɵɵelement(20, "i", 11);
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(21, UpdatePassword_Conditional_5_Conditional_21_Template, 2, 1, "small", 12);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "button", 14);
    i0.ɵɵtext(23);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.error() ? 4 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("formGroup", ctx_r1.form);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("type", ctx_r1.showPassword() ? "text" : "password");
    i0.ɵɵcontrol();
    i0.ɵɵadvance();
    i0.ɵɵattribute("aria-label", ctx_r1.showPassword() ? "Masquer le mot de passe" : "Afficher le mot de passe");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("fa-eye", !ctx_r1.showPassword())("fa-eye-slash", ctx_r1.showPassword());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.controlError("password") ? 13 : -1);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("type", ctx_r1.showConfirmation() ? "text" : "password");
    i0.ɵɵcontrol();
    i0.ɵɵadvance();
    i0.ɵɵattribute("aria-label", ctx_r1.showConfirmation() ? "Masquer la confirmation" : "Afficher la confirmation");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("fa-eye", !ctx_r1.showConfirmation())("fa-eye-slash", ctx_r1.showConfirmation());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.controlError("confirmPassword") ? 21 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.submitting() || !ctx_r1.token);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.submitting() ? "Activation\u2026" : "Activer mon compte", " ");
} }
function matchingPassword(control) {
    const password = control.parent?.get('password')?.value;
    return control.value && password !== control.value ? { mismatch: true } : null;
}
export class UpdatePassword {
    api = inject(ApiService);
    route = inject(ActivatedRoute);
    fb = inject(FormBuilder);
    token = this.route.snapshot.queryParamMap.get('token') ?? '';
    submitting = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "submitting" }] : /* istanbul ignore next */ []));
    success = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "success" }] : /* istanbul ignore next */ []));
    error = signal(this.token ? null : 'Le lien d’invitation est incomplet.', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "error" }] : /* istanbul ignore next */ []));
    showPassword = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "showPassword" }] : /* istanbul ignore next */ []));
    showConfirmation = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "showConfirmation" }] : /* istanbul ignore next */ []));
    form = this.fb.nonNullable.group({
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
        confirmPassword: ['', [Validators.required, matchingPassword]],
    });
    constructor() {
        this.form.controls.password.valueChanges.subscribe(() => this.form.controls.confirmPassword.updateValueAndValidity());
    }
    submit() {
        if (!this.token || this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.submitting.set(true);
        this.error.set(null);
        this.api
            .acceptMemberInvitation(this.token, this.form.controls.password.value)
            .pipe(finalize(() => this.submitting.set(false)))
            .subscribe({
            next: () => this.success.set(true),
            error: (error) => {
                const message = error.error?.message;
                this.error.set(typeof message === 'string' ? message : 'L’invitation n’a pas pu être activée.');
            },
        });
    }
    controlError(name) {
        const control = this.form.controls[name];
        if (!control.touched || !control.errors)
            return null;
        if (control.hasError('required'))
            return 'Ce champ est obligatoire.';
        if (control.hasError('minlength'))
            return 'Le mot de passe doit contenir au moins 8 caractères.';
        if (control.hasError('mismatch'))
            return 'Les mots de passe ne correspondent pas.';
        return 'Valeur invalide.';
    }
    static ɵfac = function UpdatePassword_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || UpdatePassword)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: UpdatePassword, selectors: [["app-update-password"]], decls: 6, vars: 1, consts: [[1, "activation-page"], ["aria-labelledby", "activation-title", 1, "activation-card"], ["aria-hidden", "true", 1, "activation-icon"], [1, "fa-solid", "fa-user-check"], ["id", "activation-title"], ["routerLink", "/authentification", 1, "activation-primary"], ["role", "alert", 1, "activation-error"], ["novalidate", "", 3, "ngSubmit", "formGroup"], [1, "activation-password"], ["pInputText", "", "formControlName", "password", "autocomplete", "new-password", "placeholder", "8 caract\u00E8res minimum", 3, "type"], ["type", "button", 3, "click"], ["aria-hidden", "true", 1, "fa-solid"], ["role", "alert"], ["pInputText", "", "formControlName", "confirmPassword", "autocomplete", "new-password", "placeholder", "R\u00E9p\u00E9ter le mot de passe", 3, "type"], ["type", "submit", 1, "activation-primary", 3, "disabled"]], template: function UpdatePassword_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "main", 0)(1, "section", 1)(2, "div", 2);
            i0.ɵɵelement(3, "i", 3);
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(4, UpdatePassword_Conditional_4_Template, 6, 0)(5, UpdatePassword_Conditional_5_Template, 24, 18);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(4);
            i0.ɵɵconditional(ctx.success() ? 4 : 5);
        } }, dependencies: [ReactiveFormsModule, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName, RouterLink, InputText], styles: ["[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n}\n.activation-page[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  display: grid;\n  place-items: center;\n  padding: 1.5rem;\n  background: #f5f7f9;\n}\n.activation-card[_ngcontent-%COMP%] {\n  width: min(100%, 29rem);\n  padding: 2rem;\n  border-radius: 0.85rem;\n  background: #fff;\n  box-shadow: 0 1rem 3rem rgb(15 23 42 / 10%);\n}\n.activation-icon[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 3rem;\n  height: 3rem;\n  margin-bottom: 1rem;\n  border-radius: 0.7rem;\n  background: rgb(7 136 63 / 12%);\n  color: #07883f;\n  font-size: 1.25rem;\n}\nh1[_ngcontent-%COMP%] {\n  margin: 0 0 0.5rem;\n  color: #162338;\n  font-size: 1.5rem;\n}\np[_ngcontent-%COMP%] {\n  margin: 0 0 1.5rem;\n  color: #64748b;\n  line-height: 1.6;\n}\nform[_ngcontent-%COMP%], \nlabel[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.45rem;\n}\nform[_ngcontent-%COMP%] {\n  gap: 1rem;\n}\nlabel[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:first-child {\n  color: #334155;\n  font-weight: 600;\n}\n.activation-password[_ngcontent-%COMP%] {\n  position: relative;\n  display: block;\n}\n.activation-password[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 2.75rem;\n  padding-right: 2.75rem;\n}\n.activation-password[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 50%;\n  right: 0.35rem;\n  display: grid;\n  width: 2rem;\n  height: 2rem;\n  translate: 0 -50%;\n  place-items: center;\n  border: 0;\n  background: transparent;\n  color: #64748b;\n  cursor: pointer;\n}\nsmall[_ngcontent-%COMP%], \n.activation-error[_ngcontent-%COMP%] {\n  color: #dc2626;\n}\n.activation-error[_ngcontent-%COMP%] {\n  margin-bottom: 1rem;\n  padding: 0.75rem;\n  border-radius: 0.5rem;\n  background: #fef2f2;\n}\n.activation-primary[_ngcontent-%COMP%] {\n  display: inline-flex;\n  min-height: 2.75rem;\n  min-width: 8.75rem;\n  width: fit-content;\n  padding: 0.625rem 1.25rem;\n  align-items: center;\n  justify-content: center;\n  border: 0;\n  border-radius: 0.55rem;\n  background: #07883f;\n  color: #fff;\n  font-weight: 700;\n  line-height: 1.25;\n  white-space: nowrap;\n  text-decoration: none;\n  cursor: pointer;\n}\n\nform[_ngcontent-%COMP%]   .activation-primary[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.activation-primary[_ngcontent-%COMP%]:disabled {\n  cursor: not-allowed;\n  opacity: 0.65;\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(UpdatePassword, [{
        type: Component,
        args: [{ imports: [ReactiveFormsModule, RouterLink, InputText], selector: 'app-update-password', template: "<main class=\"activation-page\">\n  <section class=\"activation-card\" aria-labelledby=\"activation-title\">\n    <div class=\"activation-icon\" aria-hidden=\"true\"><i class=\"fa-solid fa-user-check\"></i></div>\n    @if (success()) {\n      <h1 id=\"activation-title\">Votre compte est activ\u00E9</h1>\n      <p>Votre mot de passe a \u00E9t\u00E9 enregistr\u00E9. Vous pouvez maintenant vous connecter \u00E0 KubaGest.</p>\n      <a routerLink=\"/authentification\" class=\"activation-primary\">Se connecter</a>\n    } @else {\n      <h1 id=\"activation-title\">Activez votre compte</h1>\n      <p>Choisissez un mot de passe personnel pour accepter l\u2019invitation.</p>\n      @if (error()) {\n        <div class=\"activation-error\" role=\"alert\">{{ error() }}</div>\n      }\n      <form [formGroup]=\"form\" (ngSubmit)=\"submit()\" novalidate>\n        <label>\n          <span>Mot de passe</span>\n          <span class=\"activation-password\">\n            <input\n              pInputText\n              [type]=\"showPassword() ? 'text' : 'password'\"\n              formControlName=\"password\"\n              autocomplete=\"new-password\"\n              placeholder=\"8 caract\u00E8res minimum\"\n            />\n            <button\n              type=\"button\"\n              [attr.aria-label]=\"\n                showPassword() ? 'Masquer le mot de passe' : 'Afficher le mot de passe'\n              \"\n              (click)=\"showPassword.set(!showPassword())\"\n            >\n              <i\n                class=\"fa-solid\"\n                [class.fa-eye]=\"!showPassword()\"\n                [class.fa-eye-slash]=\"showPassword()\"\n                aria-hidden=\"true\"\n              ></i>\n            </button>\n          </span>\n          @if (controlError('password')) {\n            <small role=\"alert\">{{ controlError('password') }}</small>\n          }\n        </label>\n        <label>\n          <span>Confirmer le mot de passe</span>\n          <span class=\"activation-password\">\n            <input\n              pInputText\n              [type]=\"showConfirmation() ? 'text' : 'password'\"\n              formControlName=\"confirmPassword\"\n              autocomplete=\"new-password\"\n              placeholder=\"R\u00E9p\u00E9ter le mot de passe\"\n            />\n            <button\n              type=\"button\"\n              [attr.aria-label]=\"\n                showConfirmation() ? 'Masquer la confirmation' : 'Afficher la confirmation'\n              \"\n              (click)=\"showConfirmation.set(!showConfirmation())\"\n            >\n              <i\n                class=\"fa-solid\"\n                [class.fa-eye]=\"!showConfirmation()\"\n                [class.fa-eye-slash]=\"showConfirmation()\"\n                aria-hidden=\"true\"\n              ></i>\n            </button>\n          </span>\n          @if (controlError('confirmPassword')) {\n            <small role=\"alert\">{{ controlError('confirmPassword') }}</small>\n          }\n        </label>\n        <button class=\"activation-primary\" type=\"submit\" [disabled]=\"submitting() || !token\">\n          {{ submitting() ? 'Activation\u2026' : 'Activer mon compte' }}\n        </button>\n      </form>\n    }\n  </section>\n</main>\n", styles: [":host {\n  display: block;\n  min-height: 100vh;\n}\n.activation-page {\n  min-height: 100vh;\n  display: grid;\n  place-items: center;\n  padding: 1.5rem;\n  background: #f5f7f9;\n}\n.activation-card {\n  width: min(100%, 29rem);\n  padding: 2rem;\n  border-radius: 0.85rem;\n  background: #fff;\n  box-shadow: 0 1rem 3rem rgb(15 23 42 / 10%);\n}\n.activation-icon {\n  display: grid;\n  place-items: center;\n  width: 3rem;\n  height: 3rem;\n  margin-bottom: 1rem;\n  border-radius: 0.7rem;\n  background: rgb(7 136 63 / 12%);\n  color: #07883f;\n  font-size: 1.25rem;\n}\nh1 {\n  margin: 0 0 0.5rem;\n  color: #162338;\n  font-size: 1.5rem;\n}\np {\n  margin: 0 0 1.5rem;\n  color: #64748b;\n  line-height: 1.6;\n}\nform,\nlabel {\n  display: flex;\n  flex-direction: column;\n  gap: 0.45rem;\n}\nform {\n  gap: 1rem;\n}\nlabel > span:first-child {\n  color: #334155;\n  font-weight: 600;\n}\n.activation-password {\n  position: relative;\n  display: block;\n}\n.activation-password input {\n  width: 100%;\n  min-height: 2.75rem;\n  padding-right: 2.75rem;\n}\n.activation-password button {\n  position: absolute;\n  top: 50%;\n  right: 0.35rem;\n  display: grid;\n  width: 2rem;\n  height: 2rem;\n  translate: 0 -50%;\n  place-items: center;\n  border: 0;\n  background: transparent;\n  color: #64748b;\n  cursor: pointer;\n}\nsmall,\n.activation-error {\n  color: #dc2626;\n}\n.activation-error {\n  margin-bottom: 1rem;\n  padding: 0.75rem;\n  border-radius: 0.5rem;\n  background: #fef2f2;\n}\n.activation-primary {\n  display: inline-flex;\n  min-height: 2.75rem;\n  min-width: 8.75rem;\n  width: fit-content;\n  padding: 0.625rem 1.25rem;\n  align-items: center;\n  justify-content: center;\n  border: 0;\n  border-radius: 0.55rem;\n  background: #07883f;\n  color: #fff;\n  font-weight: 700;\n  line-height: 1.25;\n  white-space: nowrap;\n  text-decoration: none;\n  cursor: pointer;\n}\n\nform .activation-primary {\n  width: 100%;\n}\n.activation-primary:disabled {\n  cursor: not-allowed;\n  opacity: 0.65;\n}\n"] }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(UpdatePassword, { className: "UpdatePassword", filePath: "src/app/features/auth/update-password/update-password.ts", lineNumber: 26 }); })();
