import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api/api.service';
import * as i0 from "@angular/core";
function Connection_Case_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "h3", 14);
    i0.ɵɵtext(1, "Pr\u00EAt \u00E0 v\u00E9rifier");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "p", 15);
    i0.ɵɵtext(3, "Lancez une v\u00E9rification pour conna\u00EEtre l'\u00E9tat de la connexion.");
    i0.ɵɵelementEnd();
} }
function Connection_Case_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "h3", 14);
    i0.ɵɵtext(1, "V\u00E9rification en cours\u2026");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "p", 15);
    i0.ɵɵtext(3, "Nous attendons la r\u00E9ponse du serveur.");
    i0.ɵɵelementEnd();
} }
function Connection_Case_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "h3", 16);
    i0.ɵɵtext(1, "Le serveur r\u00E9pond");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "p", 15);
    i0.ɵɵtext(3, "La communication est \u00E9tablie.");
    i0.ɵɵelementEnd();
} }
function Connection_Case_25_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "h3", 17);
    i0.ɵɵtext(1, "Connexion indisponible");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "p", 15);
    i0.ɵɵtext(3, "V\u00E9rifiez que le serveur est d\u00E9marr\u00E9, puis r\u00E9essayez.");
    i0.ɵɵelementEnd();
} }
export class Connection {
    api = inject(ApiService);
    destroyRef = inject(DestroyRef);
    state = signal('idle', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "state" }] : /* istanbul ignore next */ []));
    check() {
        if (this.state() === 'loading')
            return;
        this.state.set('loading');
        this.api
            .checkConnection()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (body) => this.state.set(body.trim() === 'Hello World!' ? 'success' : 'error'),
            error: () => this.state.set('error'),
        });
    }
    static ɵfac = function Connection_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || Connection)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: Connection, selectors: [["app-connection"]], decls: 28, vars: 4, consts: [[1, "min-h-dvh", "bg-surface"], [1, "border-b", "border-border-subtle", "bg-surface-container-lowest"], [1, "mx-auto", "flex", "h-14", "max-w-3xl", "items-center", "justify-between", "px-margin", "md:px-margin-desktop"], ["routerLink", "/accueil", 1, "flex", "items-center", "gap-2", "text-label-lg", "font-semibold", "text-text-primary"], [1, "flex", "h-8", "w-8", "items-center", "justify-center", "rounded-lg", "bg-primary", "text-on-primary"], ["routerLink", "/accueil", 1, "text-label-md", "text-primary", "hover:text-primary-container"], ["id", "content", "tabindex", "-1", 1, "mx-auto", "max-w-3xl", "px-margin", "py-space-xl", "md:px-margin-desktop"], [1, "text-label-sm", "uppercase", "tracking-wide", "text-text-muted"], [1, "mt-2", "text-headline-xl", "text-text-primary"], [1, "mt-2", "text-body-md", "text-text-muted"], [1, "mt-8", "rounded-2xl", "border", "border-border-subtle", "bg-surface-container-lowest", "p-6", "shadow-sm", "sm:p-8"], [1, "text-headline-sm", "text-text-primary"], ["role", "status", "aria-live", "polite", 1, "mt-6", "rounded-xl", "border-l-4", "border-primary-container", "bg-surface-container-low", "p-4"], ["type", "button", 1, "mt-6", "flex", "h-11", "items-center", "justify-center", "rounded-xl", "bg-primary", "px-6", "text-label-lg", "text-on-primary", "transition-colors", "hover:bg-primary-container", "disabled:cursor-wait", "disabled:opacity-70", 3, "click", "disabled"], [1, "text-label-lg", "text-text-primary"], [1, "mt-1", "text-body-sm", "text-text-muted"], [1, "text-label-lg", "text-growth-green"], [1, "text-label-lg", "text-retail-amber"]], template: function Connection_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "header", 1)(2, "div", 2)(3, "a", 3)(4, "span", 4);
            i0.ɵɵtext(5, "K");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(6, " KubaGest ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "a", 5);
            i0.ɵɵtext(8, "Retour");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(9, "main", 6)(10, "p", 7);
            i0.ɵɵtext(11, "Espace commer\u00E7ant");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "h1", 8);
            i0.ɵɵtext(13, "Connexion");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "p", 9);
            i0.ɵɵtext(15, " V\u00E9rifiez d'abord que l'API r\u00E9pond avant d'activer l'authentification compl\u00E8te. ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(16, "section", 10)(17, "h2", 11);
            i0.ɵɵtext(18, "Disponibilit\u00E9 du serveur");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(19, "p", 9);
            i0.ɵɵtext(20, "Test \u00E0 la demande, sans modification de donn\u00E9es.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "div", 12);
            i0.ɵɵconditionalCreate(22, Connection_Case_22_Template, 4, 0)(23, Connection_Case_23_Template, 4, 0)(24, Connection_Case_24_Template, 4, 0)(25, Connection_Case_25_Template, 4, 0);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(26, "button", 13);
            i0.ɵɵlistener("click", function Connection_Template_button_click_26_listener() { return ctx.check(); });
            i0.ɵɵtext(27);
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            let tmp_1_0;
            i0.ɵɵadvance(16);
            i0.ɵɵattribute("aria-busy", ctx.state() === "loading");
            i0.ɵɵadvance(6);
            i0.ɵɵconditional((tmp_1_0 = ctx.state()) === "idle" ? 22 : tmp_1_0 === "loading" ? 23 : tmp_1_0 === "success" ? 24 : tmp_1_0 === "error" ? 25 : -1);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("disabled", ctx.state() === "loading");
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.state() === "loading" ? "V\u00E9rification\u2026" : "V\u00E9rifier la connexion", " ");
        } }, dependencies: [RouterLink], encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(Connection, [{
        type: Component,
        args: [{
                selector: 'app-connection',
                imports: [RouterLink],
                template: `
    <div class="min-h-dvh bg-surface">
      <header class="border-b border-border-subtle bg-surface-container-lowest">
        <div
          class="mx-auto flex h-14 max-w-3xl items-center justify-between px-margin md:px-margin-desktop"
        >
          <a class="flex items-center gap-2 text-label-lg font-semibold text-text-primary" routerLink="/accueil">
            <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-on-primary">K</span>
            KubaGest
          </a>
          <a class="text-label-md text-primary hover:text-primary-container" routerLink="/accueil">Retour</a>
        </div>
      </header>
      <main
        id="content"
        tabindex="-1"
        class="mx-auto max-w-3xl px-margin py-space-xl md:px-margin-desktop"
      >
        <p class="text-label-sm uppercase tracking-wide text-text-muted">Espace commerçant</p>
        <h1 class="mt-2 text-headline-xl text-text-primary">Connexion</h1>
        <p class="mt-2 text-body-md text-text-muted">
          Vérifiez d'abord que l'API répond avant d'activer l'authentification complète.
        </p>
        <section
          class="mt-8 rounded-2xl border border-border-subtle bg-surface-container-lowest p-6 shadow-sm sm:p-8"
          [attr.aria-busy]="state() === 'loading'"
        >
          <h2 class="text-headline-sm text-text-primary">Disponibilité du serveur</h2>
          <p class="mt-2 text-body-md text-text-muted">Test à la demande, sans modification de données.</p>
          <div
            class="mt-6 rounded-xl border-l-4 border-primary-container bg-surface-container-low p-4"
            role="status"
            aria-live="polite"
          >
            @switch (state()) {
              @case ('idle') {
                <h3 class="text-label-lg text-text-primary">Prêt à vérifier</h3>
                <p class="mt-1 text-body-sm text-text-muted">Lancez une vérification pour connaître l'état de la connexion.</p>
              }
              @case ('loading') {
                <h3 class="text-label-lg text-text-primary">Vérification en cours…</h3>
                <p class="mt-1 text-body-sm text-text-muted">Nous attendons la réponse du serveur.</p>
              }
              @case ('success') {
                <h3 class="text-label-lg text-growth-green">Le serveur répond</h3>
                <p class="mt-1 text-body-sm text-text-muted">La communication est établie.</p>
              }
              @case ('error') {
                <h3 class="text-label-lg text-retail-amber">Connexion indisponible</h3>
                <p class="mt-1 text-body-sm text-text-muted">Vérifiez que le serveur est démarré, puis réessayez.</p>
              }
            }
          </div>
          <button
            type="button"
            class="mt-6 flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-label-lg text-on-primary transition-colors hover:bg-primary-container disabled:cursor-wait disabled:opacity-70"
            (click)="check()"
            [disabled]="state() === 'loading'"
          >
            {{ state() === 'loading' ? 'Vérification…' : 'Vérifier la connexion' }}
          </button>
        </section>
      </main>
    </div>
  `,
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(Connection, { className: "Connection", filePath: "src/app/features/auth/auth.component.ts", lineNumber: 75 }); })();
