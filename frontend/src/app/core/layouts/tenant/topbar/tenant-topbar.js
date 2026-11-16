import { Component, computed, HostListener, inject, output, signal } from '@angular/core';
import { ApiService } from '../../../api/api.service';
import { AuthSessionService } from '../../../auth/auth-session.service';
import { ThemeToggleComponent } from '../../../ui/theme-toggle/theme-toggle';
import { formatCdfPerUsdForDisplay } from '../../../utils/exchange-rate-format.util';
import * as i0 from "@angular/core";
function TenantTopbar_Conditional_30_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 26);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx, " ");
} }
function TenantTopbar_Conditional_30_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 22);
    i0.ɵɵlistener("click", function TenantTopbar_Conditional_30_Template_div_click_0_listener($event) { return $event.stopPropagation(); });
    i0.ɵɵelementStart(1, "div", 23)(2, "p", 24);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 25);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(6, TenantTopbar_Conditional_30_Conditional_6_Template, 2, 1, "p", 26);
    i0.ɵɵelementStart(7, "button", 27);
    i0.ɵɵlistener("click", function TenantTopbar_Conditional_30_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.logoutFromMenu()); });
    i0.ɵɵelement(8, "i", 28);
    i0.ɵɵtext(9, " D\u00E9connexion ");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.displayName());
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.roleLabel());
    i0.ɵɵadvance();
    i0.ɵɵconditional((tmp_3_0 = ctx_r1.session()?.user.email) ? 6 : -1, tmp_3_0);
} }
const TENANT_ROLE_LABELS = {
    owner: 'Gérant principal',
    cashier: 'Caissier',
    stock_manager: 'Responsable stocks',
};
export class TenantTopbar {
    api = inject(ApiService);
    authSession = inject(AuthSessionService);
    logoutClick = output();
    session = this.authSession.session;
    profileMenuOpen = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "profileMenuOpen" }] : /* istanbul ignore next */ []));
    cdfPerUsdDisplay = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "cdfPerUsdDisplay" }] : /* istanbul ignore next */ []));
    exchangeRateLoading = signal(true, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "exchangeRateLoading" }] : /* istanbul ignore next */ []));
    bccLabel = computed(() => {
        const fc = this.cdfPerUsdDisplay();
        if (fc) {
            return `1 USD = ${fc} FC`;
        }
        return this.exchangeRateLoading() ? 'Chargement du taux BCC…' : 'Taux BCC non défini';
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "bccLabel" }] : /* istanbul ignore next */ []));
    ngOnInit() {
        this.api.getTenantCurrentExchangeRate().subscribe({
            next: (rate) => {
                this.cdfPerUsdDisplay.set(formatCdfPerUsdForDisplay(rate.cdfPerUsd));
                this.exchangeRateLoading.set(false);
            },
            error: () => {
                this.cdfPerUsdDisplay.set(null);
                this.exchangeRateLoading.set(false);
            },
        });
    }
    displayName = computed(() => {
        const user = this.session()?.user;
        if (!user) {
            return 'Utilisateur';
        }
        const full = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
        return full || user.email.split('@')[0] || user.email;
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "displayName" }] : /* istanbul ignore next */ []));
    roleLabel = computed(() => {
        const role = this.session()?.context?.role;
        if (!role) {
            return 'Établissement';
        }
        return TENANT_ROLE_LABELS[role] ?? role.replaceAll('_', ' ');
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "roleLabel" }] : /* istanbul ignore next */ []));
    toggleProfileMenu(event) {
        event.stopPropagation();
        this.profileMenuOpen.update((open) => !open);
    }
    closeProfileMenu() {
        this.profileMenuOpen.set(false);
    }
    logoutFromMenu() {
        this.closeProfileMenu();
        this.logoutClick.emit();
    }
    onDocumentClick() {
        this.closeProfileMenu();
    }
    onEscape() {
        this.closeProfileMenu();
    }
    static ɵfac = function TenantTopbar_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || TenantTopbar)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: TenantTopbar, selectors: [["app-tenant-topbar"]], hostBindings: function TenantTopbar_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("click", function TenantTopbar_click_HostBindingHandler() { return ctx.onDocumentClick(); }, i0.ɵɵresolveDocument)("keydown.escape", function TenantTopbar_keydown_escape_HostBindingHandler() { return ctx.onEscape(); }, i0.ɵɵresolveDocument);
        } }, outputs: { logoutClick: "logoutClick" }, decls: 31, vars: 13, consts: [[1, "layout-tenant-topbar", "flex", "items-center", "justify-between", "border-b", "border-outline-variant/30", "bg-surface-container-lowest", "px-gutter-desktop", "shadow-[0_1px_8px_rgba(0,0,0,0.04)]", "max-md:py-3", "dark:border-white/10", "dark:bg-surface-container-lowest/95", "dark:shadow-[0_1px_4px_rgba(0,0,0,0.35)]", "dark:backdrop-blur-md"], [1, "flex", "min-w-0", "flex-1", "items-center", "gap-gutter"], ["title", "Taux BCC du jour", 1, "flex", "items-center", "gap-space-sm", "rounded-lg", "bg-surface-container-low", "px-space-md", "py-space-xs"], ["aria-hidden", "true", 1, "fa-solid", "fa-right-left", "shrink-0", "text-[18px]", "text-retail-blue"], [1, "text-label-sm", "text-text-muted"], [1, "text-label-md"], [1, "hidden", "items-center", "gap-space-sm", "rounded-lg", "bg-surface-container-low", "px-space-md", "py-space-xs", "lg:flex"], ["aria-hidden", "true", 1, "fa-solid", "fa-cloud-arrow-up", "shrink-0", "text-[18px]", "text-growth-green"], [1, "text-label-md", "text-growth-green"], [1, "flex", "shrink-0", "items-center", "gap-space-md"], ["type", "button", "aria-label", "Notifications", "disabled", "", 1, "relative", "grid", "cursor-pointer", "place-items-center", "rounded-full", "p-space-sm", "text-on-surface-variant", "transition-colors", "hover:bg-surface-container-high", "hover:text-on-surface"], ["aria-hidden", "true", 1, "fa-regular", "fa-bell", "text-[22px]"], ["aria-hidden", "true", 1, "absolute", "right-1", "top-1", "inline-block", "h-2", "w-2", "rounded-full", "bg-alert-red"], ["role", "separator", "aria-hidden", "true", 1, "h-8", "w-px", "bg-surface-container-highest"], [1, "relative"], ["type", "button", "aria-haspopup", "menu", "aria-controls", "platform-profile-menu", 1, "group", "flex", "max-w-full", "cursor-pointer", "items-center", "gap-2", "rounded-lg", "border-0", "bg-transparent", "p-0", "text-left", "leading-none", "focus-visible:outline-2", "focus-visible:outline-offset-2", "focus-visible:outline-[#79c6a4]", 3, "click"], ["aria-hidden", "true", 1, "grid", "size-[2.35rem]", "shrink-0", "place-items-center", "rounded-full", "bg-[#dfeae4]", "font-semibold", "text-[#1a4338]", "group-hover:shadow-[0_0_0_2px_rgba(26,67,56,0.22)]"], [1, "min-w-0", "max-sm:hidden"], [1, "block", "max-w-40", "truncate", "text-[0.88rem]", "text-platform-ink"], [1, "block", "text-[0.72rem]", "text-retail-blue", "font-bold"], ["aria-hidden", "true", 1, "fa-solid", "fa-chevron-down", "shrink-0", "text-[0.65rem]", "text-platform-muted", "transition-transform"], ["id", "tenant-profile-menu", "role", "menu", 1, "absolute", "right-0", "top-[calc(100%+0.35rem)]", "z-[120]", "min-w-52", "overflow-hidden", "rounded-xl", "border", "border-border-subtle", "bg-surface-container-lowest", "py-1", "shadow-lg"], ["id", "tenant-profile-menu", "role", "menu", 1, "absolute", "right-0", "top-[calc(100%+0.35rem)]", "z-[120]", "min-w-52", "overflow-hidden", "rounded-xl", "border", "border-border-subtle", "bg-surface-container-lowest", "py-1", "shadow-lg", 3, "click"], [1, "border-b", "border-border-subtle", "px-3", "py-2", "sm:hidden"], [1, "truncate", "text-label-md", "font-semibold", "text-text-primary"], [1, "text-label-sm", "text-retail-blue"], ["role", "presentation", 1, "hidden", "truncate", "border-b", "border-border-subtle", "px-3", "py-2", "text-body-sm", "text-text-muted", "sm:block"], ["type", "button", "role", "menuitem", 1, "flex", "w-full", "items-center", "gap-2", "px-3", "py-2", "text-left", "text-body-md", "text-alert-red", "transition-colors", "hover:bg-error-container", 3, "click"], ["aria-hidden", "true", 1, "fa-solid", "fa-right-from-bracket", "w-4", "text-center", "text-[16px]"]], template: function TenantTopbar_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "header", 0)(1, "div", 1)(2, "div", 2);
            i0.ɵɵelement(3, "i", 3);
            i0.ɵɵelementStart(4, "span", 4);
            i0.ɵɵtext(5, "BCC :");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "span", 5);
            i0.ɵɵtext(7);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(8, "div", 6);
            i0.ɵɵelement(9, "i", 7);
            i0.ɵɵelementStart(10, "span", 4);
            i0.ɵɵtext(11, "Synchro P2P/Cloud :");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "span", 8);
            i0.ɵɵtext(13, "99,9\u00A0%");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(14, "div", 9);
            i0.ɵɵelement(15, "app-theme-toggle");
            i0.ɵɵelementStart(16, "button", 10);
            i0.ɵɵelement(17, "i", 11)(18, "span", 12);
            i0.ɵɵelementEnd();
            i0.ɵɵelement(19, "div", 13);
            i0.ɵɵelementStart(20, "div", 14)(21, "button", 15);
            i0.ɵɵlistener("click", function TenantTopbar_Template_button_click_21_listener($event) { return ctx.toggleProfileMenu($event); });
            i0.ɵɵelementStart(22, "span", 16);
            i0.ɵɵtext(23);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(24, "div", 17)(25, "strong", 18);
            i0.ɵɵtext(26);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(27, "small", 19);
            i0.ɵɵtext(28);
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(29, "i", 20);
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(30, TenantTopbar_Conditional_30_Template, 10, 3, "div", 21);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(6);
            i0.ɵɵclassProp("text-text-primary", ctx.cdfPerUsdDisplay())("text-text-muted", !ctx.cdfPerUsdDisplay());
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.bccLabel(), " ");
            i0.ɵɵadvance(14);
            i0.ɵɵattribute("aria-expanded", ctx.profileMenuOpen())("aria-label", "Menu compte : " + ctx.displayName());
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1(" ", ctx.displayName().charAt(0).toUpperCase(), " ");
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.displayName());
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.roleLabel());
            i0.ɵɵadvance();
            i0.ɵɵclassProp("rotate-180", ctx.profileMenuOpen());
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.profileMenuOpen() ? 30 : -1);
        } }, dependencies: [ThemeToggleComponent], encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TenantTopbar, [{
        type: Component,
        args: [{ selector: 'app-tenant-topbar', standalone: true, imports: [ThemeToggleComponent], template: "<header\n  class=\"layout-tenant-topbar flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-lowest px-gutter-desktop shadow-[0_1px_8px_rgba(0,0,0,0.04)] max-md:py-3 dark:border-white/10 dark:bg-surface-container-lowest/95 dark:shadow-[0_1px_4px_rgba(0,0,0,0.35)] dark:backdrop-blur-md\"\n>\n  <div class=\"flex min-w-0 flex-1 items-center gap-gutter\">\n    <div\n      class=\"flex items-center gap-space-sm rounded-lg bg-surface-container-low px-space-md py-space-xs\"\n      title=\"Taux BCC du jour\"\n    >\n      <i class=\"fa-solid fa-right-left shrink-0 text-[18px] text-retail-blue\" aria-hidden=\"true\"></i>\n      <span class=\"text-label-sm text-text-muted\">BCC :</span>\n      <span\n        class=\"text-label-md\"\n        [class.text-text-primary]=\"cdfPerUsdDisplay()\"\n        [class.text-text-muted]=\"!cdfPerUsdDisplay()\"\n      >\n        {{ bccLabel() }}\n      </span>\n    </div>\n    <div\n      class=\"hidden items-center gap-space-sm rounded-lg bg-surface-container-low px-space-md py-space-xs lg:flex\"\n    >\n      <i class=\"fa-solid fa-cloud-arrow-up shrink-0 text-[18px] text-growth-green\" aria-hidden=\"true\"></i>\n      <span class=\"text-label-sm text-text-muted\">Synchro P2P/Cloud :</span>\n      <span class=\"text-label-md text-growth-green\">99,9&nbsp;%</span>\n    </div>\n  </div>\n\n  <div class=\"flex shrink-0 items-center gap-space-md\">\n    <app-theme-toggle />\n\n    <button\n      type=\"button\"\n      class=\"relative grid cursor-pointer place-items-center rounded-full p-space-sm text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface\"\n      aria-label=\"Notifications\"\n      disabled\n    >\n      <i class=\"fa-regular fa-bell text-[22px]\" aria-hidden=\"true\"></i>\n      <span\n        class=\"absolute right-1 top-1 inline-block h-2 w-2 rounded-full bg-alert-red\"\n        aria-hidden=\"true\"\n      ></span>\n    </button>\n\n    <div class=\"h-8 w-px bg-surface-container-highest\" role=\"separator\" aria-hidden=\"true\"></div>\n\n    <div class=\"relative\">\n      <!-- <button\n        type=\"button\"\n        class=\"group flex cursor-pointer items-center gap-space-sm border-0 bg-transparent p-0 text-left focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary\"\n        (click)=\"toggleProfileMenu($event)\"\n        [attr.aria-expanded]=\"profileMenuOpen()\"\n        aria-haspopup=\"menu\"\n        aria-controls=\"tenant-profile-menu\"\n        [attr.aria-label]=\"'Menu compte : ' + displayName()\"\n      >\n        <div class=\"hidden text-right sm:block\">\n          <span class=\"block text-label-md leading-tight text-text-primary\">{{ displayName() }}</span>\n          <span class=\"block text-label-sm text-retail-blue\">{{ roleLabel() }}</span>\n        </div>\n        <span\n          class=\"grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary transition-shadow group-hover:shadow-[0_0_0_2px_rgba(0,95,65,0.25)]\"\n          aria-hidden=\"true\"\n        >\n          <i class=\"fa-solid fa-user text-[14px] text-on-primary\" aria-hidden=\"true\"></i>\n        </span>\n      </button> -->\n\n\n      <button\n        type=\"button\"\n        class=\"group flex max-w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent p-0 text-left leading-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#79c6a4]\"\n        (click)=\"toggleProfileMenu($event)\"\n        [attr.aria-expanded]=\"profileMenuOpen()\"\n        aria-haspopup=\"menu\"\n        aria-controls=\"platform-profile-menu\"\n        [attr.aria-label]=\"'Menu compte : ' + displayName()\"\n      >\n        <span\n          class=\"grid size-[2.35rem] shrink-0 place-items-center rounded-full bg-[#dfeae4] font-semibold text-[#1a4338] group-hover:shadow-[0_0_0_2px_rgba(26,67,56,0.22)]\"\n          aria-hidden=\"true\"\n        >\n          {{ displayName().charAt(0).toUpperCase() }}\n        </span>\n        <div class=\"min-w-0 max-sm:hidden\">\n          <strong class=\"block max-w-40 truncate text-[0.88rem] text-platform-ink\">{{\n            displayName()\n          }}</strong>\n          <small class=\"block text-[0.72rem] text-retail-blue font-bold\">{{ roleLabel() }}</small>\n        </div>\n        <i\n          class=\"fa-solid fa-chevron-down shrink-0 text-[0.65rem] text-platform-muted transition-transform\"\n          [class.rotate-180]=\"profileMenuOpen()\"\n          aria-hidden=\"true\"\n        ></i>\n      </button>\n\n      @if (profileMenuOpen()) {\n        <div\n          id=\"tenant-profile-menu\"\n          class=\"absolute right-0 top-[calc(100%+0.35rem)] z-[120] min-w-52 overflow-hidden rounded-xl border border-border-subtle bg-surface-container-lowest py-1 shadow-lg\"\n          role=\"menu\"\n          (click)=\"$event.stopPropagation()\"\n        >\n          <div class=\"border-b border-border-subtle px-3 py-2 sm:hidden\">\n            <p class=\"truncate text-label-md font-semibold text-text-primary\">{{ displayName() }}</p>\n            <p class=\"text-label-sm text-retail-blue\">{{ roleLabel() }}</p>\n          </div>\n          @if (session()?.user.email; as email) {\n            <p\n              class=\"hidden truncate border-b border-border-subtle px-3 py-2 text-body-sm text-text-muted sm:block\"\n              role=\"presentation\"\n            >\n              {{ email }}\n            </p>\n          }\n          <button\n            type=\"button\"\n            class=\"flex w-full items-center gap-2 px-3 py-2 text-left text-body-md text-alert-red transition-colors hover:bg-error-container\"\n            role=\"menuitem\"\n            (click)=\"logoutFromMenu()\"\n          >\n            <i class=\"fa-solid fa-right-from-bracket w-4 text-center text-[16px]\" aria-hidden=\"true\"></i>\n            D\u00E9connexion\n          </button>\n        </div>\n      }\n    </div>\n  </div>\n</header>\n" }]
    }], null, { logoutClick: [{ type: i0.Output, args: ["logoutClick"] }], onDocumentClick: [{
            type: HostListener,
            args: ['document:click']
        }], onEscape: [{
            type: HostListener,
            args: ['document:keydown.escape']
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(TenantTopbar, { className: "TenantTopbar", filePath: "src/app/core/layouts/tenant/topbar/tenant-topbar.ts", lineNumber: 19 }); })();
