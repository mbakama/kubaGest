import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Select } from 'primeng/select';
import { AUTH_FORM_PRIME_IMPORTS } from '../auth-prime-fields';
import { AuthLegalNotice } from '../auth-legal-notice';
import { ApiService } from '../../../core/api/api.service';
import { AuthSessionService } from '../../../core/auth/auth-session.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "primeng/inputtext";
import * as i3 from "primeng/checkbox";
function Login_ng_template_58_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 63);
    i0.ɵɵelement(1, "i", 64);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const option_r1 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(option_r1?.label);
} }
function Login_ng_template_60_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 65);
} }
function Login_Conditional_71_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 34);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.loginError());
} }
function Login_Conditional_78_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 40);
    i0.ɵɵtext(1, " Saisissez une adresse e-mail valide. ");
    i0.ɵɵelementEnd();
} }
function Login_Conditional_87_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 46);
    i0.ɵɵtext(1, " Le mot de passe doit contenir au moins 6 caract\u00E8res. ");
    i0.ɵɵelementEnd();
} }
function Login_Conditional_96_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 52);
} }
function Login_Conditional_97_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 53);
} }
function Login_Case_116_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " Test du serveur en cours\u2026 ");
} }
function Login_Case_117_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 61);
    i0.ɵɵtext(1, "Serveur joignable");
    i0.ɵɵelementEnd();
} }
function Login_Case_118_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 66);
    i0.ɵɵlistener("click", function Login_Case_118_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.checkApi()); });
    i0.ɵɵtext(1, "Serveur indisponible \u2014 r\u00E9essayer");
    i0.ɵɵelementEnd();
} }
function Login_Case_119_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 66);
    i0.ɵɵlistener("click", function Login_Case_119_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.checkApi()); });
    i0.ɵɵtext(1, "V\u00E9rifier la connexion au serveur");
    i0.ɵɵelementEnd();
} }
export class Login {
    api = inject(ApiService);
    authSession = inject(AuthSessionService);
    router = inject(Router);
    destroyRef = inject(DestroyRef);
    showPassword = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "showPassword" }] : /* istanbul ignore next */ []));
    submitting = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "submitting" }] : /* istanbul ignore next */ []));
    loginError = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "loginError" }] : /* istanbul ignore next */ []));
    apiState = signal('idle', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "apiState" }] : /* istanbul ignore next */ []));
    localeOptions = [
        { label: 'FR', value: 'fr' },
        { label: 'EN', value: 'en' },
        { label: 'LN', value: 'ln' },
        { label: 'SW', value: 'sw' },
    ];
    form = new FormGroup({
        email: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.email],
        }),
        password: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(6)],
        }),
        rememberMe: new FormControl(true, { nonNullable: true }),
        locale: new FormControl('fr', { nonNullable: true }),
    });
    togglePassword() {
        this.showPassword.update((v) => !v);
    }
    submit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        if (this.submitting())
            return;
        this.loginError.set(null);
        this.submitting.set(true);
        const { email, password, rememberMe } = this.form.getRawValue();
        this.api
            .login({ email: email.trim(), password })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (response) => {
                this.submitting.set(false);
                this.authSession.saveFromLogin(response, rememberMe);
                const home = this.authSession.homeRoute();
                if (home) {
                    void this.router.navigateByUrl(home);
                }
            },
            error: (err) => {
                this.submitting.set(false);
                this.loginError.set(this.readLoginError(err));
            },
        });
    }
    readLoginError(err) {
        if (err instanceof HttpErrorResponse) {
            if (err.status === 0) {
                return 'Serveur inaccessible. Vérifiez que l’API est démarrée.';
            }
            if (err.status === 401) {
                return 'E-mail ou mot de passe incorrect.';
            }
            const message = err.error?.message;
            if (typeof message === 'string') {
                return message;
            }
        }
        return 'Connexion impossible. Réessayez.';
    }
    checkApi() {
        if (this.apiState() === 'loading')
            return;
        this.apiState.set('loading');
        this.api
            .checkConnection()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (body) => this.apiState.set(body.trim() === 'Hello World!' ? 'success' : 'error'),
            error: () => this.apiState.set('error'),
        });
    }
    static ɵfac = function Login_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || Login)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: Login, selectors: [["app-login"]], decls: 120, vars: 27, consts: [["selectedItem", ""], ["dropdownicon", ""], ["id", "content", "tabindex", "-1", 1, "login-page"], [1, "login-stage"], ["aria-labelledby", "hero-title", 1, "login-visual"], ["src", "assets/login-hero.webp", "alt", "", "width", "1600", "height", "900", "fetchpriority", "high", "decoding", "async", 1, "hero__photo"], ["aria-hidden", "true", 1, "hero__shade"], ["viewBox", "0 0 1200 800", "preserveAspectRatio", "none", "aria-hidden", "true", 1, "hero__shape"], ["id", "hero-shape-grad", "x1", "0%", "y1", "0%", "x2", "80%", "y2", "100%"], ["offset", "0%", "stop-color", "#2563eb", "stop-opacity", "0.62"], ["offset", "100%", "stop-color", "#1d4ed8", "stop-opacity", "0.72"], ["fill", "url(#hero-shape-grad)", "d", "M0,420 C240,320 400,500 640,380 S980,300 1200,360 L1200,800 L0,800 Z"], ["viewBox", "0 0 320 800", "preserveAspectRatio", "none", "aria-hidden", "true", 1, "hero__curve"], ["fill", "#f8fafc", "d", "M0,0 H102 C156,72 186,248 170,430 S205,652 132,800 H320 V0 Z"], [1, "hero__content"], ["routerLink", "/authentification", "aria-label", "KubaGest", 1, "brand", "brand--desktop"], ["aria-hidden", "true", 1, "brand__mark"], [1, "hero__pitch"], ["id", "hero-title"], [1, "hero__features"], ["aria-hidden", "true", 1, "hero__feature"], [1, "fa-solid", "fa-cart-shopping"], [1, "fa-solid", "fa-boxes-stacked"], [1, "fa-solid", "fa-truck"], [1, "fa-solid", "fa-chart-column"], ["aria-labelledby", "login-title", 1, "auth-panel"], [1, "auth-panel__header"], ["routerLink", "/authentification", "aria-label", "KubaGest, accueil de connexion", 1, "brand", "brand--mobile"], [1, "language"], ["inputId", "login-locale", "size", "small", "optionLabel", "label", "optionValue", "value", "styleClass", "language-select", "panelStyleClass", "language-select-panel", "appendTo", "body", "ariaLabel", "Langue de l\u2019interface", 3, "options", "formControl"], [1, "auth-card"], [1, "auth-card__intro"], ["id", "login-title"], ["novalidate", "", 3, "ngSubmit", "formGroup"], ["role", "alert", 1, "form-error", "form-error--banner"], [1, "field"], ["for", "email"], [1, "field__control"], ["aria-hidden", "true", 1, "fa-solid", "fa-envelope"], ["pInputText", "", "fluid", "", "id", "email", "type", "email", "formControlName", "email", "autocomplete", "email", "inputmode", "email", "placeholder", "Adresse e-mail", "aria-describedby", "email-error", 3, "invalid"], ["id", "email-error", "role", "alert", 1, "field__error"], ["for", "password"], ["aria-hidden", "true", 1, "fa-solid", "fa-lock"], ["pInputText", "", "fluid", "", "id", "password", "formControlName", "password", "autocomplete", "current-password", "placeholder", "Mot de passe", "aria-describedby", "password-error", 3, "type", "invalid"], ["type", "button", 1, "field__toggle", 3, "click"], ["aria-hidden", "true", 1, "fa-solid"], ["id", "password-error", "role", "alert", 1, "field__error"], [1, "form-options"], ["for", "login-remember-me", 1, "remember"], ["formControlName", "rememberMe", "inputId", "login-remember-me", 3, "binary"], ["routerLink", "/mot-de-passe-oublie"], ["type", "submit", 1, "submit-button", 3, "disabled"], ["aria-hidden", "true", 1, "fa-solid", "fa-spinner", "submit-button__icon", "submit-button__icon--spin"], ["aria-hidden", "true", 1, "fa-solid", "fa-right-to-bracket", "submit-button__icon"], [1, "separator"], ["type", "button", "disabled", "", "title", "Connexion par code bient\u00F4t disponible", 1, "code-button"], ["aria-hidden", "true", 1, "fa-solid", "fa-qrcode"], [1, "signup"], ["routerLink", "/inscription"], [1, "auth-panel__footer"], ["role", "status", "aria-live", "polite"], [1, "status-success"], ["type", "button"], [1, "language__trigger"], ["aria-hidden", "true", 1, "fa-solid", "fa-globe"], ["aria-hidden", "true", 1, "fa-solid", "fa-chevron-down", "language__chevron"], ["type", "button", 3, "click"]], template: function Login_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "main", 2)(1, "div", 3)(2, "div", 4);
            i0.ɵɵelement(3, "img", 5)(4, "div", 6);
            i0.ɵɵnamespaceSVG();
            i0.ɵɵelementStart(5, "svg", 7)(6, "defs")(7, "linearGradient", 8);
            i0.ɵɵelement(8, "stop", 9)(9, "stop", 10);
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(10, "path", 11);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(11, "svg", 12);
            i0.ɵɵelement(12, "path", 13);
            i0.ɵɵelementEnd();
            i0.ɵɵnamespaceHTML();
            i0.ɵɵelementStart(13, "div", 14)(14, "a", 15)(15, "span", 16);
            i0.ɵɵtext(16, "K");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "span")(18, "strong");
            i0.ɵɵtext(19, "KubaGest");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "small");
            i0.ɵɵtext(21, "Gestion commerciale int\u00E9gr\u00E9e");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(22, "div", 17)(23, "h2", 18);
            i0.ɵɵtext(24, "Vendez, encaissez et pilotez votre stock en toute simplicit\u00E9.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(25, "ul", 19)(26, "li")(27, "span", 20);
            i0.ɵɵelement(28, "i", 21);
            i0.ɵɵelementStart(29, "span");
            i0.ɵɵtext(30, "Ventes");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(31, "li")(32, "span", 20);
            i0.ɵɵelement(33, "i", 22);
            i0.ɵɵelementStart(34, "span");
            i0.ɵɵtext(35, "Stocks");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(36, "li")(37, "span", 20);
            i0.ɵɵelement(38, "i", 23);
            i0.ɵɵelementStart(39, "span");
            i0.ɵɵtext(40, "Achats");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(41, "li")(42, "span", 20);
            i0.ɵɵelement(43, "i", 24);
            i0.ɵɵelementStart(44, "span");
            i0.ɵɵtext(45, "Rapports");
            i0.ɵɵelementEnd()()()()()()();
            i0.ɵɵelementStart(46, "section", 25)(47, "header", 26)(48, "a", 27)(49, "span", 16);
            i0.ɵɵtext(50, "K");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(51, "span")(52, "strong");
            i0.ɵɵtext(53, "KubaGest");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(54, "small");
            i0.ɵɵtext(55, "Gestion commerciale int\u00E9gr\u00E9e");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(56, "div", 28)(57, "p-select", 29);
            i0.ɵɵcontrolCreate();
            i0.ɵɵtemplate(58, Login_ng_template_58_Template, 4, 1, "ng-template", null, 0, i0.ɵɵtemplateRefExtractor)(60, Login_ng_template_60_Template, 1, 0, "ng-template", null, 1, i0.ɵɵtemplateRefExtractor);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(62, "div", 30)(63, "div", 31)(64, "h1", 32);
            i0.ɵɵtext(65, "Connexion \u00E0 ");
            i0.ɵɵelementStart(66, "span");
            i0.ɵɵtext(67, "KubaGest");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(68, "p");
            i0.ɵɵtext(69, "Acc\u00E9dez \u00E0 votre espace professionnel et g\u00E9rez votre commerce en toute s\u00E9curit\u00E9.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(70, "form", 33);
            i0.ɵɵlistener("ngSubmit", function Login_Template_form_ngSubmit_70_listener() { return ctx.submit(); });
            i0.ɵɵconditionalCreate(71, Login_Conditional_71_Template, 2, 1, "p", 34);
            i0.ɵɵelementStart(72, "div", 35)(73, "label", 36);
            i0.ɵɵtext(74, "Adresse e-mail");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(75, "div", 37);
            i0.ɵɵelement(76, "i", 38);
            i0.ɵɵelementStart(77, "input", 39);
            i0.ɵɵcontrolCreate();
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(78, Login_Conditional_78_Template, 2, 0, "p", 40);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(79, "div", 35)(80, "label", 41);
            i0.ɵɵtext(81, "Mot de passe");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(82, "div", 37);
            i0.ɵɵelement(83, "i", 42);
            i0.ɵɵelementStart(84, "input", 43);
            i0.ɵɵcontrolCreate();
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(85, "button", 44);
            i0.ɵɵlistener("click", function Login_Template_button_click_85_listener() { return ctx.togglePassword(); });
            i0.ɵɵelement(86, "i", 45);
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(87, Login_Conditional_87_Template, 2, 0, "p", 46);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(88, "div", 47)(89, "label", 48)(90, "p-checkbox", 49);
            i0.ɵɵcontrolCreate();
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(91, "span");
            i0.ɵɵtext(92, "Se souvenir de moi");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(93, "a", 50);
            i0.ɵɵtext(94, "Mot de passe oubli\u00E9\u00A0?");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(95, "button", 51);
            i0.ɵɵconditionalCreate(96, Login_Conditional_96_Template, 1, 0, "i", 52)(97, Login_Conditional_97_Template, 1, 0, "i", 53);
            i0.ɵɵelementStart(98, "span");
            i0.ɵɵtext(99);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(100, "div", 54)(101, "span");
            i0.ɵɵtext(102, "ou");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(103, "button", 55);
            i0.ɵɵelement(104, "i", 56);
            i0.ɵɵelementStart(105, "span");
            i0.ɵɵtext(106, "Se connecter avec un code");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(107, "p", 57);
            i0.ɵɵtext(108, " Pas encore d\u2019espace\u00A0? ");
            i0.ɵɵelementStart(109, "a", 58);
            i0.ɵɵtext(110, "Cr\u00E9er un espace");
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(111, "app-auth-legal-notice");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(112, "div", 59)(113, "p");
            i0.ɵɵtext(114, "KubaGest \u00B7 Votre commerce, mieux organis\u00E9.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(115, "p", 60);
            i0.ɵɵconditionalCreate(116, Login_Case_116_Template, 1, 0)(117, Login_Case_117_Template, 2, 0, "span", 61)(118, Login_Case_118_Template, 2, 0, "button", 62)(119, Login_Case_119_Template, 2, 0, "button", 62);
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            let tmp_28_0;
            i0.ɵɵadvance(57);
            i0.ɵɵproperty("options", ctx.localeOptions)("formControl", ctx.form.controls.locale);
            i0.ɵɵcontrol();
            i0.ɵɵadvance(13);
            i0.ɵɵproperty("formGroup", ctx.form);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.loginError() ? 71 : -1);
            i0.ɵɵadvance(4);
            i0.ɵɵclassProp("field__control--invalid", ctx.form.controls.email.touched && ctx.form.controls.email.invalid);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("invalid", ctx.form.controls.email.touched && ctx.form.controls.email.invalid);
            i0.ɵɵattribute("aria-invalid", ctx.form.controls.email.touched && ctx.form.controls.email.invalid);
            i0.ɵɵcontrol();
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.form.controls.email.touched && ctx.form.controls.email.invalid ? 78 : -1);
            i0.ɵɵadvance(4);
            i0.ɵɵclassProp("field__control--invalid", ctx.form.controls.password.touched && ctx.form.controls.password.invalid);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("type", ctx.showPassword() ? "text" : "password")("invalid", ctx.form.controls.password.touched && ctx.form.controls.password.invalid);
            i0.ɵɵattribute("aria-invalid", ctx.form.controls.password.touched && ctx.form.controls.password.invalid);
            i0.ɵɵcontrol();
            i0.ɵɵadvance();
            i0.ɵɵattribute("aria-label", ctx.showPassword() ? "Masquer le mot de passe" : "Afficher le mot de passe")("aria-pressed", ctx.showPassword());
            i0.ɵɵadvance();
            i0.ɵɵclassProp("fa-eye-slash", ctx.showPassword())("fa-eye", !ctx.showPassword());
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.form.controls.password.touched && ctx.form.controls.password.invalid ? 87 : -1);
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("binary", true);
            i0.ɵɵcontrol();
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("disabled", ctx.submitting());
            i0.ɵɵattribute("aria-busy", ctx.submitting());
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.submitting() ? 96 : 97);
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.submitting() ? "Connexion en cours\u2026" : "Se connecter");
            i0.ɵɵadvance(17);
            i0.ɵɵconditional((tmp_28_0 = ctx.apiState()) === "loading" ? 116 : tmp_28_0 === "success" ? 117 : tmp_28_0 === "error" ? 118 : 119);
        } }, dependencies: [RouterLink, ReactiveFormsModule, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormControlDirective, i1.FormGroupDirective, i1.FormControlName, Select, AuthLegalNotice, i2.InputText, i3.Checkbox], styles: ["[_nghost-%COMP%] {\n  display: block;\n  min-height: 100dvh;\n}\n\n.login-page[_ngcontent-%COMP%] {\n  min-height: 100dvh;\n  background: #f8fafc;\n  color: #102033;\n}\n\n.login-stage[_ngcontent-%COMP%] {\n  min-height: 100dvh;\n}\n\n.login-visual[_ngcontent-%COMP%] {\n  display: none;\n}\n\n.hero__photo[_ngcontent-%COMP%], \n.hero__shade[_ngcontent-%COMP%], \n.hero__shape[_ngcontent-%COMP%], \n.hero__curve[_ngcontent-%COMP%] {\n  position: absolute;\n  pointer-events: none;\n}\n\n.hero__photo[_ngcontent-%COMP%] {\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  object-position: 24% 52%;\n}\n\n.hero__shade[_ngcontent-%COMP%] {\n  inset: 0;\n  background: linear-gradient(\n    180deg,\n    rgb(15 23 42 / 0.06) 0%,\n    transparent 42%,\n    rgb(37 99 235 / 0.07) 100%\n  );\n}\n\n.hero__shape[_ngcontent-%COMP%] {\n  z-index: 1;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  height: 52%;\n  width: 100%;\n}\n\n.hero__curve[_ngcontent-%COMP%] {\n  top: 0;\n  right: 0;\n  z-index: 2;\n  height: 100%;\n  width: min(44%, 31rem);\n}\n\n.hero__content[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 4;\n  display: flex;\n  height: 100%;\n  flex-direction: column;\n  justify-content: space-between;\n  padding: clamp(1.5rem, 3vw, 2.5rem);\n}\n\n.brand--desktop[_ngcontent-%COMP%] {\n  display: none;\n}\n\n.hero__pitch[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0 0 1.25rem;\n  max-width: 22rem;\n  color: white;\n  font-size: clamp(1.35rem, 2.2vw, 1.85rem);\n  font-weight: 700;\n  line-height: 1.25;\n  letter-spacing: -0.02em;\n  text-shadow: 0 2px 12px rgb(0 0 0 / 25%);\n}\n\n.hero__features[_ngcontent-%COMP%] {\n  display: grid;\n  max-width: 24rem;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 0.5rem;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n\n.hero__feature[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.4rem;\n  border: 1.5px solid rgb(255 255 255 / 0.45);\n  border-radius: 0.9rem;\n  background: rgb(255 255 255 / 0.12);\n  padding: 0.65rem 0.35rem 0.55rem;\n  color: white;\n  font-size: 0.68rem;\n  font-weight: 650;\n  line-height: 1.2;\n  text-align: center;\n}\n\n.hero__feature[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1.15rem;\n}\n\n.brand[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.75rem;\n  color: #102033;\n  text-decoration: none;\n}\n\n.brand__mark[_ngcontent-%COMP%] {\n  display: grid;\n  width: 3rem;\n  height: 3rem;\n  place-items: center;\n  border-radius: 0.875rem;\n  background: var(--%NS%color-primary);\n  color: white;\n  font-size: 1.55rem;\n  font-weight: 800;\n}\n\n.brand[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.brand[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n}\n\n.brand[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  line-height: 1.2;\n}\n\n.brand[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  margin-top: 0.125rem;\n  color: #64748b;\n  font-size: 0.68rem;\n}\n\n.auth-panel[_ngcontent-%COMP%] {\n  display: flex;\n  min-height: 100dvh;\n  flex-direction: column;\n  padding: 1rem 1.25rem;\n}\n\n.auth-panel__header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n}\n\n.language[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n}\n\n.language__trigger[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.45rem;\n  color: #102033;\n  font-size: 0.9rem;\n  font-weight: 700;\n}\n\n.language__chevron[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  color: #475569;\n}\n\n[_nghost-%COMP%]     .language-select.p-select {\n  display: flex;\n  align-items: center;\n  height: 2rem;\n  min-height: 0;\n  border: 1px solid #cbd5e1;\n  border-radius: 5px;\n  background: #fff;\n  box-shadow: none;\n}\n\n[_nghost-%COMP%]     .language-select.p-select:not(.p-disabled):hover {\n  border-color: #94a3b8;\n}\n\n[_nghost-%COMP%]     .language-select.p-select.p-focus {\n  border-color: var(--%NS%color-primary);\n  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.12);\n}\n\n[_nghost-%COMP%]     .language-select .p-select-label {\n  display: flex;\n  align-items: center;\n  padding: 0 0.15rem 0 0.65rem;\n  line-height: 1;\n}\n\n[_nghost-%COMP%]     .language-select .p-select-dropdown {\n  width: 2rem;\n  color: #475569;\n}\n\n[_nghost-%COMP%]     .language-select-panel.p-select-overlay {\n  overflow: hidden;\n  border: 1px solid #e2e8f0;\n  border-radius: 0.85rem;\n  box-shadow: 0 14px 32px rgb(15 23 42 / 0.12);\n  min-width: 7.25rem;\n}\n\n[_nghost-%COMP%]     .language-select-panel .p-select-option {\n  padding: 0.55rem 0.85rem;\n  font-size: 0.88rem;\n  font-weight: 600;\n}\n\n[_nghost-%COMP%]     .language-select-panel .p-select-option.p-select-option-selected {\n  background: var(--%NS%color-primary-fixed);\n  color: var(--%NS%color-primary);\n}\n\n.auth-card[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 34rem;\n  margin: auto;\n  padding: 2.25rem 0;\n}\n\n.auth-card__intro[_ngcontent-%COMP%] {\n  margin-bottom: 2rem;\n}\n\n.auth-card[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: clamp(1.75rem, 7vw, 2.5rem);\n  line-height: 1.15;\n  letter-spacing: -0.04em;\n}\n\n.auth-card[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \na[_ngcontent-%COMP%] {\n  color: var(--%NS%color-primary);\n}\n\n.auth-card__intro[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  max-width: 29rem;\n  margin: 0.75rem 0 0;\n  color: #64748b;\n  font-size: 1rem;\n  line-height: 1.6;\n}\n\n.field[_ngcontent-%COMP%]    + .field[_ngcontent-%COMP%] {\n  margin-top: 1.15rem;\n}\n\n.field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  margin-bottom: 0.45rem;\n  font-size: 0.875rem;\n  font-weight: 650;\n}\n\n.field__control[_ngcontent-%COMP%] {\n  display: flex;\n  min-height: 3.5rem;\n  align-items: center;\n  gap: 0.75rem;\n  border: 1px solid #cbd5e1;\n  border-radius: 0.75rem;\n  background: white;\n  padding: 0 0.9rem;\n  color: var(--%NS%color-primary);\n  transition:\n    border-color 0.18s,\n    box-shadow 0.18s;\n}\n\n.field__control[_ngcontent-%COMP%]:focus-within {\n  border-color: var(--%NS%color-primary);\n  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.13);\n}\n\n.field__control--invalid[_ngcontent-%COMP%] {\n  border-color: #dc2626;\n}\n\n.field__control[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  min-width: 0;\n  flex: 1;\n  border: 0;\n  outline: 0;\n  color: #102033;\n  background: transparent;\n}\n\n.field__control[_ngcontent-%COMP%]   input.p-inputtext[_ngcontent-%COMP%] {\n  box-shadow: none;\n  border-radius: 0;\n  padding: 0;\n  min-height: auto;\n}\n\n.field__control[_ngcontent-%COMP%]   input.p-inputtext[_ngcontent-%COMP%]:enabled:focus {\n  box-shadow: none;\n}\n\n.field__control[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]::placeholder, \n.field__control[_ngcontent-%COMP%]   input.p-inputtext[_ngcontent-%COMP%]::placeholder {\n  color: #94a3b8;\n}\n\n[_nghost-%COMP%]     .auth-phone-group.p-inputgroup {\n  display: flex;\n  width: 100%;\n  min-height: 3.5rem;\n  align-items: stretch;\n  border: 1px solid #cbd5e1;\n  border-radius: 0.75rem;\n  overflow: hidden;\n  background: white;\n  transition:\n    border-color 0.18s,\n    box-shadow 0.18s;\n}\n\n[_nghost-%COMP%]     .auth-phone-group.p-inputgroup:has(input:focus) {\n  border-color: var(--%NS%color-primary);\n  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.13);\n}\n\n[_nghost-%COMP%]     .auth-phone-group--invalid.p-inputgroup {\n  border-color: #dc2626;\n}\n\n[_nghost-%COMP%]     .auth-phone-group .p-inputgroupaddon {\n  display: flex;\n  align-items: center;\n  align-self: stretch;\n  border: 0;\n  border-right: 1px solid #cbd5e1;\n  background: #f1f5f9;\n  padding: 0 0.85rem;\n  color: #40516a;\n  font-size: 0.9rem;\n  font-weight: 700;\n}\n\n[_nghost-%COMP%]     .auth-phone-group input.p-inputtext {\n  min-width: 0;\n  flex: 1;\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n  min-height: 0;\n  padding: 0 0.9rem;\n}\n\n.field__toggle[_ngcontent-%COMP%] {\n  display: grid;\n  width: 2.5rem;\n  height: 2.5rem;\n  place-items: center;\n  border: 0;\n  border-radius: 0.5rem;\n  background: transparent;\n  color: #475569;\n  cursor: pointer;\n}\n\n.field__toggle[_ngcontent-%COMP%]:hover {\n  background: var(--%NS%color-primary-fixed);\n  color: var(--%NS%color-primary);\n}\n\n.form-notice[_ngcontent-%COMP%] {\n  margin: 0 0 1rem;\n  padding: 0.75rem 0.9rem;\n  border-radius: 0.6rem;\n  border: 1px solid #bfdbfe;\n  background: #eff6ff;\n  color: #1e40af;\n  font-size: 0.85rem;\n  line-height: 1.4;\n}\n\n.field__error[_ngcontent-%COMP%] {\n  margin: 0.35rem 0 0;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  color: #b91c1c;\n  font-size: 0.85rem;\n  font-weight: 600;\n  line-height: 1.4;\n}\n\n.form-error[_ngcontent-%COMP%] {\n  margin: 0 0 1rem;\n  color: #b91c1c;\n  font-size: 0.85rem;\n  line-height: 1.4;\n}\n\n.form-error--banner[_ngcontent-%COMP%] {\n  border-radius: 0.6rem;\n  background: #fef2f2;\n  border: 1px solid #fecaca;\n  padding: 0.75rem 0.9rem;\n}\n\n.form-options[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  margin: 1.25rem 0;\n  font-size: 0.85rem;\n}\n\n.form-options[_ngcontent-%COMP%]   a[_ngcontent-%COMP%], \n.signup[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  font-weight: 700;\n  text-decoration: none;\n}\n\n.form-options[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover, \n.signup[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n\n.register-terms[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: var(--%NS%color-primary);\n  font-weight: 650;\n  text-underline-offset: 2px;\n}\n\n.register-terms[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n\n.remember[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.55rem;\n  color: #475569;\n  cursor: pointer;\n}\n\n[_nghost-%COMP%]     .remember .p-checkbox .p-checkbox-box {\n  border-color: #cbd5e1;\n}\n\n[_nghost-%COMP%]     .remember .p-checkbox.p-checkbox-checked .p-checkbox-box {\n  border-color: var(--%NS%color-primary);\n  background: var(--%NS%color-primary);\n}\n\n.submit-button[_ngcontent-%COMP%], \n.code-button[_ngcontent-%COMP%] {\n  display: flex;\n  width: 100%;\n  min-height: 3.5rem;\n  align-items: center;\n  justify-content: center;\n  gap: 0.65rem;\n  border-radius: 0.75rem;\n  font-weight: 750;\n  transition:\n    transform 0.15s,\n    background 0.15s,\n    box-shadow 0.15s;\n}\n\n.submit-button[_ngcontent-%COMP%] {\n  border: 0;\n  background: var(--%NS%color-primary);\n  color: white;\n  box-shadow: 0 2px 8px rgb(37 99 235 / 0.12);\n  cursor: pointer;\n}\n\n.submit-button[_ngcontent-%COMP%]:not(:disabled):hover {\n  background: var(--%NS%color-primary-container);\n  box-shadow: 0 3px 10px rgb(37 99 235 / 0.14);\n}\n\n.submit-button[_ngcontent-%COMP%]:disabled {\n  cursor: not-allowed;\n  opacity: 0.55;\n  box-shadow: none;\n}\n\n@keyframes _ngcontent-%COMP%_submit-button-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n.submit-button__icon[_ngcontent-%COMP%] {\n  width: 1rem;\n  text-align: center;\n}\n\n.submit-button__icon--spin[_ngcontent-%COMP%] {\n  display: inline-block;\n  animation: _ngcontent-%COMP%_submit-button-spin 0.75s linear infinite;\n}\n\n.separator[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  margin: 1.45rem 0;\n  color: #64748b;\n  font-size: 0.85rem;\n  font-weight: 600;\n}\n\n.separator[_ngcontent-%COMP%]::before, \n.separator[_ngcontent-%COMP%]::after {\n  height: 1px;\n  flex: 1;\n  background: #e2e8f0;\n  content: '';\n}\n\n.code-button[_ngcontent-%COMP%] {\n  border: 1px solid #93c5fd;\n  background: white;\n  color: var(--%NS%color-primary);\n}\n\n.code-button[_ngcontent-%COMP%]:disabled {\n  cursor: not-allowed;\n  opacity: 0.68;\n}\n\n.signup[_ngcontent-%COMP%] {\n  margin: 1.75rem 0 0;\n  text-align: center;\n  color: #64748b;\n  font-size: 0.9rem;\n}\n\n.auth-panel__footer[_ngcontent-%COMP%] {\n  text-align: center;\n  color: #64748b;\n  font-size: 0.72rem;\n}\n\n.auth-panel__footer[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.35rem 0;\n}\n\n.auth-panel__footer[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 0;\n  background: transparent;\n  color: #64748b;\n  text-decoration: underline;\n  cursor: pointer;\n}\n\n.status-success[_ngcontent-%COMP%] {\n  color: var(--%NS%color-primary);\n  font-weight: 700;\n}\n\n@media (min-width: 1024px) {\n  [_nghost-%COMP%]:has(.login-page), \n   .login-page[_ngcontent-%COMP%], \n   .login-stage[_ngcontent-%COMP%] {\n    height: 100dvh;\n    overflow: hidden;\n  }\n\n  .login-stage[_ngcontent-%COMP%] {\n    position: relative;\n  }\n\n  \n  .login-visual[_ngcontent-%COMP%] {\n    position: absolute;\n    inset: 0;\n    z-index: 0;\n    display: block;\n    overflow: hidden;\n    background: #f8fafc;\n  }\n\n  .hero__photo[_ngcontent-%COMP%] {\n    top: -1.5%;\n    left: -2%;\n    width: 106%;\n    height: 106%;\n    max-width: none;\n    object-fit: cover;\n    object-position: 27% 60%;\n    transform: none;\n  }\n\n  .hero__content[_ngcontent-%COMP%] {\n    max-width: min(48vw, 34rem);\n  }\n\n  .brand--desktop[_ngcontent-%COMP%] {\n    display: inline-flex;\n    color: #102033;\n  }\n\n  .brand--desktop[_ngcontent-%COMP%]   .brand__mark[_ngcontent-%COMP%] {\n    box-shadow: 0 8px 20px rgb(37 99 235 / 0.25);\n  }\n\n  .brand--mobile[_ngcontent-%COMP%] {\n    display: none;\n  }\n\n  .auth-panel[_ngcontent-%COMP%] {\n    position: relative;\n    z-index: 2;\n    display: flex;\n    min-height: 100dvh;\n    flex-direction: column;\n    justify-content: center;\n    padding: clamp(4rem, 10vh, 5rem) clamp(1.5rem, 4vw, 3.25rem) clamp(1rem, 2vh, 1.5rem);\n    background: transparent;\n  }\n\n  .auth-panel__header[_ngcontent-%COMP%] {\n    position: absolute;\n    z-index: 3;\n    top: clamp(1rem, 3vh, 2rem);\n    right: clamp(1.25rem, 2.5vw, 2.25rem);\n    justify-content: flex-end;\n  }\n\n  .auth-card[_ngcontent-%COMP%] {\n    position: relative;\n    z-index: 4;\n    display: flex;\n    width: min(100%, 31.5rem);\n    max-width: none;\n    min-height: unset;\n    flex-direction: column;\n    margin: 0 0 0 auto;\n    padding: clamp(1.85rem, 3vh, 2.45rem);\n    transform: translateX(clamp(-2.5rem, -4vw, -1.25rem));\n    border: 1px solid rgb(226 232 240 / 0.85);\n    border-radius: 1rem;\n    background: #fff;\n    box-shadow: 0 1.1rem 2.75rem rgb(15 73 57 / 0.12);\n  }\n\n  .auth-card[_ngcontent-%COMP%]   form[_ngcontent-%COMP%] {\n    display: flex;\n    min-height: 0;\n    flex: 1;\n    flex-direction: column;\n  }\n\n  .auth-card__intro[_ngcontent-%COMP%] {\n    margin-bottom: clamp(1.25rem, 2.8vh, 2rem);\n  }\n\n  .auth-card[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: clamp(1.8rem, 2.2vw, 2.45rem);\n  }\n\n  .auth-card__intro[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    margin-top: 0.5rem;\n    font-size: clamp(0.85rem, 1vw, 1rem);\n    line-height: 1.45;\n  }\n\n  .field[_ngcontent-%COMP%]    > label[_ngcontent-%COMP%] {\n    position: absolute;\n    width: 1px;\n    height: 1px;\n    overflow: hidden;\n    clip: rect(0, 0, 0, 0);\n    white-space: nowrap;\n  }\n\n  .field[_ngcontent-%COMP%]    + .field[_ngcontent-%COMP%] {\n    margin-top: clamp(0.75rem, 1.8vh, 1.15rem);\n  }\n\n  .field__control[_ngcontent-%COMP%] {\n    min-height: clamp(2.9rem, 6.2vh, 3.5rem);\n  }\n\n  [_nghost-%COMP%]     .auth-phone-group.p-inputgroup {\n    min-height: clamp(2.9rem, 6.2vh, 3.5rem);\n  }\n\n  .field__error[_ngcontent-%COMP%] {\n    margin-top: 0.25rem;\n  }\n\n  .form-options[_ngcontent-%COMP%] {\n    margin: clamp(0.8rem, 2vh, 1.25rem) 0;\n  }\n\n  .submit-button[_ngcontent-%COMP%], \n   .code-button[_ngcontent-%COMP%] {\n    min-height: clamp(2.9rem, 6.2vh, 3.5rem);\n  }\n\n  .separator[_ngcontent-%COMP%] {\n    margin: clamp(0.85rem, 2.1vh, 1.4rem) 0;\n  }\n\n  .auth-card[_ngcontent-%COMP%]:not(.auth-card--recovery)   form[_ngcontent-%COMP%]    > .signup[_ngcontent-%COMP%] {\n    margin-top: auto;\n    padding-top: clamp(1rem, 2.5vh, 1.75rem);\n  }\n\n  .auth-panel__footer[_ngcontent-%COMP%] {\n    position: absolute;\n    z-index: 1;\n    right: 1rem;\n    bottom: 0.35rem;\n    left: auto;\n    width: min(44%, 20rem);\n    font-size: 0.6rem;\n    line-height: 1;\n    text-align: right;\n  }\n\n  .auth-panel__footer[_ngcontent-%COMP%]    > p[_ngcontent-%COMP%]:first-child {\n    display: none;\n  }\n}\n\n@media (max-width: 480px) {\n  .auth-panel[_ngcontent-%COMP%] {\n    padding-inline: 1rem;\n  }\n\n  .brand[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n    display: none;\n  }\n\n  .brand__mark[_ngcontent-%COMP%] {\n    width: 2.6rem;\n    height: 2.6rem;\n  }\n\n  .form-options[_ngcontent-%COMP%] {\n    align-items: flex-start;\n    font-size: 0.78rem;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .submit-button[_ngcontent-%COMP%] {\n    transition: none;\n  }\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(Login, [{
        type: Component,
        args: [{ selector: 'app-login', imports: [RouterLink, ReactiveFormsModule, Select, AuthLegalNotice, ...AUTH_FORM_PRIME_IMPORTS], template: "<main id=\"content\" tabindex=\"-1\" class=\"login-page\">\n  <div class=\"login-stage\">\n    <div class=\"login-visual\" aria-labelledby=\"hero-title\">\n      <img\n        class=\"hero__photo\"\n        src=\"assets/login-hero.webp\"\n        alt=\"\"\n        width=\"1600\"\n        height=\"900\"\n        fetchpriority=\"high\"\n        decoding=\"async\"\n      />\n      <div class=\"hero__shade\" aria-hidden=\"true\"></div>\n      <svg class=\"hero__shape\" viewBox=\"0 0 1200 800\" preserveAspectRatio=\"none\" aria-hidden=\"true\">\n        <defs>\n          <linearGradient id=\"hero-shape-grad\" x1=\"0%\" y1=\"0%\" x2=\"80%\" y2=\"100%\">\n            <stop offset=\"0%\" stop-color=\"#2563eb\" stop-opacity=\"0.62\" />\n            <stop offset=\"100%\" stop-color=\"#1d4ed8\" stop-opacity=\"0.72\" />\n          </linearGradient>\n        </defs>\n        <path\n          fill=\"url(#hero-shape-grad)\"\n          d=\"M0,420 C240,320 400,500 640,380 S980,300 1200,360 L1200,800 L0,800 Z\"\n        />\n      </svg>\n      <svg class=\"hero__curve\" viewBox=\"0 0 320 800\" preserveAspectRatio=\"none\" aria-hidden=\"true\">\n        <path fill=\"#f8fafc\" d=\"M0,0 H102 C156,72 186,248 170,430 S205,652 132,800 H320 V0 Z\" />\n      </svg>\n\n      <div class=\"hero__content\">\n        <a class=\"brand brand--desktop\" routerLink=\"/authentification\" aria-label=\"KubaGest\">\n          <span class=\"brand__mark\" aria-hidden=\"true\">K</span>\n          <span><strong>KubaGest</strong><small>Gestion commerciale int\u00E9gr\u00E9e</small></span>\n        </a>\n\n        <div class=\"hero__pitch\">\n          <h2 id=\"hero-title\">Vendez, encaissez et pilotez votre stock en toute simplicit\u00E9.</h2>\n          <ul class=\"hero__features\">\n            <li>\n              <span class=\"hero__feature\" aria-hidden=\"true\"\n                ><i class=\"fa-solid fa-cart-shopping\"></i><span>Ventes</span></span\n              >\n            </li>\n            <li>\n              <span class=\"hero__feature\" aria-hidden=\"true\"\n                ><i class=\"fa-solid fa-boxes-stacked\"></i><span>Stocks</span></span\n              >\n            </li>\n            <li>\n              <span class=\"hero__feature\" aria-hidden=\"true\"\n                ><i class=\"fa-solid fa-truck\"></i><span>Achats</span></span\n              >\n            </li>\n            <li>\n              <span class=\"hero__feature\" aria-hidden=\"true\"\n                ><i class=\"fa-solid fa-chart-column\"></i><span>Rapports</span></span\n              >\n            </li>\n          </ul>\n        </div>\n      </div>\n    </div>\n\n    <section class=\"auth-panel\" aria-labelledby=\"login-title\">\n      <header class=\"auth-panel__header\">\n        <a\n          class=\"brand brand--mobile\"\n          routerLink=\"/authentification\"\n          aria-label=\"KubaGest, accueil de connexion\"\n        >\n          <span class=\"brand__mark\" aria-hidden=\"true\">K</span>\n          <span><strong>KubaGest</strong><small>Gestion commerciale int\u00E9gr\u00E9e</small></span>\n        </a>\n        <div class=\"language\">\n          <p-select\n            inputId=\"login-locale\"\n            size=\"small\"\n            [options]=\"localeOptions\"\n            [formControl]=\"form.controls.locale\"\n            optionLabel=\"label\"\n            optionValue=\"value\"\n            styleClass=\"language-select\"\n            panelStyleClass=\"language-select-panel\"\n            appendTo=\"body\"\n            ariaLabel=\"Langue de l\u2019interface\"\n          >\n            <ng-template #selectedItem let-option>\n              <span class=\"language__trigger\">\n                <i class=\"fa-solid fa-globe\" aria-hidden=\"true\"></i>\n                <span>{{ option?.label }}</span>\n              </span>\n            </ng-template>\n            <ng-template #dropdownicon>\n              <i class=\"fa-solid fa-chevron-down language__chevron\" aria-hidden=\"true\"></i>\n            </ng-template>\n          </p-select>\n        </div>\n      </header>\n\n      <div class=\"auth-card\">\n        <div class=\"auth-card__intro\">\n          <h1 id=\"login-title\">Connexion \u00E0 <span>KubaGest</span></h1>\n          <p>Acc\u00E9dez \u00E0 votre espace professionnel et g\u00E9rez votre commerce en toute s\u00E9curit\u00E9.</p>\n        </div>\n\n        <form [formGroup]=\"form\" (ngSubmit)=\"submit()\" novalidate>\n          @if (loginError()) {\n            <p class=\"form-error form-error--banner\" role=\"alert\">{{ loginError() }}</p>\n          }\n\n          <div class=\"field\">\n            <label for=\"email\">Adresse e-mail</label>\n            <div\n              class=\"field__control\"\n              [class.field__control--invalid]=\"\n                form.controls.email.touched && form.controls.email.invalid\n              \"\n            >\n              <i class=\"fa-solid fa-envelope\" aria-hidden=\"true\"></i>\n              <input\n                pInputText\n                fluid\n                id=\"email\"\n                type=\"email\"\n                formControlName=\"email\"\n                autocomplete=\"email\"\n                inputmode=\"email\"\n                placeholder=\"Adresse e-mail\"\n                [invalid]=\"form.controls.email.touched && form.controls.email.invalid\"\n                [attr.aria-invalid]=\"form.controls.email.touched && form.controls.email.invalid\"\n                aria-describedby=\"email-error\"\n              />\n            </div>\n            @if (form.controls.email.touched && form.controls.email.invalid) {\n              <p id=\"email-error\" class=\"field__error\" role=\"alert\">\n                Saisissez une adresse e-mail valide.\n              </p>\n            }\n          </div>\n\n          <div class=\"field\">\n            <label for=\"password\">Mot de passe</label>\n            <div\n              class=\"field__control\"\n              [class.field__control--invalid]=\"\n                form.controls.password.touched && form.controls.password.invalid\n              \"\n            >\n              <i class=\"fa-solid fa-lock\" aria-hidden=\"true\"></i>\n              <input\n                pInputText\n                fluid\n                id=\"password\"\n                [type]=\"showPassword() ? 'text' : 'password'\"\n                formControlName=\"password\"\n                autocomplete=\"current-password\"\n                placeholder=\"Mot de passe\"\n                [invalid]=\"form.controls.password.touched && form.controls.password.invalid\"\n                [attr.aria-invalid]=\"\n                  form.controls.password.touched && form.controls.password.invalid\n                \"\n                aria-describedby=\"password-error\"\n              />\n              <button\n                type=\"button\"\n                class=\"field__toggle\"\n                (click)=\"togglePassword()\"\n                [attr.aria-label]=\"\n                  showPassword() ? 'Masquer le mot de passe' : 'Afficher le mot de passe'\n                \"\n                [attr.aria-pressed]=\"showPassword()\"\n              >\n                <i\n                  class=\"fa-solid\"\n                  [class.fa-eye-slash]=\"showPassword()\"\n                  [class.fa-eye]=\"!showPassword()\"\n                  aria-hidden=\"true\"\n                ></i>\n              </button>\n            </div>\n            @if (form.controls.password.touched && form.controls.password.invalid) {\n              <p id=\"password-error\" class=\"field__error\" role=\"alert\">\n                Le mot de passe doit contenir au moins 6 caract\u00E8res.\n              </p>\n            }\n          </div>\n\n          <div class=\"form-options\">\n            <label class=\"remember\" for=\"login-remember-me\">\n              <p-checkbox\n                formControlName=\"rememberMe\"\n                [binary]=\"true\"\n                inputId=\"login-remember-me\"\n              />\n              <span>Se souvenir de moi</span>\n            </label>\n            <a routerLink=\"/mot-de-passe-oublie\">Mot de passe oubli\u00E9&nbsp;?</a>\n          </div>\n\n          <button\n            class=\"submit-button\"\n            type=\"submit\"\n            [disabled]=\"submitting()\"\n            [attr.aria-busy]=\"submitting()\"\n          >\n            @if (submitting()) {\n              <i\n                class=\"fa-solid fa-spinner submit-button__icon submit-button__icon--spin\"\n                aria-hidden=\"true\"\n              ></i>\n            } @else {\n              <i class=\"fa-solid fa-right-to-bracket submit-button__icon\" aria-hidden=\"true\"></i>\n            }\n            <span>{{ submitting() ? 'Connexion en cours\u2026' : 'Se connecter' }}</span>\n          </button>\n\n          <div class=\"separator\"><span>ou</span></div>\n\n          <button\n            class=\"code-button\"\n            type=\"button\"\n            disabled\n            title=\"Connexion par code bient\u00F4t disponible\"\n          >\n            <i class=\"fa-solid fa-qrcode\" aria-hidden=\"true\"></i>\n            <span>Se connecter avec un code</span>\n          </button>\n\n          <p class=\"signup\">\n            Pas encore d\u2019espace&nbsp;?\n            <a routerLink=\"/inscription\">Cr\u00E9er un espace</a>\n          </p>\n\n          <app-auth-legal-notice />\n        </form>\n      </div>\n\n      <div class=\"auth-panel__footer\">\n        <p>KubaGest \u00B7 Votre commerce, mieux organis\u00E9.</p>\n        <p role=\"status\" aria-live=\"polite\">\n          @switch (apiState()) {\n            @case ('loading') {\n              Test du serveur en cours\u2026\n            }\n            @case ('success') {\n              <span class=\"status-success\">Serveur joignable</span>\n            }\n            @case ('error') {\n              <button type=\"button\" (click)=\"checkApi()\">Serveur indisponible \u2014 r\u00E9essayer</button>\n            }\n            @default {\n              <button type=\"button\" (click)=\"checkApi()\">V\u00E9rifier la connexion au serveur</button>\n            }\n          }\n        </p>\n      </div>\n    </section>\n  </div>\n</main>\n", styles: [":host {\n  display: block;\n  min-height: 100dvh;\n}\n\n.login-page {\n  min-height: 100dvh;\n  background: #f8fafc;\n  color: #102033;\n}\n\n.login-stage {\n  min-height: 100dvh;\n}\n\n.login-visual {\n  display: none;\n}\n\n.hero__photo,\n.hero__shade,\n.hero__shape,\n.hero__curve {\n  position: absolute;\n  pointer-events: none;\n}\n\n.hero__photo {\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  object-position: 24% 52%;\n}\n\n.hero__shade {\n  inset: 0;\n  background: linear-gradient(\n    180deg,\n    rgb(15 23 42 / 0.06) 0%,\n    transparent 42%,\n    rgb(37 99 235 / 0.07) 100%\n  );\n}\n\n.hero__shape {\n  z-index: 1;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  height: 52%;\n  width: 100%;\n}\n\n.hero__curve {\n  top: 0;\n  right: 0;\n  z-index: 2;\n  height: 100%;\n  width: min(44%, 31rem);\n}\n\n.hero__content {\n  position: relative;\n  z-index: 4;\n  display: flex;\n  height: 100%;\n  flex-direction: column;\n  justify-content: space-between;\n  padding: clamp(1.5rem, 3vw, 2.5rem);\n}\n\n.brand--desktop {\n  display: none;\n}\n\n.hero__pitch h2 {\n  margin: 0 0 1.25rem;\n  max-width: 22rem;\n  color: white;\n  font-size: clamp(1.35rem, 2.2vw, 1.85rem);\n  font-weight: 700;\n  line-height: 1.25;\n  letter-spacing: -0.02em;\n  text-shadow: 0 2px 12px rgb(0 0 0 / 25%);\n}\n\n.hero__features {\n  display: grid;\n  max-width: 24rem;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 0.5rem;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n\n.hero__feature {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.4rem;\n  border: 1.5px solid rgb(255 255 255 / 0.45);\n  border-radius: 0.9rem;\n  background: rgb(255 255 255 / 0.12);\n  padding: 0.65rem 0.35rem 0.55rem;\n  color: white;\n  font-size: 0.68rem;\n  font-weight: 650;\n  line-height: 1.2;\n  text-align: center;\n}\n\n.hero__feature i {\n  font-size: 1.15rem;\n}\n\n.brand {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.75rem;\n  color: #102033;\n  text-decoration: none;\n}\n\n.brand__mark {\n  display: grid;\n  width: 3rem;\n  height: 3rem;\n  place-items: center;\n  border-radius: 0.875rem;\n  background: var(--color-primary);\n  color: white;\n  font-size: 1.55rem;\n  font-weight: 800;\n}\n\n.brand strong,\n.brand small {\n  display: block;\n}\n\n.brand strong {\n  font-size: 1.2rem;\n  line-height: 1.2;\n}\n\n.brand small {\n  margin-top: 0.125rem;\n  color: #64748b;\n  font-size: 0.68rem;\n}\n\n.auth-panel {\n  display: flex;\n  min-height: 100dvh;\n  flex-direction: column;\n  padding: 1rem 1.25rem;\n}\n\n.auth-panel__header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n}\n\n.language {\n  display: inline-flex;\n  align-items: center;\n}\n\n.language__trigger {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.45rem;\n  color: #102033;\n  font-size: 0.9rem;\n  font-weight: 700;\n}\n\n.language__chevron {\n  font-size: 0.85rem;\n  color: #475569;\n}\n\n:host ::ng-deep .language-select.p-select {\n  display: flex;\n  align-items: center;\n  height: 2rem;\n  min-height: 0;\n  border: 1px solid #cbd5e1;\n  border-radius: 5px;\n  background: #fff;\n  box-shadow: none;\n}\n\n:host ::ng-deep .language-select.p-select:not(.p-disabled):hover {\n  border-color: #94a3b8;\n}\n\n:host ::ng-deep .language-select.p-select.p-focus {\n  border-color: var(--color-primary);\n  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.12);\n}\n\n:host ::ng-deep .language-select .p-select-label {\n  display: flex;\n  align-items: center;\n  padding: 0 0.15rem 0 0.65rem;\n  line-height: 1;\n}\n\n:host ::ng-deep .language-select .p-select-dropdown {\n  width: 2rem;\n  color: #475569;\n}\n\n:host ::ng-deep .language-select-panel.p-select-overlay {\n  overflow: hidden;\n  border: 1px solid #e2e8f0;\n  border-radius: 0.85rem;\n  box-shadow: 0 14px 32px rgb(15 23 42 / 0.12);\n  min-width: 7.25rem;\n}\n\n:host ::ng-deep .language-select-panel .p-select-option {\n  padding: 0.55rem 0.85rem;\n  font-size: 0.88rem;\n  font-weight: 600;\n}\n\n:host ::ng-deep .language-select-panel .p-select-option.p-select-option-selected {\n  background: var(--color-primary-fixed);\n  color: var(--color-primary);\n}\n\n.auth-card {\n  width: 100%;\n  max-width: 34rem;\n  margin: auto;\n  padding: 2.25rem 0;\n}\n\n.auth-card__intro {\n  margin-bottom: 2rem;\n}\n\n.auth-card h1 {\n  margin: 0;\n  font-size: clamp(1.75rem, 7vw, 2.5rem);\n  line-height: 1.15;\n  letter-spacing: -0.04em;\n}\n\n.auth-card h1 span,\na {\n  color: var(--color-primary);\n}\n\n.auth-card__intro p {\n  max-width: 29rem;\n  margin: 0.75rem 0 0;\n  color: #64748b;\n  font-size: 1rem;\n  line-height: 1.6;\n}\n\n.field + .field {\n  margin-top: 1.15rem;\n}\n\n.field label {\n  display: block;\n  margin-bottom: 0.45rem;\n  font-size: 0.875rem;\n  font-weight: 650;\n}\n\n.field__control {\n  display: flex;\n  min-height: 3.5rem;\n  align-items: center;\n  gap: 0.75rem;\n  border: 1px solid #cbd5e1;\n  border-radius: 0.75rem;\n  background: white;\n  padding: 0 0.9rem;\n  color: var(--color-primary);\n  transition:\n    border-color 0.18s,\n    box-shadow 0.18s;\n}\n\n.field__control:focus-within {\n  border-color: var(--color-primary);\n  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.13);\n}\n\n.field__control--invalid {\n  border-color: #dc2626;\n}\n\n.field__control input {\n  min-width: 0;\n  flex: 1;\n  border: 0;\n  outline: 0;\n  color: #102033;\n  background: transparent;\n}\n\n.field__control input.p-inputtext {\n  box-shadow: none;\n  border-radius: 0;\n  padding: 0;\n  min-height: auto;\n}\n\n.field__control input.p-inputtext:enabled:focus {\n  box-shadow: none;\n}\n\n.field__control input::placeholder,\n.field__control input.p-inputtext::placeholder {\n  color: #94a3b8;\n}\n\n:host ::ng-deep .auth-phone-group.p-inputgroup {\n  display: flex;\n  width: 100%;\n  min-height: 3.5rem;\n  align-items: stretch;\n  border: 1px solid #cbd5e1;\n  border-radius: 0.75rem;\n  overflow: hidden;\n  background: white;\n  transition:\n    border-color 0.18s,\n    box-shadow 0.18s;\n}\n\n:host ::ng-deep .auth-phone-group.p-inputgroup:has(input:focus) {\n  border-color: var(--color-primary);\n  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.13);\n}\n\n:host ::ng-deep .auth-phone-group--invalid.p-inputgroup {\n  border-color: #dc2626;\n}\n\n:host ::ng-deep .auth-phone-group .p-inputgroupaddon {\n  display: flex;\n  align-items: center;\n  align-self: stretch;\n  border: 0;\n  border-right: 1px solid #cbd5e1;\n  background: #f1f5f9;\n  padding: 0 0.85rem;\n  color: #40516a;\n  font-size: 0.9rem;\n  font-weight: 700;\n}\n\n:host ::ng-deep .auth-phone-group input.p-inputtext {\n  min-width: 0;\n  flex: 1;\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n  min-height: 0;\n  padding: 0 0.9rem;\n}\n\n.field__toggle {\n  display: grid;\n  width: 2.5rem;\n  height: 2.5rem;\n  place-items: center;\n  border: 0;\n  border-radius: 0.5rem;\n  background: transparent;\n  color: #475569;\n  cursor: pointer;\n}\n\n.field__toggle:hover {\n  background: var(--color-primary-fixed);\n  color: var(--color-primary);\n}\n\n.form-notice {\n  margin: 0 0 1rem;\n  padding: 0.75rem 0.9rem;\n  border-radius: 0.6rem;\n  border: 1px solid #bfdbfe;\n  background: #eff6ff;\n  color: #1e40af;\n  font-size: 0.85rem;\n  line-height: 1.4;\n}\n\n.field__error {\n  margin: 0.35rem 0 0;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  color: #b91c1c;\n  font-size: 0.85rem;\n  font-weight: 600;\n  line-height: 1.4;\n}\n\n.form-error {\n  margin: 0 0 1rem;\n  color: #b91c1c;\n  font-size: 0.85rem;\n  line-height: 1.4;\n}\n\n.form-error--banner {\n  border-radius: 0.6rem;\n  background: #fef2f2;\n  border: 1px solid #fecaca;\n  padding: 0.75rem 0.9rem;\n}\n\n.form-options {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  margin: 1.25rem 0;\n  font-size: 0.85rem;\n}\n\n.form-options a,\n.signup a {\n  font-weight: 700;\n  text-decoration: none;\n}\n\n.form-options a:hover,\n.signup a:hover {\n  text-decoration: underline;\n}\n\n.register-terms a {\n  color: var(--color-primary);\n  font-weight: 650;\n  text-underline-offset: 2px;\n}\n\n.register-terms a:hover {\n  text-decoration: underline;\n}\n\n.remember {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.55rem;\n  color: #475569;\n  cursor: pointer;\n}\n\n:host ::ng-deep .remember .p-checkbox .p-checkbox-box {\n  border-color: #cbd5e1;\n}\n\n:host ::ng-deep .remember .p-checkbox.p-checkbox-checked .p-checkbox-box {\n  border-color: var(--color-primary);\n  background: var(--color-primary);\n}\n\n.submit-button,\n.code-button {\n  display: flex;\n  width: 100%;\n  min-height: 3.5rem;\n  align-items: center;\n  justify-content: center;\n  gap: 0.65rem;\n  border-radius: 0.75rem;\n  font-weight: 750;\n  transition:\n    transform 0.15s,\n    background 0.15s,\n    box-shadow 0.15s;\n}\n\n.submit-button {\n  border: 0;\n  background: var(--color-primary);\n  color: white;\n  box-shadow: 0 2px 8px rgb(37 99 235 / 0.12);\n  cursor: pointer;\n}\n\n.submit-button:not(:disabled):hover {\n  background: var(--color-primary-container);\n  box-shadow: 0 3px 10px rgb(37 99 235 / 0.14);\n}\n\n.submit-button:disabled {\n  cursor: not-allowed;\n  opacity: 0.55;\n  box-shadow: none;\n}\n\n@keyframes submit-button-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n.submit-button__icon {\n  width: 1rem;\n  text-align: center;\n}\n\n.submit-button__icon--spin {\n  display: inline-block;\n  animation: submit-button-spin 0.75s linear infinite;\n}\n\n.separator {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  margin: 1.45rem 0;\n  color: #64748b;\n  font-size: 0.85rem;\n  font-weight: 600;\n}\n\n.separator::before,\n.separator::after {\n  height: 1px;\n  flex: 1;\n  background: #e2e8f0;\n  content: '';\n}\n\n.code-button {\n  border: 1px solid #93c5fd;\n  background: white;\n  color: var(--color-primary);\n}\n\n.code-button:disabled {\n  cursor: not-allowed;\n  opacity: 0.68;\n}\n\n.signup {\n  margin: 1.75rem 0 0;\n  text-align: center;\n  color: #64748b;\n  font-size: 0.9rem;\n}\n\n.auth-panel__footer {\n  text-align: center;\n  color: #64748b;\n  font-size: 0.72rem;\n}\n\n.auth-panel__footer p {\n  margin: 0.35rem 0;\n}\n\n.auth-panel__footer button {\n  border: 0;\n  background: transparent;\n  color: #64748b;\n  text-decoration: underline;\n  cursor: pointer;\n}\n\n.status-success {\n  color: var(--color-primary);\n  font-weight: 700;\n}\n\n@media (min-width: 1024px) {\n  :host:has(.login-page),\n  .login-page,\n  .login-stage {\n    height: 100dvh;\n    overflow: hidden;\n  }\n\n  .login-stage {\n    position: relative;\n  }\n\n  /* Image = fond du m\u00EAme bloc que le formulaire (pas une colonne s\u00E9par\u00E9e) */\n  .login-visual {\n    position: absolute;\n    inset: 0;\n    z-index: 0;\n    display: block;\n    overflow: hidden;\n    background: #f8fafc;\n  }\n\n  .hero__photo {\n    top: -1.5%;\n    left: -2%;\n    width: 106%;\n    height: 106%;\n    max-width: none;\n    object-fit: cover;\n    object-position: 27% 60%;\n    transform: none;\n  }\n\n  .hero__content {\n    max-width: min(48vw, 34rem);\n  }\n\n  .brand--desktop {\n    display: inline-flex;\n    color: #102033;\n  }\n\n  .brand--desktop .brand__mark {\n    box-shadow: 0 8px 20px rgb(37 99 235 / 0.25);\n  }\n\n  .brand--mobile {\n    display: none;\n  }\n\n  .auth-panel {\n    position: relative;\n    z-index: 2;\n    display: flex;\n    min-height: 100dvh;\n    flex-direction: column;\n    justify-content: center;\n    padding: clamp(4rem, 10vh, 5rem) clamp(1.5rem, 4vw, 3.25rem) clamp(1rem, 2vh, 1.5rem);\n    background: transparent;\n  }\n\n  .auth-panel__header {\n    position: absolute;\n    z-index: 3;\n    top: clamp(1rem, 3vh, 2rem);\n    right: clamp(1.25rem, 2.5vw, 2.25rem);\n    justify-content: flex-end;\n  }\n\n  .auth-card {\n    position: relative;\n    z-index: 4;\n    display: flex;\n    width: min(100%, 31.5rem);\n    max-width: none;\n    min-height: unset;\n    flex-direction: column;\n    margin: 0 0 0 auto;\n    padding: clamp(1.85rem, 3vh, 2.45rem);\n    transform: translateX(clamp(-2.5rem, -4vw, -1.25rem));\n    border: 1px solid rgb(226 232 240 / 0.85);\n    border-radius: 1rem;\n    background: #fff;\n    box-shadow: 0 1.1rem 2.75rem rgb(15 73 57 / 0.12);\n  }\n\n  .auth-card form {\n    display: flex;\n    min-height: 0;\n    flex: 1;\n    flex-direction: column;\n  }\n\n  .auth-card__intro {\n    margin-bottom: clamp(1.25rem, 2.8vh, 2rem);\n  }\n\n  .auth-card h1 {\n    font-size: clamp(1.8rem, 2.2vw, 2.45rem);\n  }\n\n  .auth-card__intro p {\n    margin-top: 0.5rem;\n    font-size: clamp(0.85rem, 1vw, 1rem);\n    line-height: 1.45;\n  }\n\n  .field > label {\n    position: absolute;\n    width: 1px;\n    height: 1px;\n    overflow: hidden;\n    clip: rect(0, 0, 0, 0);\n    white-space: nowrap;\n  }\n\n  .field + .field {\n    margin-top: clamp(0.75rem, 1.8vh, 1.15rem);\n  }\n\n  .field__control {\n    min-height: clamp(2.9rem, 6.2vh, 3.5rem);\n  }\n\n  :host ::ng-deep .auth-phone-group.p-inputgroup {\n    min-height: clamp(2.9rem, 6.2vh, 3.5rem);\n  }\n\n  .field__error {\n    margin-top: 0.25rem;\n  }\n\n  .form-options {\n    margin: clamp(0.8rem, 2vh, 1.25rem) 0;\n  }\n\n  .submit-button,\n  .code-button {\n    min-height: clamp(2.9rem, 6.2vh, 3.5rem);\n  }\n\n  .separator {\n    margin: clamp(0.85rem, 2.1vh, 1.4rem) 0;\n  }\n\n  .auth-card:not(.auth-card--recovery) form > .signup {\n    margin-top: auto;\n    padding-top: clamp(1rem, 2.5vh, 1.75rem);\n  }\n\n  .auth-panel__footer {\n    position: absolute;\n    z-index: 1;\n    right: 1rem;\n    bottom: 0.35rem;\n    left: auto;\n    width: min(44%, 20rem);\n    font-size: 0.6rem;\n    line-height: 1;\n    text-align: right;\n  }\n\n  .auth-panel__footer > p:first-child {\n    display: none;\n  }\n}\n\n@media (max-width: 480px) {\n  .auth-panel {\n    padding-inline: 1rem;\n  }\n\n  .brand small {\n    display: none;\n  }\n\n  .brand__mark {\n    width: 2.6rem;\n    height: 2.6rem;\n  }\n\n  .form-options {\n    align-items: flex-start;\n    font-size: 0.78rem;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .submit-button {\n    transition: none;\n  }\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(Login, { className: "Login", filePath: "src/app/features/auth/login/login.ts", lineNumber: 21 }); })();
