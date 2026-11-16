import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ApiService } from '../../../core/api/api.service';
import { AUTHENTICATION_PATH } from '../../../core/auth/auth.paths';
import { ForgotPasswordFlowStore } from './forgot-password-flow.store';
import { FORGOT_PASSWORD_NEW_PATH, FORGOT_PASSWORD_PATH, FORGOT_PASSWORD_VERIFY_PATH, } from './forgot-password.routes';
import { Step, StepList, Stepper } from 'primeng/stepper';
import { AUTH_FORM_PRIME_IMPORTS } from '../auth-prime-fields';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "primeng/inputtext";
function ForgotPassword_Conditional_36_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 21)(1, "h1", 22);
    i0.ɵɵtext(2, "Mot de passe ");
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4, "r\u00E9initialis\u00E9");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "p");
    i0.ɵɵtext(6, "Connectez-vous avec votre nouvelle combinaison.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "button", 23);
    i0.ɵɵlistener("click", function ForgotPassword_Conditional_36_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.goToLogin()); });
    i0.ɵɵelement(8, "i", 24);
    i0.ɵɵelementStart(9, "span");
    i0.ɵɵtext(10, "Retour \u00E0 la connexion");
    i0.ɵɵelementEnd()();
} }
function ForgotPassword_Conditional_37_Case_8_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 33);
    i0.ɵɵtext(1, "Saisissez une adresse e-mail valide.");
    i0.ɵɵelementEnd();
} }
function ForgotPassword_Conditional_37_Case_8_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 34);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.error());
} }
function ForgotPassword_Conditional_37_Case_8_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 36);
} }
function ForgotPassword_Conditional_37_Case_8_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 37);
} }
function ForgotPassword_Conditional_37_Case_8_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 21)(1, "h1", 22);
    i0.ɵɵtext(2, "Mot de passe ");
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4, "oubli\u00E9");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "p");
    i0.ɵɵtext(6, "Indiquez l\u2019adresse e-mail de votre compte. Nous vous enverrons un code de v\u00E9rification.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "form", 27);
    i0.ɵɵlistener("ngSubmit", function ForgotPassword_Conditional_37_Case_8_Template_form_ngSubmit_7_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.submitEmail()); });
    i0.ɵɵelementStart(8, "div", 28)(9, "label", 29);
    i0.ɵɵtext(10, "Adresse e-mail");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "div", 30);
    i0.ɵɵelement(12, "i", 31);
    i0.ɵɵelementStart(13, "input", 32);
    i0.ɵɵcontrolCreate();
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(14, ForgotPassword_Conditional_37_Case_8_Conditional_14_Template, 2, 0, "p", 33);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(15, ForgotPassword_Conditional_37_Case_8_Conditional_15_Template, 2, 1, "p", 34);
    i0.ɵɵelementStart(16, "button", 35);
    i0.ɵɵconditionalCreate(17, ForgotPassword_Conditional_37_Case_8_Conditional_17_Template, 1, 0, "i", 36)(18, ForgotPassword_Conditional_37_Case_8_Conditional_18_Template, 1, 0, "i", 37);
    i0.ɵɵelementStart(19, "span");
    i0.ɵɵtext(20);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(21, "p", 38)(22, "a", 39);
    i0.ɵɵtext(23, "Retour \u00E0 la connexion");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("formGroup", ctx_r1.emailForm);
    i0.ɵɵadvance(4);
    i0.ɵɵclassProp("field__control--invalid", ctx_r1.emailForm.controls.email.touched && ctx_r1.emailForm.controls.email.invalid);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("invalid", ctx_r1.emailForm.controls.email.touched && ctx_r1.emailForm.controls.email.invalid);
    i0.ɵɵcontrol();
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.emailForm.controls.email.touched && ctx_r1.emailForm.controls.email.invalid ? 14 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.error() ? 15 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.submitting());
    i0.ɵɵattribute("aria-busy", ctx_r1.submitting());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.submitting() ? 17 : 18);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.submitting() ? "Envoi\u2026" : "Recevoir le code");
} }
function ForgotPassword_Conditional_37_Case_9_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 33);
    i0.ɵɵtext(1, "Le code comporte 6 chiffres.");
    i0.ɵɵelementEnd();
} }
function ForgotPassword_Conditional_37_Case_9_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 34);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.error());
} }
function ForgotPassword_Conditional_37_Case_9_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 36);
} }
function ForgotPassword_Conditional_37_Case_9_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 44);
} }
function ForgotPassword_Conditional_37_Case_9_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 21)(1, "h1", 22);
    i0.ɵɵtext(2, "V\u00E9rification du ");
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4, "code");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "p");
    i0.ɵɵtext(6, " Saisissez le code \u00E0 6 chiffres envoy\u00E9 \u00E0 ");
    i0.ɵɵelementStart(7, "strong");
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(9, ". ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "form", 27);
    i0.ɵɵlistener("ngSubmit", function ForgotPassword_Conditional_37_Case_9_Template_form_ngSubmit_10_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.submitCode()); });
    i0.ɵɵelementStart(11, "div", 28)(12, "label", 40);
    i0.ɵɵtext(13, "Code de v\u00E9rification");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "div", 41);
    i0.ɵɵelement(15, "i", 42);
    i0.ɵɵelementStart(16, "input", 43);
    i0.ɵɵcontrolCreate();
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(17, ForgotPassword_Conditional_37_Case_9_Conditional_17_Template, 2, 0, "p", 33);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(18, ForgotPassword_Conditional_37_Case_9_Conditional_18_Template, 2, 1, "p", 34);
    i0.ɵɵelementStart(19, "button", 35);
    i0.ɵɵconditionalCreate(20, ForgotPassword_Conditional_37_Case_9_Conditional_20_Template, 1, 0, "i", 36)(21, ForgotPassword_Conditional_37_Case_9_Conditional_21_Template, 1, 0, "i", 44);
    i0.ɵɵelementStart(22, "span");
    i0.ɵɵtext(23);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(24, "p", 38)(25, "a", 45);
    i0.ɵɵtext(26, "Utiliser une autre adresse e-mail");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate(ctx_r1.maskedEmail());
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("formGroup", ctx_r1.codeForm);
    i0.ɵɵadvance(4);
    i0.ɵɵclassProp("field__control--invalid", ctx_r1.codeForm.controls.code.touched && ctx_r1.codeForm.controls.code.invalid);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("invalid", ctx_r1.codeForm.controls.code.touched && ctx_r1.codeForm.controls.code.invalid);
    i0.ɵɵcontrol();
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.codeForm.controls.code.touched && ctx_r1.codeForm.controls.code.invalid ? 17 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.error() ? 18 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.submitting());
    i0.ɵɵattribute("aria-busy", ctx_r1.submitting());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.submitting() ? 20 : 21);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.submitting() ? "V\u00E9rification\u2026" : "Continuer");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("routerLink", ctx_r1.forgotPath);
} }
function ForgotPassword_Conditional_37_Case_10_Conditional_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 33);
    i0.ɵɵtext(1, "Les mots de passe ne correspondent pas.");
    i0.ɵɵelementEnd();
} }
function ForgotPassword_Conditional_37_Case_10_Conditional_25_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 34);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.error());
} }
function ForgotPassword_Conditional_37_Case_10_Conditional_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 36);
} }
function ForgotPassword_Conditional_37_Case_10_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 53);
} }
function ForgotPassword_Conditional_37_Case_10_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 21)(1, "h1", 22);
    i0.ɵɵtext(2, "Nouveau ");
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4, "mot de passe");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "p");
    i0.ɵɵtext(6, "Choisissez un mot de passe s\u00E9curis\u00E9 d\u2019au moins 8 caract\u00E8res.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "form", 27);
    i0.ɵɵlistener("ngSubmit", function ForgotPassword_Conditional_37_Case_10_Template_form_ngSubmit_7_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.submitReset()); });
    i0.ɵɵelementStart(8, "div", 28)(9, "label", 46);
    i0.ɵɵtext(10, "Mot de passe");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "div", 30);
    i0.ɵɵelement(12, "i", 47);
    i0.ɵɵelementStart(13, "input", 48);
    i0.ɵɵcontrolCreate();
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "button", 49);
    i0.ɵɵlistener("click", function ForgotPassword_Conditional_37_Case_10_Template_button_click_14_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.togglePassword()); });
    i0.ɵɵelement(15, "i", 50);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(16, "div", 28)(17, "label", 51);
    i0.ɵɵtext(18, "Confirmation");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "div", 30);
    i0.ɵɵelement(20, "i", 47);
    i0.ɵɵelementStart(21, "input", 52);
    i0.ɵɵcontrolCreate();
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "button", 49);
    i0.ɵɵlistener("click", function ForgotPassword_Conditional_37_Case_10_Template_button_click_22_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.toggleConfirmPassword()); });
    i0.ɵɵelement(23, "i", 50);
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(24, ForgotPassword_Conditional_37_Case_10_Conditional_24_Template, 2, 0, "p", 33);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(25, ForgotPassword_Conditional_37_Case_10_Conditional_25_Template, 2, 1, "p", 34);
    i0.ɵɵelementStart(26, "button", 35);
    i0.ɵɵconditionalCreate(27, ForgotPassword_Conditional_37_Case_10_Conditional_27_Template, 1, 0, "i", 36)(28, ForgotPassword_Conditional_37_Case_10_Conditional_28_Template, 1, 0, "i", 53);
    i0.ɵɵelementStart(29, "span");
    i0.ɵɵtext(30);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("formGroup", ctx_r1.resetForm);
    i0.ɵɵadvance(4);
    i0.ɵɵclassProp("field__control--invalid", ctx_r1.resetForm.controls.password.touched && ctx_r1.resetForm.controls.password.invalid);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("type", ctx_r1.showPassword() ? "text" : "password")("invalid", ctx_r1.resetForm.controls.password.touched && ctx_r1.resetForm.controls.password.invalid);
    i0.ɵɵcontrol();
    i0.ɵɵadvance();
    i0.ɵɵattribute("aria-label", ctx_r1.showPassword() ? "Masquer le mot de passe" : "Afficher le mot de passe");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("fa-eye-slash", ctx_r1.showPassword())("fa-eye", !ctx_r1.showPassword());
    i0.ɵɵadvance(4);
    i0.ɵɵclassProp("field__control--invalid", ctx_r1.resetForm.controls.confirmPassword.touched && ctx_r1.resetForm.controls.confirmPassword.invalid);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("type", ctx_r1.showConfirmPassword() ? "text" : "password")("invalid", ctx_r1.resetForm.controls.confirmPassword.touched && ctx_r1.resetForm.controls.confirmPassword.invalid);
    i0.ɵɵcontrol();
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("fa-eye-slash", ctx_r1.showConfirmPassword())("fa-eye", !ctx_r1.showConfirmPassword());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.resetForm.controls.confirmPassword.touched && ctx_r1.resetForm.controls.confirmPassword.hasError("mismatch") ? 24 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.error() ? 25 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.submitting());
    i0.ɵɵattribute("aria-busy", ctx_r1.submitting());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.submitting() ? 27 : 28);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.submitting() ? "Enregistrement\u2026" : "Enregistrer");
} }
function ForgotPassword_Conditional_37_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p-stepper", 25)(1, "p-step-list")(2, "p-step", 26);
    i0.ɵɵtext(3, "E-mail");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p-step", 26);
    i0.ɵɵtext(5, "Code");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p-step", 26);
    i0.ɵɵtext(7, "Nouveau mot de passe");
    i0.ɵɵelementEnd()()();
    i0.ɵɵconditionalCreate(8, ForgotPassword_Conditional_37_Case_8_Template, 24, 10)(9, ForgotPassword_Conditional_37_Case_9_Template, 27, 12)(10, ForgotPassword_Conditional_37_Case_10_Template, 31, 24);
} if (rf & 2) {
    let tmp_8_0;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("value", ctx_r1.recoveryStepValue())("linear", true);
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("register-step--complete", ctx_r1.recoveryStepValue() > 1);
    i0.ɵɵproperty("value", 1);
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("register-step--complete", ctx_r1.recoveryStepValue() > 2);
    i0.ɵɵproperty("value", 2);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("value", 3);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional((tmp_8_0 = ctx_r1.step()) === "email" ? 8 : tmp_8_0 === "verify" ? 9 : tmp_8_0 === "reset" ? 10 : -1);
} }
function confirmNewPassword(control) {
    const parent = control.parent;
    if (!parent)
        return null;
    const password = parent.get('password')?.value;
    if (control.value && password !== control.value) {
        return { mismatch: true };
    }
    return null;
}
export class ForgotPassword {
    api = inject(ApiService);
    router = inject(Router);
    route = inject(ActivatedRoute);
    flow = inject(ForgotPasswordFlowStore);
    destroyRef = inject(DestroyRef);
    forgotPath = FORGOT_PASSWORD_PATH;
    verifyPath = FORGOT_PASSWORD_VERIFY_PATH;
    step = toSignal(this.route.data.pipe(map((data) => data['forgotStep'] ?? 'email')), { initialValue: 'email' });
    recoveryStepValue = computed(() => {
        switch (this.step()) {
            case 'email':
                return 1;
            case 'verify':
                return 2;
            default:
                return 3;
        }
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "recoveryStepValue" }] : /* istanbul ignore next */ []));
    submitting = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "submitting" }] : /* istanbul ignore next */ []));
    error = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "error" }] : /* istanbul ignore next */ []));
    completed = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "completed" }] : /* istanbul ignore next */ []));
    showPassword = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "showPassword" }] : /* istanbul ignore next */ []));
    showConfirmPassword = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "showConfirmPassword" }] : /* istanbul ignore next */ []));
    emailForm = new FormGroup({
        email: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.email, Validators.maxLength(255)],
        }),
    });
    codeForm = new FormGroup({
        code: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.pattern(/^\d{6}$/)],
        }),
    });
    resetForm = new FormGroup({
        password: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(8), Validators.maxLength(72)],
        }),
        confirmPassword: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, confirmNewPassword],
        }),
    });
    constructor() {
        this.resetForm.controls.password.valueChanges
            .pipe(takeUntilDestroyed())
            .subscribe(() => this.resetForm.controls.confirmPassword.updateValueAndValidity());
        effect(() => {
            const step = this.step();
            if (step === 'verify' && !this.flow.email()) {
                void this.router.navigate([FORGOT_PASSWORD_PATH]);
                return;
            }
            if (step === 'reset' && !this.flow.resetToken()) {
                void this.router.navigate([FORGOT_PASSWORD_VERIFY_PATH]);
            }
        });
    }
    maskedEmail() {
        const email = this.flow.email();
        const at = email.indexOf('@');
        if (at <= 1)
            return email;
        return `${email.slice(0, 2)}•••${email.slice(at)}`;
    }
    togglePassword() {
        this.showPassword.update((v) => !v);
    }
    toggleConfirmPassword() {
        this.showConfirmPassword.update((v) => !v);
    }
    submitEmail() {
        if (this.emailForm.invalid) {
            this.emailForm.markAllAsTouched();
            return;
        }
        if (this.submitting())
            return;
        this.error.set(null);
        this.submitting.set(true);
        const email = this.emailForm.controls.email.value.trim();
        this.api
            .requestPasswordReset(email)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: () => {
                this.submitting.set(false);
                this.flow.email.set(email);
                void this.router.navigate([FORGOT_PASSWORD_VERIFY_PATH]);
            },
            error: (err) => {
                this.submitting.set(false);
                this.error.set(this.readError(err));
            },
        });
    }
    submitCode() {
        if (this.codeForm.invalid) {
            this.codeForm.markAllAsTouched();
            return;
        }
        if (this.submitting())
            return;
        this.error.set(null);
        this.submitting.set(true);
        const code = this.codeForm.controls.code.value.trim();
        this.api
            .verifyPasswordResetCode(this.flow.email(), code)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (body) => {
                this.submitting.set(false);
                this.flow.resetToken.set(body.resetToken);
                void this.router.navigate([FORGOT_PASSWORD_NEW_PATH]);
            },
            error: (err) => {
                this.submitting.set(false);
                this.error.set(this.readError(err));
            },
        });
    }
    submitReset() {
        if (this.resetForm.invalid) {
            this.resetForm.markAllAsTouched();
            return;
        }
        if (this.submitting())
            return;
        this.error.set(null);
        this.submitting.set(true);
        this.api
            .confirmPasswordReset(this.flow.resetToken(), this.resetForm.controls.password.value)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: () => {
                this.submitting.set(false);
                this.completed.set(true);
                this.flow.reset();
            },
            error: (err) => {
                this.submitting.set(false);
                this.error.set(this.readError(err));
            },
        });
    }
    goToLogin() {
        this.flow.reset();
        void this.router.navigate([AUTHENTICATION_PATH]);
    }
    readError(err) {
        if (!(err instanceof HttpErrorResponse)) {
            return 'Une erreur est survenue. Réessayez.';
        }
        if (err.status === 0) {
            return 'Serveur inaccessible. Vérifiez que l’API est démarrée.';
        }
        const body = err.error;
        if (typeof body === 'object' && body !== null && 'message' in body) {
            const message = body.message;
            if (typeof message === 'string')
                return message;
            if (Array.isArray(message) && message.length > 0) {
                return message.map(String).join(' ');
            }
        }
        return 'Impossible de poursuivre. Vérifiez vos informations.';
    }
    static ɵfac = function ForgotPassword_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ForgotPassword)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ForgotPassword, selectors: [["app-forgot-password"]], decls: 38, vars: 1, consts: [["id", "content", "tabindex", "-1", 1, "login-page"], [1, "login-stage"], ["aria-labelledby", "recovery-hero-title", 1, "login-visual"], ["src", "assets/login-hero.webp", "alt", "", "width", "1600", "height", "900", "loading", "lazy", "decoding", "async", 1, "hero__photo"], ["aria-hidden", "true", 1, "hero__shade"], ["viewBox", "0 0 1200 800", "preserveAspectRatio", "none", "aria-hidden", "true", 1, "hero__shape"], ["id", "recovery-hero-shape-grad", "x1", "0%", "y1", "0%", "x2", "80%", "y2", "100%"], ["offset", "0%", "stop-color", "#2563eb", "stop-opacity", "0.62"], ["offset", "100%", "stop-color", "#1d4ed8", "stop-opacity", "0.72"], ["fill", "url(#recovery-hero-shape-grad)", "d", "M0,420 C240,320 400,500 640,380 S980,300 1200,360 L1200,800 L0,800 Z"], ["viewBox", "0 0 320 800", "preserveAspectRatio", "none", "aria-hidden", "true", 1, "hero__curve"], ["fill", "#f8fafc", "d", "M0,0 H102 C156,72 186,248 170,430 S205,652 132,800 H320 V0 Z"], [1, "hero__content"], ["routerLink", "/authentification", "aria-label", "KubaGest", 1, "brand", "brand--desktop"], ["aria-hidden", "true", 1, "brand__mark"], [1, "hero__pitch"], ["id", "recovery-hero-title"], ["aria-labelledby", "recovery-panel-title", 1, "auth-panel"], [1, "auth-panel__header"], ["routerLink", "/authentification", "aria-label", "KubaGest", 1, "brand", "brand--mobile"], [1, "auth-card", "auth-card--recovery"], [1, "auth-card__intro"], ["id", "recovery-panel-title"], ["type", "button", 1, "submit-button", 3, "click"], ["aria-hidden", "true", 1, "fa-solid", "fa-right-to-bracket"], [1, "register-stepper", 3, "value", "linear"], [3, "value"], ["novalidate", "", 3, "ngSubmit", "formGroup"], [1, "field"], ["for", "recovery-email"], [1, "field__control"], ["aria-hidden", "true", 1, "fa-solid", "fa-envelope"], ["pInputText", "", "fluid", "", "id", "recovery-email", "type", "email", "formControlName", "email", "autocomplete", "email", "inputmode", "email", "placeholder", "Adresse e-mail", 3, "invalid"], ["role", "alert", 1, "field__error"], ["role", "alert", 1, "form-error"], ["type", "submit", 1, "submit-button", "recovery-actions__primary", 3, "disabled"], ["aria-hidden", "true", 1, "fa-regular", "fa-spinner", "submit-button__icon--spin"], ["aria-hidden", "true", 1, "fa-solid", "fa-paper-plane"], [1, "signup"], ["routerLink", "/authentification"], ["for", "recovery-code"], [1, "field__control", "recovery-code-input"], ["aria-hidden", "true", 1, "fa-solid", "fa-shield-halved"], ["pInputText", "", "fluid", "", "id", "recovery-code", "type", "text", "formControlName", "code", "inputmode", "numeric", "autocomplete", "one-time-code", "maxlength", "6", "placeholder", "\u2022 \u2022 \u2022 \u2022 \u2022 \u2022", 1, "recovery-code-input__field", 3, "invalid"], ["aria-hidden", "true", 1, "fa-solid", "fa-arrow-right"], [3, "routerLink"], ["for", "recovery-password"], ["aria-hidden", "true", 1, "fa-solid", "fa-lock"], ["pInputText", "", "fluid", "", "id", "recovery-password", "formControlName", "password", "autocomplete", "new-password", "placeholder", "Nouveau mot de passe", 3, "type", "invalid"], ["type", "button", 1, "field__toggle", 3, "click"], ["aria-hidden", "true", 1, "fa-solid"], ["for", "recovery-confirm"], ["pInputText", "", "fluid", "", "id", "recovery-confirm", "formControlName", "confirmPassword", "autocomplete", "new-password", "placeholder", "Confirmez le mot de passe", 3, "type", "invalid"], ["aria-hidden", "true", 1, "fa-solid", "fa-check"]], template: function ForgotPassword_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "main", 0)(1, "div", 1)(2, "div", 2);
            i0.ɵɵelement(3, "img", 3)(4, "div", 4);
            i0.ɵɵnamespaceSVG();
            i0.ɵɵelementStart(5, "svg", 5)(6, "defs")(7, "linearGradient", 6);
            i0.ɵɵelement(8, "stop", 7)(9, "stop", 8);
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(10, "path", 9);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(11, "svg", 10);
            i0.ɵɵelement(12, "path", 11);
            i0.ɵɵelementEnd();
            i0.ɵɵnamespaceHTML();
            i0.ɵɵelementStart(13, "div", 12)(14, "a", 13)(15, "span", 14);
            i0.ɵɵtext(16, "K");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "span")(18, "strong");
            i0.ɵɵtext(19, "KubaGest");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "small");
            i0.ɵɵtext(21, "Gestion commerciale int\u00E9gr\u00E9e");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(22, "div", 15)(23, "h2", 16);
            i0.ɵɵtext(24, "R\u00E9cup\u00E9rez l\u2019acc\u00E8s \u00E0 votre espace en toute s\u00E9curit\u00E9.");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(25, "section", 17)(26, "header", 18)(27, "a", 19)(28, "span", 14);
            i0.ɵɵtext(29, "K");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(30, "span")(31, "strong");
            i0.ɵɵtext(32, "KubaGest");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(33, "small");
            i0.ɵɵtext(34, "Gestion commerciale int\u00E9gr\u00E9e");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(35, "div", 20);
            i0.ɵɵconditionalCreate(36, ForgotPassword_Conditional_36_Template, 11, 0)(37, ForgotPassword_Conditional_37_Template, 11, 10);
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(36);
            i0.ɵɵconditional(ctx.completed() ? 36 : 37);
        } }, dependencies: [RouterLink, ReactiveFormsModule, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.MaxLengthValidator, i1.FormGroupDirective, i1.FormControlName, Stepper, StepList, Step, i2.InputText], styles: ["[_nghost-%COMP%] {\n  display: block;\n  min-height: 100dvh;\n}\n\n.login-page[_ngcontent-%COMP%] {\n  min-height: 100dvh;\n  background: #f8fafc;\n  color: #102033;\n}\n\n.login-stage[_ngcontent-%COMP%] {\n  min-height: 100dvh;\n}\n\n.login-visual[_ngcontent-%COMP%] {\n  display: none;\n}\n\n.hero__photo[_ngcontent-%COMP%], \n.hero__shade[_ngcontent-%COMP%], \n.hero__shape[_ngcontent-%COMP%], \n.hero__curve[_ngcontent-%COMP%] {\n  position: absolute;\n  pointer-events: none;\n}\n\n.hero__photo[_ngcontent-%COMP%] {\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  object-position: 24% 52%;\n}\n\n.hero__shade[_ngcontent-%COMP%] {\n  inset: 0;\n  background: linear-gradient(\n    180deg,\n    rgb(15 23 42 / 0.06) 0%,\n    transparent 42%,\n    rgb(37 99 235 / 0.07) 100%\n  );\n}\n\n.hero__shape[_ngcontent-%COMP%] {\n  z-index: 1;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  height: 52%;\n  width: 100%;\n}\n\n.hero__curve[_ngcontent-%COMP%] {\n  top: 0;\n  right: 0;\n  z-index: 2;\n  height: 100%;\n  width: min(44%, 31rem);\n}\n\n.hero__content[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 4;\n  display: flex;\n  height: 100%;\n  flex-direction: column;\n  justify-content: space-between;\n  padding: clamp(1.5rem, 3vw, 2.5rem);\n}\n\n.brand--desktop[_ngcontent-%COMP%] {\n  display: none;\n}\n\n.hero__pitch[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0 0 1.25rem;\n  max-width: 22rem;\n  color: white;\n  font-size: clamp(1.35rem, 2.2vw, 1.85rem);\n  font-weight: 700;\n  line-height: 1.25;\n  letter-spacing: -0.02em;\n  text-shadow: 0 2px 12px rgb(0 0 0 / 25%);\n}\n\n.hero__features[_ngcontent-%COMP%] {\n  display: grid;\n  max-width: 24rem;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 0.5rem;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n\n.hero__feature[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.4rem;\n  border: 1.5px solid rgb(255 255 255 / 0.45);\n  border-radius: 0.9rem;\n  background: rgb(255 255 255 / 0.12);\n  padding: 0.65rem 0.35rem 0.55rem;\n  color: white;\n  font-size: 0.68rem;\n  font-weight: 650;\n  line-height: 1.2;\n  text-align: center;\n}\n\n.hero__feature[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1.15rem;\n}\n\n.brand[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.75rem;\n  color: #102033;\n  text-decoration: none;\n}\n\n.brand__mark[_ngcontent-%COMP%] {\n  display: grid;\n  width: 3rem;\n  height: 3rem;\n  place-items: center;\n  border-radius: 0.875rem;\n  background: var(--%NS%color-primary);\n  color: white;\n  font-size: 1.55rem;\n  font-weight: 800;\n}\n\n.brand[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.brand[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n}\n\n.brand[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  line-height: 1.2;\n}\n\n.brand[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  margin-top: 0.125rem;\n  color: #64748b;\n  font-size: 0.68rem;\n}\n\n.auth-panel[_ngcontent-%COMP%] {\n  display: flex;\n  min-height: 100dvh;\n  flex-direction: column;\n  padding: 1rem 1.25rem;\n}\n\n.auth-panel__header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n}\n\n.language[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n}\n\n.language__trigger[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.45rem;\n  color: #102033;\n  font-size: 0.9rem;\n  font-weight: 700;\n}\n\n.language__chevron[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  color: #475569;\n}\n\n[_nghost-%COMP%]     .language-select.p-select {\n  display: flex;\n  align-items: center;\n  height: 2rem;\n  min-height: 0;\n  border: 1px solid #cbd5e1;\n  border-radius: 5px;\n  background: #fff;\n  box-shadow: none;\n}\n\n[_nghost-%COMP%]     .language-select.p-select:not(.p-disabled):hover {\n  border-color: #94a3b8;\n}\n\n[_nghost-%COMP%]     .language-select.p-select.p-focus {\n  border-color: var(--%NS%color-primary);\n  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.12);\n}\n\n[_nghost-%COMP%]     .language-select .p-select-label {\n  display: flex;\n  align-items: center;\n  padding: 0 0.15rem 0 0.65rem;\n  line-height: 1;\n}\n\n[_nghost-%COMP%]     .language-select .p-select-dropdown {\n  width: 2rem;\n  color: #475569;\n}\n\n[_nghost-%COMP%]     .language-select-panel.p-select-overlay {\n  overflow: hidden;\n  border: 1px solid #e2e8f0;\n  border-radius: 0.85rem;\n  box-shadow: 0 14px 32px rgb(15 23 42 / 0.12);\n  min-width: 7.25rem;\n}\n\n[_nghost-%COMP%]     .language-select-panel .p-select-option {\n  padding: 0.55rem 0.85rem;\n  font-size: 0.88rem;\n  font-weight: 600;\n}\n\n[_nghost-%COMP%]     .language-select-panel .p-select-option.p-select-option-selected {\n  background: var(--%NS%color-primary-fixed);\n  color: var(--%NS%color-primary);\n}\n\n.auth-card[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 34rem;\n  margin: auto;\n  padding: 2.25rem 0;\n}\n\n.auth-card__intro[_ngcontent-%COMP%] {\n  margin-bottom: 2rem;\n}\n\n.auth-card[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: clamp(1.75rem, 7vw, 2.5rem);\n  line-height: 1.15;\n  letter-spacing: -0.04em;\n}\n\n.auth-card[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \na[_ngcontent-%COMP%] {\n  color: var(--%NS%color-primary);\n}\n\n.auth-card__intro[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  max-width: 29rem;\n  margin: 0.75rem 0 0;\n  color: #64748b;\n  font-size: 1rem;\n  line-height: 1.6;\n}\n\n.field[_ngcontent-%COMP%]    + .field[_ngcontent-%COMP%] {\n  margin-top: 1.15rem;\n}\n\n.field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  margin-bottom: 0.45rem;\n  font-size: 0.875rem;\n  font-weight: 650;\n}\n\n.field__control[_ngcontent-%COMP%] {\n  display: flex;\n  min-height: 3.5rem;\n  align-items: center;\n  gap: 0.75rem;\n  border: 1px solid #cbd5e1;\n  border-radius: 0.75rem;\n  background: white;\n  padding: 0 0.9rem;\n  color: var(--%NS%color-primary);\n  transition:\n    border-color 0.18s,\n    box-shadow 0.18s;\n}\n\n.field__control[_ngcontent-%COMP%]:focus-within {\n  border-color: var(--%NS%color-primary);\n  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.13);\n}\n\n.field__control--invalid[_ngcontent-%COMP%] {\n  border-color: #dc2626;\n}\n\n.field__control[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  min-width: 0;\n  flex: 1;\n  border: 0;\n  outline: 0;\n  color: #102033;\n  background: transparent;\n}\n\n.field__control[_ngcontent-%COMP%]   input.p-inputtext[_ngcontent-%COMP%] {\n  box-shadow: none;\n  border-radius: 0;\n  padding: 0;\n  min-height: auto;\n}\n\n.field__control[_ngcontent-%COMP%]   input.p-inputtext[_ngcontent-%COMP%]:enabled:focus {\n  box-shadow: none;\n}\n\n.field__control[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]::placeholder, \n.field__control[_ngcontent-%COMP%]   input.p-inputtext[_ngcontent-%COMP%]::placeholder {\n  color: #94a3b8;\n}\n\n[_nghost-%COMP%]     .auth-phone-group.p-inputgroup {\n  display: flex;\n  width: 100%;\n  min-height: 3.5rem;\n  align-items: stretch;\n  border: 1px solid #cbd5e1;\n  border-radius: 0.75rem;\n  overflow: hidden;\n  background: white;\n  transition:\n    border-color 0.18s,\n    box-shadow 0.18s;\n}\n\n[_nghost-%COMP%]     .auth-phone-group.p-inputgroup:has(input:focus) {\n  border-color: var(--%NS%color-primary);\n  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.13);\n}\n\n[_nghost-%COMP%]     .auth-phone-group--invalid.p-inputgroup {\n  border-color: #dc2626;\n}\n\n[_nghost-%COMP%]     .auth-phone-group .p-inputgroupaddon {\n  display: flex;\n  align-items: center;\n  align-self: stretch;\n  border: 0;\n  border-right: 1px solid #cbd5e1;\n  background: #f1f5f9;\n  padding: 0 0.85rem;\n  color: #40516a;\n  font-size: 0.9rem;\n  font-weight: 700;\n}\n\n[_nghost-%COMP%]     .auth-phone-group input.p-inputtext {\n  min-width: 0;\n  flex: 1;\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n  min-height: 0;\n  padding: 0 0.9rem;\n}\n\n.field__toggle[_ngcontent-%COMP%] {\n  display: grid;\n  width: 2.5rem;\n  height: 2.5rem;\n  place-items: center;\n  border: 0;\n  border-radius: 0.5rem;\n  background: transparent;\n  color: #475569;\n  cursor: pointer;\n}\n\n.field__toggle[_ngcontent-%COMP%]:hover {\n  background: var(--%NS%color-primary-fixed);\n  color: var(--%NS%color-primary);\n}\n\n.form-notice[_ngcontent-%COMP%] {\n  margin: 0 0 1rem;\n  padding: 0.75rem 0.9rem;\n  border-radius: 0.6rem;\n  border: 1px solid #bfdbfe;\n  background: #eff6ff;\n  color: #1e40af;\n  font-size: 0.85rem;\n  line-height: 1.4;\n}\n\n.field__error[_ngcontent-%COMP%] {\n  margin: 0.35rem 0 0;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  color: #b91c1c;\n  font-size: 0.85rem;\n  font-weight: 600;\n  line-height: 1.4;\n}\n\n.form-error[_ngcontent-%COMP%] {\n  margin: 0 0 1rem;\n  color: #b91c1c;\n  font-size: 0.85rem;\n  line-height: 1.4;\n}\n\n.form-error--banner[_ngcontent-%COMP%] {\n  border-radius: 0.6rem;\n  background: #fef2f2;\n  border: 1px solid #fecaca;\n  padding: 0.75rem 0.9rem;\n}\n\n.form-options[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  margin: 1.25rem 0;\n  font-size: 0.85rem;\n}\n\n.form-options[_ngcontent-%COMP%]   a[_ngcontent-%COMP%], \n.signup[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  font-weight: 700;\n  text-decoration: none;\n}\n\n.form-options[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover, \n.signup[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n\n.register-terms[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: var(--%NS%color-primary);\n  font-weight: 650;\n  text-underline-offset: 2px;\n}\n\n.register-terms[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n\n.remember[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.55rem;\n  color: #475569;\n  cursor: pointer;\n}\n\n[_nghost-%COMP%]     .remember .p-checkbox .p-checkbox-box {\n  border-color: #cbd5e1;\n}\n\n[_nghost-%COMP%]     .remember .p-checkbox.p-checkbox-checked .p-checkbox-box {\n  border-color: var(--%NS%color-primary);\n  background: var(--%NS%color-primary);\n}\n\n.submit-button[_ngcontent-%COMP%], \n.code-button[_ngcontent-%COMP%] {\n  display: flex;\n  width: 100%;\n  min-height: 3.5rem;\n  align-items: center;\n  justify-content: center;\n  gap: 0.65rem;\n  border-radius: 0.75rem;\n  font-weight: 750;\n  transition:\n    transform 0.15s,\n    background 0.15s,\n    box-shadow 0.15s;\n}\n\n.submit-button[_ngcontent-%COMP%] {\n  border: 0;\n  background: var(--%NS%color-primary);\n  color: white;\n  box-shadow: 0 2px 8px rgb(37 99 235 / 0.12);\n  cursor: pointer;\n}\n\n.submit-button[_ngcontent-%COMP%]:not(:disabled):hover {\n  background: var(--%NS%color-primary-container);\n  box-shadow: 0 3px 10px rgb(37 99 235 / 0.14);\n}\n\n.submit-button[_ngcontent-%COMP%]:disabled {\n  cursor: not-allowed;\n  opacity: 0.55;\n  box-shadow: none;\n}\n\n@keyframes _ngcontent-%COMP%_submit-button-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n.submit-button__icon[_ngcontent-%COMP%] {\n  width: 1rem;\n  text-align: center;\n}\n\n.submit-button__icon--spin[_ngcontent-%COMP%] {\n  display: inline-block;\n  animation: _ngcontent-%COMP%_submit-button-spin 0.75s linear infinite;\n}\n\n.separator[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  margin: 1.45rem 0;\n  color: #64748b;\n  font-size: 0.85rem;\n  font-weight: 600;\n}\n\n.separator[_ngcontent-%COMP%]::before, \n.separator[_ngcontent-%COMP%]::after {\n  height: 1px;\n  flex: 1;\n  background: #e2e8f0;\n  content: '';\n}\n\n.code-button[_ngcontent-%COMP%] {\n  border: 1px solid #93c5fd;\n  background: white;\n  color: var(--%NS%color-primary);\n}\n\n.code-button[_ngcontent-%COMP%]:disabled {\n  cursor: not-allowed;\n  opacity: 0.68;\n}\n\n.signup[_ngcontent-%COMP%] {\n  margin: 1.75rem 0 0;\n  text-align: center;\n  color: #64748b;\n  font-size: 0.9rem;\n}\n\n.auth-panel__footer[_ngcontent-%COMP%] {\n  text-align: center;\n  color: #64748b;\n  font-size: 0.72rem;\n}\n\n.auth-panel__footer[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.35rem 0;\n}\n\n.auth-panel__footer[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 0;\n  background: transparent;\n  color: #64748b;\n  text-decoration: underline;\n  cursor: pointer;\n}\n\n.status-success[_ngcontent-%COMP%] {\n  color: var(--%NS%color-primary);\n  font-weight: 700;\n}\n\n@media (min-width: 1024px) {\n  [_nghost-%COMP%]:has(.login-page), \n   .login-page[_ngcontent-%COMP%], \n   .login-stage[_ngcontent-%COMP%] {\n    height: 100dvh;\n    overflow: hidden;\n  }\n\n  .login-stage[_ngcontent-%COMP%] {\n    position: relative;\n  }\n\n  \n  .login-visual[_ngcontent-%COMP%] {\n    position: absolute;\n    inset: 0;\n    z-index: 0;\n    display: block;\n    overflow: hidden;\n    background: #f8fafc;\n  }\n\n  .hero__photo[_ngcontent-%COMP%] {\n    top: -1.5%;\n    left: -2%;\n    width: 106%;\n    height: 106%;\n    max-width: none;\n    object-fit: cover;\n    object-position: 27% 60%;\n    transform: none;\n  }\n\n  .hero__content[_ngcontent-%COMP%] {\n    max-width: min(48vw, 34rem);\n  }\n\n  .brand--desktop[_ngcontent-%COMP%] {\n    display: inline-flex;\n    color: #102033;\n  }\n\n  .brand--desktop[_ngcontent-%COMP%]   .brand__mark[_ngcontent-%COMP%] {\n    box-shadow: 0 8px 20px rgb(37 99 235 / 0.25);\n  }\n\n  .brand--mobile[_ngcontent-%COMP%] {\n    display: none;\n  }\n\n  .auth-panel[_ngcontent-%COMP%] {\n    position: relative;\n    z-index: 2;\n    display: flex;\n    min-height: 100dvh;\n    flex-direction: column;\n    justify-content: center;\n    padding: clamp(4rem, 10vh, 5rem) clamp(1.5rem, 4vw, 3.25rem) clamp(1rem, 2vh, 1.5rem);\n    background: transparent;\n  }\n\n  .auth-panel__header[_ngcontent-%COMP%] {\n    position: absolute;\n    z-index: 3;\n    top: clamp(1rem, 3vh, 2rem);\n    right: clamp(1.25rem, 2.5vw, 2.25rem);\n    justify-content: flex-end;\n  }\n\n  .auth-card[_ngcontent-%COMP%] {\n    position: relative;\n    z-index: 4;\n    display: flex;\n    width: min(100%, 31.5rem);\n    max-width: none;\n    min-height: unset;\n    flex-direction: column;\n    margin: 0 0 0 auto;\n    padding: clamp(1.85rem, 3vh, 2.45rem);\n    transform: translateX(clamp(-2.5rem, -4vw, -1.25rem));\n    border: 1px solid rgb(226 232 240 / 0.85);\n    border-radius: 1rem;\n    background: #fff;\n    box-shadow: 0 1.1rem 2.75rem rgb(15 73 57 / 0.12);\n  }\n\n  .auth-card[_ngcontent-%COMP%]   form[_ngcontent-%COMP%] {\n    display: flex;\n    min-height: 0;\n    flex: 1;\n    flex-direction: column;\n  }\n\n  .auth-card__intro[_ngcontent-%COMP%] {\n    margin-bottom: clamp(1.25rem, 2.8vh, 2rem);\n  }\n\n  .auth-card[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: clamp(1.8rem, 2.2vw, 2.45rem);\n  }\n\n  .auth-card__intro[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    margin-top: 0.5rem;\n    font-size: clamp(0.85rem, 1vw, 1rem);\n    line-height: 1.45;\n  }\n\n  .field[_ngcontent-%COMP%]    > label[_ngcontent-%COMP%] {\n    position: absolute;\n    width: 1px;\n    height: 1px;\n    overflow: hidden;\n    clip: rect(0, 0, 0, 0);\n    white-space: nowrap;\n  }\n\n  .field[_ngcontent-%COMP%]    + .field[_ngcontent-%COMP%] {\n    margin-top: clamp(0.75rem, 1.8vh, 1.15rem);\n  }\n\n  .field__control[_ngcontent-%COMP%] {\n    min-height: clamp(2.9rem, 6.2vh, 3.5rem);\n  }\n\n  [_nghost-%COMP%]     .auth-phone-group.p-inputgroup {\n    min-height: clamp(2.9rem, 6.2vh, 3.5rem);\n  }\n\n  .field__error[_ngcontent-%COMP%] {\n    margin-top: 0.25rem;\n  }\n\n  .form-options[_ngcontent-%COMP%] {\n    margin: clamp(0.8rem, 2vh, 1.25rem) 0;\n  }\n\n  .submit-button[_ngcontent-%COMP%], \n   .code-button[_ngcontent-%COMP%] {\n    min-height: clamp(2.9rem, 6.2vh, 3.5rem);\n  }\n\n  .separator[_ngcontent-%COMP%] {\n    margin: clamp(0.85rem, 2.1vh, 1.4rem) 0;\n  }\n\n  .auth-card[_ngcontent-%COMP%]:not(.auth-card--recovery)   form[_ngcontent-%COMP%]    > .signup[_ngcontent-%COMP%] {\n    margin-top: auto;\n    padding-top: clamp(1rem, 2.5vh, 1.75rem);\n  }\n\n  .auth-panel__footer[_ngcontent-%COMP%] {\n    position: absolute;\n    z-index: 1;\n    right: 1rem;\n    bottom: 0.35rem;\n    left: auto;\n    width: min(44%, 20rem);\n    font-size: 0.6rem;\n    line-height: 1;\n    text-align: right;\n  }\n\n  .auth-panel__footer[_ngcontent-%COMP%]    > p[_ngcontent-%COMP%]:first-child {\n    display: none;\n  }\n}\n\n@media (max-width: 480px) {\n  .auth-panel[_ngcontent-%COMP%] {\n    padding-inline: 1rem;\n  }\n\n  .brand[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n    display: none;\n  }\n\n  .brand__mark[_ngcontent-%COMP%] {\n    width: 2.6rem;\n    height: 2.6rem;\n  }\n\n  .form-options[_ngcontent-%COMP%] {\n    align-items: flex-start;\n    font-size: 0.78rem;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .submit-button[_ngcontent-%COMP%] {\n    transition: none;\n  }\n}", ".auth-card--recovery[_ngcontent-%COMP%] {\r\n  padding-top: 1.35rem;\r\n}\r\n\r\n.auth-card--recovery[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]    > .signup[_ngcontent-%COMP%] {\r\n  margin: 1.15rem 0 0;\r\n  padding: 0;\r\n  text-align: center;\r\n}\r\n\r\n[_nghost-%COMP%]     .register-stepper {\r\n  display: block;\r\n  margin: 0 0 1.35rem;\r\n}\r\n\r\n[_nghost-%COMP%]     .register-stepper .p-step-title {\r\n  font-size: 0.78rem;\r\n  font-weight: 700;\r\n}\r\n\r\n[_nghost-%COMP%]     .register-stepper .p-step-number {\r\n  width: 2.5rem;\r\n  min-width: 2.5rem;\r\n  height: 2.5rem;\r\n  font-size: 1.05rem;\r\n  font-weight: 700;\r\n}\r\n\r\n[_nghost-%COMP%]     .register-stepper .p-step-active .p-step-number {\r\n  border-color: var(--%NS%color-primary);\r\n  background: var(--%NS%color-primary-fixed);\r\n  color: var(--%NS%color-primary);\r\n}\r\n\r\n[_nghost-%COMP%]     .register-stepper .p-step-active .p-step-title {\r\n  color: var(--%NS%color-primary);\r\n}\r\n\r\n[_nghost-%COMP%]     .register-stepper .p-step-active .p-stepper-separator {\r\n  background: var(--%NS%color-primary);\r\n}\r\n\r\n[_nghost-%COMP%]     .register-stepper .register-step--complete .p-step-number {\r\n  border-color: var(--%NS%color-primary);\r\n  background: var(--%NS%color-primary);\r\n  color: var(--%NS%color-on-primary);\r\n}\r\n\r\n[_nghost-%COMP%]     .register-stepper .register-step--complete .p-step-title {\r\n  color: var(--%NS%color-primary);\r\n}\r\n\r\n[_nghost-%COMP%]     .register-stepper .register-step--complete .p-stepper-separator {\r\n  background: var(--%NS%color-primary);\r\n}\r\n\r\n.recovery-code-input__field[_ngcontent-%COMP%] {\r\n  letter-spacing: 0.35em;\r\n  font-weight: 700;\r\n  text-align: center;\r\n}\r\n\r\n.recovery-actions__primary[_ngcontent-%COMP%] {\r\n  margin-top: 1.15rem;\r\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ForgotPassword, [{
        type: Component,
        args: [{ selector: 'app-forgot-password', imports: [RouterLink, ReactiveFormsModule, Stepper, StepList, Step, ...AUTH_FORM_PRIME_IMPORTS], template: "<main id=\"content\" tabindex=\"-1\" class=\"login-page\">\n  <div class=\"login-stage\">\n    <div class=\"login-visual\" aria-labelledby=\"recovery-hero-title\">\n      <img\n        class=\"hero__photo\"\n        src=\"assets/login-hero.webp\"\n        alt=\"\"\n        width=\"1600\"\n        height=\"900\"\n        loading=\"lazy\"\n        decoding=\"async\"\n      />\n      <div class=\"hero__shade\" aria-hidden=\"true\"></div>\n      <svg class=\"hero__shape\" viewBox=\"0 0 1200 800\" preserveAspectRatio=\"none\" aria-hidden=\"true\">\n        <defs>\n          <linearGradient id=\"recovery-hero-shape-grad\" x1=\"0%\" y1=\"0%\" x2=\"80%\" y2=\"100%\">\n            <stop offset=\"0%\" stop-color=\"#2563eb\" stop-opacity=\"0.62\" />\n            <stop offset=\"100%\" stop-color=\"#1d4ed8\" stop-opacity=\"0.72\" />\n          </linearGradient>\n        </defs>\n        <path\n          fill=\"url(#recovery-hero-shape-grad)\"\n          d=\"M0,420 C240,320 400,500 640,380 S980,300 1200,360 L1200,800 L0,800 Z\"\n        />\n      </svg>\n      <svg class=\"hero__curve\" viewBox=\"0 0 320 800\" preserveAspectRatio=\"none\" aria-hidden=\"true\">\n        <path fill=\"#f8fafc\" d=\"M0,0 H102 C156,72 186,248 170,430 S205,652 132,800 H320 V0 Z\" />\n      </svg>\n\n      <div class=\"hero__content\">\n        <a class=\"brand brand--desktop\" routerLink=\"/authentification\" aria-label=\"KubaGest\">\n          <span class=\"brand__mark\" aria-hidden=\"true\">K</span>\n          <span><strong>KubaGest</strong><small>Gestion commerciale int\u00E9gr\u00E9e</small></span>\n        </a>\n\n        <div class=\"hero__pitch\">\n          <h2 id=\"recovery-hero-title\">R\u00E9cup\u00E9rez l\u2019acc\u00E8s \u00E0 votre espace en toute s\u00E9curit\u00E9.</h2>\n        </div>\n      </div>\n    </div>\n\n    <section class=\"auth-panel\" aria-labelledby=\"recovery-panel-title\">\n      <header class=\"auth-panel__header\">\n        <a class=\"brand brand--mobile\" routerLink=\"/authentification\" aria-label=\"KubaGest\">\n          <span class=\"brand__mark\" aria-hidden=\"true\">K</span>\n          <span><strong>KubaGest</strong><small>Gestion commerciale int\u00E9gr\u00E9e</small></span>\n        </a>\n      </header>\n\n      <div class=\"auth-card auth-card--recovery\">\n        @if (completed()) {\n          <div class=\"auth-card__intro\">\n            <h1 id=\"recovery-panel-title\">Mot de passe <span>r\u00E9initialis\u00E9</span></h1>\n            <p>Connectez-vous avec votre nouvelle combinaison.</p>\n          </div>\n          <button class=\"submit-button\" type=\"button\" (click)=\"goToLogin()\">\n            <i class=\"fa-solid fa-right-to-bracket\" aria-hidden=\"true\"></i>\n            <span>Retour \u00E0 la connexion</span>\n          </button>\n        } @else {\n          <p-stepper class=\"register-stepper\" [value]=\"recoveryStepValue()\" [linear]=\"true\">\n            <p-step-list>\n              <p-step [value]=\"1\" [class.register-step--complete]=\"recoveryStepValue() > 1\"\n                >E-mail</p-step\n              >\n              <p-step [value]=\"2\" [class.register-step--complete]=\"recoveryStepValue() > 2\"\n                >Code</p-step\n              >\n              <p-step [value]=\"3\">Nouveau mot de passe</p-step>\n            </p-step-list>\n          </p-stepper>\n\n          @switch (step()) {\n            @case ('email') {\n              <div class=\"auth-card__intro\">\n                <h1 id=\"recovery-panel-title\">Mot de passe <span>oubli\u00E9</span></h1>\n                <p>Indiquez l\u2019adresse e-mail de votre compte. Nous vous enverrons un code de v\u00E9rification.</p>\n              </div>\n              <form [formGroup]=\"emailForm\" (ngSubmit)=\"submitEmail()\" novalidate>\n                <div class=\"field\">\n                  <label for=\"recovery-email\">Adresse e-mail</label>\n                  <div\n                    class=\"field__control\"\n                    [class.field__control--invalid]=\"\n                      emailForm.controls.email.touched && emailForm.controls.email.invalid\n                    \"\n                  >\n                    <i class=\"fa-solid fa-envelope\" aria-hidden=\"true\"></i>\n                    <input\n                      pInputText\n                      fluid\n                      id=\"recovery-email\"\n                      type=\"email\"\n                      formControlName=\"email\"\n                      autocomplete=\"email\"\n                      inputmode=\"email\"\n                      placeholder=\"Adresse e-mail\"\n                      [invalid]=\"emailForm.controls.email.touched && emailForm.controls.email.invalid\"\n                    />\n                  </div>\n                  @if (emailForm.controls.email.touched && emailForm.controls.email.invalid) {\n                    <p class=\"field__error\" role=\"alert\">Saisissez une adresse e-mail valide.</p>\n                  }\n                </div>\n                @if (error()) {\n                  <p class=\"form-error\" role=\"alert\">{{ error() }}</p>\n                }\n                <button class=\"submit-button recovery-actions__primary\" type=\"submit\" [disabled]=\"submitting()\" [attr.aria-busy]=\"submitting()\">\n                  @if (submitting()) {\n                    <i class=\"fa-regular fa-spinner submit-button__icon--spin\" aria-hidden=\"true\"></i>\n                  } @else {\n                    <i class=\"fa-solid fa-paper-plane\" aria-hidden=\"true\"></i>\n                  }\n                  <span>{{ submitting() ? 'Envoi\u2026' : 'Recevoir le code' }}</span>\n                </button>\n                <p class=\"signup\"><a routerLink=\"/authentification\">Retour \u00E0 la connexion</a></p>\n              </form>\n            }\n            @case ('verify') {\n              <div class=\"auth-card__intro\">\n                <h1 id=\"recovery-panel-title\">V\u00E9rification du <span>code</span></h1>\n                <p>\n                  Saisissez le code \u00E0 6 chiffres envoy\u00E9 \u00E0 <strong>{{ maskedEmail() }}</strong>.\n                </p>\n              </div>\n              <form [formGroup]=\"codeForm\" (ngSubmit)=\"submitCode()\" novalidate>\n                <div class=\"field\">\n                  <label for=\"recovery-code\">Code de v\u00E9rification</label>\n                  <div\n                    class=\"field__control recovery-code-input\"\n                    [class.field__control--invalid]=\"codeForm.controls.code.touched && codeForm.controls.code.invalid\"\n                  >\n                    <i class=\"fa-solid fa-shield-halved\" aria-hidden=\"true\"></i>\n                    <input\n                      pInputText\n                      fluid\n                      id=\"recovery-code\"\n                      type=\"text\"\n                      formControlName=\"code\"\n                      inputmode=\"numeric\"\n                      autocomplete=\"one-time-code\"\n                      maxlength=\"6\"\n                      placeholder=\"\u2022 \u2022 \u2022 \u2022 \u2022 \u2022\"\n                      class=\"recovery-code-input__field\"\n                      [invalid]=\"codeForm.controls.code.touched && codeForm.controls.code.invalid\"\n                    />\n                  </div>\n                  @if (codeForm.controls.code.touched && codeForm.controls.code.invalid) {\n                    <p class=\"field__error\" role=\"alert\">Le code comporte 6 chiffres.</p>\n                  }\n                </div>\n                @if (error()) {\n                  <p class=\"form-error\" role=\"alert\">{{ error() }}</p>\n                }\n                <button class=\"submit-button recovery-actions__primary\" type=\"submit\" [disabled]=\"submitting()\" [attr.aria-busy]=\"submitting()\">\n                  @if (submitting()) {\n                    <i class=\"fa-regular fa-spinner submit-button__icon--spin\" aria-hidden=\"true\"></i>\n                  } @else {\n                    <i class=\"fa-solid fa-arrow-right\" aria-hidden=\"true\"></i>\n                  }\n                  <span>{{ submitting() ? 'V\u00E9rification\u2026' : 'Continuer' }}</span>\n                </button>\n                <p class=\"signup\">\n                  <a [routerLink]=\"forgotPath\">Utiliser une autre adresse e-mail</a>\n                </p>\n              </form>\n            }\n            @case ('reset') {\n              <div class=\"auth-card__intro\">\n                <h1 id=\"recovery-panel-title\">Nouveau <span>mot de passe</span></h1>\n                <p>Choisissez un mot de passe s\u00E9curis\u00E9 d\u2019au moins 8 caract\u00E8res.</p>\n              </div>\n              <form [formGroup]=\"resetForm\" (ngSubmit)=\"submitReset()\" novalidate>\n                <div class=\"field\">\n                  <label for=\"recovery-password\">Mot de passe</label>\n                  <div\n                    class=\"field__control\"\n                    [class.field__control--invalid]=\"\n                      resetForm.controls.password.touched && resetForm.controls.password.invalid\n                    \"\n                  >\n                    <i class=\"fa-solid fa-lock\" aria-hidden=\"true\"></i>\n                    <input\n                      pInputText\n                      fluid\n                      id=\"recovery-password\"\n                      [type]=\"showPassword() ? 'text' : 'password'\"\n                      formControlName=\"password\"\n                      autocomplete=\"new-password\"\n                      placeholder=\"Nouveau mot de passe\"\n                      [invalid]=\"resetForm.controls.password.touched && resetForm.controls.password.invalid\"\n                    />\n                    <button\n                      type=\"button\"\n                      class=\"field__toggle\"\n                      (click)=\"togglePassword()\"\n                      [attr.aria-label]=\"showPassword() ? 'Masquer le mot de passe' : 'Afficher le mot de passe'\"\n                    >\n                      <i\n                        class=\"fa-solid\"\n                        [class.fa-eye-slash]=\"showPassword()\"\n                        [class.fa-eye]=\"!showPassword()\"\n                        aria-hidden=\"true\"\n                      ></i>\n                    </button>\n                  </div>\n                </div>\n                <div class=\"field\">\n                  <label for=\"recovery-confirm\">Confirmation</label>\n                  <div\n                    class=\"field__control\"\n                    [class.field__control--invalid]=\"\n                      resetForm.controls.confirmPassword.touched && resetForm.controls.confirmPassword.invalid\n                    \"\n                  >\n                    <i class=\"fa-solid fa-lock\" aria-hidden=\"true\"></i>\n                    <input\n                      pInputText\n                      fluid\n                      id=\"recovery-confirm\"\n                      [type]=\"showConfirmPassword() ? 'text' : 'password'\"\n                      formControlName=\"confirmPassword\"\n                      autocomplete=\"new-password\"\n                      placeholder=\"Confirmez le mot de passe\"\n                      [invalid]=\"resetForm.controls.confirmPassword.touched && resetForm.controls.confirmPassword.invalid\"\n                    />\n                    <button type=\"button\" class=\"field__toggle\" (click)=\"toggleConfirmPassword()\">\n                      <i\n                        class=\"fa-solid\"\n                        [class.fa-eye-slash]=\"showConfirmPassword()\"\n                        [class.fa-eye]=\"!showConfirmPassword()\"\n                        aria-hidden=\"true\"\n                      ></i>\n                    </button>\n                  </div>\n                  @if (resetForm.controls.confirmPassword.touched && resetForm.controls.confirmPassword.hasError('mismatch')) {\n                    <p class=\"field__error\" role=\"alert\">Les mots de passe ne correspondent pas.</p>\n                  }\n                </div>\n                @if (error()) {\n                  <p class=\"form-error\" role=\"alert\">{{ error() }}</p>\n                }\n                <button class=\"submit-button recovery-actions__primary\" type=\"submit\" [disabled]=\"submitting()\" [attr.aria-busy]=\"submitting()\">\n                  @if (submitting()) {\n                    <i class=\"fa-regular fa-spinner submit-button__icon--spin\" aria-hidden=\"true\"></i>\n                  } @else {\n                    <i class=\"fa-solid fa-check\" aria-hidden=\"true\"></i>\n                  }\n                  <span>{{ submitting() ? 'Enregistrement\u2026' : 'Enregistrer' }}</span>\n                </button>\n              </form>\n            }\n          }\n        }\n      </div>\n    </section>\n  </div>\n</main>\n", styles: [":host {\n  display: block;\n  min-height: 100dvh;\n}\n\n.login-page {\n  min-height: 100dvh;\n  background: #f8fafc;\n  color: #102033;\n}\n\n.login-stage {\n  min-height: 100dvh;\n}\n\n.login-visual {\n  display: none;\n}\n\n.hero__photo,\n.hero__shade,\n.hero__shape,\n.hero__curve {\n  position: absolute;\n  pointer-events: none;\n}\n\n.hero__photo {\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  object-position: 24% 52%;\n}\n\n.hero__shade {\n  inset: 0;\n  background: linear-gradient(\n    180deg,\n    rgb(15 23 42 / 0.06) 0%,\n    transparent 42%,\n    rgb(37 99 235 / 0.07) 100%\n  );\n}\n\n.hero__shape {\n  z-index: 1;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  height: 52%;\n  width: 100%;\n}\n\n.hero__curve {\n  top: 0;\n  right: 0;\n  z-index: 2;\n  height: 100%;\n  width: min(44%, 31rem);\n}\n\n.hero__content {\n  position: relative;\n  z-index: 4;\n  display: flex;\n  height: 100%;\n  flex-direction: column;\n  justify-content: space-between;\n  padding: clamp(1.5rem, 3vw, 2.5rem);\n}\n\n.brand--desktop {\n  display: none;\n}\n\n.hero__pitch h2 {\n  margin: 0 0 1.25rem;\n  max-width: 22rem;\n  color: white;\n  font-size: clamp(1.35rem, 2.2vw, 1.85rem);\n  font-weight: 700;\n  line-height: 1.25;\n  letter-spacing: -0.02em;\n  text-shadow: 0 2px 12px rgb(0 0 0 / 25%);\n}\n\n.hero__features {\n  display: grid;\n  max-width: 24rem;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 0.5rem;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n\n.hero__feature {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.4rem;\n  border: 1.5px solid rgb(255 255 255 / 0.45);\n  border-radius: 0.9rem;\n  background: rgb(255 255 255 / 0.12);\n  padding: 0.65rem 0.35rem 0.55rem;\n  color: white;\n  font-size: 0.68rem;\n  font-weight: 650;\n  line-height: 1.2;\n  text-align: center;\n}\n\n.hero__feature i {\n  font-size: 1.15rem;\n}\n\n.brand {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.75rem;\n  color: #102033;\n  text-decoration: none;\n}\n\n.brand__mark {\n  display: grid;\n  width: 3rem;\n  height: 3rem;\n  place-items: center;\n  border-radius: 0.875rem;\n  background: var(--color-primary);\n  color: white;\n  font-size: 1.55rem;\n  font-weight: 800;\n}\n\n.brand strong,\n.brand small {\n  display: block;\n}\n\n.brand strong {\n  font-size: 1.2rem;\n  line-height: 1.2;\n}\n\n.brand small {\n  margin-top: 0.125rem;\n  color: #64748b;\n  font-size: 0.68rem;\n}\n\n.auth-panel {\n  display: flex;\n  min-height: 100dvh;\n  flex-direction: column;\n  padding: 1rem 1.25rem;\n}\n\n.auth-panel__header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n}\n\n.language {\n  display: inline-flex;\n  align-items: center;\n}\n\n.language__trigger {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.45rem;\n  color: #102033;\n  font-size: 0.9rem;\n  font-weight: 700;\n}\n\n.language__chevron {\n  font-size: 0.85rem;\n  color: #475569;\n}\n\n:host ::ng-deep .language-select.p-select {\n  display: flex;\n  align-items: center;\n  height: 2rem;\n  min-height: 0;\n  border: 1px solid #cbd5e1;\n  border-radius: 5px;\n  background: #fff;\n  box-shadow: none;\n}\n\n:host ::ng-deep .language-select.p-select:not(.p-disabled):hover {\n  border-color: #94a3b8;\n}\n\n:host ::ng-deep .language-select.p-select.p-focus {\n  border-color: var(--color-primary);\n  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.12);\n}\n\n:host ::ng-deep .language-select .p-select-label {\n  display: flex;\n  align-items: center;\n  padding: 0 0.15rem 0 0.65rem;\n  line-height: 1;\n}\n\n:host ::ng-deep .language-select .p-select-dropdown {\n  width: 2rem;\n  color: #475569;\n}\n\n:host ::ng-deep .language-select-panel.p-select-overlay {\n  overflow: hidden;\n  border: 1px solid #e2e8f0;\n  border-radius: 0.85rem;\n  box-shadow: 0 14px 32px rgb(15 23 42 / 0.12);\n  min-width: 7.25rem;\n}\n\n:host ::ng-deep .language-select-panel .p-select-option {\n  padding: 0.55rem 0.85rem;\n  font-size: 0.88rem;\n  font-weight: 600;\n}\n\n:host ::ng-deep .language-select-panel .p-select-option.p-select-option-selected {\n  background: var(--color-primary-fixed);\n  color: var(--color-primary);\n}\n\n.auth-card {\n  width: 100%;\n  max-width: 34rem;\n  margin: auto;\n  padding: 2.25rem 0;\n}\n\n.auth-card__intro {\n  margin-bottom: 2rem;\n}\n\n.auth-card h1 {\n  margin: 0;\n  font-size: clamp(1.75rem, 7vw, 2.5rem);\n  line-height: 1.15;\n  letter-spacing: -0.04em;\n}\n\n.auth-card h1 span,\na {\n  color: var(--color-primary);\n}\n\n.auth-card__intro p {\n  max-width: 29rem;\n  margin: 0.75rem 0 0;\n  color: #64748b;\n  font-size: 1rem;\n  line-height: 1.6;\n}\n\n.field + .field {\n  margin-top: 1.15rem;\n}\n\n.field label {\n  display: block;\n  margin-bottom: 0.45rem;\n  font-size: 0.875rem;\n  font-weight: 650;\n}\n\n.field__control {\n  display: flex;\n  min-height: 3.5rem;\n  align-items: center;\n  gap: 0.75rem;\n  border: 1px solid #cbd5e1;\n  border-radius: 0.75rem;\n  background: white;\n  padding: 0 0.9rem;\n  color: var(--color-primary);\n  transition:\n    border-color 0.18s,\n    box-shadow 0.18s;\n}\n\n.field__control:focus-within {\n  border-color: var(--color-primary);\n  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.13);\n}\n\n.field__control--invalid {\n  border-color: #dc2626;\n}\n\n.field__control input {\n  min-width: 0;\n  flex: 1;\n  border: 0;\n  outline: 0;\n  color: #102033;\n  background: transparent;\n}\n\n.field__control input.p-inputtext {\n  box-shadow: none;\n  border-radius: 0;\n  padding: 0;\n  min-height: auto;\n}\n\n.field__control input.p-inputtext:enabled:focus {\n  box-shadow: none;\n}\n\n.field__control input::placeholder,\n.field__control input.p-inputtext::placeholder {\n  color: #94a3b8;\n}\n\n:host ::ng-deep .auth-phone-group.p-inputgroup {\n  display: flex;\n  width: 100%;\n  min-height: 3.5rem;\n  align-items: stretch;\n  border: 1px solid #cbd5e1;\n  border-radius: 0.75rem;\n  overflow: hidden;\n  background: white;\n  transition:\n    border-color 0.18s,\n    box-shadow 0.18s;\n}\n\n:host ::ng-deep .auth-phone-group.p-inputgroup:has(input:focus) {\n  border-color: var(--color-primary);\n  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.13);\n}\n\n:host ::ng-deep .auth-phone-group--invalid.p-inputgroup {\n  border-color: #dc2626;\n}\n\n:host ::ng-deep .auth-phone-group .p-inputgroupaddon {\n  display: flex;\n  align-items: center;\n  align-self: stretch;\n  border: 0;\n  border-right: 1px solid #cbd5e1;\n  background: #f1f5f9;\n  padding: 0 0.85rem;\n  color: #40516a;\n  font-size: 0.9rem;\n  font-weight: 700;\n}\n\n:host ::ng-deep .auth-phone-group input.p-inputtext {\n  min-width: 0;\n  flex: 1;\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n  min-height: 0;\n  padding: 0 0.9rem;\n}\n\n.field__toggle {\n  display: grid;\n  width: 2.5rem;\n  height: 2.5rem;\n  place-items: center;\n  border: 0;\n  border-radius: 0.5rem;\n  background: transparent;\n  color: #475569;\n  cursor: pointer;\n}\n\n.field__toggle:hover {\n  background: var(--color-primary-fixed);\n  color: var(--color-primary);\n}\n\n.form-notice {\n  margin: 0 0 1rem;\n  padding: 0.75rem 0.9rem;\n  border-radius: 0.6rem;\n  border: 1px solid #bfdbfe;\n  background: #eff6ff;\n  color: #1e40af;\n  font-size: 0.85rem;\n  line-height: 1.4;\n}\n\n.field__error {\n  margin: 0.35rem 0 0;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  color: #b91c1c;\n  font-size: 0.85rem;\n  font-weight: 600;\n  line-height: 1.4;\n}\n\n.form-error {\n  margin: 0 0 1rem;\n  color: #b91c1c;\n  font-size: 0.85rem;\n  line-height: 1.4;\n}\n\n.form-error--banner {\n  border-radius: 0.6rem;\n  background: #fef2f2;\n  border: 1px solid #fecaca;\n  padding: 0.75rem 0.9rem;\n}\n\n.form-options {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  margin: 1.25rem 0;\n  font-size: 0.85rem;\n}\n\n.form-options a,\n.signup a {\n  font-weight: 700;\n  text-decoration: none;\n}\n\n.form-options a:hover,\n.signup a:hover {\n  text-decoration: underline;\n}\n\n.register-terms a {\n  color: var(--color-primary);\n  font-weight: 650;\n  text-underline-offset: 2px;\n}\n\n.register-terms a:hover {\n  text-decoration: underline;\n}\n\n.remember {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.55rem;\n  color: #475569;\n  cursor: pointer;\n}\n\n:host ::ng-deep .remember .p-checkbox .p-checkbox-box {\n  border-color: #cbd5e1;\n}\n\n:host ::ng-deep .remember .p-checkbox.p-checkbox-checked .p-checkbox-box {\n  border-color: var(--color-primary);\n  background: var(--color-primary);\n}\n\n.submit-button,\n.code-button {\n  display: flex;\n  width: 100%;\n  min-height: 3.5rem;\n  align-items: center;\n  justify-content: center;\n  gap: 0.65rem;\n  border-radius: 0.75rem;\n  font-weight: 750;\n  transition:\n    transform 0.15s,\n    background 0.15s,\n    box-shadow 0.15s;\n}\n\n.submit-button {\n  border: 0;\n  background: var(--color-primary);\n  color: white;\n  box-shadow: 0 2px 8px rgb(37 99 235 / 0.12);\n  cursor: pointer;\n}\n\n.submit-button:not(:disabled):hover {\n  background: var(--color-primary-container);\n  box-shadow: 0 3px 10px rgb(37 99 235 / 0.14);\n}\n\n.submit-button:disabled {\n  cursor: not-allowed;\n  opacity: 0.55;\n  box-shadow: none;\n}\n\n@keyframes submit-button-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n.submit-button__icon {\n  width: 1rem;\n  text-align: center;\n}\n\n.submit-button__icon--spin {\n  display: inline-block;\n  animation: submit-button-spin 0.75s linear infinite;\n}\n\n.separator {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  margin: 1.45rem 0;\n  color: #64748b;\n  font-size: 0.85rem;\n  font-weight: 600;\n}\n\n.separator::before,\n.separator::after {\n  height: 1px;\n  flex: 1;\n  background: #e2e8f0;\n  content: '';\n}\n\n.code-button {\n  border: 1px solid #93c5fd;\n  background: white;\n  color: var(--color-primary);\n}\n\n.code-button:disabled {\n  cursor: not-allowed;\n  opacity: 0.68;\n}\n\n.signup {\n  margin: 1.75rem 0 0;\n  text-align: center;\n  color: #64748b;\n  font-size: 0.9rem;\n}\n\n.auth-panel__footer {\n  text-align: center;\n  color: #64748b;\n  font-size: 0.72rem;\n}\n\n.auth-panel__footer p {\n  margin: 0.35rem 0;\n}\n\n.auth-panel__footer button {\n  border: 0;\n  background: transparent;\n  color: #64748b;\n  text-decoration: underline;\n  cursor: pointer;\n}\n\n.status-success {\n  color: var(--color-primary);\n  font-weight: 700;\n}\n\n@media (min-width: 1024px) {\n  :host:has(.login-page),\n  .login-page,\n  .login-stage {\n    height: 100dvh;\n    overflow: hidden;\n  }\n\n  .login-stage {\n    position: relative;\n  }\n\n  /* Image = fond du m\u00EAme bloc que le formulaire (pas une colonne s\u00E9par\u00E9e) */\n  .login-visual {\n    position: absolute;\n    inset: 0;\n    z-index: 0;\n    display: block;\n    overflow: hidden;\n    background: #f8fafc;\n  }\n\n  .hero__photo {\n    top: -1.5%;\n    left: -2%;\n    width: 106%;\n    height: 106%;\n    max-width: none;\n    object-fit: cover;\n    object-position: 27% 60%;\n    transform: none;\n  }\n\n  .hero__content {\n    max-width: min(48vw, 34rem);\n  }\n\n  .brand--desktop {\n    display: inline-flex;\n    color: #102033;\n  }\n\n  .brand--desktop .brand__mark {\n    box-shadow: 0 8px 20px rgb(37 99 235 / 0.25);\n  }\n\n  .brand--mobile {\n    display: none;\n  }\n\n  .auth-panel {\n    position: relative;\n    z-index: 2;\n    display: flex;\n    min-height: 100dvh;\n    flex-direction: column;\n    justify-content: center;\n    padding: clamp(4rem, 10vh, 5rem) clamp(1.5rem, 4vw, 3.25rem) clamp(1rem, 2vh, 1.5rem);\n    background: transparent;\n  }\n\n  .auth-panel__header {\n    position: absolute;\n    z-index: 3;\n    top: clamp(1rem, 3vh, 2rem);\n    right: clamp(1.25rem, 2.5vw, 2.25rem);\n    justify-content: flex-end;\n  }\n\n  .auth-card {\n    position: relative;\n    z-index: 4;\n    display: flex;\n    width: min(100%, 31.5rem);\n    max-width: none;\n    min-height: unset;\n    flex-direction: column;\n    margin: 0 0 0 auto;\n    padding: clamp(1.85rem, 3vh, 2.45rem);\n    transform: translateX(clamp(-2.5rem, -4vw, -1.25rem));\n    border: 1px solid rgb(226 232 240 / 0.85);\n    border-radius: 1rem;\n    background: #fff;\n    box-shadow: 0 1.1rem 2.75rem rgb(15 73 57 / 0.12);\n  }\n\n  .auth-card form {\n    display: flex;\n    min-height: 0;\n    flex: 1;\n    flex-direction: column;\n  }\n\n  .auth-card__intro {\n    margin-bottom: clamp(1.25rem, 2.8vh, 2rem);\n  }\n\n  .auth-card h1 {\n    font-size: clamp(1.8rem, 2.2vw, 2.45rem);\n  }\n\n  .auth-card__intro p {\n    margin-top: 0.5rem;\n    font-size: clamp(0.85rem, 1vw, 1rem);\n    line-height: 1.45;\n  }\n\n  .field > label {\n    position: absolute;\n    width: 1px;\n    height: 1px;\n    overflow: hidden;\n    clip: rect(0, 0, 0, 0);\n    white-space: nowrap;\n  }\n\n  .field + .field {\n    margin-top: clamp(0.75rem, 1.8vh, 1.15rem);\n  }\n\n  .field__control {\n    min-height: clamp(2.9rem, 6.2vh, 3.5rem);\n  }\n\n  :host ::ng-deep .auth-phone-group.p-inputgroup {\n    min-height: clamp(2.9rem, 6.2vh, 3.5rem);\n  }\n\n  .field__error {\n    margin-top: 0.25rem;\n  }\n\n  .form-options {\n    margin: clamp(0.8rem, 2vh, 1.25rem) 0;\n  }\n\n  .submit-button,\n  .code-button {\n    min-height: clamp(2.9rem, 6.2vh, 3.5rem);\n  }\n\n  .separator {\n    margin: clamp(0.85rem, 2.1vh, 1.4rem) 0;\n  }\n\n  .auth-card:not(.auth-card--recovery) form > .signup {\n    margin-top: auto;\n    padding-top: clamp(1rem, 2.5vh, 1.75rem);\n  }\n\n  .auth-panel__footer {\n    position: absolute;\n    z-index: 1;\n    right: 1rem;\n    bottom: 0.35rem;\n    left: auto;\n    width: min(44%, 20rem);\n    font-size: 0.6rem;\n    line-height: 1;\n    text-align: right;\n  }\n\n  .auth-panel__footer > p:first-child {\n    display: none;\n  }\n}\n\n@media (max-width: 480px) {\n  .auth-panel {\n    padding-inline: 1rem;\n  }\n\n  .brand small {\n    display: none;\n  }\n\n  .brand__mark {\n    width: 2.6rem;\n    height: 2.6rem;\n  }\n\n  .form-options {\n    align-items: flex-start;\n    font-size: 0.78rem;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .submit-button {\n    transition: none;\n  }\n}\n", ".auth-card--recovery {\r\n  padding-top: 1.35rem;\r\n}\r\n\r\n.auth-card--recovery form > .signup {\r\n  margin: 1.15rem 0 0;\r\n  padding: 0;\r\n  text-align: center;\r\n}\r\n\r\n:host ::ng-deep .register-stepper {\r\n  display: block;\r\n  margin: 0 0 1.35rem;\r\n}\r\n\r\n:host ::ng-deep .register-stepper .p-step-title {\r\n  font-size: 0.78rem;\r\n  font-weight: 700;\r\n}\r\n\r\n:host ::ng-deep .register-stepper .p-step-number {\r\n  width: 2.5rem;\r\n  min-width: 2.5rem;\r\n  height: 2.5rem;\r\n  font-size: 1.05rem;\r\n  font-weight: 700;\r\n}\r\n\r\n:host ::ng-deep .register-stepper .p-step-active .p-step-number {\r\n  border-color: var(--color-primary);\r\n  background: var(--color-primary-fixed);\r\n  color: var(--color-primary);\r\n}\r\n\r\n:host ::ng-deep .register-stepper .p-step-active .p-step-title {\r\n  color: var(--color-primary);\r\n}\r\n\r\n:host ::ng-deep .register-stepper .p-step-active .p-stepper-separator {\r\n  background: var(--color-primary);\r\n}\r\n\r\n:host ::ng-deep .register-stepper .register-step--complete .p-step-number {\r\n  border-color: var(--color-primary);\r\n  background: var(--color-primary);\r\n  color: var(--color-on-primary);\r\n}\r\n\r\n:host ::ng-deep .register-stepper .register-step--complete .p-step-title {\r\n  color: var(--color-primary);\r\n}\r\n\r\n:host ::ng-deep .register-stepper .register-step--complete .p-stepper-separator {\r\n  background: var(--color-primary);\r\n}\r\n\r\n.recovery-code-input__field {\r\n  letter-spacing: 0.35em;\r\n  font-weight: 700;\r\n  text-align: center;\r\n}\r\n\r\n.recovery-actions__primary {\r\n  margin-top: 1.15rem;\r\n}\r\n"] }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ForgotPassword, { className: "ForgotPassword", filePath: "src/app/features/auth/forgot-password/forgot-password.ts", lineNumber: 43 }); })();
