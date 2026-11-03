import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../core/api/api.service';

@Component({
  selector: 'app-connection',
  template: `
    <p class="eyebrow">SERVEUR</p>
    <h1>Connexion au serveur</h1>
    <p class="page-intro">Vérifiez la communication avec le serveur Kubagest.</p>
    <section
      class="connection-panel"
      aria-labelledby="connection-title"
      [attr.aria-busy]="state() === 'loading'"
    >
      <h2 id="connection-title">Disponibilité du serveur</h2>
      <p>Une vérification à la demande, sans modifier vos données.</p>
      <div class="connection-result" role="status" aria-live="polite">
        @switch (state()) {
          @case ('idle') {
            <h3>Prêt à vérifier</h3>
            <p>Lancez une vérification pour connaître l’état de la connexion.</p>
          }
          @case ('loading') {
            <h3>Vérification en cours…</h3>
            <p>Nous attendons la réponse du serveur.</p>
          }
          @case ('success') {
            <h3>Le serveur répond</h3>
            <p>La communication est établie. Les services métier seront reliés progressivement.</p>
          }
          @case ('error') {
            <h3>Connexion indisponible</h3>
            <p>Vérifiez que le serveur est démarré, puis réessayez.</p>
          }
        }
      </div>
      <button class="button primary" (click)="check()" [disabled]="state() === 'loading'">
        {{ state() === 'loading' ? 'Vérification…' : 'Vérifier la connexion' }}
      </button>
    </section>
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
