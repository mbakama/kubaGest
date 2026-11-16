import { Component, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import * as i0 from "@angular/core";
const _c0 = a0 => ({ exact: a0 });
const _forTrack0 = ($index, $item) => $item.id;
function PlatformSidebarMenu_For_2_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 2);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r1 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(item_r1.label);
} }
function PlatformSidebarMenu_For_2_Conditional_2_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 9);
} if (rf & 2) {
    const item_r1 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵclassMap(item_r1.icon);
} }
function PlatformSidebarMenu_For_2_Conditional_2_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-platform-sidebar-menu", 8);
} if (rf & 2) {
    const item_r1 = i0.ɵɵnextContext(2).$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵproperty("items", item_r1.children)("depth", ctx_r2.depth() + 1);
} }
function PlatformSidebarMenu_For_2_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 5);
    i0.ɵɵlistener("click", function PlatformSidebarMenu_For_2_Conditional_2_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r2); const item_r1 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.toggleGroup(item_r1.id)); });
    i0.ɵɵconditionalCreate(1, PlatformSidebarMenu_For_2_Conditional_2_Conditional_1_Template, 1, 2, "i", 6);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(4, "i", 7);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(5, PlatformSidebarMenu_For_2_Conditional_2_Conditional_5_Template, 1, 2, "app-platform-sidebar-menu", 8);
} if (rf & 2) {
    const item_r1 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("platform-sidebar__nav-item--expanded", ctx_r2.isExpanded(item_r1.id));
    i0.ɵɵattribute("aria-expanded", ctx_r2.isExpanded(item_r1.id));
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r1.icon ? 1 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r1.label);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.isExpanded(item_r1.id) ? 5 : -1);
} }
function PlatformSidebarMenu_For_2_Conditional_3_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 9);
} if (rf & 2) {
    const item_r1 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵclassMap(item_r1.icon);
} }
function PlatformSidebarMenu_For_2_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "a", 3);
    i0.ɵɵconditionalCreate(1, PlatformSidebarMenu_For_2_Conditional_3_Conditional_1_Template, 1, 2, "i", 6);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r1 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵproperty("routerLink", item_r1.link)("routerLinkActiveOptions", i0.ɵɵpureFunction1(4, _c0, ctx_r2.linkExact(item_r1.link)));
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r1.icon ? 1 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r1.label);
} }
function PlatformSidebarMenu_For_2_Conditional_4_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 9);
} if (rf & 2) {
    const item_r1 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵclassMap(item_r1.icon);
} }
function PlatformSidebarMenu_For_2_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 4);
    i0.ɵɵconditionalCreate(1, PlatformSidebarMenu_For_2_Conditional_4_Conditional_1_Template, 1, 2, "i", 6);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span", 10);
    i0.ɵɵtext(5, "Bient\u00F4t");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r1 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r1.icon ? 1 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r1.label);
} }
function PlatformSidebarMenu_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li", 1);
    i0.ɵɵconditionalCreate(1, PlatformSidebarMenu_For_2_Conditional_1_Template, 2, 1, "span", 2)(2, PlatformSidebarMenu_For_2_Conditional_2_Template, 6, 6)(3, PlatformSidebarMenu_For_2_Conditional_3_Template, 4, 6, "a", 3)(4, PlatformSidebarMenu_For_2_Conditional_4_Template, 6, 2, "span", 4);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r1 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r1.isTitle ? 1 : ctx_r2.hasChildren(item_r1) ? 2 : item_r1.link && !item_r1.disabled ? 3 : 4);
} }
export class PlatformSidebarMenu {
    items = input.required(/* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "items" }] : /* istanbul ignore next */ []));
    depth = input(0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "depth" }] : /* istanbul ignore next */ []));
    expanded = signal({}, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "expanded" }] : /* istanbul ignore next */ []));
    hasChildren(item) {
        return (item.children?.length ?? 0) > 0;
    }
    isExpanded(id) {
        return this.expanded()[id] ?? false;
    }
    toggleGroup(id) {
        this.expanded.update((state) => ({ ...state, [id]: !state[id] }));
    }
    linkExact(link) {
        return link === '/';
    }
    static ɵfac = function PlatformSidebarMenu_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PlatformSidebarMenu)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PlatformSidebarMenu, selectors: [["app-platform-sidebar-menu"]], inputs: { items: [1, "items"], depth: [1, "depth"] }, decls: 3, vars: 3, consts: [[1, "platform-sidebar__list"], [1, "platform-sidebar__entry"], [1, "platform-sidebar__title"], ["routerLinkActive", "platform-sidebar__nav-item--active", 1, "platform-sidebar__nav-item", 3, "routerLink", "routerLinkActiveOptions"], [1, "platform-sidebar__nav-item", "platform-sidebar__nav-item--disabled"], ["type", "button", 1, "platform-sidebar__nav-item", "platform-sidebar__nav-item--parent", 3, "click"], ["aria-hidden", "true", 1, "fa-solid", 3, "class"], ["aria-hidden", "true", 1, "fa-solid", "fa-chevron-down", "platform-sidebar__chevron"], [3, "items", "depth"], ["aria-hidden", "true", 1, "fa-solid"], [1, "platform-sidebar__soon"]], template: function PlatformSidebarMenu_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "ul", 0);
            i0.ɵɵrepeaterCreate(1, PlatformSidebarMenu_For_2_Template, 5, 1, "li", 1, _forTrack0);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵclassProp("platform-sidebar__list--sub", ctx.depth() > 0);
            i0.ɵɵattribute("data-depth", ctx.depth());
            i0.ɵɵadvance();
            i0.ɵɵrepeater(ctx.items());
        } }, dependencies: [PlatformSidebarMenu, RouterLink, RouterLinkActive], styles: ["@use '../../sidebar-menu.styles.scss' as menu;\n\n@include menu.sidebar-menu('platform-sidebar');"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PlatformSidebarMenu, [{
        type: Component,
        args: [{ selector: 'app-platform-sidebar-menu', imports: [RouterLink, RouterLinkActive, PlatformSidebarMenu], template: "<ul\n  class=\"platform-sidebar__list\"\n  [class.platform-sidebar__list--sub]=\"depth() > 0\"\n  [attr.data-depth]=\"depth()\"\n>\n  @for (item of items(); track item.id) {\n    <li class=\"platform-sidebar__entry\">\n      @if (item.isTitle) {\n        <span class=\"platform-sidebar__title\">{{ item.label }}</span>\n      } @else if (hasChildren(item)) {\n        <button\n          type=\"button\"\n          class=\"platform-sidebar__nav-item platform-sidebar__nav-item--parent\"\n          [class.platform-sidebar__nav-item--expanded]=\"isExpanded(item.id)\"\n          (click)=\"toggleGroup(item.id)\"\n          [attr.aria-expanded]=\"isExpanded(item.id)\"\n        >\n          @if (item.icon) {\n            <i class=\"fa-solid\" [class]=\"item.icon\" aria-hidden=\"true\"></i>\n          }\n          <span>{{ item.label }}</span>\n          <i class=\"fa-solid fa-chevron-down platform-sidebar__chevron\" aria-hidden=\"true\"></i>\n        </button>\n        @if (isExpanded(item.id)) {\n          <app-platform-sidebar-menu [items]=\"item.children!\" [depth]=\"depth() + 1\" />\n        }\n      } @else if (item.link && !item.disabled) {\n        <a\n          class=\"platform-sidebar__nav-item\"\n          [routerLink]=\"item.link\"\n          routerLinkActive=\"platform-sidebar__nav-item--active\"\n          [routerLinkActiveOptions]=\"{ exact: linkExact(item.link) }\"\n        >\n          @if (item.icon) {\n            <i class=\"fa-solid\" [class]=\"item.icon\" aria-hidden=\"true\"></i>\n          }\n          <span>{{ item.label }}</span>\n        </a>\n      } @else {\n        <span class=\"platform-sidebar__nav-item platform-sidebar__nav-item--disabled\">\n          @if (item.icon) {\n            <i class=\"fa-solid\" [class]=\"item.icon\" aria-hidden=\"true\"></i>\n          }\n          <span>{{ item.label }}</span>\n          <span class=\"platform-sidebar__soon\">Bient\u00F4t</span>\n        </span>\n      }\n    </li>\n  }\n</ul>\n", styles: ["@use '../../sidebar-menu.styles.scss' as menu;\n\n@include menu.sidebar-menu('platform-sidebar');\n"] }]
    }], null, { items: [{ type: i0.Input, args: [{ isSignal: true, alias: "items", required: true }] }], depth: [{ type: i0.Input, args: [{ isSignal: true, alias: "depth", required: false }] }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PlatformSidebarMenu, { className: "PlatformSidebarMenu", filePath: "src/app/core/layouts/platform/sidebar/platform-sidebar-menu.ts", lineNumber: 11 }); })();
