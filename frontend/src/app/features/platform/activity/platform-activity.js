import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/api/api.service';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.id;
function PlatformActivity_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 4);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.error());
} }
function PlatformActivity_For_67_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 19);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const kind_r2 = ctx.$implicit;
    i0.ɵɵproperty("value", kind_r2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(kind_r2);
} }
function PlatformActivity_Conditional_68_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 20);
    i0.ɵɵtext(1, "Chargement du registre\u2026");
    i0.ɵɵelementEnd();
} }
function PlatformActivity_Conditional_69_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 20);
    i0.ɵɵtext(1, "Aucune action ne correspond aux filtres.");
    i0.ɵɵelementEnd();
} }
function PlatformActivity_Conditional_70_For_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 25)(1, "td")(2, "time");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "td")(5, "div", 26)(6, "span");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div")(9, "strong");
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "small");
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(13, "td")(14, "span", 27);
    i0.ɵɵelement(15, "i", 28);
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "small");
    i0.ɵɵtext(18);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(19, "td")(20, "strong");
    i0.ɵɵtext(21);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "small");
    i0.ɵɵtext(23);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(24, "td")(25, "code");
    i0.ɵɵtext(26);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const entry_r3 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("audit-selected", ctx_r0.selectedId() === entry_r3.id);
    i0.ɵɵproperty("id", "audit-" + entry_r3.id);
    i0.ɵɵadvance(2);
    i0.ɵɵattribute("datetime", entry_r3.occurredAt);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.formatDate(entry_r3.occurredAt));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r0.initials(entry_r3));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r0.actor(entry_r3));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(entry_r3.actorEmail ?? "Action syst\u00E8me");
    i0.ɵɵadvance(3);
    i0.ɵɵclassMap(ctx_r0.actionIcon(entry_r3.kind));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(entry_r3.title);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(entry_r3.kind);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(entry_r3.detail);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(entry_r3.tenantId ? "Espace identifi\u00E9" : "Cible plateforme");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("#", entry_r3.id.slice(0, 8).toUpperCase());
} }
function PlatformActivity_Conditional_70_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 21)(1, "table")(2, "thead")(3, "tr")(4, "th");
    i0.ɵɵtext(5, "Date et heure");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "th");
    i0.ɵɵtext(7, "Auteur");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "th");
    i0.ɵɵtext(9, "Action");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "th");
    i0.ɵɵtext(11, "Espace / Cible");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "th");
    i0.ɵɵtext(13, "R\u00E9f\u00E9rence");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(14, "tbody");
    i0.ɵɵrepeaterCreate(15, PlatformActivity_Conditional_70_For_16_Template, 27, 15, "tr", 24, _forTrack0);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(15);
    i0.ɵɵrepeater(ctx_r0.filteredEntries());
} }
export class PlatformActivity {
    api = inject(ApiService);
    destroyRef = inject(DestroyRef);
    route = inject(ActivatedRoute);
    loading = signal(true, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "loading" }] : /* istanbul ignore next */ []));
    error = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "error" }] : /* istanbul ignore next */ []));
    entries = signal([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "entries" }] : /* istanbul ignore next */ []));
    selectedId = signal(this.route.snapshot.queryParamMap.get('entree'), /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "selectedId" }] : /* istanbul ignore next */ []));
    search = signal('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "search" }] : /* istanbul ignore next */ []));
    actionFilter = signal('all', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "actionFilter" }] : /* istanbul ignore next */ []));
    actionKinds = computed(() => [...new Set(this.entries().map((entry) => entry.kind))], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "actionKinds" }] : /* istanbul ignore next */ []));
    actorCount = computed(() => new Set(this.entries().map((entry) => this.actor(entry))).size, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "actorCount" }] : /* istanbul ignore next */ []));
    todayCount = computed(() => {
        const today = new Date().toDateString();
        return this.entries().filter((entry) => new Date(entry.occurredAt).toDateString() === today)
            .length;
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "todayCount" }] : /* istanbul ignore next */ []));
    filteredEntries = computed(() => {
        const query = this.search().trim().toLocaleLowerCase('fr');
        const kind = this.actionFilter();
        return this.entries().filter((entry) => {
            const matchesKind = kind === 'all' || entry.kind === kind;
            const haystack = `${entry.title} ${entry.detail} ${this.actor(entry)} ${entry.actorEmail ?? ''}`.toLocaleLowerCase('fr');
            return matchesKind && (!query || haystack.includes(query));
        });
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "filteredEntries" }] : /* istanbul ignore next */ []));
    ngOnInit() {
        this.api
            .getPlatformActivityLog()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (entries) => {
                this.entries.set(entries);
                this.loading.set(false);
                setTimeout(() => this.scrollToSelected(), 0);
            },
            error: (error) => {
                this.loading.set(false);
                this.error.set(error instanceof HttpErrorResponse && error.status === 403
                    ? 'Accès au registre refusé.'
                    : 'Impossible de charger le registre d’audit.');
            },
        });
    }
    actor(entry) {
        return entry.actorName ?? entry.actorEmail ?? 'Système';
    }
    initials(entry) {
        return this.actor(entry)
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0])
            .join('')
            .toUpperCase();
    }
    actionIcon(kind) {
        return kind === 'tenant.registered'
            ? 'fa-building-circle-check'
            : kind === 'tenant.subscription.updated'
                ? 'fa-file-signature'
                : 'fa-shield-halved';
    }
    updateSearch(event) {
        this.search.set(event.target.value);
    }
    updateActionFilter(event) {
        this.actionFilter.set(event.target.value);
    }
    formatDate(iso) {
        return new Date(iso).toLocaleString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    }
    scrollToSelected() {
        const id = this.selectedId();
        if (id)
            document
                .getElementById(`audit-${id}`)
                ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    static ɵfac = function PlatformActivity_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PlatformActivity)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PlatformActivity, selectors: [["app-platform-activity"]], decls: 78, vars: 9, consts: [[1, "audit-head"], ["aria-label", "Fil d\u2019Ariane"], ["routerLink", "/"], [1, "fa-solid", "fa-chevron-right"], ["role", "alert", 1, "audit-error"], ["aria-label", "Indicateurs du journal", 1, "audit-kpis"], [1, "fa-solid", "fa-clock-rotate-left"], [1, "fa-solid", "fa-calendar-day"], [1, "fa-solid", "fa-user-shield"], [1, "fa-solid", "fa-list-check"], ["aria-labelledby", "audit-register-title", 1, "audit-register"], [1, "audit-register__toolbar"], ["id", "audit-register-title"], [1, "audit-register__filters"], [1, "sr-only"], [1, "fa-solid", "fa-magnifying-glass"], ["type", "search", "placeholder", "Auteur, espace ou action\u2026", 3, "input", "value"], ["aria-label", "Filtrer par type d\u2019action", 3, "change", "value"], ["value", "all"], [3, "value"], [1, "audit-state"], [1, "audit-table-wrap"], [1, "audit-notice"], [1, "fa-solid", "fa-circle-info"], [3, "id", "audit-selected"], [3, "id"], [1, "audit-actor"], [1, "audit-action"], [1, "fa-solid"]], template: function PlatformActivity_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "header", 0)(1, "div")(2, "nav", 1)(3, "a", 2);
            i0.ɵɵtext(4, "Tableau de bord");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(5, "i", 3);
            i0.ɵɵelementStart(6, "span");
            i0.ɵɵtext(7, "Journal d\u2019audit");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(8, "h1");
            i0.ɵɵtext(9, "Journal d\u2019Audit & Tra\u00E7abilit\u00E9");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "p");
            i0.ɵɵtext(11, " Historique chronologique des actions d\u2019administration effectu\u00E9es sur la plateforme KubaGest. ");
            i0.ɵɵelementEnd()()();
            i0.ɵɵconditionalCreate(12, PlatformActivity_Conditional_12_Template, 2, 1, "p", 4);
            i0.ɵɵelementStart(13, "section", 5)(14, "article")(15, "div")(16, "small");
            i0.ɵɵtext(17, "\u00C9v\u00E9nements charg\u00E9s");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "strong");
            i0.ɵɵtext(19);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "span");
            i0.ɵɵtext(21, "derni\u00E8res actions consign\u00E9es");
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(22, "i", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "article")(24, "div")(25, "small");
            i0.ɵɵtext(26, "Activit\u00E9 aujourd\u2019hui");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(27, "strong");
            i0.ɵɵtext(28);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(29, "span");
            i0.ɵɵtext(30, "actions enregistr\u00E9es");
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(31, "i", 7);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(32, "article")(33, "div")(34, "small");
            i0.ɵɵtext(35, "Auteurs identifi\u00E9s");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(36, "strong");
            i0.ɵɵtext(37);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(38, "span");
            i0.ɵɵtext(39, "comptes ou syst\u00E8me");
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(40, "i", 8);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(41, "article")(42, "div")(43, "small");
            i0.ɵɵtext(44, "Types d\u2019action");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(45, "strong");
            i0.ɵɵtext(46);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(47, "span");
            i0.ɵɵtext(48, "cat\u00E9gories audit\u00E9es");
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(49, "i", 9);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(50, "section", 10)(51, "div", 11)(52, "div")(53, "h2", 12);
            i0.ɵɵtext(54, "Registre des \u00E9v\u00E9nements");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(55, "p");
            i0.ɵɵtext(56);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(57, "div", 13)(58, "label")(59, "span", 14);
            i0.ɵɵtext(60, "Rechercher");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(61, "i", 15);
            i0.ɵɵelementStart(62, "input", 16);
            i0.ɵɵlistener("input", function PlatformActivity_Template_input_input_62_listener($event) { return ctx.updateSearch($event); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(63, "select", 17);
            i0.ɵɵlistener("change", function PlatformActivity_Template_select_change_63_listener($event) { return ctx.updateActionFilter($event); });
            i0.ɵɵelementStart(64, "option", 18);
            i0.ɵɵtext(65, "Toutes les actions");
            i0.ɵɵelementEnd();
            i0.ɵɵrepeaterCreate(66, PlatformActivity_For_67_Template, 2, 2, "option", 19, i0.ɵɵrepeaterTrackByIdentity);
            i0.ɵɵelementEnd()()();
            i0.ɵɵconditionalCreate(68, PlatformActivity_Conditional_68_Template, 2, 0, "p", 20)(69, PlatformActivity_Conditional_69_Template, 2, 0, "p", 20)(70, PlatformActivity_Conditional_70_Template, 17, 0, "div", 21);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(71, "aside", 22);
            i0.ɵɵelement(72, "i", 23);
            i0.ɵɵelementStart(73, "div")(74, "strong");
            i0.ɵɵtext(75, "Conservation du registre");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(76, "p");
            i0.ɵɵtext(77, " Les entr\u00E9es pr\u00E9sent\u00E9es proviennent directement du journal d\u2019audit du backend. Elles sont consultables en lecture seule depuis cette interface. ");
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(12);
            i0.ɵɵconditional(ctx.error() ? 12 : -1);
            i0.ɵɵadvance(7);
            i0.ɵɵtextInterpolate(ctx.entries().length);
            i0.ɵɵadvance(9);
            i0.ɵɵtextInterpolate(ctx.todayCount());
            i0.ɵɵadvance(9);
            i0.ɵɵtextInterpolate(ctx.actorCount());
            i0.ɵɵadvance(9);
            i0.ɵɵtextInterpolate(ctx.actionKinds().length);
            i0.ɵɵadvance(10);
            i0.ɵɵtextInterpolate1("", ctx.filteredEntries().length, " r\u00E9sultat(s) affich\u00E9(s)");
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("value", ctx.search());
            i0.ɵɵadvance();
            i0.ɵɵproperty("value", ctx.actionFilter());
            i0.ɵɵadvance(3);
            i0.ɵɵrepeater(ctx.actionKinds());
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.loading() ? 68 : ctx.filteredEntries().length === 0 ? 69 : 70);
        } }, dependencies: [RouterLink], styles: [".audit-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 1.5rem;\n  margin-bottom: 1.25rem;\n}\n.audit-head[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  color: var(--%NS%color-platform-muted);\n  font-size: 0.75rem;\n  font-weight: 600;\n}\n.audit-head[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: var(--%NS%color-primary);\n  text-decoration: none;\n}\n.audit-head[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 0.55rem;\n}\n.audit-head[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0.55rem 0 0.35rem;\n  font-size: 1.7rem;\n  line-height: 1.2;\n}\n.audit-head[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  max-width: 760px;\n  margin: 0;\n  color: var(--%NS%color-platform-muted);\n  font-size: 0.9rem;\n}\n.audit-head__badge[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.45rem;\n  padding: 0.55rem 0.8rem;\n  border-radius: 999px;\n  background: var(--%NS%color-primary-fixed);\n  color: var(--%NS%color-primary);\n  font-size: 0.75rem;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.audit-kpis[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 1rem;\n  margin-bottom: 1rem;\n}\n.audit-kpis[_ngcontent-%COMP%]   article[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 1rem;\n  padding: 1rem;\n  background: var(--%NS%color-surface-container-lowest);\n  border: 1px solid var(--%NS%color-border-subtle);\n  border-radius: 14px;\n}\n.audit-kpis[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.audit-kpis[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: block;\n  color: var(--%NS%color-platform-muted);\n}\n.audit-kpis[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  font-weight: 600;\n}\n.audit-kpis[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n  margin: 0.25rem 0;\n  font-size: 1.5rem;\n  line-height: 1;\n}\n.audit-kpis[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n}\n.audit-kpis[_ngcontent-%COMP%]   article[_ngcontent-%COMP%]    > i[_ngcontent-%COMP%] {\n  display: grid;\n  width: 2.5rem;\n  height: 2.5rem;\n  place-items: center;\n  border-radius: 10px;\n  background: var(--%NS%color-primary-fixed);\n  color: var(--%NS%color-primary);\n}\n.audit-register[_ngcontent-%COMP%] {\n  overflow: hidden;\n  background: var(--%NS%color-surface-container-lowest);\n  border: 1px solid var(--%NS%color-border-subtle);\n  border-radius: 14px;\n}\n.audit-register__toolbar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  padding: 1rem;\n  border-bottom: 1px solid var(--%NS%color-border-subtle);\n}\n.audit-register__toolbar[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1rem;\n}\n.audit-register__toolbar[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.2rem 0 0;\n  color: var(--%NS%color-platform-muted);\n  font-size: 0.72rem;\n}\n.audit-register__filters[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.65rem;\n}\n.audit-register__filters[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  min-width: 260px;\n  padding: 0 0.75rem;\n  background: var(--%NS%color-surface-container-low);\n  border: 1px solid var(--%NS%color-border-subtle);\n  border-radius: 9px;\n  color: var(--%NS%color-platform-muted);\n}\n.audit-register__filters[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.audit-register__filters[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  height: 2.35rem;\n  border: 0;\n  outline: 0;\n  background: transparent;\n  color: inherit;\n  font: inherit;\n}\n.audit-register__filters[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.audit-register__filters[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  padding: 0 0.75rem;\n  border: 1px solid var(--%NS%color-border-subtle);\n  border-radius: 9px;\n  background: var(--%NS%color-surface-container-low);\n}\n.audit-table-wrap[_ngcontent-%COMP%] {\n  overflow: auto;\n}\n.audit-table-wrap[_ngcontent-%COMP%]   table[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 920px;\n  border-collapse: collapse;\n  font-size: 0.8rem;\n}\n.audit-table-wrap[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], \n.audit-table-wrap[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 0.8rem 1rem;\n  text-align: left;\n  border-bottom: 1px solid var(--%NS%color-border-subtle);\n  vertical-align: middle;\n}\n.audit-table-wrap[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  background: var(--%NS%color-surface-container-low);\n  color: var(--%NS%color-platform-muted);\n  font-size: 0.7rem;\n  text-transform: uppercase;\n  letter-spacing: 0.035em;\n}\n.audit-table-wrap[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover   td[_ngcontent-%COMP%] {\n  background: color-mix(in srgb, var(--%NS%color-primary-fixed) 35%, transparent);\n}\n.audit-table-wrap[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.audit-table-wrap[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n}\n.audit-table-wrap[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  margin-top: 0.18rem;\n  color: var(--%NS%color-platform-muted);\n  font-size: 0.68rem;\n}\n.audit-table-wrap[_ngcontent-%COMP%]   time[_ngcontent-%COMP%] {\n  white-space: nowrap;\n}\n.audit-actor[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.55rem;\n}\n.audit-actor[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  display: grid;\n  width: 2rem;\n  height: 2rem;\n  flex: 0 0 auto;\n  place-items: center;\n  border-radius: 50%;\n  background: var(--%NS%color-primary);\n  color: white;\n  font-size: 0.68rem;\n  font-weight: 800;\n}\n.audit-action[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.4rem;\n  padding: 0.3rem 0.5rem;\n  border-radius: 6px;\n  background: var(--%NS%color-primary-fixed);\n  color: var(--%NS%color-primary);\n  font-weight: 700;\n  white-space: nowrap;\n}\n.audit-table-wrap[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  padding: 0.25rem 0.4rem;\n  border-radius: 5px;\n  background: var(--%NS%color-surface-container-low);\n  color: var(--%NS%color-platform-muted);\n  font-size: 0.7rem;\n}\n.audit-selected[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  background: var(--%NS%color-primary-fixed) !important;\n}\n.audit-state[_ngcontent-%COMP%] {\n  min-height: 180px;\n  display: grid;\n  place-items: center;\n  color: var(--%NS%color-platform-muted);\n}\n.audit-notice[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.8rem;\n  margin-top: 1rem;\n  padding: 1rem;\n  border-radius: 12px;\n  background: var(--%NS%color-surface-container-low);\n  color: var(--%NS%color-platform-muted);\n}\n.audit-notice[_ngcontent-%COMP%]    > i[_ngcontent-%COMP%] {\n  color: var(--%NS%color-primary);\n  margin-top: 0.15rem;\n}\n.audit-notice[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--%NS%color-on-surface);\n}\n.audit-notice[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.25rem 0 0;\n  font-size: 0.78rem;\n}\n.audit-error[_ngcontent-%COMP%] {\n  color: #b42318;\n}\n@media (max-width: 1100px) {\n  .audit-kpis[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n  .audit-register__toolbar[_ngcontent-%COMP%] {\n    align-items: flex-start;\n    flex-direction: column;\n  }\n  .audit-register__filters[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .audit-register__filters[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n    flex: 1;\n  }\n}\n@media (max-width: 620px) {\n  .audit-head[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n  .audit-kpis[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .audit-register__filters[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n  .audit-register__filters[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n    min-width: 0;\n  }\n  .audit-register__filters[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PlatformActivity, [{
        type: Component,
        args: [{ selector: 'app-platform-activity', imports: [RouterLink], template: "<header class=\"audit-head\">\n  <div>\n    <nav aria-label=\"Fil d\u2019Ariane\">\n      <a routerLink=\"/\">Tableau de bord</a><i class=\"fa-solid fa-chevron-right\"></i\n      ><span>Journal d\u2019audit</span>\n    </nav>\n    <h1>Journal d\u2019Audit & Tra\u00E7abilit\u00E9</h1>\n    <p>\n      Historique chronologique des actions d\u2019administration effectu\u00E9es sur la plateforme KubaGest.\n    </p>\n  </div>\n  <!-- <span class=\"audit-head__badge\"><i class=\"fa-solid fa-shield-halved\"></i> Registre prot\u00E9g\u00E9</span> -->\n</header>\n\n@if (error()) {\n  <p class=\"audit-error\" role=\"alert\">{{ error() }}</p>\n}\n\n<section class=\"audit-kpis\" aria-label=\"Indicateurs du journal\">\n  <article>\n    <div>\n      <small>\u00C9v\u00E9nements charg\u00E9s</small><strong>{{ entries().length }}</strong\n      ><span>derni\u00E8res actions consign\u00E9es</span>\n    </div>\n    <i class=\"fa-solid fa-clock-rotate-left\"></i>\n  </article>\n  <article>\n    <div>\n      <small>Activit\u00E9 aujourd\u2019hui</small><strong>{{ todayCount() }}</strong\n      ><span>actions enregistr\u00E9es</span>\n    </div>\n    <i class=\"fa-solid fa-calendar-day\"></i>\n  </article>\n  <article>\n    <div>\n      <small>Auteurs identifi\u00E9s</small><strong>{{ actorCount() }}</strong\n      ><span>comptes ou syst\u00E8me</span>\n    </div>\n    <i class=\"fa-solid fa-user-shield\"></i>\n  </article>\n  <article>\n    <div>\n      <small>Types d\u2019action</small><strong>{{ actionKinds().length }}</strong\n      ><span>cat\u00E9gories audit\u00E9es</span>\n    </div>\n    <i class=\"fa-solid fa-list-check\"></i>\n  </article>\n</section>\n\n<section class=\"audit-register\" aria-labelledby=\"audit-register-title\">\n  <div class=\"audit-register__toolbar\">\n    <div>\n      <h2 id=\"audit-register-title\">Registre des \u00E9v\u00E9nements</h2>\n      <p>{{ filteredEntries().length }} r\u00E9sultat(s) affich\u00E9(s)</p>\n    </div>\n    <div class=\"audit-register__filters\">\n      <label\n        ><span class=\"sr-only\">Rechercher</span><i class=\"fa-solid fa-magnifying-glass\"></i\n        ><input\n          type=\"search\"\n          placeholder=\"Auteur, espace ou action\u2026\"\n          [value]=\"search()\"\n          (input)=\"updateSearch($event)\"\n      /></label>\n      <select\n        aria-label=\"Filtrer par type d\u2019action\"\n        [value]=\"actionFilter()\"\n        (change)=\"updateActionFilter($event)\"\n      >\n        <option value=\"all\">Toutes les actions</option>\n        @for (kind of actionKinds(); track kind) {\n          <option [value]=\"kind\">{{ kind }}</option>\n        }\n      </select>\n    </div>\n  </div>\n\n  @if (loading()) {\n    <p class=\"audit-state\">Chargement du registre\u2026</p>\n  } @else if (filteredEntries().length === 0) {\n    <p class=\"audit-state\">Aucune action ne correspond aux filtres.</p>\n  } @else {\n    <div class=\"audit-table-wrap\">\n      <table>\n        <thead>\n          <tr>\n            <th>Date et heure</th>\n            <th>Auteur</th>\n            <th>Action</th>\n            <th>Espace / Cible</th>\n            <th>R\u00E9f\u00E9rence</th>\n          </tr>\n        </thead>\n        <tbody>\n          @for (entry of filteredEntries(); track entry.id) {\n            <tr [id]=\"'audit-' + entry.id\" [class.audit-selected]=\"selectedId() === entry.id\">\n              <td>\n                <time [attr.datetime]=\"entry.occurredAt\">{{ formatDate(entry.occurredAt) }}</time>\n              </td>\n              <td>\n                <div class=\"audit-actor\">\n                  <span>{{ initials(entry) }}</span>\n                  <div>\n                    <strong>{{ actor(entry) }}</strong\n                    ><small>{{ entry.actorEmail ?? 'Action syst\u00E8me' }}</small>\n                  </div>\n                </div>\n              </td>\n              <td>\n                <span class=\"audit-action\"\n                  ><i class=\"fa-solid\" [class]=\"actionIcon(entry.kind)\"></i>{{ entry.title }}</span\n                ><small>{{ entry.kind }}</small>\n              </td>\n              <td>\n                <strong>{{ entry.detail }}</strong\n                ><small>{{ entry.tenantId ? 'Espace identifi\u00E9' : 'Cible plateforme' }}</small>\n              </td>\n              <td>\n                <code>#{{ entry.id.slice(0, 8).toUpperCase() }}</code>\n              </td>\n            </tr>\n          }\n        </tbody>\n      </table>\n    </div>\n  }\n</section>\n\n<aside class=\"audit-notice\">\n  <i class=\"fa-solid fa-circle-info\"></i>\n  <div>\n    <strong>Conservation du registre</strong>\n    <p>\n      Les entr\u00E9es pr\u00E9sent\u00E9es proviennent directement du journal d\u2019audit du backend. Elles sont\n      consultables en lecture seule depuis cette interface.\n    </p>\n  </div>\n</aside>\n", styles: [".audit-head {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 1.5rem;\n  margin-bottom: 1.25rem;\n}\n.audit-head nav {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  color: var(--color-platform-muted);\n  font-size: 0.75rem;\n  font-weight: 600;\n}\n.audit-head nav a {\n  color: var(--color-primary);\n  text-decoration: none;\n}\n.audit-head nav i {\n  font-size: 0.55rem;\n}\n.audit-head h1 {\n  margin: 0.55rem 0 0.35rem;\n  font-size: 1.7rem;\n  line-height: 1.2;\n}\n.audit-head p {\n  max-width: 760px;\n  margin: 0;\n  color: var(--color-platform-muted);\n  font-size: 0.9rem;\n}\n.audit-head__badge {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.45rem;\n  padding: 0.55rem 0.8rem;\n  border-radius: 999px;\n  background: var(--color-primary-fixed);\n  color: var(--color-primary);\n  font-size: 0.75rem;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.audit-kpis {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 1rem;\n  margin-bottom: 1rem;\n}\n.audit-kpis article {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 1rem;\n  padding: 1rem;\n  background: var(--color-surface-container-lowest);\n  border: 1px solid var(--color-border-subtle);\n  border-radius: 14px;\n}\n.audit-kpis small,\n.audit-kpis span {\n  display: block;\n  color: var(--color-platform-muted);\n}\n.audit-kpis small {\n  font-size: 0.75rem;\n  font-weight: 600;\n}\n.audit-kpis strong {\n  display: block;\n  margin: 0.25rem 0;\n  font-size: 1.5rem;\n  line-height: 1;\n}\n.audit-kpis span {\n  font-size: 0.7rem;\n}\n.audit-kpis article > i {\n  display: grid;\n  width: 2.5rem;\n  height: 2.5rem;\n  place-items: center;\n  border-radius: 10px;\n  background: var(--color-primary-fixed);\n  color: var(--color-primary);\n}\n.audit-register {\n  overflow: hidden;\n  background: var(--color-surface-container-lowest);\n  border: 1px solid var(--color-border-subtle);\n  border-radius: 14px;\n}\n.audit-register__toolbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  padding: 1rem;\n  border-bottom: 1px solid var(--color-border-subtle);\n}\n.audit-register__toolbar h2 {\n  margin: 0;\n  font-size: 1rem;\n}\n.audit-register__toolbar p {\n  margin: 0.2rem 0 0;\n  color: var(--color-platform-muted);\n  font-size: 0.72rem;\n}\n.audit-register__filters {\n  display: flex;\n  gap: 0.65rem;\n}\n.audit-register__filters label {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  min-width: 260px;\n  padding: 0 0.75rem;\n  background: var(--color-surface-container-low);\n  border: 1px solid var(--color-border-subtle);\n  border-radius: 9px;\n  color: var(--color-platform-muted);\n}\n.audit-register__filters input,\n.audit-register__filters select {\n  height: 2.35rem;\n  border: 0;\n  outline: 0;\n  background: transparent;\n  color: inherit;\n  font: inherit;\n}\n.audit-register__filters input {\n  width: 100%;\n}\n.audit-register__filters select {\n  padding: 0 0.75rem;\n  border: 1px solid var(--color-border-subtle);\n  border-radius: 9px;\n  background: var(--color-surface-container-low);\n}\n.audit-table-wrap {\n  overflow: auto;\n}\n.audit-table-wrap table {\n  width: 100%;\n  min-width: 920px;\n  border-collapse: collapse;\n  font-size: 0.8rem;\n}\n.audit-table-wrap th,\n.audit-table-wrap td {\n  padding: 0.8rem 1rem;\n  text-align: left;\n  border-bottom: 1px solid var(--color-border-subtle);\n  vertical-align: middle;\n}\n.audit-table-wrap th {\n  background: var(--color-surface-container-low);\n  color: var(--color-platform-muted);\n  font-size: 0.7rem;\n  text-transform: uppercase;\n  letter-spacing: 0.035em;\n}\n.audit-table-wrap tr:hover td {\n  background: color-mix(in srgb, var(--color-primary-fixed) 35%, transparent);\n}\n.audit-table-wrap td strong,\n.audit-table-wrap td small {\n  display: block;\n}\n.audit-table-wrap td small {\n  margin-top: 0.18rem;\n  color: var(--color-platform-muted);\n  font-size: 0.68rem;\n}\n.audit-table-wrap time {\n  white-space: nowrap;\n}\n.audit-actor {\n  display: flex;\n  align-items: center;\n  gap: 0.55rem;\n}\n.audit-actor > span {\n  display: grid;\n  width: 2rem;\n  height: 2rem;\n  flex: 0 0 auto;\n  place-items: center;\n  border-radius: 50%;\n  background: var(--color-primary);\n  color: white;\n  font-size: 0.68rem;\n  font-weight: 800;\n}\n.audit-action {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.4rem;\n  padding: 0.3rem 0.5rem;\n  border-radius: 6px;\n  background: var(--color-primary-fixed);\n  color: var(--color-primary);\n  font-weight: 700;\n  white-space: nowrap;\n}\n.audit-table-wrap code {\n  padding: 0.25rem 0.4rem;\n  border-radius: 5px;\n  background: var(--color-surface-container-low);\n  color: var(--color-platform-muted);\n  font-size: 0.7rem;\n}\n.audit-selected td {\n  background: var(--color-primary-fixed) !important;\n}\n.audit-state {\n  min-height: 180px;\n  display: grid;\n  place-items: center;\n  color: var(--color-platform-muted);\n}\n.audit-notice {\n  display: flex;\n  gap: 0.8rem;\n  margin-top: 1rem;\n  padding: 1rem;\n  border-radius: 12px;\n  background: var(--color-surface-container-low);\n  color: var(--color-platform-muted);\n}\n.audit-notice > i {\n  color: var(--color-primary);\n  margin-top: 0.15rem;\n}\n.audit-notice strong {\n  color: var(--color-on-surface);\n}\n.audit-notice p {\n  margin: 0.25rem 0 0;\n  font-size: 0.78rem;\n}\n.audit-error {\n  color: #b42318;\n}\n@media (max-width: 1100px) {\n  .audit-kpis {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n  .audit-register__toolbar {\n    align-items: flex-start;\n    flex-direction: column;\n  }\n  .audit-register__filters {\n    width: 100%;\n  }\n  .audit-register__filters label {\n    flex: 1;\n  }\n}\n@media (max-width: 620px) {\n  .audit-head {\n    flex-direction: column;\n  }\n  .audit-kpis {\n    grid-template-columns: 1fr;\n  }\n  .audit-register__filters {\n    flex-direction: column;\n  }\n  .audit-register__filters label {\n    min-width: 0;\n  }\n  .audit-register__filters select {\n    width: 100%;\n  }\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PlatformActivity, { className: "PlatformActivity", filePath: "src/app/features/platform/activity/platform-activity.ts", lineNumber: 14 }); })();
