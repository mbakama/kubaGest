import { DOCUMENT, CurrencyPipe, DatePipe, DecimalPipe, isPlatformBrowser, NgClass } from '@angular/common';
import { Component, computed, DestroyRef, inject, PLATFORM_ID, signal, } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChartModule } from 'primeng/chart';
import { ApiService } from '../../core/api/api.service';
import { AuthSessionService } from '../../core/auth/auth-session.service';
import * as i0 from "@angular/core";
import * as i1 from "primeng/chart";
const _c0 = () => [1, 2, 3, 4];
const _forTrack0 = ($index, $item) => $item.title + $item.subtitle;
function Dashboard_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "header", 1)(1, "div", 4)(2, "div", 5)(3, "span", 6);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span", 7);
    i0.ɵɵelement(6, "i", 8);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "p", 9);
    i0.ɵɵtext(9, " Supervision de l\u2019activit\u00E9 commerciale en temps r\u00E9el \u00B7 Devise : ");
    i0.ɵɵelementStart(10, "strong", 10);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(12, "div", 5)(13, "span", 11);
    i0.ɵɵtext(14);
    i0.ɵɵpipe(15, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "button", 12);
    i0.ɵɵlistener("click", function Dashboard_Conditional_1_Template_button_click_16_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.loadDashboard()); });
    i0.ɵɵelement(17, "i", 13);
    i0.ɵɵtext(18, " Actualiser ");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const data_r3 = ctx;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("Bonjour, ", ctx_r1.firstName());
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.tenantName(), " ");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(data_r3.currency);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("Mis \u00E0 jour ", i0.ɵɵpipeBind2(15, 7, data_r3.asOf, "HH:mm"));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r1.loading());
    i0.ɵɵadvance();
    i0.ɵɵclassProp("animate-spin", ctx_r1.loading());
} }
function Dashboard_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "header", 2)(1, "span", 6);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 14);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Bonjour, ", ctx_r1.firstName());
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.tenantName());
} }
function Dashboard_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 3);
    i0.ɵɵelement(1, "i", 15);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "button", 16);
    i0.ɵɵlistener("click", function Dashboard_Conditional_3_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.loadDashboard()); });
    i0.ɵɵtext(5, "R\u00E9essayer");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.loadError());
} }
function Dashboard_Conditional_4_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 32);
    i0.ɵɵelement(1, "i", 72);
    i0.ɵɵtext(2);
    i0.ɵɵpipe(3, "number");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const change_r5 = ctx;
    i0.ɵɵclassMap(change_r5 >= 0 ? "bg-surface-container-low text-growth-green" : "bg-error-container text-alert-red");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("fa-arrow-trend-up", change_r5 >= 0)("fa-arrow-trend-down", change_r5 < 0);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind2(3, 7, change_r5, "1.1-1"), " % vs hier ");
} }
function Dashboard_Conditional_4_Conditional_83_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 32);
    i0.ɵɵelement(1, "i", 72);
    i0.ɵɵtext(2);
    i0.ɵɵpipe(3, "number");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const trendChange_r6 = ctx;
    i0.ɵɵclassMap(trendChange_r6 >= 0 ? "bg-primary-fixed/50 text-growth-green" : "bg-error-container text-alert-red");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("fa-arrow-trend-up", trendChange_r6 >= 0)("fa-arrow-trend-down", trendChange_r6 < 0);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind2(3, 7, trendChange_r6, "1.1-1"), " % vs sem. pr\u00E9c. ");
} }
function Dashboard_Conditional_4_Conditional_84_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 11);
    i0.ɵɵtext(1, "Pas de comparaison sur la p\u00E9riode pr\u00E9c\u00E9dente");
    i0.ɵɵelementEnd();
} }
function Dashboard_Conditional_4_Conditional_107_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 63);
    i0.ɵɵelement(1, "i", 73);
    i0.ɵɵtext(2, " Aucune activit\u00E9 r\u00E9cente. ");
    i0.ɵɵelementEnd();
} }
function Dashboard_Conditional_4_Conditional_108_For_2_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 79);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "currency");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const activity_r7 = i0.ɵɵnextContext().$implicit;
    const data_r8 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind4(2, 1, activity_r7.amount, data_r8.currency, "symbol", "1.0-0"));
} }
function Dashboard_Conditional_4_Conditional_108_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li", 74)(1, "span", 75);
    i0.ɵɵelement(2, "i", 76);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 77)(4, "strong", 78);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "small", 11);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(8, Dashboard_Conditional_4_Conditional_108_For_2_Conditional_8_Template, 3, 6, "span", 79);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const activity_r7 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(activity_r7.tone === "warning" ? "bg-error-container text-alert-red" : "bg-primary-fixed text-primary");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ctx_r1.activityIcon(activity_r7.kind));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(activity_r7.title);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(activity_r7.subtitle);
    i0.ɵɵadvance();
    i0.ɵɵconditional(activity_r7.amount ? 8 : -1);
} }
function Dashboard_Conditional_4_Conditional_108_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ul", 64);
    i0.ɵɵrepeaterCreate(1, Dashboard_Conditional_4_Conditional_108_For_2_Template, 9, 6, "li", 74, _forTrack0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const data_r8 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵrepeater(data_r8.recentActivity);
} }
function Dashboard_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 17)(1, "article", 18)(2, "div", 19)(3, "span", 20);
    i0.ɵɵelement(4, "i", 21);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(5, Dashboard_Conditional_4_Conditional_5_Template, 4, 10, "span", 22);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 23)(7, "span", 24);
    i0.ɵɵtext(8, "Chiffre d\u2019affaires du jour");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 25)(10, "span", 26);
    i0.ɵɵtext(11);
    i0.ɵɵpipe(12, "currency");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "p", 27);
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "div", 28);
    i0.ɵɵelement(16, "div", 29);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(17, "article", 18)(18, "div", 19)(19, "span", 30);
    i0.ɵɵelement(20, "i", 31);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "span", 32);
    i0.ɵɵtext(22);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(23, "div", 23)(24, "span", 24);
    i0.ɵɵtext(25, "Encaissements en caisse");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "div", 33)(27, "span", 26);
    i0.ɵɵtext(28);
    i0.ɵɵpipe(29, "currency");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(30, "p", 27);
    i0.ɵɵtext(31, "Solde de caisse \u00E0 cet instant");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(32, "div", 28);
    i0.ɵɵelement(33, "div", 34);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(34, "article", 18)(35, "div", 19)(36, "span", 35);
    i0.ɵɵelement(37, "i", 36);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(38, "span", 37);
    i0.ɵɵtext(39, " 7 derniers jours ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(40, "div", 23)(41, "span", 24);
    i0.ɵɵtext(42, "Ventes de la semaine");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(43, "div", 33)(44, "span", 26);
    i0.ɵɵtext(45);
    i0.ɵɵpipe(46, "currency");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(47, "p", 27);
    i0.ɵɵtext(48, "Comparaison avec la semaine pr\u00E9c\u00E9dente");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(49, "div", 28);
    i0.ɵɵelement(50, "div", 38);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(51, "article", 18)(52, "div", 19)(53, "span", 39);
    i0.ɵɵelement(54, "i", 40);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(55, "span", 41);
    i0.ɵɵtext(56, " \u00C0 suivre ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(57, "div", 23)(58, "span", 24);
    i0.ɵɵtext(59, "Alertes op\u00E9rationnelles");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(60, "div", 25)(61, "span", 26);
    i0.ɵɵtext(62);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(63, "span", 42);
    i0.ɵɵtext(64);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(65, "p", 27);
    i0.ɵɵtext(66, "Ventes et stocks r\u00E9cents");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(67, "div", 28);
    i0.ɵɵelement(68, "div", 43);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(69, "section", 44)(70, "article", 45)(71, "div", 46)(72, "div")(73, "div", 47);
    i0.ɵɵelement(74, "span", 48);
    i0.ɵɵelementStart(75, "span", 49);
    i0.ɵɵtext(76, "Performance commerciale");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(77, "h2", 50);
    i0.ɵɵtext(78, "Ventes des 7 derniers jours");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(79, "div", 51)(80, "span", 52);
    i0.ɵɵtext(81);
    i0.ɵɵpipe(82, "currency");
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(83, Dashboard_Conditional_4_Conditional_83_Template, 4, 10, "span", 22)(84, Dashboard_Conditional_4_Conditional_84_Template, 2, 0, "span", 11);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(85, "div", 53);
    i0.ɵɵelement(86, "p-chart", 54);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(87, "article", 55)(88, "div")(89, "span", 56);
    i0.ɵɵtext(90, "Tr\u00E9sorerie");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(91, "h2", 57);
    i0.ɵɵtext(92, "\u00C9tat des caisses");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(93, "div", 58);
    i0.ɵɵelement(94, "span", 59);
    i0.ɵɵtext(95);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(96, "p", 60);
    i0.ɵɵtext(97);
    i0.ɵɵpipe(98, "currency");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(99, "p", 61);
    i0.ɵɵtext(100, " Le solde affich\u00E9 est calcul\u00E9 \u00E0 partir des mouvements de caisse valid\u00E9s. ");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(101, "section", 62)(102, "article", 2)(103, "span", 56);
    i0.ɵɵtext(104, "Suivi en direct");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(105, "h2", 57);
    i0.ɵɵtext(106, "Activit\u00E9 r\u00E9cente");
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(107, Dashboard_Conditional_4_Conditional_107_Template, 3, 0, "div", 63)(108, Dashboard_Conditional_4_Conditional_108_Template, 3, 0, "ul", 64);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(109, "article", 2)(110, "span", 56);
    i0.ɵɵtext(111, "Raccourcis");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(112, "h2", 57);
    i0.ɵɵtext(113, "Op\u00E9rations courantes");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(114, "div", 65)(115, "span", 66);
    i0.ɵɵelement(116, "i", 67);
    i0.ɵɵtext(117, " Nouvelle vente ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(118, "span", 66);
    i0.ɵɵelement(119, "i", 68);
    i0.ɵɵtext(120, " Consulter le stock ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(121, "span", 66);
    i0.ɵɵelement(122, "i", 69);
    i0.ɵɵtext(123, " Inventaire ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(124, "span", 66);
    i0.ɵɵelement(125, "i", 70);
    i0.ɵɵtext(126, " Rapport journalier ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(127, "p", 71);
    i0.ɵɵtext(128, " Les raccourcis op\u00E9rationnels seront activ\u00E9s avec les modules correspondants. ");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    let tmp_2_0;
    let tmp_16_0;
    const data_r8 = ctx;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵconditional((tmp_2_0 = data_r8.salesToday.changePercent) ? 5 : -1, tmp_2_0);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind4(12, 31, data_r8.salesToday.amount, data_r8.currency, "symbol", "1.0-0"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate3(" ", data_r8.salesToday.saleCount, " vente", data_r8.salesToday.saleCount > 1 ? "s" : "", " enregistr\u00E9e", data_r8.salesToday.saleCount > 1 ? "s" : "", " ");
    i0.ɵɵadvance(2);
    i0.ɵɵstyleProp("width", ctx_r1.kpiMeter(data_r8.salesToday.amount, ctx_r1.maxDailySales()), "%");
    i0.ɵɵadvance(5);
    i0.ɵɵclassMap(data_r8.cashBalance.status === "none" ? "bg-surface-container-low text-text-muted" : "bg-tertiary-fixed/30 text-tertiary-container");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", data_r8.cashBalance.badge ?? "Aucune caisse", " ");
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind4(29, 36, data_r8.cashBalance.amount, data_r8.currency, "symbol", "1.0-0"));
    i0.ɵɵadvance(5);
    i0.ɵɵstyleProp("width", ctx_r1.kpiMeter(data_r8.cashBalance.amount, ctx_r1.maxDailySales()), "%");
    i0.ɵɵadvance(12);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind4(46, 41, data_r8.salesTrend.amount, data_r8.currency, "symbol", "1.0-0"));
    i0.ɵɵadvance(5);
    i0.ɵɵstyleProp("width", ctx_r1.kpiMeter(data_r8.salesTrend.amount, ctx_r1.maxDailySales()), "%");
    i0.ɵɵadvance(12);
    i0.ɵɵtextInterpolate(data_r8.recentActivity.length);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("\u00E9v\u00E9nement", data_r8.recentActivity.length > 1 ? "s" : "");
    i0.ɵɵadvance(4);
    i0.ɵɵstyleProp("width", ctx_r1.alertsProgress(data_r8.recentActivity.length), "%");
    i0.ɵɵadvance(13);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind4(82, 46, data_r8.salesTrend.amount, data_r8.currency, "symbol", "1.0-0"));
    i0.ɵɵadvance(2);
    i0.ɵɵconditional((tmp_16_0 = data_r8.salesTrend.changePercent) ? 83 : 84, tmp_16_0);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("data", ctx_r1.salesChartData())("options", ctx_r1.salesChartOptions());
    i0.ɵɵadvance(7);
    i0.ɵɵclassMap(data_r8.cashBalance.status === "open" ? "bg-primary-fixed/40 text-primary" : "bg-surface-container-low text-text-muted");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("bg-growth-green", data_r8.cashBalance.status === "open");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", data_r8.cashBalance.status === "open" ? "Caisse ouverte" : data_r8.cashBalance.status === "closed" ? "Caisse cl\u00F4tur\u00E9e" : "Aucune caisse ouverte", " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind4(98, 51, data_r8.cashBalance.amount, data_r8.currency, "symbol", "1.0-0"), " ");
    i0.ɵɵadvance(10);
    i0.ɵɵconditional(data_r8.recentActivity.length === 0 ? 107 : 108);
} }
function Dashboard_Conditional_5_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 81);
} }
function Dashboard_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 80);
    i0.ɵɵrepeaterCreate(1, Dashboard_Conditional_5_For_2_Template, 1, 0, "div", 81, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(3, "div", 82);
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵrepeater(i0.ɵɵpureFunction0(0, _c0));
} }
export class Dashboard {
    api = inject(ApiService);
    authSession = inject(AuthSessionService);
    destroyRef = inject(DestroyRef);
    document = inject(DOCUMENT);
    platformId = inject(PLATFORM_ID);
    session = this.authSession.session;
    dashboard = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "dashboard" }] : /* istanbul ignore next */ []));
    loading = signal(true, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "loading" }] : /* istanbul ignore next */ []));
    loadError = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "loadError" }] : /* istanbul ignore next */ []));
    chartTextColor = signal('#64748b', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "chartTextColor" }] : /* istanbul ignore next */ []));
    chartBorderColor = signal('rgba(148, 163, 184, 0.18)', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "chartBorderColor" }] : /* istanbul ignore next */ []));
    tenantName = computed(() => this.session()?.context?.tenantName ?? 'Votre établissement', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "tenantName" }] : /* istanbul ignore next */ []));
    firstName = computed(() => this.session()?.user.firstName ?? 'Bonjour', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "firstName" }] : /* istanbul ignore next */ []));
    maxDailySales = computed(() => Math.max(1, ...(this.dashboard()?.salesTrend.days.map((day) => Number(day.amount)) ?? [1])), /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "maxDailySales" }] : /* istanbul ignore next */ []));
    salesChartData = computed(() => {
        const trend = this.dashboard()?.salesTrend;
        const days = trend?.days ?? [];
        const amounts = days.map((day) => Number(day.amount));
        const peak = Math.max(0, ...amounts);
        return {
            labels: days.map((day) => day.label),
            datasets: [
                {
                    label: 'Ventes',
                    data: amounts,
                    backgroundColor: amounts.map((value) => value > 0 && value === peak
                        ? 'rgba(16, 185, 129, 0.92)'
                        : 'rgba(16, 185, 129, 0.72)'),
                    hoverBackgroundColor: '#059669',
                    borderColor: '#10b981',
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false,
                    maxBarThickness: 42,
                },
            ],
        };
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "salesChartData" }] : /* istanbul ignore next */ []));
    salesChartOptions = computed(() => {
        const textColor = this.chartTextColor();
        const gridColor = this.chartBorderColor();
        const currency = this.dashboard()?.currency ?? 'USD';
        const formatAmount = (value) => new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency,
            maximumFractionDigits: 0,
        }).format(value);
        return {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 350 },
            plugins: {
                legend: { display: false },
                tooltip: {
                    displayColors: false,
                    callbacks: {
                        label: (context) => formatAmount(Number(context.raw ?? 0)),
                    },
                },
            },
            scales: {
                x: {
                    border: { display: false },
                    grid: { display: false },
                    ticks: { color: textColor, font: { size: 11 } },
                },
                y: {
                    beginAtZero: true,
                    border: { display: false },
                    grid: { color: gridColor },
                    ticks: {
                        color: textColor,
                        callback: (value) => formatAmount(Number(value)),
                        maxTicksLimit: 5,
                    },
                },
            },
        };
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "salesChartOptions" }] : /* istanbul ignore next */ []));
    ngOnInit() {
        this.initChartTheme();
        this.loadDashboard();
    }
    loadDashboard() {
        this.loading.set(true);
        this.loadError.set(null);
        this.api
            .getTenantDashboard()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (dashboard) => {
                this.dashboard.set(dashboard);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
                this.loadError.set('Les données du tableau de bord sont momentanément indisponibles.');
            },
        });
    }
    initChartTheme() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        const style = getComputedStyle(this.document.documentElement);
        const value = (token, fallback) => style.getPropertyValue(token).trim() || fallback;
        this.chartTextColor.set(value('--color-text-muted', '#64748b'));
        this.chartBorderColor.set(value('--color-outline-variant', 'rgba(148, 163, 184, 0.18)'));
    }
    /** Barre de progression décorative sous les KPI (maquette Stitch). */
    kpiMeter(amount, cap) {
        const value = Number(amount);
        if (value <= 0 || cap <= 0) {
            return 8;
        }
        return Math.min(100, Math.max(12, Math.round((value / cap) * 100)));
    }
    alertsProgress(count) {
        return count > 0 ? Math.min(100, count * 20) : 8;
    }
    activityIcon(kind) {
        return kind === 'sale' ? 'fa-receipt' : 'fa-boxes-stacked';
    }
    static ɵfac = function Dashboard_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || Dashboard)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: Dashboard, selectors: [["app-dashboard"]], decls: 6, vars: 3, consts: [[1, "flex", "w-full", "flex-col", "gap-space-lg", "pb-space-xl", "text-text-primary"], [1, "flex", "flex-col", "justify-between", "gap-space-md", "rounded-xl", "bg-surface-container-lowest", "p-space-lg", "shadow-sm", "lg:flex-row", "lg:items-center"], [1, "rounded-xl", "bg-surface-container-lowest", "p-space-lg", "shadow-sm"], ["role", "alert", 1, "flex", "flex-wrap", "items-center", "gap-space-sm", "rounded-xl", "border", "border-error-container", "bg-error-container", "px-space-md", "py-space-sm", "text-body-md", "text-error"], [1, "flex", "flex-col", "gap-space-xs"], [1, "flex", "flex-wrap", "items-center", "gap-space-sm"], [1, "text-headline-lg", "font-semibold", "tracking-tight"], [1, "inline-flex", "items-center", "gap-1", "rounded-full", "bg-surface-container-high", "px-2.5", "py-0.5", "text-label-sm", "font-semibold", "text-on-surface-variant"], ["aria-hidden", "true", 1, "fa-solid", "fa-store", "text-[14px]", "text-retail-blue"], [1, "text-body-md", "text-text-muted"], [1, "text-text-primary"], [1, "text-body-sm", "text-text-muted"], ["type", "button", 1, "inline-flex", "cursor-pointer", "items-center", "gap-1.5", "rounded-lg", "border", "border-border-subtle", "bg-surface-container-lowest", "px-4", "py-2", "text-label-md", "font-semibold", "text-primary", "shadow-sm", "transition-colors", "hover:bg-surface-container-low", "disabled:cursor-wait", "disabled:opacity-65", 3, "click", "disabled"], ["aria-hidden", "true", 1, "fa-solid", "fa-rotate-right", "text-[18px]"], [1, "mt-1", "text-body-md", "text-text-muted"], ["aria-hidden", "true", 1, "fa-solid", "fa-circle-exclamation"], ["type", "button", 1, "ml-auto", "font-semibold", "underline", 3, "click"], ["aria-label", "Indicateurs cl\u00E9s", 1, "grid", "grid-cols-1", "gap-gutter-desktop", "sm:grid-cols-2", "xl:grid-cols-4"], [1, "flex", "flex-col", "justify-between", "rounded-xl", "bg-surface-container-lowest", "p-space-md", "shadow-sm", "transition-shadow", "hover:shadow-md"], [1, "flex", "items-start", "justify-between"], [1, "flex", "h-10", "w-10", "items-center", "justify-center", "rounded-full", "bg-primary-fixed", "text-primary"], ["aria-hidden", "true", 1, "fa-solid", "fa-coins", "text-[22px]"], [1, "inline-flex", "items-center", "gap-0.5", "rounded-full", "px-2", "py-0.5", "text-label-sm", "font-semibold", 3, "class"], [1, "mt-space-md"], [1, "block", "text-label-md", "text-text-muted"], [1, "mt-1", "flex", "items-baseline", "gap-2"], [1, "text-headline-xl", "font-bold", "tracking-tight"], [1, "mt-1", "text-body-sm", "text-text-muted"], [1, "mt-3", "h-1.5", "w-full", "overflow-hidden", "rounded-full", "bg-surface-container-high"], [1, "h-full", "rounded-full", "bg-primary"], [1, "flex", "h-10", "w-10", "items-center", "justify-center", "rounded-full", "bg-secondary-fixed", "text-retail-blue"], ["aria-hidden", "true", 1, "fa-solid", "fa-cash-register", "text-[22px]"], [1, "inline-flex", "items-center", "gap-0.5", "rounded-full", "px-2", "py-0.5", "text-label-sm", "font-semibold"], [1, "mt-1"], [1, "h-full", "rounded-full", "bg-retail-blue"], [1, "flex", "h-10", "w-10", "items-center", "justify-center", "rounded-full", "bg-tertiary-fixed", "text-tertiary"], ["aria-hidden", "true", 1, "fa-solid", "fa-chart-line", "text-[22px]"], [1, "inline-flex", "items-center", "gap-0.5", "rounded-full", "bg-surface-container", "px-2", "py-0.5", "text-label-sm", "font-semibold", "text-text-primary"], [1, "h-full", "rounded-full", "bg-growth-green"], [1, "flex", "h-10", "w-10", "items-center", "justify-center", "rounded-full", "bg-error-container", "text-error"], ["aria-hidden", "true", 1, "fa-solid", "fa-bell", "text-[22px]"], [1, "inline-flex", "items-center", "gap-0.5", "rounded-full", "bg-error-container", "px-2", "py-0.5", "text-label-sm", "font-semibold", "text-alert-red"], [1, "text-label-md", "text-text-muted"], [1, "h-full", "rounded-full", "bg-alert-red"], [1, "grid", "grid-cols-1", "gap-gutter-desktop", "lg:grid-cols-3"], [1, "flex", "flex-col", "justify-between", "rounded-xl", "border", "border-border-subtle/60", "bg-surface-container", "p-space-lg", "shadow-sm", "lg:col-span-2"], [1, "mb-space-lg", "flex", "flex-col", "justify-between", "gap-space-sm", "sm:flex-row", "sm:items-start"], [1, "flex", "items-center", "gap-2"], ["aria-hidden", "true", 1, "h-2", "w-2", "rounded-full", "bg-growth-green"], [1, "text-label-sm", "font-semibold", "uppercase", "tracking-wider", "text-text-muted"], [1, "mt-1", "text-headline-md", "font-semibold", "tracking-tight"], [1, "flex", "flex-col", "items-start", "gap-1", "sm:items-end"], [1, "text-label-lg", "font-bold", "text-text-primary"], ["role", "img", "aria-label", "\u00C9volution des ventes sur sept jours", 1, "tenant-dashboard__chart"], ["type", "bar", 3, "data", "options"], [1, "flex", "flex-col", "justify-between", "rounded-xl", "bg-surface-container-lowest", "p-space-lg", "shadow-sm"], [1, "block", "text-label-sm", "font-semibold", "uppercase", "tracking-wider", "text-text-muted"], [1, "text-headline-md", "font-semibold", "tracking-tight"], [1, "mt-space-md", "inline-flex", "items-center", "gap-1.5", "rounded-full", "px-2.5", "py-1", "text-label-sm", "font-semibold"], [1, "h-2", "w-2", "rounded-full"], [1, "mt-space-md", "text-headline-xl", "font-bold", "tracking-tight"], [1, "mt-2", "text-body-sm", "text-text-muted"], [1, "grid", "grid-cols-1", "gap-gutter-desktop", "lg:grid-cols-2"], [1, "flex", "min-h-40", "flex-col", "items-center", "justify-center", "gap-2", "text-body-md", "text-text-muted"], [1, "mt-space-md", "space-y-0", "divide-y", "divide-surface-container-high"], [1, "mt-space-md", "grid", "grid-cols-1", "gap-2", "sm:grid-cols-2"], [1, "flex", "items-center", "gap-2", "rounded-lg", "border", "border-border-subtle", "bg-surface-container-low", "p-3", "text-label-md", "font-semibold", "text-on-surface-variant"], ["aria-hidden", "true", 1, "fa-solid", "fa-cart-shopping", "text-primary"], ["aria-hidden", "true", 1, "fa-solid", "fa-boxes-stacked", "text-primary"], ["aria-hidden", "true", 1, "fa-solid", "fa-clipboard-list", "text-primary"], ["aria-hidden", "true", 1, "fa-solid", "fa-file-export", "text-primary"], [1, "mt-space-md", "text-body-sm", "text-text-muted"], ["aria-hidden", "true", 1, "fa-solid", "text-[14px]"], ["aria-hidden", "true", 1, "fa-solid", "fa-clock-rotate-left", "text-2xl"], [1, "flex", "items-center", "gap-space-sm", "py-3"], [1, "flex", "h-8", "w-8", "shrink-0", "items-center", "justify-center", "rounded-lg"], ["aria-hidden", "true", 1, "fa-solid", 3, "ngClass"], [1, "min-w-0", "flex-1"], [1, "block", "text-label-md"], [1, "text-label-md", "font-bold"], ["aria-busy", "true", 1, "grid", "grid-cols-1", "gap-gutter-desktop", "sm:grid-cols-2", "xl:grid-cols-4"], [1, "h-44", "animate-pulse", "rounded-xl", "bg-surface-container-high"], [1, "h-72", "animate-pulse", "rounded-xl", "bg-surface-container-high"]], template: function Dashboard_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0);
            i0.ɵɵconditionalCreate(1, Dashboard_Conditional_1_Template, 19, 10, "header", 1)(2, Dashboard_Conditional_2_Template, 5, 2, "header", 2);
            i0.ɵɵconditionalCreate(3, Dashboard_Conditional_3_Template, 6, 1, "div", 3);
            i0.ɵɵconditionalCreate(4, Dashboard_Conditional_4_Template, 129, 56)(5, Dashboard_Conditional_5_Template, 4, 1);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            let tmp_0_0;
            let tmp_2_0;
            i0.ɵɵadvance();
            i0.ɵɵconditional((tmp_0_0 = ctx.dashboard()) ? 1 : 2, tmp_0_0);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.loadError() ? 3 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional((tmp_2_0 = ctx.dashboard()) ? 4 : ctx.loading() ? 5 : -1, tmp_2_0);
        } }, dependencies: [ChartModule, i1.UIChart, NgClass, CurrencyPipe, DatePipe, DecimalPipe], styles: [".tenant-dashboard__chart[_ngcontent-%COMP%] {\n  position: relative;\n  height: 14rem;\n  min-width: 0;\n}\n\n[_nghost-%COMP%]     .tenant-dashboard__chart p-chart, \n[_nghost-%COMP%]     .tenant-dashboard__chart .p-chart, \n[_nghost-%COMP%]     .tenant-dashboard__chart canvas {\n  display: block;\n  width: 100% !important;\n  height: 100% !important;\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(Dashboard, [{
        type: Component,
        args: [{ selector: 'app-dashboard', imports: [ChartModule, CurrencyPipe, DatePipe, DecimalPipe, NgClass], template: "<div class=\"flex w-full flex-col gap-space-lg pb-space-xl text-text-primary\">\n  @if (dashboard(); as data) {\n    <header\n      class=\"flex flex-col justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm lg:flex-row lg:items-center\"\n    >\n      <div class=\"flex flex-col gap-space-xs\">\n        <div class=\"flex flex-wrap items-center gap-space-sm\">\n          <span class=\"text-headline-lg font-semibold tracking-tight\">Bonjour, {{ firstName() }}</span>\n          <span\n            class=\"inline-flex items-center gap-1 rounded-full bg-surface-container-high px-2.5 py-0.5 text-label-sm font-semibold text-on-surface-variant\"\n          >\n            <i class=\"fa-solid fa-store text-[14px] text-retail-blue\" aria-hidden=\"true\"></i>\n            {{ tenantName() }}\n          </span>\n        </div>\n        <p class=\"text-body-md text-text-muted\">\n          Supervision de l\u2019activit\u00E9 commerciale en temps r\u00E9el \u00B7 Devise :\n          <strong class=\"text-text-primary\">{{ data.currency }}</strong>\n        </p>\n      </div>\n      <div class=\"flex flex-wrap items-center gap-space-sm\">\n        <span class=\"text-body-sm text-text-muted\">Mis \u00E0 jour {{ data.asOf | date: 'HH:mm' }}</span>\n        <button\n          type=\"button\"\n          class=\"inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-container-lowest px-4 py-2 text-label-md font-semibold text-primary shadow-sm transition-colors hover:bg-surface-container-low disabled:cursor-wait disabled:opacity-65\"\n          (click)=\"loadDashboard()\"\n          [disabled]=\"loading()\"\n        >\n          <i class=\"fa-solid fa-rotate-right text-[18px]\" [class.animate-spin]=\"loading()\" aria-hidden=\"true\"></i>\n          Actualiser\n        </button>\n      </div>\n    </header>\n  } @else {\n    <header class=\"rounded-xl bg-surface-container-lowest p-space-lg shadow-sm\">\n      <span class=\"text-headline-lg font-semibold tracking-tight\">Bonjour, {{ firstName() }}</span>\n      <p class=\"mt-1 text-body-md text-text-muted\">{{ tenantName() }}</p>\n    </header>\n  }\n\n  @if (loadError()) {\n    <div\n      class=\"flex flex-wrap items-center gap-space-sm rounded-xl border border-error-container bg-error-container px-space-md py-space-sm text-body-md text-error\"\n      role=\"alert\"\n    >\n      <i class=\"fa-solid fa-circle-exclamation\" aria-hidden=\"true\"></i>\n      <span>{{ loadError() }}</span>\n      <button type=\"button\" class=\"ml-auto font-semibold underline\" (click)=\"loadDashboard()\">R\u00E9essayer</button>\n    </div>\n  }\n\n  @if (dashboard(); as data) {\n    <section\n      class=\"grid grid-cols-1 gap-gutter-desktop sm:grid-cols-2 xl:grid-cols-4\"\n      aria-label=\"Indicateurs cl\u00E9s\"\n    >\n      <article\n        class=\"flex flex-col justify-between rounded-xl bg-surface-container-lowest p-space-md shadow-sm transition-shadow hover:shadow-md\"\n      >\n        <div class=\"flex items-start justify-between\">\n          <span\n            class=\"flex h-10 w-10 items-center justify-center rounded-full bg-primary-fixed text-primary\"\n          >\n            <i class=\"fa-solid fa-coins text-[22px]\" aria-hidden=\"true\"></i>\n          </span>\n          @if (data.salesToday.changePercent; as change) {\n            <span\n              class=\"inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-label-sm font-semibold\"\n              [class]=\"change >= 0 ? 'bg-surface-container-low text-growth-green' : 'bg-error-container text-alert-red'\"\n            >\n              <i\n                class=\"fa-solid text-[14px]\"\n                [class.fa-arrow-trend-up]=\"change >= 0\"\n                [class.fa-arrow-trend-down]=\"change < 0\"\n                aria-hidden=\"true\"\n              ></i>\n              {{ change | number: '1.1-1' }} % vs hier\n            </span>\n          }\n        </div>\n        <div class=\"mt-space-md\">\n          <span class=\"block text-label-md text-text-muted\">Chiffre d\u2019affaires du jour</span>\n          <div class=\"mt-1 flex items-baseline gap-2\">\n            <span class=\"text-headline-xl font-bold tracking-tight\">{{\n              data.salesToday.amount | currency: data.currency : 'symbol' : '1.0-0'\n            }}</span>\n          </div>\n          <p class=\"mt-1 text-body-sm text-text-muted\">\n            {{ data.salesToday.saleCount }} vente{{ data.salesToday.saleCount > 1 ? 's' : '' }} enregistr\u00E9e{{\n              data.salesToday.saleCount > 1 ? 's' : ''\n            }}\n          </p>\n        </div>\n        <div class=\"mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high\">\n          <div\n            class=\"h-full rounded-full bg-primary\"\n            [style.width.%]=\"kpiMeter(data.salesToday.amount, maxDailySales())\"\n          ></div>\n        </div>\n      </article>\n\n      <article\n        class=\"flex flex-col justify-between rounded-xl bg-surface-container-lowest p-space-md shadow-sm transition-shadow hover:shadow-md\"\n      >\n        <div class=\"flex items-start justify-between\">\n          <span\n            class=\"flex h-10 w-10 items-center justify-center rounded-full bg-secondary-fixed text-retail-blue\"\n          >\n            <i class=\"fa-solid fa-cash-register text-[22px]\" aria-hidden=\"true\"></i>\n          </span>\n          <span\n            class=\"inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-label-sm font-semibold\"\n            [class]=\"\n              data.cashBalance.status === 'none'\n                ? 'bg-surface-container-low text-text-muted'\n                : 'bg-tertiary-fixed/30 text-tertiary-container'\n            \"\n          >\n            {{ data.cashBalance.badge ?? 'Aucune caisse' }}\n          </span>\n        </div>\n        <div class=\"mt-space-md\">\n          <span class=\"block text-label-md text-text-muted\">Encaissements en caisse</span>\n          <div class=\"mt-1\">\n            <span class=\"text-headline-xl font-bold tracking-tight\">{{\n              data.cashBalance.amount | currency: data.currency : 'symbol' : '1.0-0'\n            }}</span>\n          </div>\n          <p class=\"mt-1 text-body-sm text-text-muted\">Solde de caisse \u00E0 cet instant</p>\n        </div>\n        <div class=\"mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high\">\n          <div\n            class=\"h-full rounded-full bg-retail-blue\"\n            [style.width.%]=\"kpiMeter(data.cashBalance.amount, maxDailySales())\"\n          ></div>\n        </div>\n      </article>\n\n      <article\n        class=\"flex flex-col justify-between rounded-xl bg-surface-container-lowest p-space-md shadow-sm transition-shadow hover:shadow-md\"\n      >\n        <div class=\"flex items-start justify-between\">\n          <span class=\"flex h-10 w-10 items-center justify-center rounded-full bg-tertiary-fixed text-tertiary\">\n            <i class=\"fa-solid fa-chart-line text-[22px]\" aria-hidden=\"true\"></i>\n          </span>\n          <span\n            class=\"inline-flex items-center gap-0.5 rounded-full bg-surface-container px-2 py-0.5 text-label-sm font-semibold text-text-primary\"\n          >\n            7 derniers jours\n          </span>\n        </div>\n        <div class=\"mt-space-md\">\n          <span class=\"block text-label-md text-text-muted\">Ventes de la semaine</span>\n          <div class=\"mt-1\">\n            <span class=\"text-headline-xl font-bold tracking-tight\">{{\n              data.salesTrend.amount | currency: data.currency : 'symbol' : '1.0-0'\n            }}</span>\n          </div>\n          <p class=\"mt-1 text-body-sm text-text-muted\">Comparaison avec la semaine pr\u00E9c\u00E9dente</p>\n        </div>\n        <div class=\"mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high\">\n          <div\n            class=\"h-full rounded-full bg-growth-green\"\n            [style.width.%]=\"kpiMeter(data.salesTrend.amount, maxDailySales())\"\n          ></div>\n        </div>\n      </article>\n\n      <article\n        class=\"flex flex-col justify-between rounded-xl bg-surface-container-lowest p-space-md shadow-sm transition-shadow hover:shadow-md\"\n      >\n        <div class=\"flex items-start justify-between\">\n          <span class=\"flex h-10 w-10 items-center justify-center rounded-full bg-error-container text-error\">\n            <i class=\"fa-solid fa-bell text-[22px]\" aria-hidden=\"true\"></i>\n          </span>\n          <span\n            class=\"inline-flex items-center gap-0.5 rounded-full bg-error-container px-2 py-0.5 text-label-sm font-semibold text-alert-red\"\n          >\n            \u00C0 suivre\n          </span>\n        </div>\n        <div class=\"mt-space-md\">\n          <span class=\"block text-label-md text-text-muted\">Alertes op\u00E9rationnelles</span>\n          <div class=\"mt-1 flex items-baseline gap-2\">\n            <span class=\"text-headline-xl font-bold tracking-tight\">{{ data.recentActivity.length }}</span>\n            <span class=\"text-label-md text-text-muted\">\u00E9v\u00E9nement{{ data.recentActivity.length > 1 ? 's' : '' }}</span>\n          </div>\n          <p class=\"mt-1 text-body-sm text-text-muted\">Ventes et stocks r\u00E9cents</p>\n        </div>\n        <div class=\"mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high\">\n          <div\n            class=\"h-full rounded-full bg-alert-red\"\n            [style.width.%]=\"alertsProgress(data.recentActivity.length)\"\n          ></div>\n        </div>\n      </article>\n    </section>\n\n    <section class=\"grid grid-cols-1 gap-gutter-desktop lg:grid-cols-3\">\n      <article\n        class=\"flex flex-col justify-between rounded-xl border border-border-subtle/60 bg-surface-container p-space-lg shadow-sm lg:col-span-2\"\n      >\n        <div class=\"mb-space-lg flex flex-col justify-between gap-space-sm sm:flex-row sm:items-start\">\n          <div>\n            <div class=\"flex items-center gap-2\">\n              <span class=\"h-2 w-2 rounded-full bg-growth-green\" aria-hidden=\"true\"></span>\n              <span class=\"text-label-sm font-semibold uppercase tracking-wider text-text-muted\"\n                >Performance commerciale</span\n              >\n            </div>\n            <h2 class=\"mt-1 text-headline-md font-semibold tracking-tight\">Ventes des 7 derniers jours</h2>\n          </div>\n          <div class=\"flex flex-col items-start gap-1 sm:items-end\">\n            <span class=\"text-label-lg font-bold text-text-primary\">{{\n              data.salesTrend.amount | currency: data.currency : 'symbol' : '1.0-0'\n            }}</span>\n            @if (data.salesTrend.changePercent; as trendChange) {\n              <span\n                class=\"inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-label-sm font-semibold\"\n                [class]=\"\n                  trendChange >= 0\n                    ? 'bg-primary-fixed/50 text-growth-green'\n                    : 'bg-error-container text-alert-red'\n                \"\n              >\n                <i\n                  class=\"fa-solid text-[14px]\"\n                  [class.fa-arrow-trend-up]=\"trendChange >= 0\"\n                  [class.fa-arrow-trend-down]=\"trendChange < 0\"\n                  aria-hidden=\"true\"\n                ></i>\n                {{ trendChange | number: '1.1-1' }} % vs sem. pr\u00E9c.\n              </span>\n            } @else {\n              <span class=\"text-body-sm text-text-muted\">Pas de comparaison sur la p\u00E9riode pr\u00E9c\u00E9dente</span>\n            }\n          </div>\n        </div>\n        <div\n          class=\"tenant-dashboard__chart\"\n          role=\"img\"\n          aria-label=\"\u00C9volution des ventes sur sept jours\"\n        >\n          <p-chart type=\"bar\" [data]=\"salesChartData()\" [options]=\"salesChartOptions()\" />\n        </div>\n      </article>\n\n      <article class=\"flex flex-col justify-between rounded-xl bg-surface-container-lowest p-space-lg shadow-sm\">\n        <div>\n          <span class=\"block text-label-sm font-semibold uppercase tracking-wider text-text-muted\">Tr\u00E9sorerie</span>\n          <h2 class=\"text-headline-md font-semibold tracking-tight\">\u00C9tat des caisses</h2>\n          <div\n            class=\"mt-space-md inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-label-sm font-semibold\"\n            [class]=\"\n              data.cashBalance.status === 'open'\n                ? 'bg-primary-fixed/40 text-primary'\n                : 'bg-surface-container-low text-text-muted'\n            \"\n          >\n            <span class=\"h-2 w-2 rounded-full\" [class.bg-growth-green]=\"data.cashBalance.status === 'open'\"></span>\n            {{\n              data.cashBalance.status === 'open'\n                ? 'Caisse ouverte'\n                : data.cashBalance.status === 'closed'\n                  ? 'Caisse cl\u00F4tur\u00E9e'\n                  : 'Aucune caisse ouverte'\n            }}\n          </div>\n          <p class=\"mt-space-md text-headline-xl font-bold tracking-tight\">\n            {{ data.cashBalance.amount | currency: data.currency : 'symbol' : '1.0-0' }}\n          </p>\n          <p class=\"mt-2 text-body-sm text-text-muted\">\n            Le solde affich\u00E9 est calcul\u00E9 \u00E0 partir des mouvements de caisse valid\u00E9s.\n          </p>\n        </div>\n      </article>\n    </section>\n\n    <section class=\"grid grid-cols-1 gap-gutter-desktop lg:grid-cols-2\">\n      <article class=\"rounded-xl bg-surface-container-lowest p-space-lg shadow-sm\">\n        <span class=\"block text-label-sm font-semibold uppercase tracking-wider text-text-muted\">Suivi en direct</span>\n        <h2 class=\"text-headline-md font-semibold tracking-tight\">Activit\u00E9 r\u00E9cente</h2>\n        @if (data.recentActivity.length === 0) {\n          <div\n            class=\"flex min-h-40 flex-col items-center justify-center gap-2 text-body-md text-text-muted\"\n          >\n            <i class=\"fa-solid fa-clock-rotate-left text-2xl\" aria-hidden=\"true\"></i>\n            Aucune activit\u00E9 r\u00E9cente.\n          </div>\n        } @else {\n          <ul class=\"mt-space-md space-y-0 divide-y divide-surface-container-high\">\n            @for (activity of data.recentActivity; track activity.title + activity.subtitle) {\n              <li class=\"flex items-center gap-space-sm py-3\">\n                <span\n                  class=\"flex h-8 w-8 shrink-0 items-center justify-center rounded-lg\"\n                  [class]=\"\n                    activity.tone === 'warning'\n                      ? 'bg-error-container text-alert-red'\n                      : 'bg-primary-fixed text-primary'\n                  \"\n                >\n                  <i class=\"fa-solid\" [ngClass]=\"activityIcon(activity.kind)\" aria-hidden=\"true\"></i>\n                </span>\n                <div class=\"min-w-0 flex-1\">\n                  <strong class=\"block text-label-md\">{{ activity.title }}</strong>\n                  <small class=\"text-body-sm text-text-muted\">{{ activity.subtitle }}</small>\n                </div>\n                @if (activity.amount) {\n                  <span class=\"text-label-md font-bold\">{{\n                    activity.amount | currency: data.currency : 'symbol' : '1.0-0'\n                  }}</span>\n                }\n              </li>\n            }\n          </ul>\n        }\n      </article>\n\n      <article class=\"rounded-xl bg-surface-container-lowest p-space-lg shadow-sm\">\n        <span class=\"block text-label-sm font-semibold uppercase tracking-wider text-text-muted\">Raccourcis</span>\n        <h2 class=\"text-headline-md font-semibold tracking-tight\">Op\u00E9rations courantes</h2>\n        <div class=\"mt-space-md grid grid-cols-1 gap-2 sm:grid-cols-2\">\n          <span\n            class=\"flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-container-low p-3 text-label-md font-semibold text-on-surface-variant\"\n          >\n            <i class=\"fa-solid fa-cart-shopping text-primary\" aria-hidden=\"true\"></i>\n            Nouvelle vente\n          </span>\n          <span\n            class=\"flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-container-low p-3 text-label-md font-semibold text-on-surface-variant\"\n          >\n            <i class=\"fa-solid fa-boxes-stacked text-primary\" aria-hidden=\"true\"></i>\n            Consulter le stock\n          </span>\n          <span\n            class=\"flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-container-low p-3 text-label-md font-semibold text-on-surface-variant\"\n          >\n            <i class=\"fa-solid fa-clipboard-list text-primary\" aria-hidden=\"true\"></i>\n            Inventaire\n          </span>\n          <span\n            class=\"flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-container-low p-3 text-label-md font-semibold text-on-surface-variant\"\n          >\n            <i class=\"fa-solid fa-file-export text-primary\" aria-hidden=\"true\"></i>\n            Rapport journalier\n          </span>\n        </div>\n        <p class=\"mt-space-md text-body-sm text-text-muted\">\n          Les raccourcis op\u00E9rationnels seront activ\u00E9s avec les modules correspondants.\n        </p>\n      </article>\n    </section>\n  } @else if (loading()) {\n    <section class=\"grid grid-cols-1 gap-gutter-desktop sm:grid-cols-2 xl:grid-cols-4\" aria-busy=\"true\">\n      @for (s of [1, 2, 3, 4]; track s) {\n        <div class=\"h-44 animate-pulse rounded-xl bg-surface-container-high\"></div>\n      }\n    </section>\n    <div class=\"h-72 animate-pulse rounded-xl bg-surface-container-high\"></div>\n  }\n</div>\n", styles: [".tenant-dashboard__chart {\n  position: relative;\n  height: 14rem;\n  min-width: 0;\n}\n\n:host ::ng-deep .tenant-dashboard__chart p-chart,\n:host ::ng-deep .tenant-dashboard__chart .p-chart,\n:host ::ng-deep .tenant-dashboard__chart canvas {\n  display: block;\n  width: 100% !important;\n  height: 100% !important;\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(Dashboard, { className: "Dashboard", filePath: "src/app/features/dashboard/dashboard.ts", lineNumber: 24 }); })();
