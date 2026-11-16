import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService } from '../../../core/api/api.service';
import { AuthSessionService } from '../../../core/auth/auth-session.service';
import { AppDialogService } from '../../../core/ui/dialog';
import { AppLoadingService } from '../../../core/ui/loading';
import { RDC_DIAL, formatRdcPhoneLocalDisplay, formatTelephoneWithCountryCode, rdcPhoneErrorMessage, rdcPhoneValidator, rdcPhoneValueFromInput, } from '../../../core/utils/rdc-phone.util';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputText } from 'primeng/inputtext';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.id;
const _forTrack1 = ($index, $item) => $item.label;
function PlatformProfile_For_14_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 10);
    i0.ɵɵlistener("click", function PlatformProfile_For_14_Template_button_click_0_listener() { const tab_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.selectTab(tab_r2.id)); });
    i0.ɵɵelement(1, "i", 3);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const tab_r2 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵclassMap(ctx_r2.activeTab() === tab_r2.id ? "bg-gradient-to-r from-[#e9f8ef] to-[#f9fdfb] text-primary after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-[#0d9a4e] after:content-['']" : "bg-transparent text-[#253650] hover:bg-slate-50");
    i0.ɵɵadvance();
    i0.ɵɵclassMap(tab_r2.icon);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", tab_r2.label, " ");
} }
function PlatformProfile_Conditional_15_For_18_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 65);
    i0.ɵɵtext(1, "Actif");
    i0.ɵɵelementEnd();
} }
function PlatformProfile_Conditional_15_For_18_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const row_r5 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵtextInterpolate1(" ", row_r5.value, " ");
} }
function PlatformProfile_Conditional_15_For_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 22)(1, "dt", 62);
    i0.ɵɵelement(2, "i", 63);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "dd", 64);
    i0.ɵɵconditionalCreate(5, PlatformProfile_Conditional_15_For_18_Conditional_5_Template, 2, 0, "span", 65)(6, PlatformProfile_Conditional_15_For_18_Conditional_6_Template, 1, 1);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const row_r5 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(row_r5.icon);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", row_r5.label, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(row_r5.label === "Statut" ? 5 : 6);
} }
function PlatformProfile_Conditional_15_Conditional_26_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 66);
    i0.ɵɵlistener("click", function PlatformProfile_Conditional_15_Conditional_26_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.cancelEditing()); });
    i0.ɵɵtext(1, " Annuler ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("disabled", ctx_r2.saving());
} }
function PlatformProfile_Conditional_15_Conditional_60_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small", 70);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r2.phoneFieldError());
} }
function PlatformProfile_Conditional_15_Conditional_60_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "p-inputgroup", 67)(1, "p-inputgroup-addon", 68);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "input", 69);
    i0.ɵɵlistener("input", function PlatformProfile_Conditional_15_Conditional_60_Template_input_input_3_listener($event) { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.onPhoneInput($event)); })("blur", function PlatformProfile_Conditional_15_Conditional_60_Template_input_blur_3_listener() { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.onPhoneBlur()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(4, PlatformProfile_Conditional_15_Conditional_60_Conditional_4_Template, 2, 1, "small", 70);
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("profile-phone-group--invalid", !!ctx_r2.phoneFieldError());
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r2.rdcDial);
    i0.ɵɵadvance();
    i0.ɵɵproperty("invalid", !!ctx_r2.phoneFieldError())("value", ctx_r2.phoneLocalValue());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.phoneFieldError() ? 4 : -1);
} }
function PlatformProfile_Conditional_15_Conditional_61_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 39);
    i0.ɵɵelement(1, "i", 71);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.formattedPhoneDisplay(), " ");
} }
function PlatformProfile_Conditional_15_For_72_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 49);
    i0.ɵɵelement(1, "i", 72);
    i0.ɵɵelementStart(2, "p", 73)(3, "strong", 74);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span", 75);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const metric_r8 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵclassMap(metric_r8.icon);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(metric_r8.value);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(metric_r8.label);
} }
function PlatformProfile_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 8)(1, "aside", 11);
    i0.ɵɵelement(2, "div", 12);
    i0.ɵɵelementStart(3, "div", 13)(4, "span");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "button", 14);
    i0.ɵɵelement(7, "i", 15);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 16)(9, "span", 17);
    i0.ɵɵelement(10, "i", 18);
    i0.ɵɵtext(11, "Super Administrateur ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "h2", 19);
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "p", 20);
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "dl", 21);
    i0.ɵɵrepeaterCreate(17, PlatformProfile_Conditional_15_For_18_Template, 7, 4, "div", 22, _forTrack1);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(19, "div", 23)(20, "section", 24)(21, "div", 25)(22, "h2", 26);
    i0.ɵɵelement(23, "i", 27);
    i0.ɵɵtext(24, "Informations personnelles ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "div", 28);
    i0.ɵɵconditionalCreate(26, PlatformProfile_Conditional_15_Conditional_26_Template, 2, 1, "button", 29);
    i0.ɵɵelementStart(27, "button", 30);
    i0.ɵɵlistener("click", function PlatformProfile_Conditional_15_Template_button_click_27_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.toggleEditing()); });
    i0.ɵɵelement(28, "i", 31);
    i0.ɵɵtext(29);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(30, "form", 32);
    i0.ɵɵlistener("ngSubmit", function PlatformProfile_Conditional_15_Template_form_ngSubmit_30_listener($event) { return $event.preventDefault(); });
    i0.ɵɵelementStart(31, "label", 33);
    i0.ɵɵtext(32, " Pr\u00E9nom ");
    i0.ɵɵelementStart(33, "span", 34);
    i0.ɵɵtext(34, "*");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "input", 35);
    i0.ɵɵcontrolCreate();
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(36, "label", 33);
    i0.ɵɵtext(37, " Nom ");
    i0.ɵɵelementStart(38, "span", 34);
    i0.ɵɵtext(39, "*");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "input", 36);
    i0.ɵɵcontrolCreate();
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(41, "label", 33);
    i0.ɵɵtext(42, " R\u00F4le ");
    i0.ɵɵelementStart(43, "div", 37);
    i0.ɵɵelement(44, "i", 38);
    i0.ɵɵtext(45, "Super Administrateur ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(46, "label", 33);
    i0.ɵɵtext(47, " Adresse e-mail ");
    i0.ɵɵelementStart(48, "span", 34);
    i0.ɵɵtext(49, "*");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(50, "div", 39);
    i0.ɵɵelement(51, "i", 40);
    i0.ɵɵtext(52);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(53, "label", 33);
    i0.ɵɵtext(54, " Organisation ");
    i0.ɵɵelementStart(55, "div", 39);
    i0.ɵɵelement(56, "i", 41);
    i0.ɵɵtext(57);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(58, "label", 33);
    i0.ɵɵtext(59, " T\u00E9l\u00E9phone ");
    i0.ɵɵconditionalCreate(60, PlatformProfile_Conditional_15_Conditional_60_Template, 5, 6)(61, PlatformProfile_Conditional_15_Conditional_61_Template, 3, 1, "div", 39);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(62, "label", 42);
    i0.ɵɵtext(63, " Localisation ");
    i0.ɵɵelement(64, "input", 43);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(65, "div", 44)(66, "section", 45)(67, "h2", 46);
    i0.ɵɵelement(68, "i", 47);
    i0.ɵɵtext(69, "R\u00E9sum\u00E9 du compte ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(70, "div", 48);
    i0.ɵɵrepeaterCreate(71, PlatformProfile_Conditional_15_For_72_Template, 7, 4, "div", 49, _forTrack1);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(73, "section", 50)(74, "h2", 51);
    i0.ɵɵelement(75, "i", 52);
    i0.ɵɵtext(76, "S\u00E9curit\u00E9 du compte ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(77, "div", 53);
    i0.ɵɵelement(78, "i", 54);
    i0.ɵɵelementStart(79, "p", 55)(80, "strong", 56);
    i0.ɵɵtext(81, "Mot de passe");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(82, "span", 57);
    i0.ɵɵtext(83, "Prot\u00E9g\u00E9 et chiffr\u00E9");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(84, "button", 58);
    i0.ɵɵtext(85, " Changer ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(86, "div", 53);
    i0.ɵɵelement(87, "i", 59);
    i0.ɵɵelementStart(88, "p", 55)(89, "strong", 56);
    i0.ɵɵtext(90, "Authentification \u00E0 deux facteurs (2FA)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(91, "span", 60);
    i0.ɵɵtext(92, "\u00C0 configurer");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(93, "button", 58);
    i0.ɵɵtext(94, " Configurer ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(95, "div", 53);
    i0.ɵɵelement(96, "i", 61);
    i0.ɵɵelementStart(97, "p", 55)(98, "strong", 56);
    i0.ɵɵtext(99, "R\u00E9cup\u00E9ration du compte");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(100, "span", 57);
    i0.ɵɵtext(101);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(102, "button", 58);
    i0.ɵɵtext(103, " Modifier ");
    i0.ɵɵelementEnd()()()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r2.initials());
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.displayName(), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.session()?.user?.email ?? "\u2014", " ");
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r2.identityMeta());
    i0.ɵɵadvance(9);
    i0.ɵɵconditional(ctx_r2.editing() ? 26 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r2.saving() || ctx_r2.loading());
    i0.ɵɵadvance();
    i0.ɵɵclassProp("fa-pen", !ctx_r2.editing())("fa-check", ctx_r2.editing());
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.editing() ? ctx_r2.saving() ? "Enregistrement\u2026" : "Enregistrer" : "Modifier", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("formGroup", ctx_r2.personalForm);
    i0.ɵɵadvance(5);
    i0.ɵɵcontrol();
    i0.ɵɵadvance(5);
    i0.ɵɵcontrol();
    i0.ɵɵadvance(12);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.profile()?.personal.email ?? ctx_r2.session()?.user?.email ?? "\u2014", " ");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.profile()?.personal.organization ?? "KubaGest", " ");
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r2.editing() ? 60 : 61);
    i0.ɵɵadvance(11);
    i0.ɵɵrepeater(ctx_r2.accountMetrics());
    i0.ɵɵadvance(30);
    i0.ɵɵtextInterpolate(ctx_r2.session()?.user?.email ?? "\u2014");
} }
function PlatformProfile_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 9);
    i0.ɵɵelement(1, "i", 76);
    i0.ɵɵelementStart(2, "h2", 77);
    i0.ɵɵtext(3, " Cette section sera bient\u00F4t disponible ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 78);
    i0.ɵɵtext(5, "Les param\u00E8tres correspondants seront ajout\u00E9s dans une prochaine version.");
    i0.ɵɵelementEnd()();
} }
const PROFILE_TABS = [
    { id: 'general', label: 'Informations générales', icon: 'fa-regular fa-user' },
    { id: 'security', label: 'Sécurité', icon: 'fa-solid fa-lock' },
    { id: 'preferences', label: 'Préférences', icon: 'fa-solid fa-sliders' },
    { id: 'sessions', label: 'Sessions', icon: 'fa-solid fa-desktop' },
    { id: 'activity', label: 'Activité du compte', icon: 'fa-regular fa-clock' },
];
export class PlatformProfile {
    authSession = inject(AuthSessionService);
    api = inject(ApiService);
    destroyRef = inject(DestroyRef);
    dialog = inject(AppDialogService);
    loadingOverlay = inject(AppLoadingService);
    rdcDial = RDC_DIAL;
    session = this.authSession.session;
    profile = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "profile" }] : /* istanbul ignore next */ []));
    activeTab = signal('general', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "activeTab" }] : /* istanbul ignore next */ []));
    editing = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "editing" }] : /* istanbul ignore next */ []));
    loading = signal(true, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "loading" }] : /* istanbul ignore next */ []));
    saving = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "saving" }] : /* istanbul ignore next */ []));
    personalForm = new FormGroup({
        firstName: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(80)],
        }),
        lastName: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(80)],
        }),
        phone: new FormControl('', { nonNullable: true, validators: [rdcPhoneValidator()] }),
    });
    displayName = computed(() => {
        const fromProfile = this.profile()?.personal.fullName?.trim();
        if (fromProfile) {
            return fromProfile;
        }
        const user = this.session()?.user;
        return ([user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() ||
            'Administrateur plateforme');
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "displayName" }] : /* istanbul ignore next */ []));
    initials = computed(() => {
        const value = this.displayName();
        return value
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join('');
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "initials" }] : /* istanbul ignore next */ []));
    memberSince = computed(() => {
        const raw = this.profile()?.identity.memberSince;
        if (raw) {
            return new Date(raw).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });
        }
        return '—';
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "memberSince" }] : /* istanbul ignore next */ []));
    displayId = computed(() => this.profile()?.identity.displayId ?? this.session()?.user?.id ?? '—', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "displayId" }] : /* istanbul ignore next */ []));
    userCount = computed(() => this.profile()?.accountSummary.userCount ?? null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "userCount" }] : /* istanbul ignore next */ []));
    tenantCount = computed(() => this.profile()?.accountSummary.tenantCount ?? null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "tenantCount" }] : /* istanbul ignore next */ []));
    subscriptionCount = computed(() => this.profile()?.accountSummary.activeSubscriptions ?? null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "subscriptionCount" }] : /* istanbul ignore next */ []));
    formattedPhoneDisplay = computed(() => {
        const raw = this.profile()?.personal.phone ?? this.personalForm.getRawValue().phone;
        if (!raw?.trim()) {
            return 'Non renseigné';
        }
        const local = formatRdcPhoneLocalDisplay(raw);
        return local ? `${RDC_DIAL} ${local}` : raw;
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "formattedPhoneDisplay" }] : /* istanbul ignore next */ []));
    tabs = PROFILE_TABS;
    identityMeta = computed(() => [
        { label: 'ID utilisateur', icon: 'fa-regular fa-user', value: this.displayId() },
        { label: 'Membre depuis', icon: 'fa-regular fa-calendar', value: this.memberSince() },
        { label: 'Statut', icon: 'fa-solid fa-shield-halved', value: null },
        { label: 'Espaces gérés', icon: 'fa-regular fa-building', value: String(this.tenantCount() ?? '…') },
    ], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "identityMeta" }] : /* istanbul ignore next */ []));
    accountMetrics = computed(() => [
        { icon: 'fa-solid fa-users', value: String(this.userCount() ?? '…'), label: 'Utilisateurs' },
        {
            icon: 'fa-regular fa-building',
            value: String(this.tenantCount() ?? '…'),
            label: 'Espaces / Entreprises',
        },
        {
            icon: 'fa-solid fa-layer-group',
            value: String(this.subscriptionCount() ?? '…'),
            label: 'Abonnements actifs',
        },
        { icon: 'fa-solid fa-coins', value: '—', label: 'Revenus (ce mois)' },
    ], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "accountMetrics" }] : /* istanbul ignore next */ []));
    ngOnInit() {
        this.loadProfile();
    }
    selectTab(tab) {
        this.activeTab.set(tab);
    }
    phoneLocalValue() {
        return formatRdcPhoneLocalDisplay(this.personalForm.getRawValue().phone);
    }
    phoneFieldError() {
        const control = this.personalForm.controls.phone;
        if (!control.touched && !control.dirty) {
            return null;
        }
        return rdcPhoneErrorMessage(control.errors);
    }
    onPhoneInput(event) {
        const input = event.target;
        let beforeCaret = input.value.slice(0, input.selectionStart ?? input.value.length);
        const value = rdcPhoneValueFromInput(input.value);
        this.personalForm.controls.phone.setValue(value, { emitEvent: true });
        this.personalForm.controls.phone.markAsDirty();
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
        this.personalForm.controls.phone.markAsTouched();
    }
    async toggleEditing() {
        if (this.editing()) {
            if (this.personalForm.invalid) {
                this.personalForm.markAllAsTouched();
                return;
            }
            const confirmed = await this.dialog.confirm({
                header: 'Enregistrer les modifications',
                message: 'Voulez-vous enregistrer vos informations personnelles ?',
                acceptLabel: 'Enregistrer',
                icon: 'pi pi-check-circle',
            });
            if (confirmed) {
                this.savePersonal();
            }
            return;
        }
        this.editing.set(true);
        this.syncFormFromProfile();
    }
    async cancelEditing() {
        if (this.personalForm.dirty) {
            const confirmed = await this.dialog.confirm({
                header: 'Annuler les modifications',
                message: 'Les changements non enregistrés seront perdus. Voulez-vous continuer ?',
                acceptLabel: 'Oui, annuler',
                rejectLabel: 'Continuer la saisie',
                icon: 'pi pi-exclamation-triangle',
            });
            if (!confirmed) {
                return;
            }
        }
        this.editing.set(false);
        this.syncFormFromProfile();
    }
    loadProfile() {
        this.loading.set(true);
        this.api
            .getPlatformProfile()
            .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false)))
            .subscribe({
            next: (response) => {
                this.profile.set(response);
                this.syncFormFromProfile();
                this.authSession.mergeUser({
                    firstName: response.user.firstName,
                    lastName: response.user.lastName,
                });
            },
        });
    }
    phoneToFormValue(stored) {
        if (!stored?.trim()) {
            return '';
        }
        const trimmed = stored.trim();
        if (trimmed.startsWith(RDC_DIAL)) {
            const local = formatRdcPhoneLocalDisplay(trimmed);
            return local ? `${RDC_DIAL} ${local}` : trimmed;
        }
        return trimmed;
    }
    syncFormFromProfile() {
        const data = this.profile();
        const user = data?.user;
        this.personalForm.patchValue({
            firstName: user?.firstName ?? '',
            lastName: user?.lastName ?? '',
            phone: this.phoneToFormValue(data?.personal.phone),
        });
        if (!this.editing()) {
            this.personalForm.disable();
        }
        else {
            this.personalForm.enable();
        }
        this.personalForm.markAsPristine();
    }
    savePersonal() {
        if (this.personalForm.invalid) {
            this.personalForm.markAllAsTouched();
            return;
        }
        const { firstName, lastName, phone } = this.personalForm.getRawValue();
        const normalizedPhone = formatTelephoneWithCountryCode(phone);
        const payload = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: normalizedPhone,
        };
        this.saving.set(true);
        this.loadingOverlay
            .track(this.api.updatePlatformProfile(payload), 'Enregistrement en cours...')
            .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving.set(false)))
            .subscribe({
            next: (response) => {
                this.profile.set(response);
                this.editing.set(false);
                this.personalForm.disable();
                this.authSession.mergeUser({
                    firstName: response.user.firstName,
                    lastName: response.user.lastName,
                });
                this.syncFormFromProfile();
            },
            error: () => {
                void this.dialog.alert({
                    header: 'Enregistrement impossible',
                    message: 'La mise à jour n’a pas pu aboutir. Vérifiez les champs et réessayez dans un instant.',
                    icon: 'pi pi-times-circle',
                    acceptLabel: 'Compris',
                });
            },
        });
    }
    static ɵfac = function PlatformProfile_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PlatformProfile)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PlatformProfile, selectors: [["app-platform-profile"]], decls: 17, vars: 1, consts: [[1, "mx-auto", "block", "max-w-[1440px]", "text-[#12243d]"], ["aria-label", "Fil d\u2019Ariane", 1, "mb-3", "flex", "items-center", "gap-2.5", "text-[0.9rem]", "font-semibold"], ["aria-hidden", "true", 1, "fa-solid", "fa-house", "text-primary"], ["aria-hidden", "true"], [1, "m-0", "text-[clamp(1.75rem,3vw,2.15rem)]", "font-bold", "tracking-tight", "text-[#0b1220]"], [1, "mb-5", "mt-0.5", "text-[0.98rem]", "text-[#40516a]"], ["aria-label", "Sections du profil", 1, "flex", "overflow-x-auto", "rounded-xl", "border", "border-[#dbe2ea]", "bg-white", "shadow-[0_3px_14px_rgba(24,45,69,0.04)]"], ["type", "button", 1, "relative", "flex", "min-h-[3.3rem]", "flex-1", "cursor-pointer", "items-center", "justify-center", "gap-2.5", "border-0", "px-4", "text-sm", "font-semibold", "transition-colors", "max-sm:px-4", "sm:px-5", 3, "class"], [1, "mt-5", "grid", "grid-cols-1", "gap-5", "min-[850px]:grid-cols-[minmax(280px,330px)_minmax(0,1fr)]"], ["aria-live", "polite", 1, "mt-5", "rounded-2xl", "border", "border-[#dde4eb]", "bg-white", "px-6", "py-16", "text-center", "shadow-[0_7px_20px_rgba(24,45,69,0.07)]"], ["type", "button", 1, "relative", "flex", "min-h-[3.3rem]", "flex-1", "cursor-pointer", "items-center", "justify-center", "gap-2.5", "border-0", "px-4", "text-sm", "font-semibold", "transition-colors", "max-sm:px-4", "sm:px-5", 3, "click"], [1, "relative", "overflow-hidden", "rounded-2xl", "border", "border-[#dde4eb]", "bg-white", "shadow-[0_7px_20px_rgba(24,45,69,0.07)]"], [1, "h-[9.5rem]", "bg-[radial-gradient(circle_at_70%_0,#e7fff1_0_25%,transparent_26%),linear-gradient(145deg,#bbf1d2,#effbf4_62%,#fff)]"], ["aria-label", "Avatar du profil", 1, "relative", "z-[1]", "mx-auto", "-mt-[4.75rem]", "grid", "size-[7.75rem]", "place-items-center", "rounded-full", "border-[5px]", "border-white", "bg-[#d9eee2]", "text-[2.35rem]", "font-bold", "text-primary", "shadow-[0_4px_14px_rgba(7,72,43,0.16)]"], ["type", "button", "aria-label", "Changer la photo de profil", 1, "absolute", "-right-0.5", "bottom-0.5", "grid", "size-9", "cursor-pointer", "place-items-center", "rounded-full", "border-[3px]", "border-white", "bg-[#078b46]", "p-0", "text-white"], ["aria-hidden", "true", 1, "fa-solid", "fa-camera", "text-[0.82rem]"], [1, "px-6", "pb-5", "pt-4", "text-center"], [1, "inline-flex", "items-center", "gap-2", "rounded-full", "bg-[#dff7e9]", "px-3.5", "py-2", "text-[0.85rem]", "font-bold", "text-primary"], [1, "fa-solid", "fa-crown"], [1, "mt-4", "mb-0.5", "w-full", "text-center", "text-[1.45rem]", "font-bold", "text-[#0b1220]", "[overflow-wrap:anywhere]"], [1, "m-0", "text-[#31445f]", "[overflow-wrap:anywhere]"], [1, "mx-6", "border-t", "border-[#e3e8ed]", "px-0", "pb-6", "pt-1"], [1, "flex", "min-h-14", "items-center", "justify-between", "gap-4", "border-b", "border-[#edf0f3]", "last:border-0"], [1, "grid", "min-w-0", "content-start", "gap-5"], ["aria-labelledby", "personal-title", 1, "rounded-2xl", "border", "border-[#dde4eb]", "bg-white", "p-5", "shadow-[0_7px_20px_rgba(24,45,69,0.07)]", "sm:px-6"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-4", "max-sm:items-start"], ["id", "personal-title", 1, "m-0", "flex", "items-center", "gap-3", "text-xl", "font-bold", "text-[#0b1220]"], [1, "fa-regular", "fa-user", "text-primary"], [1, "flex", "flex-wrap", "gap-2"], ["type", "button", 1, "flex", "min-h-10", "cursor-pointer", "items-center", "gap-2", "rounded-[0.6rem]", "border", "border-slate-300", "bg-white", "px-4", "text-sm", "font-bold", "text-[#253650]", "disabled:cursor-not-allowed", "disabled:opacity-65", 3, "disabled"], ["type", "button", 1, "flex", "min-h-10", "cursor-pointer", "items-center", "gap-2", "rounded-[0.6rem]", "border-0", "bg-[#07883f]", "px-4", "text-sm", "font-bold", "text-white", "disabled:cursor-not-allowed", "disabled:opacity-65", 3, "click", "disabled"], [1, "fa-solid"], [1, "mt-4", "grid", "grid-cols-1", "gap-4", "min-[600px]:grid-cols-2", 3, "ngSubmit", "formGroup"], [1, "text-[0.88rem]", "font-semibold", "text-[#182943]"], [1, "text-[#df1f2d]"], ["pInputText", "", "fluid", "", "formControlName", "firstName", "autocomplete", "given-name", "placeholder", "Pr\u00E9nom", 1, "profile-field-input", "mt-1.5"], ["pInputText", "", "fluid", "", "formControlName", "lastName", "autocomplete", "family-name", "placeholder", "Nom", 1, "profile-field-input", "mt-1.5"], [1, "mt-1.5", "flex", "h-[2.65rem]", "w-full", "items-center", "gap-3", "rounded-[0.55rem]", "border", "border-transparent", "bg-[#f1f3f6]", "px-3.5", "font-medium", "text-[#40516a]"], [1, "fa-solid", "fa-crown", "text-primary"], [1, "mt-1.5", "flex", "h-[2.65rem]", "w-full", "items-center", "gap-3", "rounded-[0.55rem]", "border", "border-slate-300", "bg-white", "px-3.5", "font-medium"], [1, "fa-regular", "fa-envelope", "text-primary"], [1, "fa-regular", "fa-building", "text-primary"], [1, "text-[0.88rem]", "font-semibold", "text-[#182943]", "min-[600px]:col-span-2"], ["pInputText", "", "fluid", "", "placeholder", "Non disponible pour l\u2019instant", "disabled", "", 1, "profile-field-input", "mt-1.5"], [1, "grid", "grid-cols-1", "gap-5", "max-[1100px]:grid-cols-1", "min-[1100px]:grid-cols-2"], ["aria-labelledby", "summary-title", 1, "rounded-2xl", "border", "border-[#dde4eb]", "bg-white", "p-5", "shadow-[0_7px_20px_rgba(24,45,69,0.07)]", "sm:px-6"], ["id", "summary-title", 1, "m-0", "flex", "items-center", "gap-3", "text-xl", "font-bold", "text-[#0b1220]"], [1, "fa-solid", "fa-chart-simple", "text-primary"], [1, "mt-3", "grid", "grid-cols-1", "gap-px", "bg-[#edf0f3]", "min-[600px]:grid-cols-2"], [1, "flex", "min-h-[5.5rem]", "items-center", "gap-3", "bg-white", "p-3"], ["aria-labelledby", "security-title", 1, "rounded-2xl", "border", "border-[#dde4eb]", "bg-white", "p-5", "shadow-[0_7px_20px_rgba(24,45,69,0.07)]", "sm:px-6"], ["id", "security-title", 1, "mb-2.5", "flex", "items-center", "gap-3", "text-xl", "font-bold", "text-[#0b1220]"], [1, "fa-solid", "fa-shield-halved", "text-primary"], [1, "flex", "min-h-[4.2rem]", "items-center", "gap-3", "border-t", "border-[#edf0f3]"], ["aria-hidden", "true", 1, "fa-solid", "fa-lock", "grid", "size-[2.65rem]", "shrink-0", "place-items-center", "rounded-[0.65rem]", "bg-[#dff7e9]", "text-xl", "text-primary"], [1, "m-0", "min-w-0", "flex-1", "grid", "text-sm", "leading-tight"], [1, "text-[0.8rem]"], [1, "truncate", "text-[#51627b]"], ["type", "button", 1, "cursor-pointer", "rounded-lg", "border", "border-[#d4dce5]", "bg-white", "px-2.5", "py-1.5", "text-[0.72rem]", "font-bold", "text-[#17253b]"], ["aria-hidden", "true", 1, "fa-solid", "fa-mobile-screen", "grid", "size-[2.65rem]", "shrink-0", "place-items-center", "rounded-[0.65rem]", "bg-[#dff7e9]", "text-xl", "text-primary"], [1, "truncate", "font-bold", "text-[#098d48]"], ["aria-hidden", "true", 1, "fa-regular", "fa-envelope", "grid", "size-[2.65rem]", "shrink-0", "place-items-center", "rounded-[0.65rem]", "bg-[#dff7e9]", "text-xl", "text-primary"], [1, "flex", "items-center", "gap-3", "font-semibold"], ["aria-hidden", "true", 1, "w-5", "text-center", "text-primary"], [1, "m-0", "max-w-[48%]", "truncate", "text-[#253650]"], [1, "inline-flex", "items-center", "rounded-full", "bg-[#dff7e9]", "px-2.5", "py-1", "text-xs", "font-bold", "text-primary"], ["type", "button", 1, "flex", "min-h-10", "cursor-pointer", "items-center", "gap-2", "rounded-[0.6rem]", "border", "border-slate-300", "bg-white", "px-4", "text-sm", "font-bold", "text-[#253650]", "disabled:cursor-not-allowed", "disabled:opacity-65", 3, "click", "disabled"], [1, "profile-phone-group", "mt-1.5"], ["id", "phone-dial"], ["pInputText", "", "fluid", "", "type", "tel", "inputmode", "tel", "autocomplete", "tel", "placeholder", "Num\u00E9ro sans indicatif", "aria-describedby", "phone-dial", 3, "input", "blur", "invalid", "value"], [1, "mt-1", "block", "text-xs", "font-semibold", "text-red-600"], ["aria-hidden", "true", 1, "fa-solid", "fa-phone", "text-primary"], ["aria-hidden", "true", 1, "grid", "size-[2.65rem]", "shrink-0", "place-items-center", "rounded-[0.65rem]", "bg-[#dff7e9]", "text-xl", "text-primary"], [1, "m-0", "grid", "leading-tight"], [1, "text-xl", "text-[#0b1220]"], [1, "text-xs", "text-[#51627b]"], ["aria-hidden", "true", 1, "fa-solid", "fa-screwdriver-wrench", "mb-4", "block", "text-3xl", "text-primary"], [1, "flex", "justify-center", "gap-3", "text-xl", "font-bold", "text-[#0b1220]"], [1, "mt-2", "text-[#5a687c]"]], template: function PlatformProfile_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "nav", 1);
            i0.ɵɵelement(2, "i", 2);
            i0.ɵɵelementStart(3, "span", 3);
            i0.ɵɵtext(4, "\u203A");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "span");
            i0.ɵɵtext(6, "Profil");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(7, "header")(8, "h1", 4);
            i0.ɵɵtext(9, " Mon profil ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "p", 5);
            i0.ɵɵtext(11, " G\u00E9rez vos informations personnelles, la s\u00E9curit\u00E9 de votre compte et vos pr\u00E9f\u00E9rences. ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(12, "nav", 6);
            i0.ɵɵrepeaterCreate(13, PlatformProfile_For_14_Template, 3, 5, "button", 7, _forTrack0);
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(15, PlatformProfile_Conditional_15_Template, 104, 15, "div", 8)(16, PlatformProfile_Conditional_16_Template, 6, 0, "section", 9);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(13);
            i0.ɵɵrepeater(ctx.tabs);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.activeTab() === "general" ? 15 : 16);
        } }, dependencies: [ReactiveFormsModule, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName, InputText, InputGroup, InputGroupAddon], styles: ["[_nghost-%COMP%]     .profile-field-input.p-inputtext {\n  min-height: 2.65rem;\n  width: 100%;\n  color: #162338;\n}\n\n[_nghost-%COMP%]     .profile-field-input.p-inputtext:disabled {\n  opacity: 1;\n  background: #fff;\n}\n\n[_nghost-%COMP%]     .profile-phone-group.p-inputgroup {\n  width: 100%;\n  min-height: 2.65rem;\n  overflow: hidden;\n  border-radius: 0.55rem;\n  border: 1px solid #cbd5e1;\n  background: #fff;\n  transition:\n    border-color 0.15s,\n    box-shadow 0.15s;\n}\n\n[_nghost-%COMP%]     .profile-phone-group.p-inputgroup:has(input:focus) {\n  border-color: var(--%NS%p-primary-color, #07883f);\n  box-shadow: 0 0 0 3px rgb(7 139 70 / 12%);\n}\n\n[_nghost-%COMP%]     .profile-phone-group--invalid.p-inputgroup {\n  border-color: #ef4444;\n}\n\n[_nghost-%COMP%]     .profile-phone-group .p-inputgroupaddon {\n  display: flex;\n  align-items: center;\n  align-self: stretch;\n  border: 0;\n  border-right: 1px solid #cbd5e1;\n  background: #f1f3f6;\n  padding: 0 0.75rem;\n  font-size: 0.875rem;\n  font-weight: 600;\n  color: #40516a;\n}\n\n[_nghost-%COMP%]     .profile-phone-group input.p-inputtext {\n  min-width: 0;\n  flex: 1;\n  min-height: 0;\n  padding: 0 0.75rem;\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n  color: #162338;\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PlatformProfile, [{
        type: Component,
        args: [{ selector: 'app-platform-profile', imports: [ReactiveFormsModule, InputText, InputGroup, InputGroupAddon], template: "<div class=\"mx-auto block max-w-[1440px] text-[#12243d]\">\n  <nav\n    class=\"mb-3 flex items-center gap-2.5 text-[0.9rem] font-semibold\"\n    aria-label=\"Fil d\u2019Ariane\"\n  >\n    <i class=\"fa-solid fa-house text-primary\" aria-hidden=\"true\"></i>\n    <span aria-hidden=\"true\">\u203A</span>\n    <span>Profil</span>\n  </nav>\n\n  <header>\n    <h1\n      class=\"m-0 text-[clamp(1.75rem,3vw,2.15rem)] font-bold tracking-tight text-[#0b1220]\"\n    >\n      Mon profil\n    </h1>\n    <p class=\"mb-5 mt-0.5 text-[0.98rem] text-[#40516a]\">\n      G\u00E9rez vos informations personnelles, la s\u00E9curit\u00E9 de votre compte et vos pr\u00E9f\u00E9rences.\n    </p>\n  </header>\n\n  <nav\n    class=\"flex overflow-x-auto rounded-xl border border-[#dbe2ea] bg-white shadow-[0_3px_14px_rgba(24,45,69,0.04)]\"\n    aria-label=\"Sections du profil\"\n  >\n    @for (tab of tabs; track tab.id) {\n      <button\n        type=\"button\"\n        class=\"relative flex min-h-[3.3rem] flex-1 cursor-pointer items-center justify-center gap-2.5 border-0 px-4 text-sm font-semibold transition-colors max-sm:px-4 sm:px-5\"\n        [class]=\"\n          activeTab() === tab.id\n            ? 'bg-gradient-to-r from-[#e9f8ef] to-[#f9fdfb] text-primary after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-[#0d9a4e] after:content-[\\'\\']'\n            : 'bg-transparent text-[#253650] hover:bg-slate-50'\n        \"\n        (click)=\"selectTab(tab.id)\"\n      >\n        <i [class]=\"tab.icon\" aria-hidden=\"true\"></i>\n        {{ tab.label }}\n      </button>\n    }\n  </nav>\n\n  @if (activeTab() === 'general') {\n    <div\n      class=\"mt-5 grid grid-cols-1 gap-5 min-[850px]:grid-cols-[minmax(280px,330px)_minmax(0,1fr)]\"\n    >\n      <aside\n        class=\"relative overflow-hidden rounded-2xl border border-[#dde4eb] bg-white shadow-[0_7px_20px_rgba(24,45,69,0.07)]\"\n      >\n        <div\n          class=\"h-[9.5rem] bg-[radial-gradient(circle_at_70%_0,#e7fff1_0_25%,transparent_26%),linear-gradient(145deg,#bbf1d2,#effbf4_62%,#fff)]\"\n        ></div>\n        <div\n          class=\"relative z-[1] mx-auto -mt-[4.75rem] grid size-[7.75rem] place-items-center rounded-full border-[5px] border-white bg-[#d9eee2] text-[2.35rem] font-bold text-primary shadow-[0_4px_14px_rgba(7,72,43,0.16)]\"\n          aria-label=\"Avatar du profil\"\n        >\n          <span>{{ initials() }}</span>\n          <button\n            type=\"button\"\n            class=\"absolute -right-0.5 bottom-0.5 grid size-9 cursor-pointer place-items-center rounded-full border-[3px] border-white bg-[#078b46] p-0 text-white\"\n            aria-label=\"Changer la photo de profil\"\n          >\n            <i class=\"fa-solid fa-camera text-[0.82rem]\" aria-hidden=\"true\"></i>\n          </button>\n        </div>\n        <div class=\"px-6 pb-5 pt-4 text-center\">\n          <span\n            class=\"inline-flex items-center gap-2 rounded-full bg-[#dff7e9] px-3.5 py-2 text-[0.85rem] font-bold text-primary\"\n          >\n            <i class=\"fa-solid fa-crown\"></i>Super Administrateur\n          </span>\n          <h2\n            class=\"mt-4 mb-0.5 w-full text-center text-[1.45rem] font-bold text-[#0b1220] [overflow-wrap:anywhere]\"\n          >\n            {{ displayName() }}\n          </h2>\n          <p class=\"m-0 text-[#31445f] [overflow-wrap:anywhere]\">\n            {{ session()?.user?.email ?? '\u2014' }}\n          </p>\n        </div>\n        <dl class=\"mx-6 border-t border-[#e3e8ed] px-0 pb-6 pt-1\">\n          @for (row of identityMeta(); track row.label) {\n            <div\n              class=\"flex min-h-14 items-center justify-between gap-4 border-b border-[#edf0f3] last:border-0\"\n            >\n              <dt class=\"flex items-center gap-3 font-semibold\">\n                <i class=\"w-5 text-center text-primary\" [class]=\"row.icon\" aria-hidden=\"true\"></i>\n                {{ row.label }}\n              </dt>\n              <dd class=\"m-0 max-w-[48%] truncate text-[#253650]\">\n                @if (row.label === 'Statut') {\n                  <span\n                    class=\"inline-flex items-center rounded-full bg-[#dff7e9] px-2.5 py-1 text-xs font-bold text-primary\"\n                    >Actif</span\n                  >\n                } @else {\n                  {{ row.value }}\n                }\n              </dd>\n            </div>\n          }\n        </dl>\n      </aside>\n\n      <div class=\"grid min-w-0 content-start gap-5\">\n        <section\n          class=\"rounded-2xl border border-[#dde4eb] bg-white p-5 shadow-[0_7px_20px_rgba(24,45,69,0.07)] sm:px-6\"\n          aria-labelledby=\"personal-title\"\n        >\n          <div class=\"flex flex-wrap items-center justify-between gap-4 max-sm:items-start\">\n            <h2\n              id=\"personal-title\"\n              class=\"m-0 flex items-center gap-3 text-xl font-bold text-[#0b1220]\"\n            >\n              <i class=\"fa-regular fa-user text-primary\"></i>Informations personnelles\n            </h2>\n            <div class=\"flex flex-wrap gap-2\">\n              @if (editing()) {\n                <button\n                  type=\"button\"\n                  class=\"flex min-h-10 cursor-pointer items-center gap-2 rounded-[0.6rem] border border-slate-300 bg-white px-4 text-sm font-bold text-[#253650] disabled:cursor-not-allowed disabled:opacity-65\"\n                  (click)=\"cancelEditing()\"\n                  [disabled]=\"saving()\"\n                >\n                  Annuler\n                </button>\n              }\n              <button\n                type=\"button\"\n                class=\"flex min-h-10 cursor-pointer items-center gap-2 rounded-[0.6rem] border-0 bg-[#07883f] px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-65\"\n                (click)=\"toggleEditing()\"\n                [disabled]=\"saving() || loading()\"\n              >\n                <i class=\"fa-solid\" [class.fa-pen]=\"!editing()\" [class.fa-check]=\"editing()\"></i>\n                {{ editing() ? (saving() ? 'Enregistrement\u2026' : 'Enregistrer') : 'Modifier' }}\n              </button>\n            </div>\n          </div>\n          <form\n            class=\"mt-4 grid grid-cols-1 gap-4 min-[600px]:grid-cols-2\"\n            [formGroup]=\"personalForm\"\n            (ngSubmit)=\"$event.preventDefault()\"\n          >\n            <label class=\"text-[0.88rem] font-semibold text-[#182943]\">\n              Pr\u00E9nom <span class=\"text-[#df1f2d]\">*</span>\n              <input\n                pInputText\n                fluid\n                class=\"profile-field-input mt-1.5\"\n                formControlName=\"firstName\"\n                autocomplete=\"given-name\"\n                placeholder=\"Pr\u00E9nom\"\n              />\n            </label>\n            <label class=\"text-[0.88rem] font-semibold text-[#182943]\">\n              Nom <span class=\"text-[#df1f2d]\">*</span>\n              <input\n                pInputText\n                fluid\n                class=\"profile-field-input mt-1.5\"\n                formControlName=\"lastName\"\n                autocomplete=\"family-name\"\n                placeholder=\"Nom\"\n              />\n            </label>\n            <label class=\"text-[0.88rem] font-semibold text-[#182943]\">\n              R\u00F4le\n              <div\n                class=\"mt-1.5 flex h-[2.65rem] w-full items-center gap-3 rounded-[0.55rem] border border-transparent bg-[#f1f3f6] px-3.5 font-medium text-[#40516a]\"\n              >\n                <i class=\"fa-solid fa-crown text-primary\"></i>Super Administrateur\n              </div>\n            </label>\n            <label class=\"text-[0.88rem] font-semibold text-[#182943]\">\n              Adresse e-mail <span class=\"text-[#df1f2d]\">*</span>\n              <div\n                class=\"mt-1.5 flex h-[2.65rem] w-full items-center gap-3 rounded-[0.55rem] border border-slate-300 bg-white px-3.5 font-medium\"\n              >\n                <i class=\"fa-regular fa-envelope text-primary\"></i>\n                {{ profile()?.personal.email ?? session()?.user?.email ?? '\u2014' }}\n              </div>\n            </label>\n            <label class=\"text-[0.88rem] font-semibold text-[#182943]\">\n              Organisation\n              <div\n                class=\"mt-1.5 flex h-[2.65rem] w-full items-center gap-3 rounded-[0.55rem] border border-slate-300 bg-white px-3.5 font-medium\"\n              >\n                <i class=\"fa-regular fa-building text-primary\"></i>\n                {{ profile()?.personal.organization ?? 'KubaGest' }}\n              </div>\n            </label>\n            <label class=\"text-[0.88rem] font-semibold text-[#182943]\">\n              T\u00E9l\u00E9phone\n              @if (editing()) {\n                <p-inputgroup\n                  class=\"profile-phone-group mt-1.5\"\n                  [class.profile-phone-group--invalid]=\"!!phoneFieldError()\"\n                >\n                  <p-inputgroup-addon id=\"phone-dial\">{{ rdcDial }}</p-inputgroup-addon>\n                  <input\n                    pInputText\n                    fluid\n                    type=\"tel\"\n                    inputmode=\"tel\"\n                    autocomplete=\"tel\"\n                    placeholder=\"Num\u00E9ro sans indicatif\"\n                    aria-describedby=\"phone-dial\"\n                    [invalid]=\"!!phoneFieldError()\"\n                    [value]=\"phoneLocalValue()\"\n                    (input)=\"onPhoneInput($event)\"\n                    (blur)=\"onPhoneBlur()\"\n                  />\n                </p-inputgroup>\n                @if (phoneFieldError()) {\n                  <small class=\"mt-1 block text-xs font-semibold text-red-600\">{{ phoneFieldError() }}</small>\n                }\n              } @else {\n                <div\n                  class=\"mt-1.5 flex h-[2.65rem] w-full items-center gap-3 rounded-[0.55rem] border border-slate-300 bg-white px-3.5 font-medium\"\n                >\n                  <i class=\"fa-solid fa-phone text-primary\" aria-hidden=\"true\"></i>\n                  {{ formattedPhoneDisplay() }}\n                </div>\n              }\n            </label>\n            <label class=\"text-[0.88rem] font-semibold text-[#182943] min-[600px]:col-span-2\">\n              Localisation\n              <input\n                pInputText\n                fluid\n                class=\"profile-field-input mt-1.5\"\n                placeholder=\"Non disponible pour l\u2019instant\"\n                disabled\n              />\n            </label>\n          </form>\n        </section>\n\n        <div class=\"grid grid-cols-1 gap-5 max-[1100px]:grid-cols-1 min-[1100px]:grid-cols-2\">\n          <section\n            class=\"rounded-2xl border border-[#dde4eb] bg-white p-5 shadow-[0_7px_20px_rgba(24,45,69,0.07)] sm:px-6\"\n            aria-labelledby=\"summary-title\"\n          >\n            <h2\n              id=\"summary-title\"\n              class=\"m-0 flex items-center gap-3 text-xl font-bold text-[#0b1220]\"\n            >\n              <i class=\"fa-solid fa-chart-simple text-primary\"></i>R\u00E9sum\u00E9 du compte\n            </h2>\n            <div\n              class=\"mt-3 grid grid-cols-1 gap-px bg-[#edf0f3] min-[600px]:grid-cols-2\"\n            >\n              @for (metric of accountMetrics(); track metric.label) {\n                <div\n                  class=\"flex min-h-[5.5rem] items-center gap-3 bg-white p-3\"\n                >\n                  <i\n                    class=\"grid size-[2.65rem] shrink-0 place-items-center rounded-[0.65rem] bg-[#dff7e9] text-xl text-primary\"\n                    [class]=\"metric.icon\"\n                    aria-hidden=\"true\"\n                  ></i>\n                  <p class=\"m-0 grid leading-tight\">\n                    <strong class=\"text-xl text-[#0b1220]\">{{ metric.value }}</strong>\n                    <span class=\"text-xs text-[#51627b]\">{{ metric.label }}</span>\n                  </p>\n                </div>\n              }\n            </div>\n          </section>\n\n          <section\n            class=\"rounded-2xl border border-[#dde4eb] bg-white p-5 shadow-[0_7px_20px_rgba(24,45,69,0.07)] sm:px-6\"\n            aria-labelledby=\"security-title\"\n          >\n            <h2\n              id=\"security-title\"\n              class=\"mb-2.5 flex items-center gap-3 text-xl font-bold text-[#0b1220]\"\n            >\n              <i class=\"fa-solid fa-shield-halved text-primary\"></i>S\u00E9curit\u00E9 du compte\n            </h2>\n            <div class=\"flex min-h-[4.2rem] items-center gap-3 border-t border-[#edf0f3]\">\n              <i\n                class=\"fa-solid fa-lock grid size-[2.65rem] shrink-0 place-items-center rounded-[0.65rem] bg-[#dff7e9] text-xl text-primary\"\n                aria-hidden=\"true\"\n              ></i>\n              <p class=\"m-0 min-w-0 flex-1 grid text-sm leading-tight\">\n                <strong class=\"text-[0.8rem]\">Mot de passe</strong>\n                <span class=\"truncate text-[#51627b]\">Prot\u00E9g\u00E9 et chiffr\u00E9</span>\n              </p>\n              <button\n                type=\"button\"\n                class=\"cursor-pointer rounded-lg border border-[#d4dce5] bg-white px-2.5 py-1.5 text-[0.72rem] font-bold text-[#17253b]\"\n              >\n                Changer\n              </button>\n            </div>\n            <div class=\"flex min-h-[4.2rem] items-center gap-3 border-t border-[#edf0f3]\">\n              <i\n                class=\"fa-solid fa-mobile-screen grid size-[2.65rem] shrink-0 place-items-center rounded-[0.65rem] bg-[#dff7e9] text-xl text-primary\"\n                aria-hidden=\"true\"\n              ></i>\n              <p class=\"m-0 min-w-0 flex-1 grid text-sm leading-tight\">\n                <strong class=\"text-[0.8rem]\">Authentification \u00E0 deux facteurs (2FA)</strong>\n                <span class=\"truncate font-bold text-[#098d48]\">\u00C0 configurer</span>\n              </p>\n              <button\n                type=\"button\"\n                class=\"cursor-pointer rounded-lg border border-[#d4dce5] bg-white px-2.5 py-1.5 text-[0.72rem] font-bold text-[#17253b]\"\n              >\n                Configurer\n              </button>\n            </div>\n            <div class=\"flex min-h-[4.2rem] items-center gap-3 border-t border-[#edf0f3]\">\n              <i\n                class=\"fa-regular fa-envelope grid size-[2.65rem] shrink-0 place-items-center rounded-[0.65rem] bg-[#dff7e9] text-xl text-primary\"\n                aria-hidden=\"true\"\n              ></i>\n              <p class=\"m-0 min-w-0 flex-1 grid text-sm leading-tight\">\n                <strong class=\"text-[0.8rem]\">R\u00E9cup\u00E9ration du compte</strong>\n                <span class=\"truncate text-[#51627b]\">{{ session()?.user?.email ?? '\u2014' }}</span>\n              </p>\n              <button\n                type=\"button\"\n                class=\"cursor-pointer rounded-lg border border-[#d4dce5] bg-white px-2.5 py-1.5 text-[0.72rem] font-bold text-[#17253b]\"\n              >\n                Modifier\n              </button>\n            </div>\n          </section>\n        </div>\n      </div>\n    </div>\n  } @else {\n    <section\n      class=\"mt-5 rounded-2xl border border-[#dde4eb] bg-white px-6 py-16 text-center shadow-[0_7px_20px_rgba(24,45,69,0.07)]\"\n      aria-live=\"polite\"\n    >\n      <i class=\"fa-solid fa-screwdriver-wrench mb-4 block text-3xl text-primary\" aria-hidden=\"true\"></i>\n      <h2 class=\"flex justify-center gap-3 text-xl font-bold text-[#0b1220]\">\n        Cette section sera bient\u00F4t disponible\n      </h2>\n      <p class=\"mt-2 text-[#5a687c]\">Les param\u00E8tres correspondants seront ajout\u00E9s dans une prochaine version.</p>\n    </section>\n  }\n</div>\n", styles: [":host ::ng-deep .profile-field-input.p-inputtext {\n  min-height: 2.65rem;\n  width: 100%;\n  color: #162338;\n}\n\n:host ::ng-deep .profile-field-input.p-inputtext:disabled {\n  opacity: 1;\n  background: #fff;\n}\n\n:host ::ng-deep .profile-phone-group.p-inputgroup {\n  width: 100%;\n  min-height: 2.65rem;\n  overflow: hidden;\n  border-radius: 0.55rem;\n  border: 1px solid #cbd5e1;\n  background: #fff;\n  transition:\n    border-color 0.15s,\n    box-shadow 0.15s;\n}\n\n:host ::ng-deep .profile-phone-group.p-inputgroup:has(input:focus) {\n  border-color: var(--p-primary-color, #07883f);\n  box-shadow: 0 0 0 3px rgb(7 139 70 / 12%);\n}\n\n:host ::ng-deep .profile-phone-group--invalid.p-inputgroup {\n  border-color: #ef4444;\n}\n\n:host ::ng-deep .profile-phone-group .p-inputgroupaddon {\n  display: flex;\n  align-items: center;\n  align-self: stretch;\n  border: 0;\n  border-right: 1px solid #cbd5e1;\n  background: #f1f3f6;\n  padding: 0 0.75rem;\n  font-size: 0.875rem;\n  font-weight: 600;\n  color: #40516a;\n}\n\n:host ::ng-deep .profile-phone-group input.p-inputtext {\n  min-width: 0;\n  flex: 1;\n  min-height: 0;\n  padding: 0 0.75rem;\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n  color: #162338;\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PlatformProfile, { className: "PlatformProfile", filePath: "src/app/features/platform/profile/platform-profile.ts", lineNumber: 43 }); })();
