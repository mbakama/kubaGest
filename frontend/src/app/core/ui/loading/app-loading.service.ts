import { Injectable, computed, signal } from '@angular/core';
import { finalize, type Observable } from 'rxjs';

/**
 * Overlay global — même logique que eRecettes (`loading_state` + `loading_message`)
 * affiché par `<app-loading-host />` à la racine.
 */
@Injectable({ providedIn: 'root' })
export class AppLoadingService {
  private readonly activeCount = signal(0);
  readonly loading_message = signal<string | null>(null);

  /** Nommage aligné eRecettes / contribuable-new. */
  readonly loading_state = computed(() => this.activeCount() > 0);

  /** Alias interne. */
  readonly visible = this.loading_state;

  start(message?: string): void {
    this.show(message);
  }

  stop(): void {
    this.hide();
  }

  show(message?: string): void {
    this.activeCount.update((count) => count + 1);
    if (message) {
      this.loading_message.set(message);
    } else if (this.activeCount() === 1 && !this.loading_message()) {
      this.loading_message.set('Chargement en cours ...');
    }
  }

  hide(): void {
    this.activeCount.update((count) => Math.max(0, count - 1));
    if (this.activeCount() === 0) {
      this.loading_message.set(null);
    }
  }

  async run<T>(task: () => Promise<T>, message?: string): Promise<T> {
    this.start(message);
    try {
      return await task();
    } finally {
      this.stop();
    }
  }

  track<T>(source: Observable<T>, message?: string): Observable<T> {
    this.start(message);
    return source.pipe(finalize(() => this.stop()));
  }
}
