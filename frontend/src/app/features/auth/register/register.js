import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { debounceTime } from 'rxjs';
import { RegisterDraftStore } from './register-draft.store';
import { Select } from 'primeng/select';
import { Step, StepList, Stepper } from 'primeng/stepper';
import { AUTH_FORM_PRIME_IMPORTS } from '../auth-prime-fields';
import { AuthLegalNotice } from '../auth-legal-notice';
import { ApiService } from '../../../core/api/api.service';
import { AUTHENTICATION_PATH, PRIVACY_POLICY_PATH, REGISTRATION_PATH, TERMS_OF_USE_PATH, } from '../../../core/auth/auth.paths';
import { formatRdcPhoneLocalDisplay, formatTelephoneWithCountryCode, RDC_DIAL, rdcPhoneErrorMessage, rdcPhoneValidator, rdcPhoneValueFromInput, } from '../../../core/utils/rdc-phone.util';
import { FORGOT_PASSWORD_PATH } from '../forgot-password/forgot-password.routes';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "primeng/inputtext";
import * as i3 from "primeng/inputgroup";
import * as i4 from "primeng/inputgroupaddon";
import * as i5 from "primeng/checkbox";
const _c0 = a0 => ({ retour: a0 });
function Register_ng_template_42_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 28);
    i0.ɵɵelement(1, "i", 29);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const option_r1 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(option_r1?.label);
} }
function Register_ng_template_44_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 30);
} }
function Register_Conditional_47_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 27)(1, "div", 31);
    i0.ɵɵelement(2, "i", 32);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "h2", 33);
    i0.ɵɵtext(4, "Votre espace est pr\u00EAt");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p");
    i0.ɵɵtext(6, " Connectez-vous avec l\u2019adresse e-mail et le mot de passe que vous venez de d\u00E9finir. ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "button", 34);
    i0.ɵɵlistener("click", function Register_Conditional_47_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.goToLogin()); });
    i0.ɵɵelement(8, "i", 35);
    i0.ɵɵelementStart(9, "span");
    i0.ɵɵtext(10, "Aller \u00E0 la connexion");
    i0.ɵɵelementEnd()()();
} }
function Register_Conditional_48_Conditional_16_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 58);
    i0.ɵɵtext(1, "Indiquez votre pr\u00E9nom.");
    i0.ɵɵelementEnd();
} }
function Register_Conditional_48_Conditional_16_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 58);
    i0.ɵɵtext(1, "Indiquez votre nom.");
    i0.ɵɵelementEnd();
} }
function Register_Conditional_48_Conditional_16_Case_25_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 66);
} }
function Register_Conditional_48_Conditional_16_Case_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 67);
} }
function Register_Conditional_48_Conditional_16_Case_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 69);
} }
function Register_Conditional_48_Conditional_16_Case_29_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 70);
} }
function Register_Conditional_48_Conditional_16_Conditional_30_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 71);
    i0.ɵɵtext(1, " Format d\u2019adresse e-mail invalide. ");
    i0.ɵɵelementEnd();
} }
function Register_Conditional_48_Conditional_16_Conditional_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 72);
    i0.ɵɵtext(1, " Un compte existe d\u00E9j\u00E0 avec cette adresse. ");
    i0.ɵɵelementStart(2, "a", 79);
    i0.ɵɵtext(3, "Se connecter");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(4, " ou ");
    i0.ɵɵelementStart(5, "a", 79);
    i0.ɵɵtext(6, "mot de passe oubli\u00E9\u00A0?");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("routerLink", ctx_r2.authPath);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("routerLink", ctx_r2.forgotPasswordPath);
} }
function Register_Conditional_48_Conditional_16_Conditional_41_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 78);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.phoneFieldError(), " ");
} }
function Register_Conditional_48_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 40)(1, "div", 52)(2, "div", 53)(3, "label", 54);
    i0.ɵɵtext(4, "Pr\u00E9nom");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 55);
    i0.ɵɵelement(6, "i", 56);
    i0.ɵɵelementStart(7, "input", 57);
    i0.ɵɵcontrolCreate();
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(8, Register_Conditional_48_Conditional_16_Conditional_8_Template, 2, 0, "p", 58);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 53)(10, "label", 59);
    i0.ɵɵtext(11, "Nom");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "div", 55);
    i0.ɵɵelement(13, "i", 56);
    i0.ɵɵelementStart(14, "input", 60);
    i0.ɵɵcontrolCreate();
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(15, Register_Conditional_48_Conditional_16_Conditional_15_Template, 2, 0, "p", 58);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "div", 61)(17, "label", 62);
    i0.ɵɵtext(18, "Sexe");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "p-select", 63);
    i0.ɵɵcontrolCreate();
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(20, "div", 52)(21, "div", 64)(22, "label", 65);
    i0.ɵɵtext(23, "Adresse e-mail");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "div", 55);
    i0.ɵɵconditionalCreate(25, Register_Conditional_48_Conditional_16_Case_25_Template, 1, 0, "i", 66)(26, Register_Conditional_48_Conditional_16_Case_26_Template, 1, 0, "i", 67);
    i0.ɵɵelementStart(27, "input", 68);
    i0.ɵɵcontrolCreate();
    i0.ɵɵlistener("blur", function Register_Conditional_48_Conditional_16_Template_input_blur_27_listener() { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.onEmailBlur()); })("input", function Register_Conditional_48_Conditional_16_Template_input_input_27_listener() { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.onEmailInput()); });
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(28, Register_Conditional_48_Conditional_16_Case_28_Template, 1, 0, "i", 69)(29, Register_Conditional_48_Conditional_16_Case_29_Template, 1, 0, "i", 70);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(30, Register_Conditional_48_Conditional_16_Conditional_30_Template, 2, 0, "p", 71)(31, Register_Conditional_48_Conditional_16_Conditional_31_Template, 7, 2, "p", 72);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "div", 53)(33, "label", 73);
    i0.ɵɵtext(34, "T\u00E9l\u00E9phone ");
    i0.ɵɵelementStart(35, "span", 74);
    i0.ɵɵtext(36, "facultatif");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(37, "p-inputgroup", 75)(38, "p-inputgroup-addon", 76);
    i0.ɵɵtext(39);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "input", 77);
    i0.ɵɵlistener("input", function Register_Conditional_48_Conditional_16_Template_input_input_40_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.onPhoneInput($event)); })("blur", function Register_Conditional_48_Conditional_16_Template_input_blur_40_listener() { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.onPhoneBlur()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(41, Register_Conditional_48_Conditional_16_Conditional_41_Template, 2, 1, "p", 78);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    let tmp_18_0;
    let tmp_23_0;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(5);
    i0.ɵɵclassProp("field__control--invalid", ctx_r2.form.controls.firstName.touched && ctx_r2.form.controls.firstName.invalid);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("invalid", ctx_r2.form.controls.firstName.touched && ctx_r2.form.controls.firstName.invalid);
    i0.ɵɵcontrol();
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.form.controls.firstName.touched && ctx_r2.form.controls.firstName.hasError("required") ? 8 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵclassProp("field__control--invalid", ctx_r2.form.controls.lastName.touched && ctx_r2.form.controls.lastName.invalid);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("invalid", ctx_r2.form.controls.lastName.touched && ctx_r2.form.controls.lastName.invalid);
    i0.ɵɵcontrol();
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.form.controls.lastName.touched && ctx_r2.form.controls.lastName.hasError("required") ? 15 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("options", ctx_r2.sexOptions)("fluid", true);
    i0.ɵɵcontrol();
    i0.ɵɵadvance(5);
    i0.ɵɵclassProp("field__control--invalid", ctx_r2.form.controls.email.touched && (ctx_r2.form.controls.email.hasError("required") || ctx_r2.form.controls.email.hasError("email") || ctx_r2.emailFieldState() === "taken"))("field__control--email-available", ctx_r2.emailFieldState() === "available")("field__control--email-checking", ctx_r2.emailFieldState() === "checking");
    i0.ɵɵadvance();
    i0.ɵɵconditional((tmp_18_0 = ctx_r2.emailFieldState()) === "checking" ? 25 : 26);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("invalid", ctx_r2.form.controls.email.touched && (ctx_r2.form.controls.email.invalid || ctx_r2.emailFieldState() === "taken"));
    i0.ɵɵattribute("aria-invalid", ctx_r2.form.controls.email.touched && (ctx_r2.form.controls.email.invalid || ctx_r2.emailFieldState() === "taken"))("aria-describedby", ctx_r2.form.controls.email.touched && ctx_r2.form.controls.email.invalid ? "email-error" : ctx_r2.emailFieldState() === "taken" ? "email-taken-error" : null);
    i0.ɵɵcontrol();
    i0.ɵɵadvance();
    i0.ɵɵconditional((tmp_23_0 = ctx_r2.emailFieldState()) === "available" ? 28 : tmp_23_0 === "taken" ? 29 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.form.controls.email.touched && (ctx_r2.form.controls.email.hasError("required") || ctx_r2.form.controls.email.hasError("email")) ? 30 : ctx_r2.emailFieldState() === "taken" ? 31 : -1);
    i0.ɵɵadvance(7);
    i0.ɵɵclassProp("auth-phone-group--invalid", !!ctx_r2.phoneFieldError());
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r2.rdcDial);
    i0.ɵɵadvance();
    i0.ɵɵproperty("invalid", !!ctx_r2.phoneFieldError())("value", ctx_r2.phoneLocalValue());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.phoneFieldError() ? 41 : -1);
} }
function Register_Conditional_48_Conditional_17_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 58);
    i0.ɵɵtext(1, "Nom requis (2 caract\u00E8res minimum).");
    i0.ɵɵelementEnd();
} }
function Register_Conditional_48_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 40)(1, "div", 53)(2, "label", 80);
    i0.ɵɵtext(3, "Nom de l\u2019\u00E9tablissement");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 55);
    i0.ɵɵelement(5, "i", 81);
    i0.ɵɵelementStart(6, "input", 82);
    i0.ɵɵcontrolCreate();
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(7, Register_Conditional_48_Conditional_17_Conditional_7_Template, 2, 0, "p", 58);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 53)(9, "label", 83);
    i0.ɵɵtext(10, "Type d\u2019activit\u00E9");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "div", 84);
    i0.ɵɵelement(12, "i", 85);
    i0.ɵɵelementStart(13, "div", 86)(14, "p-select", 87);
    i0.ɵɵcontrolCreate();
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵclassProp("field__control--invalid", ctx_r2.form.controls.tenantName.touched && ctx_r2.form.controls.tenantName.invalid);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("invalid", ctx_r2.form.controls.tenantName.touched && ctx_r2.form.controls.tenantName.invalid);
    i0.ɵɵcontrol();
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.form.controls.tenantName.touched && ctx_r2.form.controls.tenantName.invalid ? 7 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵclassProp("field__control--invalid", ctx_r2.form.controls.activityType.touched && ctx_r2.form.controls.activityType.invalid);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("options", ctx_r2.activityOptions);
    i0.ɵɵcontrol();
} }
function Register_Conditional_48_Conditional_18_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 58);
    i0.ɵɵtext(1, "Mot de passe trop court.");
    i0.ɵɵelementEnd();
} }
function Register_Conditional_48_Conditional_18_Conditional_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 58);
    i0.ɵɵtext(1, " Les mots de passe ne correspondent pas. ");
    i0.ɵɵelementEnd();
} }
function Register_Conditional_48_Conditional_18_Conditional_30_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 58);
    i0.ɵɵtext(1, "Acceptez les conditions pour continuer.");
    i0.ɵɵelementEnd();
} }
function Register_Conditional_48_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 40)(1, "div", 52)(2, "div", 53)(3, "label", 88);
    i0.ɵɵtext(4, "Mot de passe");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 55);
    i0.ɵɵelement(6, "i", 89);
    i0.ɵɵelementStart(7, "input", 90);
    i0.ɵɵcontrolCreate();
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "button", 91);
    i0.ɵɵlistener("click", function Register_Conditional_48_Conditional_18_Template_button_click_8_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.togglePassword()); });
    i0.ɵɵelement(9, "i", 92);
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(10, Register_Conditional_48_Conditional_18_Conditional_10_Template, 2, 0, "p", 58);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "div", 53)(12, "label", 93);
    i0.ɵɵtext(13, "Confirmation");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "div", 55);
    i0.ɵɵelement(15, "i", 89);
    i0.ɵɵelementStart(16, "input", 94);
    i0.ɵɵcontrolCreate();
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "button", 91);
    i0.ɵɵlistener("click", function Register_Conditional_48_Conditional_18_Template_button_click_17_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.toggleConfirmPassword()); });
    i0.ɵɵelement(18, "i", 92);
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(19, Register_Conditional_48_Conditional_18_Conditional_19_Template, 2, 0, "p", 58);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(20, "div", 95)(21, "p-checkbox", 96);
    i0.ɵɵcontrolCreate();
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "label", 97);
    i0.ɵɵtext(23, " J\u2019accepte les ");
    i0.ɵɵelementStart(24, "a", 98);
    i0.ɵɵlistener("click", function Register_Conditional_48_Conditional_18_Template_a_click_24_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(2); ctx_r2.persistDraftNow(); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵtext(25, "conditions d\u2019utilisation");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(26, " et la ");
    i0.ɵɵelementStart(27, "a", 98);
    i0.ɵɵlistener("click", function Register_Conditional_48_Conditional_18_Template_a_click_27_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(2); ctx_r2.persistDraftNow(); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵtext(28, "politique de confidentialit\u00E9");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(29, " de KubaGest. ");
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(30, Register_Conditional_48_Conditional_18_Conditional_30_Template, 2, 0, "p", 58);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(5);
    i0.ɵɵclassProp("field__control--invalid", ctx_r2.form.controls.password.touched && ctx_r2.form.controls.password.invalid);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("type", ctx_r2.showPassword() ? "text" : "password")("invalid", ctx_r2.form.controls.password.touched && ctx_r2.form.controls.password.invalid);
    i0.ɵɵcontrol();
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("fa-eye-slash", ctx_r2.showPassword())("fa-eye", !ctx_r2.showPassword());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.form.controls.password.touched && ctx_r2.form.controls.password.hasError("minlength") ? 10 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵclassProp("field__control--invalid", ctx_r2.form.controls.confirmPassword.touched && ctx_r2.form.controls.confirmPassword.invalid);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("type", ctx_r2.showConfirmPassword() ? "text" : "password")("invalid", ctx_r2.form.controls.confirmPassword.touched && ctx_r2.form.controls.confirmPassword.invalid);
    i0.ɵɵcontrol();
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("fa-eye-slash", ctx_r2.showConfirmPassword())("fa-eye", !ctx_r2.showConfirmPassword());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.form.controls.confirmPassword.touched && ctx_r2.form.controls.confirmPassword.hasError("mismatch") ? 19 : -1);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("register-terms--invalid", ctx_r2.form.controls.acceptTerms.touched && ctx_r2.form.controls.acceptTerms.invalid);
    i0.ɵɵadvance();
    i0.ɵɵproperty("binary", true);
    i0.ɵɵcontrol();
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("routerLink", ctx_r2.termsPath)("queryParams", i0.ɵɵpureFunction1(26, _c0, ctx_r2.registrationPath));
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("routerLink", ctx_r2.privacyPath)("queryParams", i0.ɵɵpureFunction1(28, _c0, ctx_r2.registrationPath));
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r2.form.controls.acceptTerms.touched && ctx_r2.form.controls.acceptTerms.invalid ? 30 : -1);
} }
function Register_Conditional_48_Conditional_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 41);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r2.registerError());
} }
function Register_Conditional_48_Conditional_27_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 99);
    i0.ɵɵlistener("click", function Register_Conditional_48_Conditional_27_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.goToStep(ctx_r2.currentStep() - 1)); });
    i0.ɵɵelement(1, "i", 23);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3, "Pr\u00E9c\u00E9dent");
    i0.ɵɵelementEnd()();
} }
function Register_Conditional_48_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "a", 48);
    i0.ɵɵtext(1, "Annuler");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("routerLink", ctx_r2.authPath);
} }
function Register_Conditional_48_Conditional_29_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 34);
    i0.ɵɵlistener("click", function Register_Conditional_48_Conditional_29_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r8); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.nextStep()); });
    i0.ɵɵelementStart(1, "span");
    i0.ɵɵtext(2, "Continuer");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(3, "i", 100);
    i0.ɵɵelementEnd();
} }
function Register_Conditional_48_Conditional_30_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 101);
} }
function Register_Conditional_48_Conditional_30_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 102);
} }
function Register_Conditional_48_Conditional_30_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "button", 50);
    i0.ɵɵconditionalCreate(1, Register_Conditional_48_Conditional_30_Conditional_1_Template, 1, 0, "i", 101)(2, Register_Conditional_48_Conditional_30_Conditional_2_Template, 1, 0, "i", 102);
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("disabled", ctx_r2.submitting());
    i0.ɵɵattribute("aria-busy", ctx_r2.submitting());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.submitting() ? 1 : 2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r2.submitting() ? "Cr\u00E9ation en cours\u2026" : "Cr\u00E9er mon espace");
} }
function Register_Conditional_48_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "header", 36)(1, "h2", 33);
    i0.ɵɵtext(2, "Cr\u00E9er votre ");
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4, "espace");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "p");
    i0.ɵɵtext(6, "Renseignez les informations ci-dessous pour activer KubaGest.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "p-stepper", 37)(8, "p-step-list")(9, "p-step", 38);
    i0.ɵɵtext(10, "Responsable");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "p-step", 38);
    i0.ɵɵtext(12, "\u00C9tablissement");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "p-step", 38);
    i0.ɵɵtext(14, "S\u00E9curit\u00E9");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(15, "form", 39);
    i0.ɵɵlistener("ngSubmit", function Register_Conditional_48_Template_form_ngSubmit_15_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.submit()); });
    i0.ɵɵconditionalCreate(16, Register_Conditional_48_Conditional_16_Template, 42, 28, "div", 40);
    i0.ɵɵconditionalCreate(17, Register_Conditional_48_Conditional_17_Template, 15, 7, "div", 40);
    i0.ɵɵconditionalCreate(18, Register_Conditional_48_Conditional_18_Template, 31, 30, "div", 40);
    i0.ɵɵconditionalCreate(19, Register_Conditional_48_Conditional_19_Template, 2, 1, "p", 41);
    i0.ɵɵelementStart(20, "div", 42)(21, "div", 43)(22, "p", 44);
    i0.ɵɵtext(23, " D\u00E9j\u00E0 un compte\u00A0? ");
    i0.ɵɵelementStart(24, "a", 45);
    i0.ɵɵtext(25, "Se connecter");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(26, "div", 46);
    i0.ɵɵconditionalCreate(27, Register_Conditional_48_Conditional_27_Template, 4, 0, "button", 47)(28, Register_Conditional_48_Conditional_28_Template, 2, 1, "a", 48);
    i0.ɵɵconditionalCreate(29, Register_Conditional_48_Conditional_29_Template, 4, 0, "button", 49)(30, Register_Conditional_48_Conditional_30_Template, 5, 4, "button", 50);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(31, "app-auth-legal-notice", 51);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("value", ctx_r2.currentStep())("linear", true);
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("register-step--complete", ctx_r2.currentStep() > 1);
    i0.ɵɵproperty("value", 1);
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("register-step--complete", ctx_r2.currentStep() > 2);
    i0.ɵɵproperty("value", 2);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("value", 3);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("formGroup", ctx_r2.form);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.currentStep() === 1 ? 16 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.currentStep() === 2 ? 17 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.currentStep() === 3 ? 18 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.registerError() ? 19 : -1);
    i0.ɵɵadvance(8);
    i0.ɵɵconditional(ctx_r2.currentStep() > 1 ? 27 : 28);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.currentStep() < 3 ? 29 : 30);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("saveDraft", ctx_r2.persistDraftNow);
} }
function confirmPassword(control) {
    const parent = control.parent;
    if (!parent)
        return null;
    const password = parent.get('password')?.value;
    if (control.value && password !== control.value) {
        return { mismatch: true };
    }
    return null;
}
export class Register {
    api = inject(ApiService);
    router = inject(Router);
    destroyRef = inject(DestroyRef);
    registerDraft = inject(RegisterDraftStore);
    showPassword = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "showPassword" }] : /* istanbul ignore next */ []));
    showConfirmPassword = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "showConfirmPassword" }] : /* istanbul ignore next */ []));
    submitting = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "submitting" }] : /* istanbul ignore next */ []));
    registerError = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "registerError" }] : /* istanbul ignore next */ []));
    registerSuccess = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "registerSuccess" }] : /* istanbul ignore next */ []));
    currentStep = signal(1, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "currentStep" }] : /* istanbul ignore next */ []));
    emailAvailability = signal('idle', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "emailAvailability" }] : /* istanbul ignore next */ []));
    emailLastChecked = signal('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "emailLastChecked" }] : /* istanbul ignore next */ []));
    authPath = AUTHENTICATION_PATH;
    forgotPasswordPath = FORGOT_PASSWORD_PATH;
    privacyPath = PRIVACY_POLICY_PATH;
    termsPath = TERMS_OF_USE_PATH;
    registrationPath = REGISTRATION_PATH;
    rdcDial = RDC_DIAL;
    localeOptions = [
        { label: 'FR', value: 'fr' },
        { label: 'EN', value: 'en' },
        { label: 'LN', value: 'ln' },
        { label: 'SW', value: 'sw' },
    ];
    activityOptions = [
        { label: 'Boutique', value: 'boutique' },
        { label: 'Alimentation', value: 'alimentation' },
        { label: 'Pharmacie', value: 'pharmacie' },
    ];
    sexOptions = [
        { label: 'Masculin', value: 'male' },
        { label: 'Féminin', value: 'female' },
    ];
    form = new FormGroup({
        firstName: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(80)],
        }),
        lastName: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(80)],
        }),
        sex: new FormControl('male', {
            nonNullable: true,
            validators: [Validators.required],
        }),
        tenantName: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(2), Validators.maxLength(150)],
        }),
        activityType: new FormControl('boutique', {
            nonNullable: true,
            validators: [Validators.required],
        }),
        email: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.email, Validators.maxLength(255)],
        }),
        phone: new FormControl('', {
            nonNullable: true,
            validators: [rdcPhoneValidator()],
        }),
        password: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(8), Validators.maxLength(72)],
        }),
        confirmPassword: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, confirmPassword],
        }),
        acceptTerms: new FormControl(false, {
            nonNullable: true,
            validators: [Validators.requiredTrue],
        }),
        locale: new FormControl('fr', { nonNullable: true }),
    });
    constructor() {
        this.restoreRegisterDraft();
        this.form.controls.password.valueChanges
            .pipe(takeUntilDestroyed())
            .subscribe(() => this.form.controls.confirmPassword.updateValueAndValidity());
        this.form.valueChanges
            .pipe(debounceTime(150), takeUntilDestroyed())
            .subscribe(() => this.persistRegisterDraft());
        effect(() => {
            this.currentStep();
            this.persistRegisterDraft();
        });
        this.destroyRef.onDestroy(() => this.persistRegisterDraft());
    }
    togglePassword() {
        this.showPassword.update((v) => !v);
    }
    toggleConfirmPassword() {
        this.showConfirmPassword.update((v) => !v);
    }
    goToStep(step) {
        this.currentStep.set(step);
        this.registerError.set(null);
        this.persistRegisterDraft();
    }
    /** Sauvegarde avant navigation (ex. pages légales). */
    persistDraftNow() {
        this.persistRegisterDraft();
    }
    nextStep() {
        const controls = this.currentStep() === 1
            ? [
                this.form.controls.firstName,
                this.form.controls.lastName,
                this.form.controls.sex,
                this.form.controls.email,
                this.form.controls.phone,
            ]
            : [this.form.controls.tenantName, this.form.controls.activityType];
        controls.forEach((control) => {
            control.markAsTouched();
            control.updateValueAndValidity();
        });
        if (!controls.every((control) => control.valid)) {
            return;
        }
        if (this.currentStep() === 1) {
            const email = this.form.controls.email.value.trim();
            if (this.emailFieldState() === 'taken') {
                return;
            }
            if (this.emailFieldState() !== 'available' || email !== this.emailLastChecked()) {
                this.runEmailAvailabilityCheck(email, () => {
                    if (this.emailFieldState() === 'available') {
                        this.goToStep(2);
                    }
                });
                return;
            }
        }
        this.goToStep(this.currentStep() + 1);
    }
    onEmailInput() {
        const email = this.form.controls.email.value.trim();
        if (email !== this.emailLastChecked()) {
            this.emailAvailability.set('idle');
            this.clearEmailTakenError();
        }
    }
    phoneLocalValue() {
        return formatRdcPhoneLocalDisplay(this.form.getRawValue().phone);
    }
    phoneFieldError() {
        const control = this.form.controls.phone;
        if (!control.touched && !control.dirty) {
            return null;
        }
        return rdcPhoneErrorMessage(control.errors);
    }
    onPhoneInput(event) {
        const input = event.target;
        const beforeCaret = input.value.slice(0, input.selectionStart ?? input.value.length);
        const value = rdcPhoneValueFromInput(input.value);
        this.form.controls.phone.setValue(value, { emitEvent: true });
        this.form.controls.phone.markAsDirty();
        input.value = this.phoneLocalValue();
        const digitsBeforeCaret = (beforeCaret.match(/\d/g) ?? []).length;
        let position = 0;
        let count = 0;
        while (position < input.value.length && count < digitsBeforeCaret) {
            if (/\d/.test(input.value[position])) {
                count++;
            }
            position++;
        }
        input.setSelectionRange(position, position);
    }
    onPhoneBlur() {
        this.form.controls.phone.markAsTouched();
    }
    onEmailBlur() {
        const control = this.form.controls.email;
        control.markAsTouched();
        const email = control.value.trim();
        if (!email) {
            this.emailAvailability.set('idle');
            return;
        }
        if (control.hasError('required') || control.hasError('email')) {
            this.emailAvailability.set('idle');
            return;
        }
        if (email === this.emailLastChecked() && this.emailAvailability() !== 'idle') {
            return;
        }
        this.runEmailAvailabilityCheck(email);
    }
    submit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        if (this.emailAvailability() === 'checking') {
            return;
        }
        if (this.emailAvailability() === 'taken' || this.form.controls.email.hasError('emailTaken')) {
            return;
        }
        const email = this.form.controls.email.value.trim();
        if (this.emailAvailability() !== 'available' || email !== this.emailLastChecked()) {
            this.runEmailAvailabilityCheck(email, () => {
                if (this.emailAvailability() === 'available') {
                    this.submit();
                }
            });
            return;
        }
        if (this.submitting())
            return;
        this.registerError.set(null);
        this.registerSuccess.set(false);
        this.submitting.set(true);
        const raw = this.form.getRawValue();
        const payload = {
            firstName: raw.firstName.trim(),
            lastName: raw.lastName.trim(),
            sex: raw.sex,
            tenantName: raw.tenantName.trim(),
            activityType: raw.activityType,
            email: raw.email.trim(),
            password: raw.password,
            currency: 'CDF',
        };
        const normalizedPhone = formatTelephoneWithCountryCode(raw.phone);
        if (normalizedPhone) {
            payload.phone = normalizedPhone;
        }
        this.api
            .register(payload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: () => {
                this.submitting.set(false);
                this.registerSuccess.set(true);
                this.registerDraft.clear();
            },
            error: (err) => {
                this.submitting.set(false);
                this.registerError.set(this.readRegisterError(err));
            },
        });
    }
    goToLogin() {
        void this.router.navigate([AUTHENTICATION_PATH]);
    }
    emailFieldState() {
        const control = this.form.controls.email;
        if (this.emailAvailability() === 'checking') {
            return 'checking';
        }
        if (this.emailAvailability() === 'taken' ||
            control.hasError('emailTaken')) {
            return 'taken';
        }
        if (this.emailAvailability() === 'available') {
            return 'available';
        }
        return 'idle';
    }
    runEmailAvailabilityCheck(email, after) {
        this.emailAvailability.set('checking');
        this.clearEmailTakenError();
        this.api
            .checkRegistrationEmail(email)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (res) => {
                this.emailLastChecked.set(email);
                this.emailAvailability.set(res.available ? 'available' : 'taken');
                const control = this.form.controls.email;
                if (!res.available) {
                    control.setErrors({ ...(control.errors ?? {}), emailTaken: true });
                }
                else {
                    this.clearEmailTakenError();
                }
                after?.();
            },
            error: () => {
                this.emailAvailability.set('idle');
                after?.();
            },
        });
    }
    clearEmailTakenError() {
        const control = this.form.controls.email;
        if (!control.errors?.['emailTaken']) {
            return;
        }
        const { emailTaken: _removed, ...rest } = control.errors;
        control.setErrors(Object.keys(rest).length ? rest : null);
    }
    persistRegisterDraft() {
        if (this.registerSuccess()) {
            return;
        }
        this.registerDraft.save({
            step: this.currentStep(),
            form: this.form.getRawValue(),
            emailAvailability: this.emailAvailability(),
            emailLastChecked: this.emailLastChecked(),
        });
    }
    restoreRegisterDraft() {
        const draft = this.registerDraft.load();
        if (!draft) {
            return;
        }
        this.form.patchValue(draft.form);
        if (!draft.form.sex) {
            this.form.controls.sex.setValue('male');
        }
        this.currentStep.set(Math.min(3, Math.max(1, draft.step)));
        this.emailAvailability.set(draft.emailAvailability);
        this.emailLastChecked.set(draft.emailLastChecked);
    }
    readRegisterError(err) {
        if (!(err instanceof HttpErrorResponse)) {
            return 'Impossible de créer votre espace. Réessayez plus tard.';
        }
        if (err.status === 0) {
            return 'Serveur inaccessible. Vérifiez que l’API est démarrée.';
        }
        const body = err.error;
        if (typeof body === 'object' && body !== null && 'message' in body) {
            const message = body.message;
            if (typeof message === 'string') {
                return message;
            }
            if (Array.isArray(message) && message.length > 0) {
                return message.map(String).join(' ');
            }
        }
        if (err.status === 409) {
            return 'Un compte ou un établissement existe déjà avec ces informations.';
        }
        return 'Impossible de créer votre espace. Vérifiez les champs et réessayez.';
    }
    static ɵfac = function Register_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || Register)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: Register, selectors: [["app-register"]], decls: 49, vars: 3, consts: [["selectedItem", ""], ["dropdownicon", ""], ["id", "content", "tabindex", "-1", 1, "register-page"], [1, "register-stage"], ["aria-labelledby", "register-hero-title", 1, "register-hero"], ["src", "assets/kuba-textile-pattern.png", "alt", "", "aria-hidden", "true", 1, "register-hero__kuba-pattern"], ["aria-hidden", "true", 1, "register-hero__glow"], ["viewBox", "0 0 400 800", "preserveAspectRatio", "none", "aria-hidden", "true", 1, "register-hero__wave"], ["fill", "rgb(255 255 255 / 0.06)", "d", "M0,520 C90,420 140,580 260,480 S360,380 400,420 L400,800 L0,800 Z"], ["routerLink", "/authentification", "aria-label", "KubaGest", 1, "brand", "register-hero__brand"], ["aria-hidden", "true", 1, "brand__mark"], [1, "register-hero__body"], [1, "register-hero__eyebrow"], ["id", "register-hero-title"], [1, "register-hero__lead"], [1, "register-hero__features"], ["aria-hidden", "true", 1, "fa-solid", "fa-cart-shopping"], ["aria-hidden", "true", 1, "fa-solid", "fa-boxes-stacked"], ["aria-hidden", "true", 1, "fa-solid", "fa-truck"], ["aria-hidden", "true", 1, "fa-solid", "fa-chart-column"], ["aria-labelledby", "register-form-title", 1, "register-workspace"], [1, "register-workspace__bar"], ["routerLink", "/authentification", 1, "register-workspace__back"], ["aria-hidden", "true", 1, "fa-solid", "fa-arrow-left"], [1, "language"], ["inputId", "register-locale", "size", "small", "optionLabel", "label", "optionValue", "value", "styleClass", "language-select", "panelStyleClass", "language-select-panel", "appendTo", "body", "ariaLabel", "Langue de l\u2019interface", 3, "options", "formControl"], [1, "register-card"], [1, "register-card__success"], [1, "language__trigger"], ["aria-hidden", "true", 1, "fa-solid", "fa-globe"], ["aria-hidden", "true", 1, "fa-solid", "fa-chevron-down", "language__chevron"], ["aria-hidden", "true", 1, "register-card__success-icon"], [1, "fa-solid", "fa-circle-check"], ["id", "register-form-title"], ["type", "button", 1, "submit-button", 3, "click"], ["aria-hidden", "true", 1, "fa-solid", "fa-right-to-bracket"], [1, "register-card__head"], [1, "register-stepper", 3, "value", "linear"], [3, "value"], ["novalidate", "", 1, "register-form", 3, "ngSubmit", "formGroup"], [1, "register-form__section"], ["role", "alert", 1, "form-error"], [1, "register-form__footer"], [1, "register-form__footer-toolbar"], [1, "signup"], ["routerLink", "/authentification"], [1, "register-form__actions"], ["type", "button", 1, "wizard-button"], [1, "wizard-button", 3, "routerLink"], ["type", "button", 1, "submit-button"], ["type", "submit", 1, "submit-button", 3, "disabled"], [3, "saveDraft"], [1, "register-form__grid", "register-form__grid--2"], [1, "field"], ["for", "firstName"], [1, "field__control"], ["aria-hidden", "true", 1, "fa-solid", "fa-user"], ["pInputText", "", "fluid", "", "id", "firstName", "type", "text", "formControlName", "firstName", "autocomplete", "given-name", "placeholder", "Pr\u00E9nom", 3, "invalid"], ["role", "alert", 1, "field__error"], ["for", "lastName"], ["pInputText", "", "fluid", "", "id", "lastName", "type", "text", "formControlName", "lastName", "autocomplete", "family-name", "placeholder", "Nom", 3, "invalid"], [1, "field", "field--sex"], ["for", "register-sex"], ["inputId", "register-sex", "formControlName", "sex", "optionLabel", "label", "optionValue", "value", "appendTo", "body", "ariaLabel", "Sexe", "styleClass", "register-sex-select", "panelStyleClass", "register-select-panel", 3, "options", "fluid"], [1, "field", "field--email-availability"], ["for", "email"], ["aria-hidden", "true", 1, "fa-regular", "fa-spinner", "field__lead-icon", "field__lead-icon--spin"], ["aria-hidden", "true", 1, "fa-solid", "fa-envelope", "field__lead-icon"], ["pInputText", "", "fluid", "", "id", "email", "type", "email", "formControlName", "email", "autocomplete", "email", "inputmode", "email", "placeholder", "Adresse e-mail", 3, "blur", "input", "invalid"], ["aria-hidden", "true", 1, "fa-solid", "fa-circle-check", "field__trail-icon", "field__trail-icon--ok"], ["aria-hidden", "true", 1, "fa-solid", "fa-circle-exclamation", "field__trail-icon", "field__trail-icon--error"], ["id", "email-error", "role", "alert", 1, "field__error"], ["id", "email-taken-error", "role", "alert", 1, "field__error", "field__error--actions"], ["for", "register-phone"], [1, "register-optional"], [1, "auth-phone-group"], ["id", "register-phone-dial"], ["pInputText", "", "fluid", "", "id", "register-phone", "type", "tel", "inputmode", "tel", "autocomplete", "tel", "placeholder", "Ex. 812 345 678", "aria-describedby", "register-phone-dial", 3, "input", "blur", "invalid", "value"], ["role", "alert", 1, "field__error", "field__error--phone"], [3, "routerLink"], ["for", "tenantName"], ["aria-hidden", "true", 1, "fa-solid", "fa-store"], ["pInputText", "", "fluid", "", "id", "tenantName", "type", "text", "formControlName", "tenantName", "autocomplete", "organization", "placeholder", "Ex. Boutique Kintambo", 3, "invalid"], ["for", "activityType"], [1, "field__control", "field__control--select"], ["aria-hidden", "true", 1, "fa-solid", "fa-briefcase"], [1, "field__select"], ["inputId", "activityType", "ariaLabel", "Type d\u2019activit\u00E9", "formControlName", "activityType", "optionLabel", "label", "optionValue", "value", "styleClass", "register-activity-select", "panelStyleClass", "language-select-panel", "appendTo", "body", "placeholder", "Choisir une activit\u00E9", 3, "options"], ["for", "register-password"], ["aria-hidden", "true", 1, "fa-solid", "fa-lock"], ["pInputText", "", "fluid", "", "id", "register-password", "formControlName", "password", "autocomplete", "new-password", "placeholder", "8 caract\u00E8res min.", 3, "type", "invalid"], ["type", "button", 1, "field__toggle", 3, "click"], ["aria-hidden", "true", 1, "fa-solid"], ["for", "confirmPassword"], ["pInputText", "", "fluid", "", "id", "confirmPassword", "formControlName", "confirmPassword", "autocomplete", "new-password", "placeholder", "R\u00E9p\u00E9tez le mot de passe", 3, "type", "invalid"], [1, "remember", "register-terms"], ["formControlName", "acceptTerms", "inputId", "register-accept-terms", 3, "binary"], ["for", "register-accept-terms"], [3, "click", "routerLink", "queryParams"], ["type", "button", 1, "wizard-button", 3, "click"], ["aria-hidden", "true", 1, "fa-solid", "fa-arrow-right"], ["aria-hidden", "true", 1, "fa-regular", "fa-spinner", "submit-button__icon--spin"], ["aria-hidden", "true", 1, "fa-solid", "fa-user-plus"]], template: function Register_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "main", 2)(1, "div", 3)(2, "aside", 4);
            i0.ɵɵelement(3, "img", 5)(4, "div", 6);
            i0.ɵɵnamespaceSVG();
            i0.ɵɵelementStart(5, "svg", 7);
            i0.ɵɵelement(6, "path", 8);
            i0.ɵɵelementEnd();
            i0.ɵɵnamespaceHTML();
            i0.ɵɵelementStart(7, "a", 9)(8, "span", 10);
            i0.ɵɵtext(9, "K");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "span")(11, "strong");
            i0.ɵɵtext(12, "KubaGest");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "small");
            i0.ɵɵtext(14, "Gestion commerciale int\u00E9gr\u00E9e");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(15, "div", 11)(16, "p", 12);
            i0.ɵɵtext(17, "Activation d\u2019espace");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "h1", 13);
            i0.ɵɵtext(19, "Lancez votre point de vente sur une base solide");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "p", 14);
            i0.ɵɵtext(21, " Un seul formulaire pour cr\u00E9er l\u2019\u00E9tablissement, le compte propri\u00E9taire et les param\u00E8tres essentiels (activit\u00E9, devise CDF). ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "ul", 15)(23, "li");
            i0.ɵɵelement(24, "i", 16);
            i0.ɵɵtext(25, " Ventes & encaissement ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(26, "li");
            i0.ɵɵelement(27, "i", 17);
            i0.ɵɵtext(28, " Stocks multi-d\u00E9p\u00F4ts");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(29, "li");
            i0.ɵɵelement(30, "i", 18);
            i0.ɵɵtext(31, " Achats fournisseurs");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(32, "li");
            i0.ɵɵelement(33, "i", 19);
            i0.ɵɵtext(34, " Rapports en temps r\u00E9el ");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(35, "section", 20)(36, "header", 21)(37, "a", 22);
            i0.ɵɵelement(38, "i", 23);
            i0.ɵɵtext(39, " Retour \u00E0 la connexion ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(40, "div", 24)(41, "p-select", 25);
            i0.ɵɵcontrolCreate();
            i0.ɵɵtemplate(42, Register_ng_template_42_Template, 4, 1, "ng-template", null, 0, i0.ɵɵtemplateRefExtractor)(44, Register_ng_template_44_Template, 1, 0, "ng-template", null, 1, i0.ɵɵtemplateRefExtractor);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(46, "article", 26);
            i0.ɵɵconditionalCreate(47, Register_Conditional_47_Template, 11, 0, "div", 27)(48, Register_Conditional_48_Template, 32, 17);
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(41);
            i0.ɵɵproperty("options", ctx.localeOptions)("formControl", ctx.form.controls.locale);
            i0.ɵɵcontrol();
            i0.ɵɵadvance(6);
            i0.ɵɵconditional(ctx.registerSuccess() ? 47 : 48);
        } }, dependencies: [RouterLink,
            ReactiveFormsModule, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormControlDirective, i1.FormGroupDirective, i1.FormControlName, Select,
            Stepper,
            StepList,
            Step,
            AuthLegalNotice, i2.InputText, i3.InputGroup, i4.InputGroupAddon, i5.Checkbox], styles: ["[_nghost-%COMP%] {\n  display: block;\n  min-height: 100dvh;\n}\n\n.login-page[_ngcontent-%COMP%] {\n  min-height: 100dvh;\n  background: #f8fafc;\n  color: #102033;\n}\n\n.login-stage[_ngcontent-%COMP%] {\n  min-height: 100dvh;\n}\n\n.login-visual[_ngcontent-%COMP%] {\n  display: none;\n}\n\n.hero__photo[_ngcontent-%COMP%], \n.hero__shade[_ngcontent-%COMP%], \n.hero__shape[_ngcontent-%COMP%], \n.hero__curve[_ngcontent-%COMP%] {\n  position: absolute;\n  pointer-events: none;\n}\n\n.hero__photo[_ngcontent-%COMP%] {\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  object-position: 24% 52%;\n}\n\n.hero__shade[_ngcontent-%COMP%] {\n  inset: 0;\n  background: linear-gradient(\n    180deg,\n    rgb(15 23 42 / 0.06) 0%,\n    transparent 42%,\n    rgb(37 99 235 / 0.07) 100%\n  );\n}\n\n.hero__shape[_ngcontent-%COMP%] {\n  z-index: 1;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  height: 52%;\n  width: 100%;\n}\n\n.hero__curve[_ngcontent-%COMP%] {\n  top: 0;\n  right: 0;\n  z-index: 2;\n  height: 100%;\n  width: min(44%, 31rem);\n}\n\n.hero__content[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 4;\n  display: flex;\n  height: 100%;\n  flex-direction: column;\n  justify-content: space-between;\n  padding: clamp(1.5rem, 3vw, 2.5rem);\n}\n\n.brand--desktop[_ngcontent-%COMP%] {\n  display: none;\n}\n\n.hero__pitch[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0 0 1.25rem;\n  max-width: 22rem;\n  color: white;\n  font-size: clamp(1.35rem, 2.2vw, 1.85rem);\n  font-weight: 700;\n  line-height: 1.25;\n  letter-spacing: -0.02em;\n  text-shadow: 0 2px 12px rgb(0 0 0 / 25%);\n}\n\n.hero__features[_ngcontent-%COMP%] {\n  display: grid;\n  max-width: 24rem;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 0.5rem;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n\n.hero__feature[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.4rem;\n  border: 1.5px solid rgb(255 255 255 / 0.45);\n  border-radius: 0.9rem;\n  background: rgb(255 255 255 / 0.12);\n  padding: 0.65rem 0.35rem 0.55rem;\n  color: white;\n  font-size: 0.68rem;\n  font-weight: 650;\n  line-height: 1.2;\n  text-align: center;\n}\n\n.hero__feature[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1.15rem;\n}\n\n.brand[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.75rem;\n  color: #102033;\n  text-decoration: none;\n}\n\n.brand__mark[_ngcontent-%COMP%] {\n  display: grid;\n  width: 3rem;\n  height: 3rem;\n  place-items: center;\n  border-radius: 0.875rem;\n  background: var(--%NS%color-primary);\n  color: white;\n  font-size: 1.55rem;\n  font-weight: 800;\n}\n\n.brand[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.brand[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n}\n\n.brand[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  line-height: 1.2;\n}\n\n.brand[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  margin-top: 0.125rem;\n  color: #64748b;\n  font-size: 0.68rem;\n}\n\n.auth-panel[_ngcontent-%COMP%] {\n  display: flex;\n  min-height: 100dvh;\n  flex-direction: column;\n  padding: 1rem 1.25rem;\n}\n\n.auth-panel__header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n}\n\n.language[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n}\n\n.language__trigger[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.45rem;\n  color: #102033;\n  font-size: 0.9rem;\n  font-weight: 700;\n}\n\n.language__chevron[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  color: #475569;\n}\n\n[_nghost-%COMP%]     .language-select.p-select {\n  display: flex;\n  align-items: center;\n  height: 2rem;\n  min-height: 0;\n  border: 1px solid #cbd5e1;\n  border-radius: 5px;\n  background: #fff;\n  box-shadow: none;\n}\n\n[_nghost-%COMP%]     .language-select.p-select:not(.p-disabled):hover {\n  border-color: #94a3b8;\n}\n\n[_nghost-%COMP%]     .language-select.p-select.p-focus {\n  border-color: var(--%NS%color-primary);\n  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.12);\n}\n\n[_nghost-%COMP%]     .language-select .p-select-label {\n  display: flex;\n  align-items: center;\n  padding: 0 0.15rem 0 0.65rem;\n  line-height: 1;\n}\n\n[_nghost-%COMP%]     .language-select .p-select-dropdown {\n  width: 2rem;\n  color: #475569;\n}\n\n[_nghost-%COMP%]     .language-select-panel.p-select-overlay {\n  overflow: hidden;\n  border: 1px solid #e2e8f0;\n  border-radius: 0.85rem;\n  box-shadow: 0 14px 32px rgb(15 23 42 / 0.12);\n  min-width: 7.25rem;\n}\n\n[_nghost-%COMP%]     .language-select-panel .p-select-option {\n  padding: 0.55rem 0.85rem;\n  font-size: 0.88rem;\n  font-weight: 600;\n}\n\n[_nghost-%COMP%]     .language-select-panel .p-select-option.p-select-option-selected {\n  background: var(--%NS%color-primary-fixed);\n  color: var(--%NS%color-primary);\n}\n\n.auth-card[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 34rem;\n  margin: auto;\n  padding: 2.25rem 0;\n}\n\n.auth-card__intro[_ngcontent-%COMP%] {\n  margin-bottom: 2rem;\n}\n\n.auth-card[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: clamp(1.75rem, 7vw, 2.5rem);\n  line-height: 1.15;\n  letter-spacing: -0.04em;\n}\n\n.auth-card[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \na[_ngcontent-%COMP%] {\n  color: var(--%NS%color-primary);\n}\n\n.auth-card__intro[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  max-width: 29rem;\n  margin: 0.75rem 0 0;\n  color: #64748b;\n  font-size: 1rem;\n  line-height: 1.6;\n}\n\n.field[_ngcontent-%COMP%]    + .field[_ngcontent-%COMP%] {\n  margin-top: 1.15rem;\n}\n\n.field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  margin-bottom: 0.45rem;\n  font-size: 0.875rem;\n  font-weight: 650;\n}\n\n.field__control[_ngcontent-%COMP%] {\n  display: flex;\n  min-height: 3.5rem;\n  align-items: center;\n  gap: 0.75rem;\n  border: 1px solid #cbd5e1;\n  border-radius: 0.75rem;\n  background: white;\n  padding: 0 0.9rem;\n  color: var(--%NS%color-primary);\n  transition:\n    border-color 0.18s,\n    box-shadow 0.18s;\n}\n\n.field__control[_ngcontent-%COMP%]:focus-within {\n  border-color: var(--%NS%color-primary);\n  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.13);\n}\n\n.field__control--invalid[_ngcontent-%COMP%] {\n  border-color: #dc2626;\n}\n\n.field__control[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  min-width: 0;\n  flex: 1;\n  border: 0;\n  outline: 0;\n  color: #102033;\n  background: transparent;\n}\n\n.field__control[_ngcontent-%COMP%]   input.p-inputtext[_ngcontent-%COMP%] {\n  box-shadow: none;\n  border-radius: 0;\n  padding: 0;\n  min-height: auto;\n}\n\n.field__control[_ngcontent-%COMP%]   input.p-inputtext[_ngcontent-%COMP%]:enabled:focus {\n  box-shadow: none;\n}\n\n.field__control[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]::placeholder, \n.field__control[_ngcontent-%COMP%]   input.p-inputtext[_ngcontent-%COMP%]::placeholder {\n  color: #94a3b8;\n}\n\n[_nghost-%COMP%]     .auth-phone-group.p-inputgroup {\n  display: flex;\n  width: 100%;\n  min-height: 3.5rem;\n  align-items: stretch;\n  border: 1px solid #cbd5e1;\n  border-radius: 0.75rem;\n  overflow: hidden;\n  background: white;\n  transition:\n    border-color 0.18s,\n    box-shadow 0.18s;\n}\n\n[_nghost-%COMP%]     .auth-phone-group.p-inputgroup:has(input:focus) {\n  border-color: var(--%NS%color-primary);\n  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.13);\n}\n\n[_nghost-%COMP%]     .auth-phone-group--invalid.p-inputgroup {\n  border-color: #dc2626;\n}\n\n[_nghost-%COMP%]     .auth-phone-group .p-inputgroupaddon {\n  display: flex;\n  align-items: center;\n  align-self: stretch;\n  border: 0;\n  border-right: 1px solid #cbd5e1;\n  background: #f1f5f9;\n  padding: 0 0.85rem;\n  color: #40516a;\n  font-size: 0.9rem;\n  font-weight: 700;\n}\n\n[_nghost-%COMP%]     .auth-phone-group input.p-inputtext {\n  min-width: 0;\n  flex: 1;\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n  min-height: 0;\n  padding: 0 0.9rem;\n}\n\n.field__toggle[_ngcontent-%COMP%] {\n  display: grid;\n  width: 2.5rem;\n  height: 2.5rem;\n  place-items: center;\n  border: 0;\n  border-radius: 0.5rem;\n  background: transparent;\n  color: #475569;\n  cursor: pointer;\n}\n\n.field__toggle[_ngcontent-%COMP%]:hover {\n  background: var(--%NS%color-primary-fixed);\n  color: var(--%NS%color-primary);\n}\n\n.form-notice[_ngcontent-%COMP%] {\n  margin: 0 0 1rem;\n  padding: 0.75rem 0.9rem;\n  border-radius: 0.6rem;\n  border: 1px solid #bfdbfe;\n  background: #eff6ff;\n  color: #1e40af;\n  font-size: 0.85rem;\n  line-height: 1.4;\n}\n\n.field__error[_ngcontent-%COMP%] {\n  margin: 0.35rem 0 0;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  color: #b91c1c;\n  font-size: 0.85rem;\n  font-weight: 600;\n  line-height: 1.4;\n}\n\n.form-error[_ngcontent-%COMP%] {\n  margin: 0 0 1rem;\n  color: #b91c1c;\n  font-size: 0.85rem;\n  line-height: 1.4;\n}\n\n.form-error--banner[_ngcontent-%COMP%] {\n  border-radius: 0.6rem;\n  background: #fef2f2;\n  border: 1px solid #fecaca;\n  padding: 0.75rem 0.9rem;\n}\n\n.form-options[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  margin: 1.25rem 0;\n  font-size: 0.85rem;\n}\n\n.form-options[_ngcontent-%COMP%]   a[_ngcontent-%COMP%], \n.signup[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  font-weight: 700;\n  text-decoration: none;\n}\n\n.form-options[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover, \n.signup[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n\n.register-terms[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: var(--%NS%color-primary);\n  font-weight: 650;\n  text-underline-offset: 2px;\n}\n\n.register-terms[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n\n.remember[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.55rem;\n  color: #475569;\n  cursor: pointer;\n}\n\n[_nghost-%COMP%]     .remember .p-checkbox .p-checkbox-box {\n  border-color: #cbd5e1;\n}\n\n[_nghost-%COMP%]     .remember .p-checkbox.p-checkbox-checked .p-checkbox-box {\n  border-color: var(--%NS%color-primary);\n  background: var(--%NS%color-primary);\n}\n\n.submit-button[_ngcontent-%COMP%], \n.code-button[_ngcontent-%COMP%] {\n  display: flex;\n  width: 100%;\n  min-height: 3.5rem;\n  align-items: center;\n  justify-content: center;\n  gap: 0.65rem;\n  border-radius: 0.75rem;\n  font-weight: 750;\n  transition:\n    transform 0.15s,\n    background 0.15s,\n    box-shadow 0.15s;\n}\n\n.submit-button[_ngcontent-%COMP%] {\n  border: 0;\n  background: var(--%NS%color-primary);\n  color: white;\n  box-shadow: 0 2px 8px rgb(37 99 235 / 0.12);\n  cursor: pointer;\n}\n\n.submit-button[_ngcontent-%COMP%]:not(:disabled):hover {\n  background: var(--%NS%color-primary-container);\n  box-shadow: 0 3px 10px rgb(37 99 235 / 0.14);\n}\n\n.submit-button[_ngcontent-%COMP%]:disabled {\n  cursor: not-allowed;\n  opacity: 0.55;\n  box-shadow: none;\n}\n\n@keyframes _ngcontent-%COMP%_submit-button-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n.submit-button__icon[_ngcontent-%COMP%] {\n  width: 1rem;\n  text-align: center;\n}\n\n.submit-button__icon--spin[_ngcontent-%COMP%] {\n  display: inline-block;\n  animation: _ngcontent-%COMP%_submit-button-spin 0.75s linear infinite;\n}\n\n.separator[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  margin: 1.45rem 0;\n  color: #64748b;\n  font-size: 0.85rem;\n  font-weight: 600;\n}\n\n.separator[_ngcontent-%COMP%]::before, \n.separator[_ngcontent-%COMP%]::after {\n  height: 1px;\n  flex: 1;\n  background: #e2e8f0;\n  content: '';\n}\n\n.code-button[_ngcontent-%COMP%] {\n  border: 1px solid #93c5fd;\n  background: white;\n  color: var(--%NS%color-primary);\n}\n\n.code-button[_ngcontent-%COMP%]:disabled {\n  cursor: not-allowed;\n  opacity: 0.68;\n}\n\n.signup[_ngcontent-%COMP%] {\n  margin: 1.75rem 0 0;\n  text-align: center;\n  color: #64748b;\n  font-size: 0.9rem;\n}\n\n.auth-panel__footer[_ngcontent-%COMP%] {\n  text-align: center;\n  color: #64748b;\n  font-size: 0.72rem;\n}\n\n.auth-panel__footer[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.35rem 0;\n}\n\n.auth-panel__footer[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 0;\n  background: transparent;\n  color: #64748b;\n  text-decoration: underline;\n  cursor: pointer;\n}\n\n.status-success[_ngcontent-%COMP%] {\n  color: var(--%NS%color-primary);\n  font-weight: 700;\n}\n\n@media (min-width: 1024px) {\n  [_nghost-%COMP%]:has(.login-page), \n   .login-page[_ngcontent-%COMP%], \n   .login-stage[_ngcontent-%COMP%] {\n    height: 100dvh;\n    overflow: hidden;\n  }\n\n  .login-stage[_ngcontent-%COMP%] {\n    position: relative;\n  }\n\n  \n  .login-visual[_ngcontent-%COMP%] {\n    position: absolute;\n    inset: 0;\n    z-index: 0;\n    display: block;\n    overflow: hidden;\n    background: #f8fafc;\n  }\n\n  .hero__photo[_ngcontent-%COMP%] {\n    top: -1.5%;\n    left: -2%;\n    width: 106%;\n    height: 106%;\n    max-width: none;\n    object-fit: cover;\n    object-position: 27% 60%;\n    transform: none;\n  }\n\n  .hero__content[_ngcontent-%COMP%] {\n    max-width: min(48vw, 34rem);\n  }\n\n  .brand--desktop[_ngcontent-%COMP%] {\n    display: inline-flex;\n    color: #102033;\n  }\n\n  .brand--desktop[_ngcontent-%COMP%]   .brand__mark[_ngcontent-%COMP%] {\n    box-shadow: 0 8px 20px rgb(37 99 235 / 0.25);\n  }\n\n  .brand--mobile[_ngcontent-%COMP%] {\n    display: none;\n  }\n\n  .auth-panel[_ngcontent-%COMP%] {\n    position: relative;\n    z-index: 2;\n    display: flex;\n    min-height: 100dvh;\n    flex-direction: column;\n    justify-content: center;\n    padding: clamp(4rem, 10vh, 5rem) clamp(1.5rem, 4vw, 3.25rem) clamp(1rem, 2vh, 1.5rem);\n    background: transparent;\n  }\n\n  .auth-panel__header[_ngcontent-%COMP%] {\n    position: absolute;\n    z-index: 3;\n    top: clamp(1rem, 3vh, 2rem);\n    right: clamp(1.25rem, 2.5vw, 2.25rem);\n    justify-content: flex-end;\n  }\n\n  .auth-card[_ngcontent-%COMP%] {\n    position: relative;\n    z-index: 4;\n    display: flex;\n    width: min(100%, 31.5rem);\n    max-width: none;\n    min-height: unset;\n    flex-direction: column;\n    margin: 0 0 0 auto;\n    padding: clamp(1.85rem, 3vh, 2.45rem);\n    transform: translateX(clamp(-2.5rem, -4vw, -1.25rem));\n    border: 1px solid rgb(226 232 240 / 0.85);\n    border-radius: 1rem;\n    background: #fff;\n    box-shadow: 0 1.1rem 2.75rem rgb(15 73 57 / 0.12);\n  }\n\n  .auth-card[_ngcontent-%COMP%]   form[_ngcontent-%COMP%] {\n    display: flex;\n    min-height: 0;\n    flex: 1;\n    flex-direction: column;\n  }\n\n  .auth-card__intro[_ngcontent-%COMP%] {\n    margin-bottom: clamp(1.25rem, 2.8vh, 2rem);\n  }\n\n  .auth-card[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: clamp(1.8rem, 2.2vw, 2.45rem);\n  }\n\n  .auth-card__intro[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    margin-top: 0.5rem;\n    font-size: clamp(0.85rem, 1vw, 1rem);\n    line-height: 1.45;\n  }\n\n  .field[_ngcontent-%COMP%]    > label[_ngcontent-%COMP%] {\n    position: absolute;\n    width: 1px;\n    height: 1px;\n    overflow: hidden;\n    clip: rect(0, 0, 0, 0);\n    white-space: nowrap;\n  }\n\n  .field[_ngcontent-%COMP%]    + .field[_ngcontent-%COMP%] {\n    margin-top: clamp(0.75rem, 1.8vh, 1.15rem);\n  }\n\n  .field__control[_ngcontent-%COMP%] {\n    min-height: clamp(2.9rem, 6.2vh, 3.5rem);\n  }\n\n  [_nghost-%COMP%]     .auth-phone-group.p-inputgroup {\n    min-height: clamp(2.9rem, 6.2vh, 3.5rem);\n  }\n\n  .field__error[_ngcontent-%COMP%] {\n    margin-top: 0.25rem;\n  }\n\n  .form-options[_ngcontent-%COMP%] {\n    margin: clamp(0.8rem, 2vh, 1.25rem) 0;\n  }\n\n  .submit-button[_ngcontent-%COMP%], \n   .code-button[_ngcontent-%COMP%] {\n    min-height: clamp(2.9rem, 6.2vh, 3.5rem);\n  }\n\n  .separator[_ngcontent-%COMP%] {\n    margin: clamp(0.85rem, 2.1vh, 1.4rem) 0;\n  }\n\n  .auth-card[_ngcontent-%COMP%]:not(.auth-card--recovery)   form[_ngcontent-%COMP%]    > .signup[_ngcontent-%COMP%] {\n    margin-top: auto;\n    padding-top: clamp(1rem, 2.5vh, 1.75rem);\n  }\n\n  .auth-panel__footer[_ngcontent-%COMP%] {\n    position: absolute;\n    z-index: 1;\n    right: 1rem;\n    bottom: 0.35rem;\n    left: auto;\n    width: min(44%, 20rem);\n    font-size: 0.6rem;\n    line-height: 1;\n    text-align: right;\n  }\n\n  .auth-panel__footer[_ngcontent-%COMP%]    > p[_ngcontent-%COMP%]:first-child {\n    display: none;\n  }\n}\n\n@media (max-width: 480px) {\n  .auth-panel[_ngcontent-%COMP%] {\n    padding-inline: 1rem;\n  }\n\n  .brand[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n    display: none;\n  }\n\n  .brand__mark[_ngcontent-%COMP%] {\n    width: 2.6rem;\n    height: 2.6rem;\n  }\n\n  .form-options[_ngcontent-%COMP%] {\n    align-items: flex-start;\n    font-size: 0.78rem;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .submit-button[_ngcontent-%COMP%] {\n    transition: none;\n  }\n}", "[_nghost-%COMP%] {\n  display: block;\n  min-height: 100dvh;\n  height: auto;\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n\n.register-page[_ngcontent-%COMP%] {\n  min-height: 100dvh;\n  background: #f8fafc;\n  color: #102033;\n}\n\n.register-stage[_ngcontent-%COMP%] {\n  min-height: 100dvh;\n  display: grid;\n  grid-template-columns: 1fr;\n}\n\n.register-hero[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  padding: clamp(1.5rem, 4vw, 2.5rem);\n  color: #fff;\n  background: linear-gradient(145deg, #1e3a8a 0%, #2563eb 48%, #0284c7 100%);\n}\n\n.register-hero__kuba-pattern[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  object-position: center;\n  opacity: 0.15;\n  mix-blend-mode: soft-light;\n  pointer-events: none;\n}\n\n.register-hero__glow[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -20%;\n  right: -15%;\n  width: 55%;\n  height: 70%;\n  border-radius: 50%;\n  background: rgb(255 255 255 / 0.12);\n  filter: blur(40px);\n  pointer-events: none;\n}\n\n.register-hero__wave[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  height: 45%;\n  width: 100%;\n  pointer-events: none;\n  opacity: 0.9;\n}\n\n.register-hero__brand[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  color: #fff;\n  text-decoration: none;\n}\n\n.register-hero__brand[_ngcontent-%COMP%]   .brand__mark[_ngcontent-%COMP%] {\n  background: rgb(255 255 255 / 0.18);\n  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.25);\n}\n\n.register-hero__brand[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.register-hero__brand[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: #fff;\n}\n\n.register-hero__brand[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  opacity: 0.82;\n}\n\n.register-hero__body[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  margin-top: auto;\n  padding-top: clamp(2rem, 8vh, 4rem);\n}\n\n.register-hero__eyebrow[_ngcontent-%COMP%] {\n  margin: 0 0 0.65rem;\n  font-size: 0.78rem;\n  font-weight: 700;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n  color: rgb(191 219 254 / 0.95);\n}\n\n.register-hero[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  max-width: 16ch;\n  font-size: clamp(1.75rem, 4vw, 2.65rem);\n  line-height: 1.12;\n  letter-spacing: -0.03em;\n}\n\n.register-hero__lead[_ngcontent-%COMP%] {\n  margin: 1rem 0 0;\n  max-width: 38ch;\n  color: rgb(239 246 255 / 0.9);\n  font-size: 0.95rem;\n  line-height: 1.55;\n}\n\n.register-hero__features[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.65rem;\n  margin: 1.75rem 0 0;\n  padding: 0;\n  list-style: none;\n}\n\n.register-hero__features[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.65rem;\n  padding: 0.65rem 0.85rem;\n  border: 1px solid rgb(255 255 255 / 0.22);\n  border-radius: 0.85rem;\n  background: rgb(255 255 255 / 0.08);\n  font-size: 0.88rem;\n  font-weight: 650;\n  backdrop-filter: blur(4px);\n}\n\n.register-hero__features[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  width: 1.25rem;\n  text-align: center;\n  opacity: 0.95;\n}\n\n.register-workspace[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  min-height: 0;\n  padding: clamp(1rem, 3vw, 1.75rem);\n}\n\n.register-workspace__bar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  margin-bottom: 1rem;\n}\n\n.register-workspace__back[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.45rem;\n  color: var(--%NS%color-primary);\n  font-size: 0.88rem;\n  font-weight: 700;\n  text-decoration: none;\n}\n\n.register-workspace__back[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n\n.register-card[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  border: 1px solid rgb(226 232 240 / 0.9);\n  border-radius: 1.35rem;\n  background: #fff;\n  box-shadow: 0 1.25rem 3rem rgb(15 23 42 / 0.08);\n  padding: clamp(1.35rem, 3vw, 2.1rem);\n}\n\n.register-card__head[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: clamp(1.45rem, 2.5vw, 1.85rem);\n  letter-spacing: -0.03em;\n}\n\n.register-card__head[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: var(--%NS%color-primary);\n}\n\n.register-card__head[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.4rem 0 0;\n  color: #64748b;\n  font-size: 0.92rem;\n  line-height: 1.5;\n}\n\n[_nghost-%COMP%]     .register-stepper {\n  display: block;\n  margin-top: 1.5rem;\n}\n\n[_nghost-%COMP%]     .register-stepper .p-step-title {\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n\n[_nghost-%COMP%]     .register-stepper .p-step-number {\n  width: 2.5rem;\n  min-width: 2.5rem;\n  height: 2.5rem;\n  font-size: 1.05rem;\n  font-weight: 700;\n}\n\n[_nghost-%COMP%]     .register-stepper .p-step-active .p-step-number {\n  border-color: var(--%NS%color-primary);\n  background: var(--%NS%color-primary-fixed);\n  color: var(--%NS%color-primary);\n}\n\n[_nghost-%COMP%]     .register-stepper .p-step-active .p-step-title {\n  color: var(--%NS%color-primary);\n}\n\n[_nghost-%COMP%]     .register-stepper .p-step-active .p-stepper-separator {\n  background: var(--%NS%color-primary);\n}\n\n[_nghost-%COMP%]     .register-stepper .register-step--complete .p-step-number {\n  border-color: var(--%NS%color-primary);\n  background: var(--%NS%color-primary);\n  color: var(--%NS%color-on-primary);\n}\n\n[_nghost-%COMP%]     .register-stepper .register-step--complete .p-step-title {\n  color: var(--%NS%color-primary);\n}\n\n[_nghost-%COMP%]     .register-stepper .register-step--complete .p-stepper-separator {\n  background: var(--%NS%color-primary);\n}\n\n.register-form[_ngcontent-%COMP%] {\n  margin-top: 1.35rem;\n}\n\n.register-form__section[_ngcontent-%COMP%]    + .register-form__section[_ngcontent-%COMP%] {\n  margin-top: 1.5rem;\n  padding-top: 1.5rem;\n  border-top: 1px solid #f1f5f9;\n}\n\n.register-form__section-title[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.55rem;\n  margin: 0 0 1rem;\n  color: #0f172a;\n  font-size: 0.95rem;\n  font-weight: 750;\n}\n\n.register-form__section-title[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--%NS%color-primary);\n}\n\n.register-form__grid[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0;\n}\n\n.register-form__grid--2[_ngcontent-%COMP%] {\n  grid-template-columns: 1fr;\n}\n\n.register-form__grid--2[_ngcontent-%COMP%]   .field[_ngcontent-%COMP%]    + .field[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n}\n\n.register-form__grid[_ngcontent-%COMP%]    + .register-form__grid[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n}\n\n.field--sex[_ngcontent-%COMP%] {\n  margin: 1rem 0;\n}\n\n[_nghost-%COMP%]     .register-sex-select.p-select {\n  width: 100%;\n  min-height: 3.5rem;\n  border: 1px solid #cbd5e1;\n  border-radius: 0.75rem;\n  background: #fff;\n  box-shadow: none;\n}\n\n[_nghost-%COMP%]     .register-sex-select.p-select:not(.p-disabled):hover {\n  border-color: #94a3b8;\n}\n\n[_nghost-%COMP%]     .register-sex-select.p-select.p-focus {\n  border-color: var(--%NS%color-primary);\n  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.13);\n}\n\n[_nghost-%COMP%]     .register-sex-select .p-select-label {\n  display: flex;\n  align-items: center;\n  padding: 0 1rem;\n  color: #102033;\n}\n\n[_nghost-%COMP%]     .register-sex-select .p-select-dropdown {\n  width: 3rem;\n  color: #64748b;\n}\n\n[_nghost-%COMP%]     .register-select-panel.p-select-overlay {\n  overflow: hidden;\n  border: 1px solid var(--%NS%color-border-subtle);\n  border-radius: 0.75rem;\n  box-shadow: 0 14px 32px rgb(15 23 42 / 0.12);\n}\n\n.register-optional[_ngcontent-%COMP%] {\n  color: #94a3b8;\n  font-size: 0.78rem;\n  font-weight: 500;\n}\n\n.field--email-availability[_ngcontent-%COMP%]   .field__lead-icon[_ngcontent-%COMP%] {\n  width: 1.1rem;\n  flex-shrink: 0;\n  text-align: center;\n}\n\n.field__lead-icon--spin[_ngcontent-%COMP%] {\n  animation: submit-button-spin 0.75s linear infinite;\n}\n\n.field__trail-icon[_ngcontent-%COMP%] {\n  margin-left: auto;\n  flex-shrink: 0;\n  font-size: 1.05rem;\n}\n\n.field__trail-icon--ok[_ngcontent-%COMP%] {\n  color: var(--%NS%color-primary);\n}\n\n.field__trail-icon--error[_ngcontent-%COMP%] {\n  color: #e53e3e;\n}\n\n.field__control--email-available[_ngcontent-%COMP%] {\n  border-color: var(--%NS%color-primary);\n  box-shadow: 0 0 0 2px rgb(37 99 235 / 0.12);\n}\n\n.field__control--email-checking[_ngcontent-%COMP%] {\n  border-color: #cbd5e1;\n}\n\n.field__error--actions[_ngcontent-%COMP%] {\n  margin-top: 0.55rem;\n  padding: 0.75rem 0.9rem;\n  border-radius: 0.6rem;\n  border: 1px solid #fca5a5;\n  background: #fef2f2;\n  color: #991b1b;\n  line-height: 1.45;\n}\n\n.field__error--actions[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: var(--%NS%color-primary);\n  font-weight: 700;\n  text-underline-offset: 3px;\n}\n\n.field__error--actions[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  color: var(--%NS%color-on-primary-fixed);\n}\n\n.register-terms[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n\n.field__error--phone[_ngcontent-%COMP%] {\n  margin-top: 0.45rem;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  color: #b91c1c;\n}\n\n.register-terms[_ngcontent-%COMP%] {\n  display: flex;\n  margin-top: 1.15rem;\n  align-items: flex-start;\n  line-height: 1.45;\n}\n\n.register-terms--invalid[_ngcontent-%COMP%] {\n  color: #b91c1c;\n}\n\n.register-form__footer[_ngcontent-%COMP%] {\n  margin-top: 1.5rem;\n  padding-top: 1.25rem;\n  border-top: 1px solid #f1f5f9;\n}\n\n.register-form__footer-toolbar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1.25rem;\n  margin-bottom: 0.9rem;\n}\n\n.register-form__actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-shrink: 0;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.65rem;\n}\n\n.register-form__footer[_ngcontent-%COMP%]   app-auth-legal-notice[_ngcontent-%COMP%] {\n  flex: 1 1 100%;\n  width: 100%;\n}\n\n.register-form__footer[_ngcontent-%COMP%]   .submit-button[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 9rem;\n  box-shadow: 0 2px 6px rgb(37 99 235 / 0.1);\n}\n\n.register-form__footer[_ngcontent-%COMP%]   .submit-button[_ngcontent-%COMP%]:not(:disabled):hover {\n  transform: none;\n  box-shadow: 0 2px 8px rgb(37 99 235 / 0.12);\n}\n\n.wizard-button[_ngcontent-%COMP%] {\n  display: inline-flex;\n  min-height: 3rem;\n  align-items: center;\n  justify-content: center;\n  gap: 0.55rem;\n  border: 1px solid #cbd5e1;\n  border-radius: 0.75rem;\n  padding: 0.7rem 1rem;\n  background: #fff;\n  color: #334155;\n  font: inherit;\n  font-size: 0.9rem;\n  font-weight: 750;\n  cursor: pointer;\n  text-decoration: none;\n}\n\n.wizard-button[_ngcontent-%COMP%]:hover {\n  border-color: #94a3b8;\n  background: #f8fafc;\n}\n\n.register-form__footer[_ngcontent-%COMP%]   .signup[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 0.35rem;\n  margin: 0;\n  padding: 0;\n  min-height: 3rem;\n  min-width: 0;\n  line-height: 1.45;\n  text-align: left;\n  color: #64748b;\n  font-size: 0.9rem;\n}\n\n.register-form__footer[_ngcontent-%COMP%]   .signup[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  font-weight: 700;\n  text-decoration: none;\n  color: var(--%NS%color-primary);\n}\n\n.register-form__footer[_ngcontent-%COMP%]   .signup[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n\n@media (max-width: 640px) {\n  .register-form__footer-toolbar[_ngcontent-%COMP%] {\n    align-items: stretch;\n    flex-direction: column;\n    gap: 1rem;\n  }\n  .register-form__footer[_ngcontent-%COMP%]   .signup[_ngcontent-%COMP%] {\n    text-align: center;\n    justify-content: center;\n  }\n  .register-form__actions[_ngcontent-%COMP%] {\n    width: 100%;\n    flex-wrap: wrap;\n    justify-content: stretch;\n  }\n  .register-form__actions[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n    flex: 1 1 auto;\n  }\n  .register-form__footer[_ngcontent-%COMP%]   .submit-button[_ngcontent-%COMP%] {\n    width: auto;\n  }\n}\n\n.register-card__success[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 2rem 0.5rem 0.5rem;\n}\n\n.register-card__success-icon[_ngcontent-%COMP%] {\n  color: var(--%NS%color-primary);\n  font-size: 2.75rem;\n}\n\n.register-card__success[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0.85rem 0 0;\n}\n\n.register-card__success[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.5rem auto 1.5rem;\n  max-width: 36ch;\n  color: #64748b;\n}\n\n.field__control--select[_ngcontent-%COMP%] {\n  align-items: center;\n  padding: 0 0.9rem;\n}\n\n.field__control--select[_ngcontent-%COMP%]    > i[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  width: 1em;\n  text-align: center;\n  color: var(--%NS%color-primary);\n}\n\n.field__select[_ngcontent-%COMP%] {\n  display: flex;\n  flex: 1;\n  min-width: 0;\n  align-items: center;\n}\n\n[_nghost-%COMP%]     .field__select > p-select {\n  display: flex;\n  flex: 1;\n  width: 100%;\n  min-width: 0;\n}\n\n[_nghost-%COMP%]     .field__select .register-activity-select.p-select {\n  display: flex;\n  width: 100%;\n  min-height: 0;\n  padding: 0;\n  align-items: center;\n  border: 0;\n  border-radius: 0;\n  background: transparent;\n  box-shadow: none !important;\n}\n\n[_nghost-%COMP%]     .field__select .register-activity-select.p-select.p-focus {\n  border-color: transparent;\n  box-shadow: none !important;\n}\n\n[_nghost-%COMP%]     .field__select .register-activity-select .p-select-label {\n  display: flex;\n  flex: 1;\n  align-items: center;\n  min-height: 0;\n  padding: 0;\n  font-size: inherit;\n  line-height: 1.25;\n  color: #102033;\n}\n\n[_nghost-%COMP%]     .field__select .register-activity-select .p-select-dropdown {\n  width: 2.5rem;\n  color: #475569;\n}\n\n[_nghost-%COMP%]     .field__control--select .register-activity-select.p-select, \n[_nghost-%COMP%]     .field__control--select .register-activity-select.p-inputwrapper {\n  min-height: 0;\n}\n\n@media (min-width: 640px) {\n  .register-form__grid--2[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    gap: 1rem;\n  }\n\n  .register-form__grid--2[_ngcontent-%COMP%]   .field[_ngcontent-%COMP%]    + .field[_ngcontent-%COMP%] {\n    margin-top: 0;\n  }\n}\n\n@media (min-width: 1024px) {\n  [_nghost-%COMP%] {\n    height: 100dvh;\n    overflow: hidden;\n  }\n\n  .register-stage[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(18rem, 26rem) minmax(0, 1fr);\n    height: 100dvh;\n    max-height: 100dvh;\n    overflow: hidden;\n  }\n\n  .register-hero[_ngcontent-%COMP%] {\n    min-height: 0;\n    height: 100%;\n    padding-bottom: 2.5rem;\n    overflow-y: auto;\n  }\n\n  .register-workspace[_ngcontent-%COMP%] {\n    min-height: 0;\n    height: 100%;\n    overflow-y: auto;\n    overscroll-behavior: contain;\n    padding: clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 4vw, 3rem);\n  }\n\n  .register-card[_ngcontent-%COMP%] {\n    margin: 0 auto;\n    width: min(100%, clamp(44rem, 46vw, 52rem));\n  }\n\n  .register-form__footer[_ngcontent-%COMP%]   .submit-button[_ngcontent-%COMP%] {\n    width: auto;\n    min-width: 14rem;\n  }\n\n  .register-form__footer[_ngcontent-%COMP%]   .wizard-button[_ngcontent-%COMP%] {\n    min-width: 8.75rem;\n  }\n}\n\n@media (max-width: 1023px) {\n  .register-hero[_ngcontent-%COMP%] {\n    min-height: auto;\n  }\n\n  .register-hero__body[_ngcontent-%COMP%] {\n    padding-top: 1.5rem;\n    padding-bottom: 0.5rem;\n  }\n\n  .register-hero__features[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n\n@media (max-width: 479px) {\n  .register-hero__features[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n\n  .register-workspace__back[_ngcontent-%COMP%] {\n    font-size: 0.8rem;\n  }\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(Register, [{
        type: Component,
        args: [{ selector: 'app-register', imports: [
                    RouterLink,
                    ReactiveFormsModule,
                    Select,
                    Stepper,
                    StepList,
                    Step,
                    AuthLegalNotice,
                    ...AUTH_FORM_PRIME_IMPORTS,
                ], template: "<main id=\"content\" tabindex=\"-1\" class=\"register-page\">\n  <div class=\"register-stage\">\n    <aside class=\"register-hero\" aria-labelledby=\"register-hero-title\">\n      <img\n        class=\"register-hero__kuba-pattern\"\n        src=\"assets/kuba-textile-pattern.png\"\n        alt=\"\"\n        aria-hidden=\"true\"\n      />\n      <div class=\"register-hero__glow\" aria-hidden=\"true\"></div>\n      <svg\n        class=\"register-hero__wave\"\n        viewBox=\"0 0 400 800\"\n        preserveAspectRatio=\"none\"\n        aria-hidden=\"true\"\n      >\n        <path\n          fill=\"rgb(255 255 255 / 0.06)\"\n          d=\"M0,520 C90,420 140,580 260,480 S360,380 400,420 L400,800 L0,800 Z\"\n        />\n      </svg>\n\n      <a class=\"brand register-hero__brand\" routerLink=\"/authentification\" aria-label=\"KubaGest\">\n        <span class=\"brand__mark\" aria-hidden=\"true\">K</span>\n        <span><strong>KubaGest</strong><small>Gestion commerciale int\u00E9gr\u00E9e</small></span>\n      </a>\n\n      <div class=\"register-hero__body\">\n        <p class=\"register-hero__eyebrow\">Activation d\u2019espace</p>\n        <h1 id=\"register-hero-title\">Lancez votre point de vente sur une base solide</h1>\n        <p class=\"register-hero__lead\">\n          Un seul formulaire pour cr\u00E9er l\u2019\u00E9tablissement, le compte propri\u00E9taire et les param\u00E8tres\n          essentiels (activit\u00E9, devise CDF).\n        </p>\n\n        <ul class=\"register-hero__features\">\n          <li>\n            <i class=\"fa-solid fa-cart-shopping\" aria-hidden=\"true\"></i> Ventes &amp; encaissement\n          </li>\n          <li><i class=\"fa-solid fa-boxes-stacked\" aria-hidden=\"true\"></i> Stocks multi-d\u00E9p\u00F4ts</li>\n          <li><i class=\"fa-solid fa-truck\" aria-hidden=\"true\"></i> Achats fournisseurs</li>\n          <li>\n            <i class=\"fa-solid fa-chart-column\" aria-hidden=\"true\"></i> Rapports en temps r\u00E9el\n          </li>\n        </ul>\n      </div>\n    </aside>\n\n    <section class=\"register-workspace\" aria-labelledby=\"register-form-title\">\n      <header class=\"register-workspace__bar\">\n        <a class=\"register-workspace__back\" routerLink=\"/authentification\">\n          <i class=\"fa-solid fa-arrow-left\" aria-hidden=\"true\"></i>\n          Retour \u00E0 la connexion\n        </a>\n        <div class=\"language\">\n          <p-select\n            inputId=\"register-locale\"\n            size=\"small\"\n            [options]=\"localeOptions\"\n            [formControl]=\"form.controls.locale\"\n            optionLabel=\"label\"\n            optionValue=\"value\"\n            styleClass=\"language-select\"\n            panelStyleClass=\"language-select-panel\"\n            appendTo=\"body\"\n            ariaLabel=\"Langue de l\u2019interface\"\n          >\n            <ng-template #selectedItem let-option>\n              <span class=\"language__trigger\">\n                <i class=\"fa-solid fa-globe\" aria-hidden=\"true\"></i>\n                <span>{{ option?.label }}</span>\n              </span>\n            </ng-template>\n            <ng-template #dropdownicon>\n              <i class=\"fa-solid fa-chevron-down language__chevron\" aria-hidden=\"true\"></i>\n            </ng-template>\n          </p-select>\n        </div>\n      </header>\n\n      <article class=\"register-card\">\n        @if (registerSuccess()) {\n          <div class=\"register-card__success\">\n            <div class=\"register-card__success-icon\" aria-hidden=\"true\">\n              <i class=\"fa-solid fa-circle-check\"></i>\n            </div>\n            <h2 id=\"register-form-title\">Votre espace est pr\u00EAt</h2>\n            <p>\n              Connectez-vous avec l\u2019adresse e-mail et le mot de passe que vous venez de d\u00E9finir.\n            </p>\n            <button class=\"submit-button\" type=\"button\" (click)=\"goToLogin()\">\n              <i class=\"fa-solid fa-right-to-bracket\" aria-hidden=\"true\"></i>\n              <span>Aller \u00E0 la connexion</span>\n            </button>\n          </div>\n        } @else {\n          <header class=\"register-card__head\">\n            <h2 id=\"register-form-title\">Cr\u00E9er votre <span>espace</span></h2>\n            <p>Renseignez les informations ci-dessous pour activer KubaGest.</p>\n          </header>\n\n          <p-stepper class=\"register-stepper\" [value]=\"currentStep()\" [linear]=\"true\">\n            <p-step-list>\n              <p-step [value]=\"1\" [class.register-step--complete]=\"currentStep() > 1\"\n                >Responsable</p-step\n              >\n              <p-step [value]=\"2\" [class.register-step--complete]=\"currentStep() > 2\"\n                >\u00C9tablissement</p-step\n              >\n              <p-step [value]=\"3\">S\u00E9curit\u00E9</p-step>\n            </p-step-list>\n          </p-stepper>\n\n          <form [formGroup]=\"form\" (ngSubmit)=\"submit()\" novalidate class=\"register-form\">\n            @if (currentStep() === 1) {\n              <div class=\"register-form__section\">\n                <div class=\"register-form__grid register-form__grid--2\">\n                  <div class=\"field\">\n                    <label for=\"firstName\">Pr\u00E9nom</label>\n                    <div\n                      class=\"field__control\"\n                      [class.field__control--invalid]=\"\n                        form.controls.firstName.touched && form.controls.firstName.invalid\n                      \"\n                    >\n                      <i class=\"fa-solid fa-user\" aria-hidden=\"true\"></i>\n                      <input\n                        pInputText\n                        fluid\n                        id=\"firstName\"\n                        type=\"text\"\n                        formControlName=\"firstName\"\n                        autocomplete=\"given-name\"\n                        placeholder=\"Pr\u00E9nom\"\n                        [invalid]=\"\n                          form.controls.firstName.touched && form.controls.firstName.invalid\n                        \"\n                      />\n                    </div>\n                    @if (\n                      form.controls.firstName.touched &&\n                      form.controls.firstName.hasError('required')\n                    ) {\n                      <p class=\"field__error\" role=\"alert\">Indiquez votre pr\u00E9nom.</p>\n                    }\n                  </div>\n                  <div class=\"field\">\n                    <label for=\"lastName\">Nom</label>\n                    <div\n                      class=\"field__control\"\n                      [class.field__control--invalid]=\"\n                        form.controls.lastName.touched && form.controls.lastName.invalid\n                      \"\n                    >\n                      <i class=\"fa-solid fa-user\" aria-hidden=\"true\"></i>\n                      <input\n                        pInputText\n                        fluid\n                        id=\"lastName\"\n                        type=\"text\"\n                        formControlName=\"lastName\"\n                        autocomplete=\"family-name\"\n                        placeholder=\"Nom\"\n                        [invalid]=\"form.controls.lastName.touched && form.controls.lastName.invalid\"\n                      />\n                    </div>\n                    @if (\n                      form.controls.lastName.touched && form.controls.lastName.hasError('required')\n                    ) {\n                      <p class=\"field__error\" role=\"alert\">Indiquez votre nom.</p>\n                    }\n                  </div>\n                </div>\n\n                <div class=\"field field--sex\">\n                  <label for=\"register-sex\">Sexe</label>\n                  <p-select\n                    inputId=\"register-sex\"\n                    formControlName=\"sex\"\n                    [options]=\"sexOptions\"\n                    optionLabel=\"label\"\n                    optionValue=\"value\"\n                    [fluid]=\"true\"\n                    appendTo=\"body\"\n                    ariaLabel=\"Sexe\"\n                    styleClass=\"register-sex-select\"\n                    panelStyleClass=\"register-select-panel\"\n                  />\n                </div>\n\n                <div class=\"register-form__grid register-form__grid--2\">\n                  <div class=\"field field--email-availability\">\n                    <label for=\"email\">Adresse e-mail</label>\n                    <div\n                      class=\"field__control\"\n                      [class.field__control--invalid]=\"\n                        form.controls.email.touched &&\n                        (form.controls.email.hasError('required') ||\n                          form.controls.email.hasError('email') ||\n                          emailFieldState() === 'taken')\n                      \"\n                      [class.field__control--email-available]=\"emailFieldState() === 'available'\"\n                      [class.field__control--email-checking]=\"emailFieldState() === 'checking'\"\n                    >\n                      @switch (emailFieldState()) {\n                        @case ('checking') {\n                          <i\n                            class=\"fa-regular fa-spinner field__lead-icon field__lead-icon--spin\"\n                            aria-hidden=\"true\"\n                          ></i>\n                        }\n                        @default {\n                          <i class=\"fa-solid fa-envelope field__lead-icon\" aria-hidden=\"true\"></i>\n                        }\n                      }\n                      <input\n                        pInputText\n                        fluid\n                        id=\"email\"\n                        type=\"email\"\n                        formControlName=\"email\"\n                        autocomplete=\"email\"\n                        inputmode=\"email\"\n                        placeholder=\"Adresse e-mail\"\n                        [invalid]=\"\n                          form.controls.email.touched &&\n                          (form.controls.email.invalid || emailFieldState() === 'taken')\n                        \"\n                        [attr.aria-invalid]=\"\n                          form.controls.email.touched &&\n                          (form.controls.email.invalid || emailFieldState() === 'taken')\n                        \"\n                        [attr.aria-describedby]=\"\n                          form.controls.email.touched && form.controls.email.invalid\n                            ? 'email-error'\n                            : emailFieldState() === 'taken'\n                              ? 'email-taken-error'\n                              : null\n                        \"\n                        (blur)=\"onEmailBlur()\"\n                        (input)=\"onEmailInput()\"\n                      />\n                      @switch (emailFieldState()) {\n                        @case ('available') {\n                          <i\n                            class=\"fa-solid fa-circle-check field__trail-icon field__trail-icon--ok\"\n                            aria-hidden=\"true\"\n                          ></i>\n                        }\n                        @case ('taken') {\n                          <i\n                            class=\"fa-solid fa-circle-exclamation field__trail-icon field__trail-icon--error\"\n                            aria-hidden=\"true\"\n                          ></i>\n                        }\n                      }\n                    </div>\n                    @if (\n                      form.controls.email.touched &&\n                      (form.controls.email.hasError('required') ||\n                        form.controls.email.hasError('email'))\n                    ) {\n                      <p id=\"email-error\" class=\"field__error\" role=\"alert\">\n                        Format d\u2019adresse e-mail invalide.\n                      </p>\n                    } @else if (emailFieldState() === 'taken') {\n                      <p\n                        id=\"email-taken-error\"\n                        class=\"field__error field__error--actions\"\n                        role=\"alert\"\n                      >\n                        Un compte existe d\u00E9j\u00E0 avec cette adresse.\n                        <a [routerLink]=\"authPath\">Se connecter</a>\n                        ou\n                        <a [routerLink]=\"forgotPasswordPath\">mot de passe oubli\u00E9&nbsp;?</a>\n                      </p>\n                    }\n                  </div>\n                  <div class=\"field\">\n                    <label for=\"register-phone\"\n                      >T\u00E9l\u00E9phone <span class=\"register-optional\">facultatif</span></label\n                    >\n                    <p-inputgroup\n                      class=\"auth-phone-group\"\n                      [class.auth-phone-group--invalid]=\"!!phoneFieldError()\"\n                    >\n                      <p-inputgroup-addon id=\"register-phone-dial\">{{\n                        rdcDial\n                      }}</p-inputgroup-addon>\n                      <input\n                        pInputText\n                        fluid\n                        id=\"register-phone\"\n                        type=\"tel\"\n                        inputmode=\"tel\"\n                        autocomplete=\"tel\"\n                        placeholder=\"Ex. 812 345 678\"\n                        aria-describedby=\"register-phone-dial\"\n                        [invalid]=\"!!phoneFieldError()\"\n                        [value]=\"phoneLocalValue()\"\n                        (input)=\"onPhoneInput($event)\"\n                        (blur)=\"onPhoneBlur()\"\n                      />\n                    </p-inputgroup>\n                    @if (phoneFieldError()) {\n                      <p class=\"field__error field__error--phone\" role=\"alert\">\n                        {{ phoneFieldError() }}\n                      </p>\n                    }\n                  </div>\n                </div>\n              </div>\n            }\n\n            @if (currentStep() === 2) {\n              <div class=\"register-form__section\">\n                <div class=\"field\">\n                  <label for=\"tenantName\">Nom de l\u2019\u00E9tablissement</label>\n                  <div\n                    class=\"field__control\"\n                    [class.field__control--invalid]=\"\n                      form.controls.tenantName.touched && form.controls.tenantName.invalid\n                    \"\n                  >\n                    <i class=\"fa-solid fa-store\" aria-hidden=\"true\"></i>\n                    <input\n                      pInputText\n                      fluid\n                      id=\"tenantName\"\n                      type=\"text\"\n                      formControlName=\"tenantName\"\n                      autocomplete=\"organization\"\n                      placeholder=\"Ex. Boutique Kintambo\"\n                      [invalid]=\"\n                        form.controls.tenantName.touched && form.controls.tenantName.invalid\n                      \"\n                    />\n                  </div>\n                  @if (form.controls.tenantName.touched && form.controls.tenantName.invalid) {\n                    <p class=\"field__error\" role=\"alert\">Nom requis (2 caract\u00E8res minimum).</p>\n                  }\n                </div>\n                <div class=\"field\">\n                  <label for=\"activityType\">Type d\u2019activit\u00E9</label>\n                  <div\n                    class=\"field__control field__control--select\"\n                    [class.field__control--invalid]=\"\n                      form.controls.activityType.touched && form.controls.activityType.invalid\n                    \"\n                  >\n                    <i class=\"fa-solid fa-briefcase\" aria-hidden=\"true\"></i>\n                    <div class=\"field__select\">\n                      <p-select\n                        inputId=\"activityType\"\n                        ariaLabel=\"Type d\u2019activit\u00E9\"\n                        [options]=\"activityOptions\"\n                        formControlName=\"activityType\"\n                        optionLabel=\"label\"\n                        optionValue=\"value\"\n                        styleClass=\"register-activity-select\"\n                        panelStyleClass=\"language-select-panel\"\n                        appendTo=\"body\"\n                        placeholder=\"Choisir une activit\u00E9\"\n                      />\n                    </div>\n                  </div>\n                </div>\n              </div>\n            }\n\n            @if (currentStep() === 3) {\n              <div class=\"register-form__section\">\n                <div class=\"register-form__grid register-form__grid--2\">\n                  <div class=\"field\">\n                    <label for=\"register-password\">Mot de passe</label>\n                    <div\n                      class=\"field__control\"\n                      [class.field__control--invalid]=\"\n                        form.controls.password.touched && form.controls.password.invalid\n                      \"\n                    >\n                      <i class=\"fa-solid fa-lock\" aria-hidden=\"true\"></i>\n                      <input\n                        pInputText\n                        fluid\n                        id=\"register-password\"\n                        [type]=\"showPassword() ? 'text' : 'password'\"\n                        formControlName=\"password\"\n                        autocomplete=\"new-password\"\n                        placeholder=\"8 caract\u00E8res min.\"\n                        [invalid]=\"form.controls.password.touched && form.controls.password.invalid\"\n                      />\n                      <button type=\"button\" class=\"field__toggle\" (click)=\"togglePassword()\">\n                        <i\n                          class=\"fa-solid\"\n                          [class.fa-eye-slash]=\"showPassword()\"\n                          [class.fa-eye]=\"!showPassword()\"\n                          aria-hidden=\"true\"\n                        ></i>\n                      </button>\n                    </div>\n                    @if (\n                      form.controls.password.touched && form.controls.password.hasError('minlength')\n                    ) {\n                      <p class=\"field__error\" role=\"alert\">Mot de passe trop court.</p>\n                    }\n                  </div>\n                  <div class=\"field\">\n                    <label for=\"confirmPassword\">Confirmation</label>\n                    <div\n                      class=\"field__control\"\n                      [class.field__control--invalid]=\"\n                        form.controls.confirmPassword.touched &&\n                        form.controls.confirmPassword.invalid\n                      \"\n                    >\n                      <i class=\"fa-solid fa-lock\" aria-hidden=\"true\"></i>\n                      <input\n                        pInputText\n                        fluid\n                        id=\"confirmPassword\"\n                        [type]=\"showConfirmPassword() ? 'text' : 'password'\"\n                        formControlName=\"confirmPassword\"\n                        autocomplete=\"new-password\"\n                        placeholder=\"R\u00E9p\u00E9tez le mot de passe\"\n                        [invalid]=\"\n                          form.controls.confirmPassword.touched &&\n                          form.controls.confirmPassword.invalid\n                        \"\n                      />\n                      <button type=\"button\" class=\"field__toggle\" (click)=\"toggleConfirmPassword()\">\n                        <i\n                          class=\"fa-solid\"\n                          [class.fa-eye-slash]=\"showConfirmPassword()\"\n                          [class.fa-eye]=\"!showConfirmPassword()\"\n                          aria-hidden=\"true\"\n                        ></i>\n                      </button>\n                    </div>\n                    @if (\n                      form.controls.confirmPassword.touched &&\n                      form.controls.confirmPassword.hasError('mismatch')\n                    ) {\n                      <p class=\"field__error\" role=\"alert\">\n                        Les mots de passe ne correspondent pas.\n                      </p>\n                    }\n                  </div>\n                </div>\n\n                <div\n                  class=\"remember register-terms\"\n                  [class.register-terms--invalid]=\"\n                    form.controls.acceptTerms.touched && form.controls.acceptTerms.invalid\n                  \"\n                >\n                  <p-checkbox\n                    formControlName=\"acceptTerms\"\n                    [binary]=\"true\"\n                    inputId=\"register-accept-terms\"\n                  />\n                  <label for=\"register-accept-terms\">\n                    J\u2019accepte les\n                    <a\n                      [routerLink]=\"termsPath\"\n                      [queryParams]=\"{ retour: registrationPath }\"\n                      (click)=\"persistDraftNow(); $event.stopPropagation()\"\n                      >conditions d\u2019utilisation</a\n                    >\n                    et la\n                    <a\n                      [routerLink]=\"privacyPath\"\n                      [queryParams]=\"{ retour: registrationPath }\"\n                      (click)=\"persistDraftNow(); $event.stopPropagation()\"\n                      >politique de confidentialit\u00E9</a\n                    >\n                    de KubaGest.\n                  </label>\n                </div>\n                @if (form.controls.acceptTerms.touched && form.controls.acceptTerms.invalid) {\n                  <p class=\"field__error\" role=\"alert\">Acceptez les conditions pour continuer.</p>\n                }\n              </div>\n            }\n\n            @if (registerError()) {\n              <p class=\"form-error\" role=\"alert\">{{ registerError() }}</p>\n            }\n\n            <div class=\"register-form__footer\">\n              <div class=\"register-form__footer-toolbar\">\n                <p class=\"signup\">\n                  D\u00E9j\u00E0 un compte&nbsp;?\n                  <a routerLink=\"/authentification\">Se connecter</a>\n                </p>\n                <div class=\"register-form__actions\">\n                  @if (currentStep() > 1) {\n                    <button\n                      class=\"wizard-button\"\n                      type=\"button\"\n                      (click)=\"goToStep(currentStep() - 1)\"\n                    >\n                      <i class=\"fa-solid fa-arrow-left\" aria-hidden=\"true\"></i><span>Pr\u00E9c\u00E9dent</span>\n                    </button>\n                  } @else {\n                    <a class=\"wizard-button\" [routerLink]=\"authPath\">Annuler</a>\n                  }\n                  @if (currentStep() < 3) {\n                    <button class=\"submit-button\" type=\"button\" (click)=\"nextStep()\">\n                      <span>Continuer</span\n                      ><i class=\"fa-solid fa-arrow-right\" aria-hidden=\"true\"></i>\n                    </button>\n                  } @else {\n                    <button\n                      class=\"submit-button\"\n                      type=\"submit\"\n                      [disabled]=\"submitting()\"\n                      [attr.aria-busy]=\"submitting()\"\n                    >\n                      @if (submitting()) {\n                        <i\n                          class=\"fa-regular fa-spinner submit-button__icon--spin\"\n                          aria-hidden=\"true\"\n                        ></i>\n                      } @else {\n                        <i class=\"fa-solid fa-user-plus\" aria-hidden=\"true\"></i>\n                      }\n                      <span>{{ submitting() ? 'Cr\u00E9ation en cours\u2026' : 'Cr\u00E9er mon espace' }}</span>\n                    </button>\n                  }\n                </div>\n              </div>\n              <app-auth-legal-notice [saveDraft]=\"persistDraftNow\" />\n            </div>\n          </form>\n        }\n      </article>\n    </section>\n  </div>\n</main>\n", styles: [":host {\n  display: block;\n  min-height: 100dvh;\n}\n\n.login-page {\n  min-height: 100dvh;\n  background: #f8fafc;\n  color: #102033;\n}\n\n.login-stage {\n  min-height: 100dvh;\n}\n\n.login-visual {\n  display: none;\n}\n\n.hero__photo,\n.hero__shade,\n.hero__shape,\n.hero__curve {\n  position: absolute;\n  pointer-events: none;\n}\n\n.hero__photo {\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  object-position: 24% 52%;\n}\n\n.hero__shade {\n  inset: 0;\n  background: linear-gradient(\n    180deg,\n    rgb(15 23 42 / 0.06) 0%,\n    transparent 42%,\n    rgb(37 99 235 / 0.07) 100%\n  );\n}\n\n.hero__shape {\n  z-index: 1;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  height: 52%;\n  width: 100%;\n}\n\n.hero__curve {\n  top: 0;\n  right: 0;\n  z-index: 2;\n  height: 100%;\n  width: min(44%, 31rem);\n}\n\n.hero__content {\n  position: relative;\n  z-index: 4;\n  display: flex;\n  height: 100%;\n  flex-direction: column;\n  justify-content: space-between;\n  padding: clamp(1.5rem, 3vw, 2.5rem);\n}\n\n.brand--desktop {\n  display: none;\n}\n\n.hero__pitch h2 {\n  margin: 0 0 1.25rem;\n  max-width: 22rem;\n  color: white;\n  font-size: clamp(1.35rem, 2.2vw, 1.85rem);\n  font-weight: 700;\n  line-height: 1.25;\n  letter-spacing: -0.02em;\n  text-shadow: 0 2px 12px rgb(0 0 0 / 25%);\n}\n\n.hero__features {\n  display: grid;\n  max-width: 24rem;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 0.5rem;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n\n.hero__feature {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.4rem;\n  border: 1.5px solid rgb(255 255 255 / 0.45);\n  border-radius: 0.9rem;\n  background: rgb(255 255 255 / 0.12);\n  padding: 0.65rem 0.35rem 0.55rem;\n  color: white;\n  font-size: 0.68rem;\n  font-weight: 650;\n  line-height: 1.2;\n  text-align: center;\n}\n\n.hero__feature i {\n  font-size: 1.15rem;\n}\n\n.brand {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.75rem;\n  color: #102033;\n  text-decoration: none;\n}\n\n.brand__mark {\n  display: grid;\n  width: 3rem;\n  height: 3rem;\n  place-items: center;\n  border-radius: 0.875rem;\n  background: var(--color-primary);\n  color: white;\n  font-size: 1.55rem;\n  font-weight: 800;\n}\n\n.brand strong,\n.brand small {\n  display: block;\n}\n\n.brand strong {\n  font-size: 1.2rem;\n  line-height: 1.2;\n}\n\n.brand small {\n  margin-top: 0.125rem;\n  color: #64748b;\n  font-size: 0.68rem;\n}\n\n.auth-panel {\n  display: flex;\n  min-height: 100dvh;\n  flex-direction: column;\n  padding: 1rem 1.25rem;\n}\n\n.auth-panel__header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n}\n\n.language {\n  display: inline-flex;\n  align-items: center;\n}\n\n.language__trigger {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.45rem;\n  color: #102033;\n  font-size: 0.9rem;\n  font-weight: 700;\n}\n\n.language__chevron {\n  font-size: 0.85rem;\n  color: #475569;\n}\n\n:host ::ng-deep .language-select.p-select {\n  display: flex;\n  align-items: center;\n  height: 2rem;\n  min-height: 0;\n  border: 1px solid #cbd5e1;\n  border-radius: 5px;\n  background: #fff;\n  box-shadow: none;\n}\n\n:host ::ng-deep .language-select.p-select:not(.p-disabled):hover {\n  border-color: #94a3b8;\n}\n\n:host ::ng-deep .language-select.p-select.p-focus {\n  border-color: var(--color-primary);\n  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.12);\n}\n\n:host ::ng-deep .language-select .p-select-label {\n  display: flex;\n  align-items: center;\n  padding: 0 0.15rem 0 0.65rem;\n  line-height: 1;\n}\n\n:host ::ng-deep .language-select .p-select-dropdown {\n  width: 2rem;\n  color: #475569;\n}\n\n:host ::ng-deep .language-select-panel.p-select-overlay {\n  overflow: hidden;\n  border: 1px solid #e2e8f0;\n  border-radius: 0.85rem;\n  box-shadow: 0 14px 32px rgb(15 23 42 / 0.12);\n  min-width: 7.25rem;\n}\n\n:host ::ng-deep .language-select-panel .p-select-option {\n  padding: 0.55rem 0.85rem;\n  font-size: 0.88rem;\n  font-weight: 600;\n}\n\n:host ::ng-deep .language-select-panel .p-select-option.p-select-option-selected {\n  background: var(--color-primary-fixed);\n  color: var(--color-primary);\n}\n\n.auth-card {\n  width: 100%;\n  max-width: 34rem;\n  margin: auto;\n  padding: 2.25rem 0;\n}\n\n.auth-card__intro {\n  margin-bottom: 2rem;\n}\n\n.auth-card h1 {\n  margin: 0;\n  font-size: clamp(1.75rem, 7vw, 2.5rem);\n  line-height: 1.15;\n  letter-spacing: -0.04em;\n}\n\n.auth-card h1 span,\na {\n  color: var(--color-primary);\n}\n\n.auth-card__intro p {\n  max-width: 29rem;\n  margin: 0.75rem 0 0;\n  color: #64748b;\n  font-size: 1rem;\n  line-height: 1.6;\n}\n\n.field + .field {\n  margin-top: 1.15rem;\n}\n\n.field label {\n  display: block;\n  margin-bottom: 0.45rem;\n  font-size: 0.875rem;\n  font-weight: 650;\n}\n\n.field__control {\n  display: flex;\n  min-height: 3.5rem;\n  align-items: center;\n  gap: 0.75rem;\n  border: 1px solid #cbd5e1;\n  border-radius: 0.75rem;\n  background: white;\n  padding: 0 0.9rem;\n  color: var(--color-primary);\n  transition:\n    border-color 0.18s,\n    box-shadow 0.18s;\n}\n\n.field__control:focus-within {\n  border-color: var(--color-primary);\n  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.13);\n}\n\n.field__control--invalid {\n  border-color: #dc2626;\n}\n\n.field__control input {\n  min-width: 0;\n  flex: 1;\n  border: 0;\n  outline: 0;\n  color: #102033;\n  background: transparent;\n}\n\n.field__control input.p-inputtext {\n  box-shadow: none;\n  border-radius: 0;\n  padding: 0;\n  min-height: auto;\n}\n\n.field__control input.p-inputtext:enabled:focus {\n  box-shadow: none;\n}\n\n.field__control input::placeholder,\n.field__control input.p-inputtext::placeholder {\n  color: #94a3b8;\n}\n\n:host ::ng-deep .auth-phone-group.p-inputgroup {\n  display: flex;\n  width: 100%;\n  min-height: 3.5rem;\n  align-items: stretch;\n  border: 1px solid #cbd5e1;\n  border-radius: 0.75rem;\n  overflow: hidden;\n  background: white;\n  transition:\n    border-color 0.18s,\n    box-shadow 0.18s;\n}\n\n:host ::ng-deep .auth-phone-group.p-inputgroup:has(input:focus) {\n  border-color: var(--color-primary);\n  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.13);\n}\n\n:host ::ng-deep .auth-phone-group--invalid.p-inputgroup {\n  border-color: #dc2626;\n}\n\n:host ::ng-deep .auth-phone-group .p-inputgroupaddon {\n  display: flex;\n  align-items: center;\n  align-self: stretch;\n  border: 0;\n  border-right: 1px solid #cbd5e1;\n  background: #f1f5f9;\n  padding: 0 0.85rem;\n  color: #40516a;\n  font-size: 0.9rem;\n  font-weight: 700;\n}\n\n:host ::ng-deep .auth-phone-group input.p-inputtext {\n  min-width: 0;\n  flex: 1;\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n  min-height: 0;\n  padding: 0 0.9rem;\n}\n\n.field__toggle {\n  display: grid;\n  width: 2.5rem;\n  height: 2.5rem;\n  place-items: center;\n  border: 0;\n  border-radius: 0.5rem;\n  background: transparent;\n  color: #475569;\n  cursor: pointer;\n}\n\n.field__toggle:hover {\n  background: var(--color-primary-fixed);\n  color: var(--color-primary);\n}\n\n.form-notice {\n  margin: 0 0 1rem;\n  padding: 0.75rem 0.9rem;\n  border-radius: 0.6rem;\n  border: 1px solid #bfdbfe;\n  background: #eff6ff;\n  color: #1e40af;\n  font-size: 0.85rem;\n  line-height: 1.4;\n}\n\n.field__error {\n  margin: 0.35rem 0 0;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  color: #b91c1c;\n  font-size: 0.85rem;\n  font-weight: 600;\n  line-height: 1.4;\n}\n\n.form-error {\n  margin: 0 0 1rem;\n  color: #b91c1c;\n  font-size: 0.85rem;\n  line-height: 1.4;\n}\n\n.form-error--banner {\n  border-radius: 0.6rem;\n  background: #fef2f2;\n  border: 1px solid #fecaca;\n  padding: 0.75rem 0.9rem;\n}\n\n.form-options {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  margin: 1.25rem 0;\n  font-size: 0.85rem;\n}\n\n.form-options a,\n.signup a {\n  font-weight: 700;\n  text-decoration: none;\n}\n\n.form-options a:hover,\n.signup a:hover {\n  text-decoration: underline;\n}\n\n.register-terms a {\n  color: var(--color-primary);\n  font-weight: 650;\n  text-underline-offset: 2px;\n}\n\n.register-terms a:hover {\n  text-decoration: underline;\n}\n\n.remember {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.55rem;\n  color: #475569;\n  cursor: pointer;\n}\n\n:host ::ng-deep .remember .p-checkbox .p-checkbox-box {\n  border-color: #cbd5e1;\n}\n\n:host ::ng-deep .remember .p-checkbox.p-checkbox-checked .p-checkbox-box {\n  border-color: var(--color-primary);\n  background: var(--color-primary);\n}\n\n.submit-button,\n.code-button {\n  display: flex;\n  width: 100%;\n  min-height: 3.5rem;\n  align-items: center;\n  justify-content: center;\n  gap: 0.65rem;\n  border-radius: 0.75rem;\n  font-weight: 750;\n  transition:\n    transform 0.15s,\n    background 0.15s,\n    box-shadow 0.15s;\n}\n\n.submit-button {\n  border: 0;\n  background: var(--color-primary);\n  color: white;\n  box-shadow: 0 2px 8px rgb(37 99 235 / 0.12);\n  cursor: pointer;\n}\n\n.submit-button:not(:disabled):hover {\n  background: var(--color-primary-container);\n  box-shadow: 0 3px 10px rgb(37 99 235 / 0.14);\n}\n\n.submit-button:disabled {\n  cursor: not-allowed;\n  opacity: 0.55;\n  box-shadow: none;\n}\n\n@keyframes submit-button-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n.submit-button__icon {\n  width: 1rem;\n  text-align: center;\n}\n\n.submit-button__icon--spin {\n  display: inline-block;\n  animation: submit-button-spin 0.75s linear infinite;\n}\n\n.separator {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  margin: 1.45rem 0;\n  color: #64748b;\n  font-size: 0.85rem;\n  font-weight: 600;\n}\n\n.separator::before,\n.separator::after {\n  height: 1px;\n  flex: 1;\n  background: #e2e8f0;\n  content: '';\n}\n\n.code-button {\n  border: 1px solid #93c5fd;\n  background: white;\n  color: var(--color-primary);\n}\n\n.code-button:disabled {\n  cursor: not-allowed;\n  opacity: 0.68;\n}\n\n.signup {\n  margin: 1.75rem 0 0;\n  text-align: center;\n  color: #64748b;\n  font-size: 0.9rem;\n}\n\n.auth-panel__footer {\n  text-align: center;\n  color: #64748b;\n  font-size: 0.72rem;\n}\n\n.auth-panel__footer p {\n  margin: 0.35rem 0;\n}\n\n.auth-panel__footer button {\n  border: 0;\n  background: transparent;\n  color: #64748b;\n  text-decoration: underline;\n  cursor: pointer;\n}\n\n.status-success {\n  color: var(--color-primary);\n  font-weight: 700;\n}\n\n@media (min-width: 1024px) {\n  :host:has(.login-page),\n  .login-page,\n  .login-stage {\n    height: 100dvh;\n    overflow: hidden;\n  }\n\n  .login-stage {\n    position: relative;\n  }\n\n  /* Image = fond du m\u00EAme bloc que le formulaire (pas une colonne s\u00E9par\u00E9e) */\n  .login-visual {\n    position: absolute;\n    inset: 0;\n    z-index: 0;\n    display: block;\n    overflow: hidden;\n    background: #f8fafc;\n  }\n\n  .hero__photo {\n    top: -1.5%;\n    left: -2%;\n    width: 106%;\n    height: 106%;\n    max-width: none;\n    object-fit: cover;\n    object-position: 27% 60%;\n    transform: none;\n  }\n\n  .hero__content {\n    max-width: min(48vw, 34rem);\n  }\n\n  .brand--desktop {\n    display: inline-flex;\n    color: #102033;\n  }\n\n  .brand--desktop .brand__mark {\n    box-shadow: 0 8px 20px rgb(37 99 235 / 0.25);\n  }\n\n  .brand--mobile {\n    display: none;\n  }\n\n  .auth-panel {\n    position: relative;\n    z-index: 2;\n    display: flex;\n    min-height: 100dvh;\n    flex-direction: column;\n    justify-content: center;\n    padding: clamp(4rem, 10vh, 5rem) clamp(1.5rem, 4vw, 3.25rem) clamp(1rem, 2vh, 1.5rem);\n    background: transparent;\n  }\n\n  .auth-panel__header {\n    position: absolute;\n    z-index: 3;\n    top: clamp(1rem, 3vh, 2rem);\n    right: clamp(1.25rem, 2.5vw, 2.25rem);\n    justify-content: flex-end;\n  }\n\n  .auth-card {\n    position: relative;\n    z-index: 4;\n    display: flex;\n    width: min(100%, 31.5rem);\n    max-width: none;\n    min-height: unset;\n    flex-direction: column;\n    margin: 0 0 0 auto;\n    padding: clamp(1.85rem, 3vh, 2.45rem);\n    transform: translateX(clamp(-2.5rem, -4vw, -1.25rem));\n    border: 1px solid rgb(226 232 240 / 0.85);\n    border-radius: 1rem;\n    background: #fff;\n    box-shadow: 0 1.1rem 2.75rem rgb(15 73 57 / 0.12);\n  }\n\n  .auth-card form {\n    display: flex;\n    min-height: 0;\n    flex: 1;\n    flex-direction: column;\n  }\n\n  .auth-card__intro {\n    margin-bottom: clamp(1.25rem, 2.8vh, 2rem);\n  }\n\n  .auth-card h1 {\n    font-size: clamp(1.8rem, 2.2vw, 2.45rem);\n  }\n\n  .auth-card__intro p {\n    margin-top: 0.5rem;\n    font-size: clamp(0.85rem, 1vw, 1rem);\n    line-height: 1.45;\n  }\n\n  .field > label {\n    position: absolute;\n    width: 1px;\n    height: 1px;\n    overflow: hidden;\n    clip: rect(0, 0, 0, 0);\n    white-space: nowrap;\n  }\n\n  .field + .field {\n    margin-top: clamp(0.75rem, 1.8vh, 1.15rem);\n  }\n\n  .field__control {\n    min-height: clamp(2.9rem, 6.2vh, 3.5rem);\n  }\n\n  :host ::ng-deep .auth-phone-group.p-inputgroup {\n    min-height: clamp(2.9rem, 6.2vh, 3.5rem);\n  }\n\n  .field__error {\n    margin-top: 0.25rem;\n  }\n\n  .form-options {\n    margin: clamp(0.8rem, 2vh, 1.25rem) 0;\n  }\n\n  .submit-button,\n  .code-button {\n    min-height: clamp(2.9rem, 6.2vh, 3.5rem);\n  }\n\n  .separator {\n    margin: clamp(0.85rem, 2.1vh, 1.4rem) 0;\n  }\n\n  .auth-card:not(.auth-card--recovery) form > .signup {\n    margin-top: auto;\n    padding-top: clamp(1rem, 2.5vh, 1.75rem);\n  }\n\n  .auth-panel__footer {\n    position: absolute;\n    z-index: 1;\n    right: 1rem;\n    bottom: 0.35rem;\n    left: auto;\n    width: min(44%, 20rem);\n    font-size: 0.6rem;\n    line-height: 1;\n    text-align: right;\n  }\n\n  .auth-panel__footer > p:first-child {\n    display: none;\n  }\n}\n\n@media (max-width: 480px) {\n  .auth-panel {\n    padding-inline: 1rem;\n  }\n\n  .brand small {\n    display: none;\n  }\n\n  .brand__mark {\n    width: 2.6rem;\n    height: 2.6rem;\n  }\n\n  .form-options {\n    align-items: flex-start;\n    font-size: 0.78rem;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .submit-button {\n    transition: none;\n  }\n}\n", ":host {\n  display: block;\n  min-height: 100dvh;\n  height: auto;\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n\n.register-page {\n  min-height: 100dvh;\n  background: #f8fafc;\n  color: #102033;\n}\n\n.register-stage {\n  min-height: 100dvh;\n  display: grid;\n  grid-template-columns: 1fr;\n}\n\n.register-hero {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  padding: clamp(1.5rem, 4vw, 2.5rem);\n  color: #fff;\n  background: linear-gradient(145deg, #1e3a8a 0%, #2563eb 48%, #0284c7 100%);\n}\n\n.register-hero__kuba-pattern {\n  position: absolute;\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  object-position: center;\n  opacity: 0.15;\n  mix-blend-mode: soft-light;\n  pointer-events: none;\n}\n\n.register-hero__glow {\n  position: absolute;\n  top: -20%;\n  right: -15%;\n  width: 55%;\n  height: 70%;\n  border-radius: 50%;\n  background: rgb(255 255 255 / 0.12);\n  filter: blur(40px);\n  pointer-events: none;\n}\n\n.register-hero__wave {\n  position: absolute;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  height: 45%;\n  width: 100%;\n  pointer-events: none;\n  opacity: 0.9;\n}\n\n.register-hero__brand {\n  position: relative;\n  z-index: 1;\n  color: #fff;\n  text-decoration: none;\n}\n\n.register-hero__brand .brand__mark {\n  background: rgb(255 255 255 / 0.18);\n  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.25);\n}\n\n.register-hero__brand strong,\n.register-hero__brand small {\n  color: #fff;\n}\n\n.register-hero__brand small {\n  opacity: 0.82;\n}\n\n.register-hero__body {\n  position: relative;\n  z-index: 1;\n  margin-top: auto;\n  padding-top: clamp(2rem, 8vh, 4rem);\n}\n\n.register-hero__eyebrow {\n  margin: 0 0 0.65rem;\n  font-size: 0.78rem;\n  font-weight: 700;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n  color: rgb(191 219 254 / 0.95);\n}\n\n.register-hero h1 {\n  margin: 0;\n  max-width: 16ch;\n  font-size: clamp(1.75rem, 4vw, 2.65rem);\n  line-height: 1.12;\n  letter-spacing: -0.03em;\n}\n\n.register-hero__lead {\n  margin: 1rem 0 0;\n  max-width: 38ch;\n  color: rgb(239 246 255 / 0.9);\n  font-size: 0.95rem;\n  line-height: 1.55;\n}\n\n.register-hero__features {\n  display: grid;\n  gap: 0.65rem;\n  margin: 1.75rem 0 0;\n  padding: 0;\n  list-style: none;\n}\n\n.register-hero__features li {\n  display: flex;\n  align-items: center;\n  gap: 0.65rem;\n  padding: 0.65rem 0.85rem;\n  border: 1px solid rgb(255 255 255 / 0.22);\n  border-radius: 0.85rem;\n  background: rgb(255 255 255 / 0.08);\n  font-size: 0.88rem;\n  font-weight: 650;\n  backdrop-filter: blur(4px);\n}\n\n.register-hero__features i {\n  width: 1.25rem;\n  text-align: center;\n  opacity: 0.95;\n}\n\n.register-workspace {\n  display: flex;\n  flex-direction: column;\n  min-height: 0;\n  padding: clamp(1rem, 3vw, 1.75rem);\n}\n\n.register-workspace__bar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  margin-bottom: 1rem;\n}\n\n.register-workspace__back {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.45rem;\n  color: var(--color-primary);\n  font-size: 0.88rem;\n  font-weight: 700;\n  text-decoration: none;\n}\n\n.register-workspace__back:hover {\n  text-decoration: underline;\n}\n\n.register-card {\n  flex: 0 0 auto;\n  border: 1px solid rgb(226 232 240 / 0.9);\n  border-radius: 1.35rem;\n  background: #fff;\n  box-shadow: 0 1.25rem 3rem rgb(15 23 42 / 0.08);\n  padding: clamp(1.35rem, 3vw, 2.1rem);\n}\n\n.register-card__head h2 {\n  margin: 0;\n  font-size: clamp(1.45rem, 2.5vw, 1.85rem);\n  letter-spacing: -0.03em;\n}\n\n.register-card__head h2 span {\n  color: var(--color-primary);\n}\n\n.register-card__head p {\n  margin: 0.4rem 0 0;\n  color: #64748b;\n  font-size: 0.92rem;\n  line-height: 1.5;\n}\n\n:host ::ng-deep .register-stepper {\n  display: block;\n  margin-top: 1.5rem;\n}\n\n:host ::ng-deep .register-stepper .p-step-title {\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n\n:host ::ng-deep .register-stepper .p-step-number {\n  width: 2.5rem;\n  min-width: 2.5rem;\n  height: 2.5rem;\n  font-size: 1.05rem;\n  font-weight: 700;\n}\n\n:host ::ng-deep .register-stepper .p-step-active .p-step-number {\n  border-color: var(--color-primary);\n  background: var(--color-primary-fixed);\n  color: var(--color-primary);\n}\n\n:host ::ng-deep .register-stepper .p-step-active .p-step-title {\n  color: var(--color-primary);\n}\n\n:host ::ng-deep .register-stepper .p-step-active .p-stepper-separator {\n  background: var(--color-primary);\n}\n\n:host ::ng-deep .register-stepper .register-step--complete .p-step-number {\n  border-color: var(--color-primary);\n  background: var(--color-primary);\n  color: var(--color-on-primary);\n}\n\n:host ::ng-deep .register-stepper .register-step--complete .p-step-title {\n  color: var(--color-primary);\n}\n\n:host ::ng-deep .register-stepper .register-step--complete .p-stepper-separator {\n  background: var(--color-primary);\n}\n\n.register-form {\n  margin-top: 1.35rem;\n}\n\n.register-form__section + .register-form__section {\n  margin-top: 1.5rem;\n  padding-top: 1.5rem;\n  border-top: 1px solid #f1f5f9;\n}\n\n.register-form__section-title {\n  display: flex;\n  align-items: center;\n  gap: 0.55rem;\n  margin: 0 0 1rem;\n  color: #0f172a;\n  font-size: 0.95rem;\n  font-weight: 750;\n}\n\n.register-form__section-title i {\n  color: var(--color-primary);\n}\n\n.register-form__grid {\n  display: grid;\n  gap: 0;\n}\n\n.register-form__grid--2 {\n  grid-template-columns: 1fr;\n}\n\n.register-form__grid--2 .field + .field {\n  margin-top: 1rem;\n}\n\n.register-form__grid + .register-form__grid {\n  margin-top: 1rem;\n}\n\n.field--sex {\n  margin: 1rem 0;\n}\n\n:host ::ng-deep .register-sex-select.p-select {\n  width: 100%;\n  min-height: 3.5rem;\n  border: 1px solid #cbd5e1;\n  border-radius: 0.75rem;\n  background: #fff;\n  box-shadow: none;\n}\n\n:host ::ng-deep .register-sex-select.p-select:not(.p-disabled):hover {\n  border-color: #94a3b8;\n}\n\n:host ::ng-deep .register-sex-select.p-select.p-focus {\n  border-color: var(--color-primary);\n  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.13);\n}\n\n:host ::ng-deep .register-sex-select .p-select-label {\n  display: flex;\n  align-items: center;\n  padding: 0 1rem;\n  color: #102033;\n}\n\n:host ::ng-deep .register-sex-select .p-select-dropdown {\n  width: 3rem;\n  color: #64748b;\n}\n\n:host ::ng-deep .register-select-panel.p-select-overlay {\n  overflow: hidden;\n  border: 1px solid var(--color-border-subtle);\n  border-radius: 0.75rem;\n  box-shadow: 0 14px 32px rgb(15 23 42 / 0.12);\n}\n\n.register-optional {\n  color: #94a3b8;\n  font-size: 0.78rem;\n  font-weight: 500;\n}\n\n.field--email-availability .field__lead-icon {\n  width: 1.1rem;\n  flex-shrink: 0;\n  text-align: center;\n}\n\n.field__lead-icon--spin {\n  animation: submit-button-spin 0.75s linear infinite;\n}\n\n.field__trail-icon {\n  margin-left: auto;\n  flex-shrink: 0;\n  font-size: 1.05rem;\n}\n\n.field__trail-icon--ok {\n  color: var(--color-primary);\n}\n\n.field__trail-icon--error {\n  color: #e53e3e;\n}\n\n.field__control--email-available {\n  border-color: var(--color-primary);\n  box-shadow: 0 0 0 2px rgb(37 99 235 / 0.12);\n}\n\n.field__control--email-checking {\n  border-color: #cbd5e1;\n}\n\n.field__error--actions {\n  margin-top: 0.55rem;\n  padding: 0.75rem 0.9rem;\n  border-radius: 0.6rem;\n  border: 1px solid #fca5a5;\n  background: #fef2f2;\n  color: #991b1b;\n  line-height: 1.45;\n}\n\n.field__error--actions a {\n  color: var(--color-primary);\n  font-weight: 700;\n  text-underline-offset: 3px;\n}\n\n.field__error--actions a:hover {\n  color: var(--color-on-primary-fixed);\n}\n\n.register-terms label {\n  cursor: pointer;\n}\n\n.field__error--phone {\n  margin-top: 0.45rem;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  color: #b91c1c;\n}\n\n.register-terms {\n  display: flex;\n  margin-top: 1.15rem;\n  align-items: flex-start;\n  line-height: 1.45;\n}\n\n.register-terms--invalid {\n  color: #b91c1c;\n}\n\n.register-form__footer {\n  margin-top: 1.5rem;\n  padding-top: 1.25rem;\n  border-top: 1px solid #f1f5f9;\n}\n\n.register-form__footer-toolbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1.25rem;\n  margin-bottom: 0.9rem;\n}\n\n.register-form__actions {\n  display: flex;\n  flex-shrink: 0;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.65rem;\n}\n\n.register-form__footer app-auth-legal-notice {\n  flex: 1 1 100%;\n  width: 100%;\n}\n\n.register-form__footer .submit-button {\n  width: auto;\n  min-width: 9rem;\n  box-shadow: 0 2px 6px rgb(37 99 235 / 0.1);\n}\n\n.register-form__footer .submit-button:not(:disabled):hover {\n  transform: none;\n  box-shadow: 0 2px 8px rgb(37 99 235 / 0.12);\n}\n\n.wizard-button {\n  display: inline-flex;\n  min-height: 3rem;\n  align-items: center;\n  justify-content: center;\n  gap: 0.55rem;\n  border: 1px solid #cbd5e1;\n  border-radius: 0.75rem;\n  padding: 0.7rem 1rem;\n  background: #fff;\n  color: #334155;\n  font: inherit;\n  font-size: 0.9rem;\n  font-weight: 750;\n  cursor: pointer;\n  text-decoration: none;\n}\n\n.wizard-button:hover {\n  border-color: #94a3b8;\n  background: #f8fafc;\n}\n\n.register-form__footer .signup {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 0.35rem;\n  margin: 0;\n  padding: 0;\n  min-height: 3rem;\n  min-width: 0;\n  line-height: 1.45;\n  text-align: left;\n  color: #64748b;\n  font-size: 0.9rem;\n}\n\n.register-form__footer .signup a {\n  font-weight: 700;\n  text-decoration: none;\n  color: var(--color-primary);\n}\n\n.register-form__footer .signup a:hover {\n  text-decoration: underline;\n}\n\n@media (max-width: 640px) {\n  .register-form__footer-toolbar {\n    align-items: stretch;\n    flex-direction: column;\n    gap: 1rem;\n  }\n  .register-form__footer .signup {\n    text-align: center;\n    justify-content: center;\n  }\n  .register-form__actions {\n    width: 100%;\n    flex-wrap: wrap;\n    justify-content: stretch;\n  }\n  .register-form__actions > * {\n    flex: 1 1 auto;\n  }\n  .register-form__footer .submit-button {\n    width: auto;\n  }\n}\n\n.register-card__success {\n  text-align: center;\n  padding: 2rem 0.5rem 0.5rem;\n}\n\n.register-card__success-icon {\n  color: var(--color-primary);\n  font-size: 2.75rem;\n}\n\n.register-card__success h2 {\n  margin: 0.85rem 0 0;\n}\n\n.register-card__success p {\n  margin: 0.5rem auto 1.5rem;\n  max-width: 36ch;\n  color: #64748b;\n}\n\n.field__control--select {\n  align-items: center;\n  padding: 0 0.9rem;\n}\n\n.field__control--select > i {\n  flex-shrink: 0;\n  width: 1em;\n  text-align: center;\n  color: var(--color-primary);\n}\n\n.field__select {\n  display: flex;\n  flex: 1;\n  min-width: 0;\n  align-items: center;\n}\n\n:host ::ng-deep .field__select > p-select {\n  display: flex;\n  flex: 1;\n  width: 100%;\n  min-width: 0;\n}\n\n:host ::ng-deep .field__select .register-activity-select.p-select {\n  display: flex;\n  width: 100%;\n  min-height: 0;\n  padding: 0;\n  align-items: center;\n  border: 0;\n  border-radius: 0;\n  background: transparent;\n  box-shadow: none !important;\n}\n\n:host ::ng-deep .field__select .register-activity-select.p-select.p-focus {\n  border-color: transparent;\n  box-shadow: none !important;\n}\n\n:host ::ng-deep .field__select .register-activity-select .p-select-label {\n  display: flex;\n  flex: 1;\n  align-items: center;\n  min-height: 0;\n  padding: 0;\n  font-size: inherit;\n  line-height: 1.25;\n  color: #102033;\n}\n\n:host ::ng-deep .field__select .register-activity-select .p-select-dropdown {\n  width: 2.5rem;\n  color: #475569;\n}\n\n:host ::ng-deep .field__control--select .register-activity-select.p-select,\n:host ::ng-deep .field__control--select .register-activity-select.p-inputwrapper {\n  min-height: 0;\n}\n\n@media (min-width: 640px) {\n  .register-form__grid--2 {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    gap: 1rem;\n  }\n\n  .register-form__grid--2 .field + .field {\n    margin-top: 0;\n  }\n}\n\n@media (min-width: 1024px) {\n  :host {\n    height: 100dvh;\n    overflow: hidden;\n  }\n\n  .register-stage {\n    grid-template-columns: minmax(18rem, 26rem) minmax(0, 1fr);\n    height: 100dvh;\n    max-height: 100dvh;\n    overflow: hidden;\n  }\n\n  .register-hero {\n    min-height: 0;\n    height: 100%;\n    padding-bottom: 2.5rem;\n    overflow-y: auto;\n  }\n\n  .register-workspace {\n    min-height: 0;\n    height: 100%;\n    overflow-y: auto;\n    overscroll-behavior: contain;\n    padding: clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 4vw, 3rem);\n  }\n\n  .register-card {\n    margin: 0 auto;\n    width: min(100%, clamp(44rem, 46vw, 52rem));\n  }\n\n  .register-form__footer .submit-button {\n    width: auto;\n    min-width: 14rem;\n  }\n\n  .register-form__footer .wizard-button {\n    min-width: 8.75rem;\n  }\n}\n\n@media (max-width: 1023px) {\n  .register-hero {\n    min-height: auto;\n  }\n\n  .register-hero__body {\n    padding-top: 1.5rem;\n    padding-bottom: 0.5rem;\n  }\n\n  .register-hero__features {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n\n@media (max-width: 479px) {\n  .register-hero__features {\n    grid-template-columns: 1fr;\n  }\n\n  .register-workspace__back {\n    font-size: 0.8rem;\n  }\n}\n"] }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(Register, { className: "Register", filePath: "src/app/features/auth/register/register.ts", lineNumber: 65 }); })();
