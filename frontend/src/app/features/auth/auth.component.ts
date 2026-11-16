import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api/api.service';

@Component({
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
})
export class Connection {
  private readonly api = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);
  readonly state = signal<'idle' | 'loading' | 'success' | 'error'>('idle');

  check() {
    if (this.state() === 'loading') return;
    this.state.set('loading');
    this.api
      .checkConnection()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (body) => this.state.set(body.trim() === 'Hello World!' ? 'success' : 'error'),
        error: () => this.state.set('error'),
      });
  }
}
