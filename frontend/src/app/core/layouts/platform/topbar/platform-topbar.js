import { Component, computed, HostListener, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthSessionService } from '../../../auth/auth-session.service';
import { ThemeToggleComponent } from '../../../ui/theme-toggle/theme-toggle';
import * as i0 from "@angular/core";
function PlatformTopbar_Conditional_22_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 21);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx, " ");
} }
function PlatformTopbar_Conditional_22_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 17);
    i0.ɵɵlistener("click", function PlatformTopbar_Conditional_22_Template_div_click_0_listener($event) { return $event.stopPropagation(); });
    i0.ɵɵelementStart(1, "div", 18)(2, "p", 19);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 20);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(6, PlatformTopbar_Conditional_22_Conditional_6_Template, 2, 1, "p", 21);
    i0.ɵɵelementStart(7, "a", 22);
    i0.ɵɵlistener("click", function PlatformTopbar_Conditional_22_Template_a_click_7_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeProfileMenu()); });
    i0.ɵɵelement(8, "i", 23);
    i0.ɵɵtext(9, " Mon profil ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "a", 24);
    i0.ɵɵlistener("click", function PlatformTopbar_Conditional_22_Template_a_click_10_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeProfileMenu()); });
    i0.ɵɵelement(11, "i", 25);
    i0.ɵɵtext(12, " Param\u00E8tres ");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(13, "div", 26);
    i0.ɵɵelementStart(14, "button", 27);
    i0.ɵɵlistener("click", function PlatformTopbar_Conditional_22_Template_button_click_14_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.logoutFromMenu()); });
    i0.ɵɵelement(15, "i", 28);
    i0.ɵɵtext(16, " D\u00E9connexion ");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.displayName());
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.userSubtitle());
    i0.ɵɵadvance();
    i0.ɵɵconditional((tmp_3_0 = ctx_r1.session()?.user.email) ? 6 : -1, tmp_3_0);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.profileMenuLinkClass);
    i0.ɵɵadvance(3);
    i0.ɵɵclassMap(ctx_r1.profileMenuLinkClass);
} }
const profileMenuLinkClass = 'flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-platform-ink hover:bg-surface-container-high';
export class PlatformTopbar {
    profileMenuLinkClass = profileMenuLinkClass;
    authSession = inject(AuthSessionService);
    userSubtitle = input('Super Administrateur', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "userSubtitle" }] : /* istanbul ignore next */ []));
    logoutClick = output();
    session = this.authSession.session;
    profileMenuOpen = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "profileMenuOpen" }] : /* istanbul ignore next */ []));
    displayName = computed(() => {
        const user = this.session()?.user;
        if (!user) {
            return 'Administrateur';
        }
        const full = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
        return full || user.email.split('@')[0] || user.email;
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "displayName" }] : /* istanbul ignore next */ []));
    toggleProfileMenu(event) {
        event.stopPropagation();
        this.profileMenuOpen.update((open) => !open);
    }
    closeProfileMenu() {
        this.profileMenuOpen.set(false);
    }
    logoutFromMenu() {
        this.closeProfileMenu();
        this.onLogout();
    }
    onLogout() {
        this.logoutClick.emit();
    }
    onDocumentClick() {
        this.closeProfileMenu();
    }
    onEscape() {
        this.closeProfileMenu();
    }
    static ɵfac = function PlatformTopbar_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PlatformTopbar)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PlatformTopbar, selectors: [["app-platform-topbar"]], hostBindings: function PlatformTopbar_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("click", function PlatformTopbar_click_HostBindingHandler() { return ctx.onDocumentClick(); }, i0.ɵɵresolveDocument)("keydown.escape", function PlatformTopbar_keydown_escape_HostBindingHandler() { return ctx.onEscape(); }, i0.ɵɵresolveDocument);
        } }, inputs: { userSubtitle: [1, "userSubtitle"] }, outputs: { logoutClick: "logoutClick" }, decls: 23, vars: 8, consts: [[1, "layout-platform-topbar", "flex", "items-center", "justify-between", "gap-4", "border-b", "border-border-subtle", "bg-surface-container-lowest", "px-6", "shadow-[0_1px_4px_rgba(15,34,58,0.06)]", "max-md:py-3.5", "max-md:shadow-none", "dark:border-white/10", "dark:bg-surface-container-lowest/95", "dark:shadow-[0_1px_4px_rgba(0,0,0,0.35)]", "dark:backdrop-blur-md"], [1, "flex", "max-w-[520px]", "flex-1", "items-center", "gap-2", "rounded-full", "border", "border-border-subtle", "bg-surface-container-low", "px-3", "py-2", "text-platform-muted"], ["aria-hidden", "true", 1, "fa-solid", "fa-magnifying-glass"], [1, "sr-only"], ["type", "search", "placeholder", "Rechercher un utilisateur, un espace\u2026", "disabled", "", 1, "min-w-0", "flex-1", "border-0", "bg-transparent", "text-platform-ink", "outline-none"], [1, "rounded", "border", "border-border-subtle", "bg-surface-container-lowest", "px-1.5", "py-0.5", "text-[0.7rem]", "text-inherit"], [1, "flex", "items-center", "gap-3"], ["type", "button", "aria-label", "Notifications", "disabled", "", 1, "grid", "size-9", "place-items-center", "rounded-full", "border", "border-border-subtle", "bg-surface-container-lowest", "text-platform-muted"], ["aria-hidden", "true", 1, "fa-regular", "fa-bell"], [1, "relative", "min-w-0"], ["type", "button", "aria-haspopup", "menu", "aria-controls", "platform-profile-menu", 1, "group", "flex", "max-w-full", "cursor-pointer", "items-center", "gap-2", "rounded-lg", "border-0", "bg-transparent", "p-0", "text-left", "leading-none", "focus-visible:outline-2", "focus-visible:outline-offset-2", "focus-visible:outline-primary", 3, "click"], ["aria-hidden", "true", 1, "grid", "size-[2.35rem]", "shrink-0", "place-items-center", "rounded-full", "bg-primary-fixed", "font-semibold", "text-on-primary-fixed", "group-hover:shadow-[0_0_0_2px]", "group-hover:shadow-primary/25"], [1, "min-w-0", "max-sm:hidden"], [1, "block", "max-w-40", "truncate", "text-[0.88rem]", "text-platform-ink"], [1, "block", "text-[0.72rem]", "text-platform-muted"], ["aria-hidden", "true", 1, "fa-solid", "fa-chevron-down", "shrink-0", "text-[0.65rem]", "text-platform-muted", "transition-transform"], ["id", "platform-profile-menu", "role", "menu", 1, "absolute", "right-0", "top-[calc(100%+0.35rem)]", "z-[120]", "min-w-52", "overflow-hidden", "rounded-xl", "border", "border-border-subtle", "bg-surface-container-lowest", "py-1", "shadow-lg"], ["id", "platform-profile-menu", "role", "menu", 1, "absolute", "right-0", "top-[calc(100%+0.35rem)]", "z-[120]", "min-w-52", "overflow-hidden", "rounded-xl", "border", "border-border-subtle", "bg-surface-container-lowest", "py-1", "shadow-lg", 3, "click"], [1, "border-b", "border-border-subtle", "px-3", "py-2", "sm:hidden"], [1, "truncate", "text-sm", "font-semibold", "text-platform-ink"], [1, "text-xs", "text-platform-muted"], ["role", "presentation", 1, "hidden", "truncate", "border-b", "border-border-subtle", "px-3", "py-2", "text-xs", "text-[#8a9690]", "sm:block"], ["routerLink", "/profil", "role", "menuitem", 3, "click"], ["aria-hidden", "true", 1, "fa-solid", "fa-user", "w-4", "text-center"], ["routerLink", "/parametres", "role", "menuitem", 3, "click"], ["aria-hidden", "true", 1, "fa-solid", "fa-gear", "w-4", "text-center"], ["role", "separator", 1, "my-1", "border-t", "border-border-subtle"], ["type", "button", "role", "menuitem", 1, "flex", "w-full", "items-center", "gap-2", "px-3", "py-2", "text-left", "text-sm", "text-alert-red", "hover:bg-error-container", 3, "click"], ["aria-hidden", "true", 1, "fa-solid", "fa-right-from-bracket"]], template: function PlatformTopbar_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "header", 0)(1, "label", 1);
            i0.ɵɵelement(2, "i", 2);
            i0.ɵɵelementStart(3, "span", 3);
            i0.ɵɵtext(4, "Rechercher");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(5, "input", 4);
            i0.ɵɵelementStart(6, "kbd", 5);
            i0.ɵɵtext(7, "Ctrl + K");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(8, "div", 6);
            i0.ɵɵelement(9, "app-theme-toggle");
            i0.ɵɵelementStart(10, "button", 7);
            i0.ɵɵelement(11, "i", 8);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "div", 9)(13, "button", 10);
            i0.ɵɵlistener("click", function PlatformTopbar_Template_button_click_13_listener($event) { return ctx.toggleProfileMenu($event); });
            i0.ɵɵelementStart(14, "span", 11);
            i0.ɵɵtext(15);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(16, "div", 12)(17, "strong", 13);
            i0.ɵɵtext(18);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(19, "small", 14);
            i0.ɵɵtext(20);
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(21, "i", 15);
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(22, PlatformTopbar_Conditional_22_Template, 17, 7, "div", 16);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(13);
            i0.ɵɵattribute("aria-expanded", ctx.profileMenuOpen())("aria-label", "Menu compte : " + ctx.displayName());
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1(" ", ctx.displayName().charAt(0).toUpperCase(), " ");
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.displayName());
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.userSubtitle());
            i0.ɵɵadvance();
            i0.ɵɵclassProp("rotate-180", ctx.profileMenuOpen());
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.profileMenuOpen() ? 22 : -1);
        } }, dependencies: [RouterLink, ThemeToggleComponent], encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PlatformTopbar, [{
        type: Component,
        args: [{ selector: 'app-platform-topbar', imports: [RouterLink, ThemeToggleComponent], template: "<header\n  class=\"layout-platform-topbar flex items-center justify-between gap-4 border-b border-border-subtle bg-surface-container-lowest px-6 shadow-[0_1px_4px_rgba(15,34,58,0.06)] max-md:py-3.5 max-md:shadow-none dark:border-white/10 dark:bg-surface-container-lowest/95 dark:shadow-[0_1px_4px_rgba(0,0,0,0.35)] dark:backdrop-blur-md\"\n>\n  <label\n    class=\"flex max-w-[520px] flex-1 items-center gap-2 rounded-full border border-border-subtle bg-surface-container-low px-3 py-2 text-platform-muted\"\n  >\n    <i class=\"fa-solid fa-magnifying-glass\" aria-hidden=\"true\"></i>\n    <span class=\"sr-only\">Rechercher</span>\n    <input\n      type=\"search\"\n      class=\"min-w-0 flex-1 border-0 bg-transparent text-platform-ink outline-none\"\n      placeholder=\"Rechercher un utilisateur, un espace\u2026\"\n      disabled\n    />\n    <kbd\n      class=\"rounded border border-border-subtle bg-surface-container-lowest px-1.5 py-0.5 text-[0.7rem] text-inherit\"\n      >Ctrl + K</kbd\n    >\n  </label>\n\n  <div class=\"flex items-center gap-3\">\n    <app-theme-toggle />\n\n    <button\n      type=\"button\"\n      class=\"grid size-9 place-items-center rounded-full border border-border-subtle bg-surface-container-lowest text-platform-muted\"\n      aria-label=\"Notifications\"\n      disabled\n    >\n      <i class=\"fa-regular fa-bell\" aria-hidden=\"true\"></i>\n    </button>\n\n    <div class=\"relative min-w-0\">\n      <button\n        type=\"button\"\n        class=\"group flex max-w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent p-0 text-left leading-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary\"\n        (click)=\"toggleProfileMenu($event)\"\n        [attr.aria-expanded]=\"profileMenuOpen()\"\n        aria-haspopup=\"menu\"\n        aria-controls=\"platform-profile-menu\"\n        [attr.aria-label]=\"'Menu compte : ' + displayName()\"\n      >\n        <span\n          class=\"grid size-[2.35rem] shrink-0 place-items-center rounded-full bg-primary-fixed font-semibold text-on-primary-fixed group-hover:shadow-[0_0_0_2px] group-hover:shadow-primary/25\"\n          aria-hidden=\"true\"\n        >\n          {{ displayName().charAt(0).toUpperCase() }}\n        </span>\n        <div class=\"min-w-0 max-sm:hidden\">\n          <strong class=\"block max-w-40 truncate text-[0.88rem] text-platform-ink\">{{\n            displayName()\n          }}</strong>\n          <small class=\"block text-[0.72rem] text-platform-muted\">{{ userSubtitle() }}</small>\n        </div>\n        <i\n          class=\"fa-solid fa-chevron-down shrink-0 text-[0.65rem] text-platform-muted transition-transform\"\n          [class.rotate-180]=\"profileMenuOpen()\"\n          aria-hidden=\"true\"\n        ></i>\n      </button>\n\n      @if (profileMenuOpen()) {\n        <div\n          id=\"platform-profile-menu\"\n          class=\"absolute right-0 top-[calc(100%+0.35rem)] z-[120] min-w-52 overflow-hidden rounded-xl border border-border-subtle bg-surface-container-lowest py-1 shadow-lg\"\n          role=\"menu\"\n          (click)=\"$event.stopPropagation()\"\n        >\n          <div class=\"border-b border-border-subtle px-3 py-2 sm:hidden\">\n            <p class=\"truncate text-sm font-semibold text-platform-ink\">{{ displayName() }}</p>\n            <p class=\"text-xs text-platform-muted\">{{ userSubtitle() }}</p>\n          </div>\n          @if (session()?.user.email; as email) {\n            <p\n              class=\"hidden truncate border-b border-border-subtle px-3 py-2 text-xs text-[#8a9690] sm:block\"\n              role=\"presentation\"\n            >\n              {{ email }}\n            </p>\n          }\n          <a\n            routerLink=\"/profil\"\n            [class]=\"profileMenuLinkClass\"\n            role=\"menuitem\"\n            (click)=\"closeProfileMenu()\"\n          >\n            <i class=\"fa-solid fa-user w-4 text-center\" aria-hidden=\"true\"></i>\n            Mon profil\n          </a>\n          <a\n            routerLink=\"/parametres\"\n            [class]=\"profileMenuLinkClass\"\n            role=\"menuitem\"\n            (click)=\"closeProfileMenu()\"\n          >\n            <i class=\"fa-solid fa-gear w-4 text-center\" aria-hidden=\"true\"></i>\n            Param\u00E8tres\n          </a>\n          <div class=\"my-1 border-t border-border-subtle\" role=\"separator\"></div>\n          <button\n            type=\"button\"\n            class=\"flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-alert-red hover:bg-error-container\"\n            role=\"menuitem\"\n            (click)=\"logoutFromMenu()\"\n          >\n            <i class=\"fa-solid fa-right-from-bracket\" aria-hidden=\"true\"></i>\n            D\u00E9connexion\n          </button>\n        </div>\n      }\n    </div>\n  </div>\n</header>\n", styles: ["/* Styles r\u00E9serv\u00E9s si besoin (composant = Tailwind dans le template). */\n"] }]
    }], null, { userSubtitle: [{ type: i0.Input, args: [{ isSignal: true, alias: "userSubtitle", required: false }] }], logoutClick: [{ type: i0.Output, args: ["logoutClick"] }], onDocumentClick: [{
            type: HostListener,
            args: ['document:click']
        }], onEscape: [{
            type: HostListener,
            args: ['document:keydown.escape']
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PlatformTopbar, { className: "PlatformTopbar", filePath: "src/app/core/layouts/platform/topbar/platform-topbar.ts", lineNumber: 15 }); })();
