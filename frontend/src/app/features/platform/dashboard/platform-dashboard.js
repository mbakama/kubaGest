import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, DestroyRef, inject, PLATFORM_ID, signal, } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChartModule } from 'primeng/chart';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/api/api.service';
import * as i0 from "@angular/core";
import * as i1 from "primeng/chart";
const _c0 = a0 => ({ entree: a0 });
const _forTrack0 = ($index, $item) => $item.id;
function PlatformDashboard_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 1);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.loadError());
} }
function PlatformDashboard_Conditional_51_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1, "Chargement\u2026");
    i0.ɵɵelementEnd();
} }
function PlatformDashboard_Conditional_52_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 15);
    i0.ɵɵelement(1, "p-chart", 29);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("data", ctx_r0.creationChartData())("options", ctx_r0.creationChartOptions);
} }
function PlatformDashboard_Conditional_56_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1, "Chargement\u2026");
    i0.ɵɵelementEnd();
} }
function PlatformDashboard_Conditional_57_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 18);
    i0.ɵɵtext(1, "Aucune formule \u00E0 r\u00E9partir pour le moment.");
    i0.ɵɵelementEnd();
} }
function PlatformDashboard_Conditional_58_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 19);
    i0.ɵɵelement(1, "p-chart", 30);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("data", ctx_r0.polarAreaData())("options", ctx_r0.polarAreaOptions());
} }
function PlatformDashboard_Conditional_63_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1, "Chargement\u2026");
    i0.ɵɵelementEnd();
} }
function PlatformDashboard_Conditional_64_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1, "Aucun espace pour le moment.");
    i0.ɵɵelementEnd();
} }
function PlatformDashboard_Conditional_65_For_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "td");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "td")(8, "span", 33);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const tenant_r2 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(tenant_r2.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(tenant_r2.subscription?.plan ?? "\u2014");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.formatDate(tenant_r2.createdAt));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(tenant_r2.status);
} }
function PlatformDashboard_Conditional_65_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 23)(1, "table", 31)(2, "thead")(3, "tr")(4, "th", 32);
    i0.ɵɵtext(5, "Espace / Entreprise");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "th", 32);
    i0.ɵɵtext(7, "Formule");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "th", 32);
    i0.ɵɵtext(9, "Date de cr\u00E9ation");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "th", 32);
    i0.ɵɵtext(11, "Statut");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(12, "tbody");
    i0.ɵɵrepeaterCreate(13, PlatformDashboard_Conditional_65_For_14_Template, 10, 4, "tr", null, _forTrack0);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(13);
    i0.ɵɵrepeater(ctx_r0.recentTenants());
} }
function PlatformDashboard_Conditional_72_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1, "Chargement\u2026");
    i0.ɵɵelementEnd();
} }
function PlatformDashboard_Conditional_73_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1, "Aucune activit\u00E9 r\u00E9cente.");
    i0.ɵɵelementEnd();
} }
function PlatformDashboard_Conditional_74_For_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 36)(2, "div", 37)(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "strong");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(7, "td", 38)(8, "div", 39);
    i0.ɵɵelement(9, "i", 40);
    i0.ɵɵelementStart(10, "strong");
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(12, "td", 41)(13, "span");
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "td", 42)(16, "time");
    i0.ɵɵtext(17);
    i0.ɵɵelementStart(18, "small");
    i0.ɵɵtext(19);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(20, "td")(21, "a", 43);
    i0.ɵɵelement(22, "i", 44);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const item_r3 = ctx.$implicit;
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(item_r3.actorInitials);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r3.actor);
    i0.ɵɵadvance(3);
    i0.ɵɵclassMap(item_r3.icon);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r3.title);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r3.detail);
    i0.ɵɵadvance(2);
    i0.ɵɵattribute("datetime", item_r3.occurredAt);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(item_r3.when);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r3.occurredAt);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("queryParams", i0.ɵɵpureFunction1(11, _c0, item_r3.id));
    i0.ɵɵattribute("aria-label", "Voir la trace de " + item_r3.title);
} }
function PlatformDashboard_Conditional_74_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 28)(1, "table", 34)(2, "thead")(3, "tr")(4, "th");
    i0.ɵɵtext(5, "Auteur");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "th");
    i0.ɵɵtext(7, "Action");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "th");
    i0.ɵɵtext(9, "Cible");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "th");
    i0.ɵɵtext(11, "Date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "th")(13, "span", 35);
    i0.ɵɵtext(14, "D\u00E9tail");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(15, "tbody");
    i0.ɵɵrepeaterCreate(16, PlatformDashboard_Conditional_74_For_17_Template, 23, 13, "tr", null, _forTrack0);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(16);
    i0.ɵɵrepeater(ctx_r0.activityFeed());
} }
const ACTIVITY_ICONS = {
    'tenant.registered': 'fa-building',
    'tenant.subscription.updated': 'fa-file-lines',
};
export class PlatformDashboard {
    api = inject(ApiService);
    destroyRef = inject(DestroyRef);
    document = inject(DOCUMENT);
    platformId = inject(PLATFORM_ID);
    loading = signal(true, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "loading" }] : /* istanbul ignore next */ []));
    loadError = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "loadError" }] : /* istanbul ignore next */ []));
    dashboard = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "dashboard" }] : /* istanbul ignore next */ []));
    polarAreaPalette = signal(['#2563eb', '#0284c7', '#7c3aed', '#f59e0b', '#ec4899'], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "polarAreaPalette" }] : /* istanbul ignore next */ []));
    chartTextColor = signal('#64748b', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "chartTextColor" }] : /* istanbul ignore next */ []));
    chartBorderColor = signal('rgba(148, 163, 184, 0.25)', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "chartBorderColor" }] : /* istanbul ignore next */ []));
    userCount = computed(() => this.dashboard()?.kpis.userCount ?? 0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "userCount" }] : /* istanbul ignore next */ []));
    spaceCount = computed(() => this.dashboard()?.kpis.tenantCount ?? 0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "spaceCount" }] : /* istanbul ignore next */ []));
    activeSubscriptions = computed(() => this.dashboard()?.kpis.activeSubscriptions ?? 0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "activeSubscriptions" }] : /* istanbul ignore next */ []));
    recentTenants = computed(() => this.dashboard()?.recentTenants ?? [], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "recentTenants" }] : /* istanbul ignore next */ []));
    planDistribution = computed(() => {
        return this.dashboard()?.planDistribution ?? [];
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "planDistribution" }] : /* istanbul ignore next */ []));
    polarAreaData = computed(() => {
        const slices = this.planDistribution();
        const palette = this.polarAreaPalette();
        return {
            labels: slices.map((slice) => slice.plan),
            datasets: [
                {
                    label: 'Espaces par formule',
                    data: slices.map((slice) => slice.count),
                    backgroundColor: slices.map((_, index) => palette[index % palette.length]),
                    borderColor: this.chartBorderColor(),
                    borderWidth: 2,
                },
            ],
        };
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "polarAreaData" }] : /* istanbul ignore next */ []));
    polarAreaOptions = computed(() => {
        const textColor = this.chartTextColor();
        const borderColor = this.chartBorderColor();
        return {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 350 },
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 16,
                    },
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const count = Number(context.raw ?? 0);
                            return ` ${context.label}: ${count} espace${count > 1 ? 's' : ''}`;
                        },
                    },
                },
            },
            scales: {
                r: {
                    beginAtZero: true,
                    grid: { color: borderColor },
                    angleLines: { color: borderColor },
                    ticks: { display: false, precision: 0 },
                    pointLabels: { display: false, color: textColor },
                },
            },
        };
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "polarAreaOptions" }] : /* istanbul ignore next */ []));
    creationChartData = computed(() => {
        const rows = this.dashboard()?.creationsByMonth ?? [];
        const labels = rows.map((item) => {
            const [year, month] = item.period.split('-').map(Number);
            return new Date(year, month - 1, 1).toLocaleDateString('fr-FR', {
                month: 'short',
            });
        });
        return {
            labels,
            datasets: [
                {
                    label: 'Espaces créés',
                    data: rows.map((item) => item.count),
                    backgroundColor: 'rgba(37, 99, 235, 0.78)',
                    hoverBackgroundColor: '#1d4ed8',
                    borderColor: '#2563eb',
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false,
                    maxBarThickness: 42,
                },
            ],
        };
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "creationChartData" }] : /* istanbul ignore next */ []));
    creationChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 350 },
        plugins: {
            legend: { display: false },
            tooltip: {
                displayColors: false,
                callbacks: {
                    label: (context) => {
                        const count = Number(context.raw ?? 0);
                        return `${count} espace${count > 1 ? 's' : ''} créé${count > 1 ? 's' : ''}`;
                    },
                },
            },
        },
        scales: {
            x: {
                border: { display: false },
                grid: { display: false },
                ticks: { color: '#64748b', font: { size: 11 } },
            },
            y: {
                beginAtZero: true,
                border: { display: false },
                grid: { color: 'rgba(148, 163, 184, 0.18)' },
                ticks: { color: '#64748b', precision: 0, stepSize: 1 },
            },
        },
    };
    activityFeed = computed(() => {
        const rows = this.dashboard()?.recentActivity ?? [];
        return rows.map((item) => this.toActivityItem(item));
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "activityFeed" }] : /* istanbul ignore next */ []));
    ngOnInit() {
        this.initChartTheme();
        this.api
            .getPlatformDashboard()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (body) => {
                this.dashboard.set(body);
                this.loading.set(false);
            },
            error: (err) => {
                this.loading.set(false);
                this.loadError.set(this.readError(err));
            },
        });
    }
    initChartTheme() {
        if (!isPlatformBrowser(this.platformId))
            return;
        const style = getComputedStyle(this.document.documentElement);
        const value = (token, fallback) => style.getPropertyValue(token).trim() || fallback;
        this.chartTextColor.set(value('--p-text-color', '#64748b'));
        this.chartBorderColor.set(value('--p-content-border-color', 'rgba(148, 163, 184, 0.25)'));
        this.polarAreaPalette.set([
            value('--color-primary', '#2563eb'),
            value('--p-cyan-500', '#0284c7'),
            value('--p-purple-500', '#7c3aed'),
            value('--p-orange-500', '#f59e0b'),
            value('--p-pink-500', '#ec4899'),
        ]);
    }
    formatDate(iso) {
        return new Date(iso).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    }
    toActivityItem(item) {
        const actor = item.actorName ?? 'Système';
        return {
            id: item.id,
            title: item.title,
            detail: item.detail,
            actor,
            actorInitials: actor
                .split(/\s+/)
                .slice(0, 2)
                .map((part) => part[0])
                .join('')
                .toUpperCase(),
            occurredAt: this.formatDateTime(item.occurredAt),
            when: this.formatRelative(item.occurredAt),
            icon: ACTIVITY_ICONS[item.kind] ?? 'fa-circle-info',
        };
    }
    formatDateTime(iso) {
        return new Date(iso).toLocaleString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }
    formatRelative(iso) {
        const diffMs = Date.now() - Date.parse(iso);
        const hours = Math.floor(diffMs / 3_600_000);
        if (hours < 1) {
            return 'À l’instant';
        }
        if (hours < 48) {
            return `Il y a ${hours} h`;
        }
        const days = Math.floor(hours / 24);
        return `Il y a ${days} j`;
    }
    readError(err) {
        if (err instanceof HttpErrorResponse) {
            if (err.status === 0) {
                return 'Serveur inaccessible.';
            }
            if (err.status === 403) {
                return 'Accès plateforme refusé.';
            }
            const message = err.error?.message;
            if (typeof message === 'string') {
                return message;
            }
        }
        return 'Impossible de charger le tableau de bord.';
    }
    static ɵfac = function PlatformDashboard_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PlatformDashboard)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PlatformDashboard, selectors: [["app-platform-dashboard"]], decls: 75, vars: 9, consts: [[1, "platform-dashboard__head"], ["role", "alert", 1, "platform-dashboard__error"], ["aria-label", "Indicateurs cl\u00E9s", 1, "platform-dashboard__kpis"], [1, "platform-dashboard__kpi"], [1, "platform-dashboard__kpi-icon", "platform-dashboard__kpi-icon--users"], ["aria-hidden", "true", 1, "fa-solid", "fa-users"], [1, "platform-dashboard__kpi-icon", "platform-dashboard__kpi-icon--spaces"], ["aria-hidden", "true", 1, "fa-solid", "fa-building"], [1, "platform-dashboard__kpi-icon", "platform-dashboard__kpi-icon--subs"], ["aria-hidden", "true", 1, "fa-solid", "fa-file-lines"], [1, "platform-dashboard__kpi-icon", "platform-dashboard__kpi-icon--revenue"], ["aria-hidden", "true", 1, "fa-solid", "fa-coins"], [1, "platform-dashboard__grid"], ["aria-labelledby", "evolution-title", 1, "platform-dashboard__card"], ["id", "evolution-title"], ["role", "img", "aria-label", "Histogramme du nombre d\u2019espaces cr\u00E9\u00E9s par mois", 1, "platform-dashboard__chart"], ["aria-labelledby", "plan-title", 1, "platform-dashboard__card"], ["id", "plan-title"], [1, "platform-dashboard__empty"], ["role", "img", "aria-label", "R\u00E9partition du nombre d\u2019espaces par formule", 1, "platform-dashboard__polar-chart"], [1, "platform-dashboard__bottom"], ["aria-labelledby", "recent-spaces-title", 1, "platform-dashboard__card"], ["id", "recent-spaces-title"], [1, "platform-dashboard__table-wrap"], ["aria-labelledby", "activity-title", 1, "platform-dashboard__card"], [1, "platform-dashboard__card-head"], ["id", "activity-title"], ["routerLink", "/journal-activite"], [1, "platform-dashboard__activity-table-wrap"], ["type", "bar", 3, "data", "options"], ["type", "polarArea", 3, "data", "options"], [1, "platform-dashboard__table"], ["scope", "col"], [1, "platform-dashboard__status"], [1, "platform-dashboard__activity-table"], [1, "sr-only"], ["data-label", "Auteur"], [1, "platform-dashboard__activity-author"], ["data-label", "Action"], [1, "platform-dashboard__activity-action"], ["aria-hidden", "true", 1, "fa-solid"], ["data-label", "Cible"], ["data-label", "Date"], ["routerLink", "/journal-activite", 1, "platform-dashboard__activity-link", 3, "queryParams"], ["aria-hidden", "true", 1, "fa-solid", "fa-arrow-right"]], template: function PlatformDashboard_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "h1");
            i0.ɵɵtext(2, "Tableau de bord Administrateur");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(3, "p");
            i0.ɵɵtext(4, "Supervision des espaces, abonnements et sant\u00E9 de la plateforme KubaGest.");
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(5, PlatformDashboard_Conditional_5_Template, 2, 1, "p", 1);
            i0.ɵɵelementStart(6, "section", 2)(7, "article", 3)(8, "div", 4);
            i0.ɵɵelement(9, "i", 5);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "div")(11, "small");
            i0.ɵɵtext(12, "Utilisateurs");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "strong");
            i0.ɵɵtext(14);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "span");
            i0.ɵɵtext(16, "comptes actifs");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(17, "article", 3)(18, "div", 6);
            i0.ɵɵelement(19, "i", 7);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "div")(21, "small");
            i0.ɵɵtext(22, "Espaces / Entreprises");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "strong");
            i0.ɵɵtext(24);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(25, "span");
            i0.ɵɵtext(26);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(27, "article", 3)(28, "div", 8);
            i0.ɵɵelement(29, "i", 9);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(30, "div")(31, "small");
            i0.ɵɵtext(32, "Abonnements actifs");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(33, "strong");
            i0.ɵɵtext(34);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(35, "span");
            i0.ɵɵtext(36, "essai ou actif");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(37, "article", 3)(38, "div", 10);
            i0.ɵɵelement(39, "i", 11);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(40, "div")(41, "small");
            i0.ɵɵtext(42, "Revenus (ce mois)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(43, "strong");
            i0.ɵɵtext(44, "\u2014");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(45, "span");
            i0.ɵɵtext(46, "Paiements \u00E0 venir");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(47, "div", 12)(48, "section", 13)(49, "h2", 14);
            i0.ɵɵtext(50, "\u00C9volution des espaces cr\u00E9\u00E9s");
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(51, PlatformDashboard_Conditional_51_Template, 2, 0, "p")(52, PlatformDashboard_Conditional_52_Template, 2, 2, "div", 15);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(53, "section", 16)(54, "h2", 17);
            i0.ɵɵtext(55, "R\u00E9partition des formules");
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(56, PlatformDashboard_Conditional_56_Template, 2, 0, "p")(57, PlatformDashboard_Conditional_57_Template, 2, 0, "p", 18)(58, PlatformDashboard_Conditional_58_Template, 2, 2, "div", 19);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(59, "div", 20)(60, "section", 21)(61, "h2", 22);
            i0.ɵɵtext(62, "Derniers espaces cr\u00E9\u00E9s");
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(63, PlatformDashboard_Conditional_63_Template, 2, 0, "p")(64, PlatformDashboard_Conditional_64_Template, 2, 0, "p")(65, PlatformDashboard_Conditional_65_Template, 15, 0, "div", 23);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(66, "section", 24)(67, "div", 25)(68, "h2", 26);
            i0.ɵɵtext(69, "Activit\u00E9s r\u00E9centes");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(70, "a", 27);
            i0.ɵɵtext(71, "Voir tout le journal");
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(72, PlatformDashboard_Conditional_72_Template, 2, 0, "p")(73, PlatformDashboard_Conditional_73_Template, 2, 0, "p")(74, PlatformDashboard_Conditional_74_Template, 18, 0, "div", 28);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(5);
            i0.ɵɵconditional(ctx.loadError() ? 5 : -1);
            i0.ɵɵadvance(9);
            i0.ɵɵtextInterpolate(ctx.loading() ? "\u2026" : ctx.userCount());
            i0.ɵɵadvance(10);
            i0.ɵɵtextInterpolate(ctx.loading() ? "\u2026" : ctx.spaceCount());
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.loading() ? "" : "inscrits");
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate(ctx.loading() ? "\u2026" : ctx.activeSubscriptions());
            i0.ɵɵadvance(17);
            i0.ɵɵconditional(ctx.loading() ? 51 : 52);
            i0.ɵɵadvance(5);
            i0.ɵɵconditional(ctx.loading() ? 56 : ctx.planDistribution().length === 0 ? 57 : 58);
            i0.ɵɵadvance(7);
            i0.ɵɵconditional(ctx.loading() ? 63 : ctx.recentTenants().length === 0 ? 64 : 65);
            i0.ɵɵadvance(9);
            i0.ɵɵconditional(ctx.loading() ? 72 : ctx.activityFeed().length === 0 ? 73 : 74);
        } }, dependencies: [ChartModule, i1.UIChart, RouterLink], styles: [".platform-dashboard__head[_ngcontent-%COMP%] {\n  margin-bottom: 1.25rem;\n}\n\n.platform-dashboard__head[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.65rem;\n}\n\n.platform-dashboard__head[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.35rem 0 0;\n  color: var(--%NS%color-platform-muted);\n}\n\n.platform-dashboard__kpis[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 1rem;\n  margin-bottom: 1.25rem;\n}\n\n.platform-dashboard__kpi[_ngcontent-%COMP%] {\n  background: var(--%NS%color-surface-container-lowest);\n  border: 1px solid var(--%NS%color-border-subtle);\n  border-radius: 14px;\n  padding: 1rem 1.1rem;\n  display: flex;\n  gap: 0.85rem;\n  align-items: flex-start;\n}\n\n.platform-dashboard__kpi-icon[_ngcontent-%COMP%] {\n  width: 2.5rem;\n  height: 2.5rem;\n  border-radius: 12px;\n  display: grid;\n  place-items: center;\n  flex-shrink: 0;\n}\n\n.platform-dashboard__kpi-icon--users[_ngcontent-%COMP%] {\n  background: #e8f1ff;\n  color: #2b5ea8;\n}\n\n.platform-dashboard__kpi-icon--spaces[_ngcontent-%COMP%] {\n  background: var(--%NS%color-primary-fixed);\n  color: var(--%NS%color-primary);\n}\n\n.platform-dashboard__kpi-icon--subs[_ngcontent-%COMP%] {\n  background: #f2ecff;\n  color: #6b4bb2;\n}\n\n.platform-dashboard__kpi-icon--revenue[_ngcontent-%COMP%] {\n  background: #fff3e6;\n  color: #b35c16;\n}\n\n.platform-dashboard__kpi[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  color: var(--%NS%color-platform-muted);\n  font-size: 0.8rem;\n}\n\n.platform-dashboard__kpi[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 1.45rem;\n  line-height: 1.2;\n}\n\n.platform-dashboard__kpi[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: var(--%NS%color-primary);\n}\n\n.platform-dashboard__grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1.35fr 1fr;\n  gap: 1rem;\n  margin-bottom: 1rem;\n}\n\n.platform-dashboard__card[_ngcontent-%COMP%] {\n  background: var(--%NS%color-surface-container-lowest);\n  border: 1px solid var(--%NS%color-border-subtle);\n  border-radius: 14px;\n  padding: 1rem 1.1rem;\n}\n\n.platform-dashboard__card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0 0 0.85rem;\n  font-size: 1rem;\n}\n\n.platform-dashboard__card-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  margin-bottom: 0.85rem;\n}\n\n.platform-dashboard__card-head[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.platform-dashboard__card-head[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: var(--%NS%color-primary);\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-decoration: none;\n}\n\n.platform-dashboard__chart[_ngcontent-%COMP%] {\n  position: relative;\n  height: 220px;\n  min-width: 0;\n}\n\n[_nghost-%COMP%]     .platform-dashboard__chart p-chart, \n[_nghost-%COMP%]     .platform-dashboard__chart .p-chart, \n[_nghost-%COMP%]     .platform-dashboard__chart canvas {\n  display: block;\n  width: 100% !important;\n  height: 100% !important;\n}\n\n.platform-dashboard__polar-chart[_ngcontent-%COMP%] {\n  position: relative;\n  height: 220px;\n  min-width: 0;\n}\n\n.platform-dashboard__empty[_ngcontent-%COMP%] {\n  display: grid;\n  min-height: 220px;\n  margin: 0;\n  place-items: center;\n  color: var(--%NS%color-platform-muted);\n  text-align: center;\n}\n\n[_nghost-%COMP%]     .platform-dashboard__polar-chart p-chart, \n[_nghost-%COMP%]     .platform-dashboard__polar-chart .p-chart, \n[_nghost-%COMP%]     .platform-dashboard__polar-chart canvas {\n  display: block;\n  width: 100% !important;\n  height: 100% !important;\n}\n\n.platform-dashboard__bottom[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1.35fr 1fr;\n  gap: 1rem;\n}\n\n.platform-dashboard__table-wrap[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n\n.platform-dashboard__table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 0.86rem;\n}\n\n.platform-dashboard__table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], \n.platform-dashboard__table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  text-align: left;\n  padding: 0.55rem 0.35rem;\n  border-bottom: 1px solid var(--%NS%color-border-subtle);\n}\n\n.platform-dashboard__table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  color: var(--%NS%color-platform-muted);\n  font-weight: 600;\n}\n\n.platform-dashboard__status[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 0.15rem 0.45rem;\n  border-radius: 999px;\n  font-size: 0.72rem;\n  background: #e8f6ef;\n  color: #1a5c44;\n}\n\n.platform-dashboard__activity-table-wrap[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n.platform-dashboard__activity-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 0.76rem;\n}\n.platform-dashboard__activity-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  padding: 0.45rem 0.5rem;\n  color: var(--%NS%color-platform-muted);\n  font-size: 0.62rem;\n  font-weight: 700;\n  letter-spacing: 0.035em;\n  text-align: left;\n  text-transform: uppercase;\n}\n.platform-dashboard__activity-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 0.55rem 0.5rem;\n  border-top: 1px solid var(--%NS%color-border-subtle);\n  vertical-align: middle;\n}\n.platform-dashboard__activity-table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover   td[_ngcontent-%COMP%] {\n  background: color-mix(in srgb, var(--%NS%color-primary-fixed) 28%, transparent);\n}\n.platform-dashboard__activity-author[_ngcontent-%COMP%], \n.platform-dashboard__activity-action[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  white-space: nowrap;\n}\n.platform-dashboard__activity-author[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  display: grid;\n  width: 1.85rem;\n  height: 1.85rem;\n  flex: 0 0 auto;\n  place-items: center;\n  border-radius: 50%;\n  background: var(--%NS%color-primary-fixed);\n  color: var(--%NS%color-primary);\n  font-size: 0.62rem;\n  font-weight: 800;\n}\n.platform-dashboard__activity-action[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  display: grid;\n  width: 1.65rem;\n  height: 1.65rem;\n  flex: 0 0 auto;\n  place-items: center;\n  border-radius: 6px;\n  background: var(--%NS%color-primary-fixed);\n  color: var(--%NS%color-primary);\n}\n.platform-dashboard__activity-table[_ngcontent-%COMP%]   time[_ngcontent-%COMP%] {\n  white-space: nowrap;\n  font-weight: 600;\n}\n.platform-dashboard__activity-table[_ngcontent-%COMP%]   time[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 0.12rem;\n  color: var(--%NS%color-platform-muted);\n  font-size: 0.6rem;\n  font-weight: 400;\n}\n.platform-dashboard__activity-link[_ngcontent-%COMP%] {\n  display: grid;\n  width: 1.8rem;\n  height: 1.8rem;\n  place-items: center;\n  border-radius: 50%;\n  color: var(--%NS%color-primary);\n  text-decoration: none;\n}\n.platform-dashboard__activity-link[_ngcontent-%COMP%]:hover {\n  background: var(--%NS%color-primary-fixed);\n}\n\n.platform-dashboard__error[_ngcontent-%COMP%] {\n  color: #9a3412;\n}\n\n@media (max-width: 1100px) {\n  .platform-dashboard__kpis[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  .platform-dashboard__grid[_ngcontent-%COMP%], \n   .platform-dashboard__bottom[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n\n@media (max-width: 520px) {\n  .platform-dashboard__kpis[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n\n  .platform-dashboard__activity-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .platform-dashboard__activity-table[_ngcontent-%COMP%], \n   .platform-dashboard__activity-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%], \n   .platform-dashboard__activity-table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%], \n   .platform-dashboard__activity-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n    display: block;\n    width: 100%;\n  }\n  .platform-dashboard__activity-table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n    position: relative;\n    padding: 0.65rem 2.5rem 0.65rem 0;\n    border-top: 1px solid var(--%NS%color-border-subtle);\n  }\n  .platform-dashboard__activity-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n    display: flex;\n    justify-content: space-between;\n    gap: 1rem;\n    padding: 0.25rem 0;\n    border: 0;\n  }\n  .platform-dashboard__activity-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]::before {\n    content: attr(data-label);\n    color: var(--%NS%color-platform-muted);\n    font-size: 0.65rem;\n    font-weight: 700;\n    text-transform: uppercase;\n  }\n  .platform-dashboard__activity-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:last-child {\n    position: absolute;\n    top: 50%;\n    right: 0;\n    width: auto;\n    transform: translateY(-50%);\n  }\n  .platform-dashboard__activity-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:last-child::before {\n    display: none;\n  }\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PlatformDashboard, [{
        type: Component,
        args: [{ selector: 'app-platform-dashboard', imports: [ChartModule, RouterLink], template: "<div class=\"platform-dashboard__head\">\n  <h1>Tableau de bord Administrateur</h1>\n  <p>Supervision des espaces, abonnements et sant\u00E9 de la plateforme KubaGest.</p>\n</div>\n\n@if (loadError()) {\n  <p class=\"platform-dashboard__error\" role=\"alert\">{{ loadError() }}</p>\n}\n\n<section class=\"platform-dashboard__kpis\" aria-label=\"Indicateurs cl\u00E9s\">\n  <article class=\"platform-dashboard__kpi\">\n    <div class=\"platform-dashboard__kpi-icon platform-dashboard__kpi-icon--users\">\n      <i class=\"fa-solid fa-users\" aria-hidden=\"true\"></i>\n    </div>\n    <div>\n      <small>Utilisateurs</small>\n      <strong>{{ loading() ? '\u2026' : userCount() }}</strong>\n      <span>comptes actifs</span>\n    </div>\n  </article>\n  <article class=\"platform-dashboard__kpi\">\n    <div class=\"platform-dashboard__kpi-icon platform-dashboard__kpi-icon--spaces\">\n      <i class=\"fa-solid fa-building\" aria-hidden=\"true\"></i>\n    </div>\n    <div>\n      <small>Espaces / Entreprises</small>\n      <strong>{{ loading() ? '\u2026' : spaceCount() }}</strong>\n      <span>{{ loading() ? '' : 'inscrits' }}</span>\n    </div>\n  </article>\n  <article class=\"platform-dashboard__kpi\">\n    <div class=\"platform-dashboard__kpi-icon platform-dashboard__kpi-icon--subs\">\n      <i class=\"fa-solid fa-file-lines\" aria-hidden=\"true\"></i>\n    </div>\n    <div>\n      <small>Abonnements actifs</small>\n      <strong>{{ loading() ? '\u2026' : activeSubscriptions() }}</strong>\n      <span>essai ou actif</span>\n    </div>\n  </article>\n  <article class=\"platform-dashboard__kpi\">\n    <div class=\"platform-dashboard__kpi-icon platform-dashboard__kpi-icon--revenue\">\n      <i class=\"fa-solid fa-coins\" aria-hidden=\"true\"></i>\n    </div>\n    <div>\n      <small>Revenus (ce mois)</small>\n      <strong>\u2014</strong>\n      <span>Paiements \u00E0 venir</span>\n    </div>\n  </article>\n</section>\n\n<div class=\"platform-dashboard__grid\">\n  <section class=\"platform-dashboard__card\" aria-labelledby=\"evolution-title\">\n    <h2 id=\"evolution-title\">\u00C9volution des espaces cr\u00E9\u00E9s</h2>\n    @if (loading()) {\n      <p>Chargement\u2026</p>\n    } @else {\n      <div\n        class=\"platform-dashboard__chart\"\n        role=\"img\"\n        aria-label=\"Histogramme du nombre d\u2019espaces cr\u00E9\u00E9s par mois\"\n      >\n        <p-chart type=\"bar\" [data]=\"creationChartData()\" [options]=\"creationChartOptions\" />\n      </div>\n    }\n  </section>\n\n  <section class=\"platform-dashboard__card\" aria-labelledby=\"plan-title\">\n    <h2 id=\"plan-title\">R\u00E9partition des formules</h2>\n    @if (loading()) {\n      <p>Chargement\u2026</p>\n    } @else if (planDistribution().length === 0) {\n      <p class=\"platform-dashboard__empty\">Aucune formule \u00E0 r\u00E9partir pour le moment.</p>\n    } @else {\n      <div\n        class=\"platform-dashboard__polar-chart\"\n        role=\"img\"\n        aria-label=\"R\u00E9partition du nombre d\u2019espaces par formule\"\n      >\n        <p-chart type=\"polarArea\" [data]=\"polarAreaData()\" [options]=\"polarAreaOptions()\" />\n      </div>\n    }\n  </section>\n</div>\n\n<div class=\"platform-dashboard__bottom\">\n  <section class=\"platform-dashboard__card\" aria-labelledby=\"recent-spaces-title\">\n    <h2 id=\"recent-spaces-title\">Derniers espaces cr\u00E9\u00E9s</h2>\n    @if (loading()) {\n      <p>Chargement\u2026</p>\n    } @else if (recentTenants().length === 0) {\n      <p>Aucun espace pour le moment.</p>\n    } @else {\n      <div class=\"platform-dashboard__table-wrap\">\n        <table class=\"platform-dashboard__table\">\n          <thead>\n            <tr>\n              <th scope=\"col\">Espace / Entreprise</th>\n              <th scope=\"col\">Formule</th>\n              <th scope=\"col\">Date de cr\u00E9ation</th>\n              <th scope=\"col\">Statut</th>\n            </tr>\n          </thead>\n          <tbody>\n            @for (tenant of recentTenants(); track tenant.id) {\n              <tr>\n                <td>{{ tenant.name }}</td>\n                <td>{{ tenant.subscription?.plan ?? '\u2014' }}</td>\n                <td>{{ formatDate(tenant.createdAt) }}</td>\n                <td>\n                  <span class=\"platform-dashboard__status\">{{ tenant.status }}</span>\n                </td>\n              </tr>\n            }\n          </tbody>\n        </table>\n      </div>\n    }\n  </section>\n\n  <section class=\"platform-dashboard__card\" aria-labelledby=\"activity-title\">\n    <div class=\"platform-dashboard__card-head\">\n      <h2 id=\"activity-title\">Activit\u00E9s r\u00E9centes</h2>\n      <a routerLink=\"/journal-activite\">Voir tout le journal</a>\n    </div>\n    @if (loading()) {\n      <p>Chargement\u2026</p>\n    } @else if (activityFeed().length === 0) {\n      <p>Aucune activit\u00E9 r\u00E9cente.</p>\n    } @else {\n      <div class=\"platform-dashboard__activity-table-wrap\">\n        <table class=\"platform-dashboard__activity-table\">\n          <thead>\n            <tr>\n              <th>Auteur</th>\n              <th>Action</th>\n              <th>Cible</th>\n              <th>Date</th>\n              <th><span class=\"sr-only\">D\u00E9tail</span></th>\n            </tr>\n          </thead>\n          <tbody>\n            @for (item of activityFeed(); track item.id) {\n              <tr>\n                <td data-label=\"Auteur\">\n                  <div class=\"platform-dashboard__activity-author\">\n                    <span>{{ item.actorInitials }}</span\n                    ><strong>{{ item.actor }}</strong>\n                  </div>\n                </td>\n                <td data-label=\"Action\">\n                  <div class=\"platform-dashboard__activity-action\">\n                    <i class=\"fa-solid\" [class]=\"item.icon\" aria-hidden=\"true\"></i\n                    ><strong>{{ item.title }}</strong>\n                  </div>\n                </td>\n                <td data-label=\"Cible\">\n                  <span>{{ item.detail }}</span>\n                </td>\n                <td data-label=\"Date\">\n                  <time [attr.datetime]=\"item.occurredAt\"\n                    >{{ item.when }}<small>{{ item.occurredAt }}</small></time\n                  >\n                </td>\n                <td>\n                  <a\n                    class=\"platform-dashboard__activity-link\"\n                    routerLink=\"/journal-activite\"\n                    [queryParams]=\"{ entree: item.id }\"\n                    [attr.aria-label]=\"'Voir la trace de ' + item.title\"\n                    ><i class=\"fa-solid fa-arrow-right\" aria-hidden=\"true\"></i\n                  ></a>\n                </td>\n              </tr>\n            }\n          </tbody>\n        </table>\n      </div>\n    }\n  </section>\n</div>\n", styles: [".platform-dashboard__head {\n  margin-bottom: 1.25rem;\n}\n\n.platform-dashboard__head h1 {\n  margin: 0;\n  font-size: 1.65rem;\n}\n\n.platform-dashboard__head p {\n  margin: 0.35rem 0 0;\n  color: var(--color-platform-muted);\n}\n\n.platform-dashboard__kpis {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 1rem;\n  margin-bottom: 1.25rem;\n}\n\n.platform-dashboard__kpi {\n  background: var(--color-surface-container-lowest);\n  border: 1px solid var(--color-border-subtle);\n  border-radius: 14px;\n  padding: 1rem 1.1rem;\n  display: flex;\n  gap: 0.85rem;\n  align-items: flex-start;\n}\n\n.platform-dashboard__kpi-icon {\n  width: 2.5rem;\n  height: 2.5rem;\n  border-radius: 12px;\n  display: grid;\n  place-items: center;\n  flex-shrink: 0;\n}\n\n.platform-dashboard__kpi-icon--users {\n  background: #e8f1ff;\n  color: #2b5ea8;\n}\n\n.platform-dashboard__kpi-icon--spaces {\n  background: var(--color-primary-fixed);\n  color: var(--color-primary);\n}\n\n.platform-dashboard__kpi-icon--subs {\n  background: #f2ecff;\n  color: #6b4bb2;\n}\n\n.platform-dashboard__kpi-icon--revenue {\n  background: #fff3e6;\n  color: #b35c16;\n}\n\n.platform-dashboard__kpi small {\n  display: block;\n  color: var(--color-platform-muted);\n  font-size: 0.8rem;\n}\n\n.platform-dashboard__kpi strong {\n  display: block;\n  font-size: 1.45rem;\n  line-height: 1.2;\n}\n\n.platform-dashboard__kpi span {\n  font-size: 0.75rem;\n  color: var(--color-primary);\n}\n\n.platform-dashboard__grid {\n  display: grid;\n  grid-template-columns: 1.35fr 1fr;\n  gap: 1rem;\n  margin-bottom: 1rem;\n}\n\n.platform-dashboard__card {\n  background: var(--color-surface-container-lowest);\n  border: 1px solid var(--color-border-subtle);\n  border-radius: 14px;\n  padding: 1rem 1.1rem;\n}\n\n.platform-dashboard__card h2 {\n  margin: 0 0 0.85rem;\n  font-size: 1rem;\n}\n\n.platform-dashboard__card-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  margin-bottom: 0.85rem;\n}\n\n.platform-dashboard__card-head h2 {\n  margin: 0;\n}\n.platform-dashboard__card-head a {\n  color: var(--color-primary);\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-decoration: none;\n}\n\n.platform-dashboard__chart {\n  position: relative;\n  height: 220px;\n  min-width: 0;\n}\n\n:host ::ng-deep .platform-dashboard__chart p-chart,\n:host ::ng-deep .platform-dashboard__chart .p-chart,\n:host ::ng-deep .platform-dashboard__chart canvas {\n  display: block;\n  width: 100% !important;\n  height: 100% !important;\n}\n\n.platform-dashboard__polar-chart {\n  position: relative;\n  height: 220px;\n  min-width: 0;\n}\n\n.platform-dashboard__empty {\n  display: grid;\n  min-height: 220px;\n  margin: 0;\n  place-items: center;\n  color: var(--color-platform-muted);\n  text-align: center;\n}\n\n:host ::ng-deep .platform-dashboard__polar-chart p-chart,\n:host ::ng-deep .platform-dashboard__polar-chart .p-chart,\n:host ::ng-deep .platform-dashboard__polar-chart canvas {\n  display: block;\n  width: 100% !important;\n  height: 100% !important;\n}\n\n.platform-dashboard__bottom {\n  display: grid;\n  grid-template-columns: 1.35fr 1fr;\n  gap: 1rem;\n}\n\n.platform-dashboard__table-wrap {\n  overflow-x: auto;\n}\n\n.platform-dashboard__table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 0.86rem;\n}\n\n.platform-dashboard__table th,\n.platform-dashboard__table td {\n  text-align: left;\n  padding: 0.55rem 0.35rem;\n  border-bottom: 1px solid var(--color-border-subtle);\n}\n\n.platform-dashboard__table th {\n  color: var(--color-platform-muted);\n  font-weight: 600;\n}\n\n.platform-dashboard__status {\n  display: inline-block;\n  padding: 0.15rem 0.45rem;\n  border-radius: 999px;\n  font-size: 0.72rem;\n  background: #e8f6ef;\n  color: #1a5c44;\n}\n\n.platform-dashboard__activity-table-wrap {\n  overflow-x: auto;\n}\n.platform-dashboard__activity-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 0.76rem;\n}\n.platform-dashboard__activity-table th {\n  padding: 0.45rem 0.5rem;\n  color: var(--color-platform-muted);\n  font-size: 0.62rem;\n  font-weight: 700;\n  letter-spacing: 0.035em;\n  text-align: left;\n  text-transform: uppercase;\n}\n.platform-dashboard__activity-table td {\n  padding: 0.55rem 0.5rem;\n  border-top: 1px solid var(--color-border-subtle);\n  vertical-align: middle;\n}\n.platform-dashboard__activity-table tr:hover td {\n  background: color-mix(in srgb, var(--color-primary-fixed) 28%, transparent);\n}\n.platform-dashboard__activity-author,\n.platform-dashboard__activity-action {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  white-space: nowrap;\n}\n.platform-dashboard__activity-author > span {\n  display: grid;\n  width: 1.85rem;\n  height: 1.85rem;\n  flex: 0 0 auto;\n  place-items: center;\n  border-radius: 50%;\n  background: var(--color-primary-fixed);\n  color: var(--color-primary);\n  font-size: 0.62rem;\n  font-weight: 800;\n}\n.platform-dashboard__activity-action i {\n  display: grid;\n  width: 1.65rem;\n  height: 1.65rem;\n  flex: 0 0 auto;\n  place-items: center;\n  border-radius: 6px;\n  background: var(--color-primary-fixed);\n  color: var(--color-primary);\n}\n.platform-dashboard__activity-table time {\n  white-space: nowrap;\n  font-weight: 600;\n}\n.platform-dashboard__activity-table time small {\n  display: block;\n  margin-top: 0.12rem;\n  color: var(--color-platform-muted);\n  font-size: 0.6rem;\n  font-weight: 400;\n}\n.platform-dashboard__activity-link {\n  display: grid;\n  width: 1.8rem;\n  height: 1.8rem;\n  place-items: center;\n  border-radius: 50%;\n  color: var(--color-primary);\n  text-decoration: none;\n}\n.platform-dashboard__activity-link:hover {\n  background: var(--color-primary-fixed);\n}\n\n.platform-dashboard__error {\n  color: #9a3412;\n}\n\n@media (max-width: 1100px) {\n  .platform-dashboard__kpis {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  .platform-dashboard__grid,\n  .platform-dashboard__bottom {\n    grid-template-columns: 1fr;\n  }\n}\n\n@media (max-width: 520px) {\n  .platform-dashboard__kpis {\n    grid-template-columns: 1fr;\n  }\n\n  .platform-dashboard__activity-table thead {\n    display: none;\n  }\n  .platform-dashboard__activity-table,\n  .platform-dashboard__activity-table tbody,\n  .platform-dashboard__activity-table tr,\n  .platform-dashboard__activity-table td {\n    display: block;\n    width: 100%;\n  }\n  .platform-dashboard__activity-table tr {\n    position: relative;\n    padding: 0.65rem 2.5rem 0.65rem 0;\n    border-top: 1px solid var(--color-border-subtle);\n  }\n  .platform-dashboard__activity-table td {\n    display: flex;\n    justify-content: space-between;\n    gap: 1rem;\n    padding: 0.25rem 0;\n    border: 0;\n  }\n  .platform-dashboard__activity-table td::before {\n    content: attr(data-label);\n    color: var(--color-platform-muted);\n    font-size: 0.65rem;\n    font-weight: 700;\n    text-transform: uppercase;\n  }\n  .platform-dashboard__activity-table td:last-child {\n    position: absolute;\n    top: 50%;\n    right: 0;\n    width: auto;\n    transform: translateY(-50%);\n  }\n  .platform-dashboard__activity-table td:last-child::before {\n    display: none;\n  }\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PlatformDashboard, { className: "PlatformDashboard", filePath: "src/app/features/platform/dashboard/platform-dashboard.ts", lineNumber: 50 }); })();
