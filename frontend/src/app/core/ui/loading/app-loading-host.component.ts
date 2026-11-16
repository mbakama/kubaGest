import { Component, computed, inject } from '@angular/core';
import { AppLoadingService } from './app-loading.service';

@Component({
  selector: 'app-loading-host',
  template: `
    @if (loading.loading_state()) {
      <div
        class="app-loading"
        role="status"
        aria-live="polite"
        [attr.aria-busy]="true"
        [attr.aria-label]="label()"
      >
        <div class="app-loading__panel">
          <div class="lds-roller" aria-hidden="true">
            @for (i of dots; track i) {
              <div></div>
            }
          </div>
          <p class="app-loading__text">{{ label() }}</p>
        </div>
      </div>
    }
  `,
  styleUrl: './app-loading-host.component.scss',
})
export class AppLoadingHostComponent {
  readonly loading = inject(AppLoadingService);
  readonly dots = Array.from({ length: 8 }, (_, i) => i);

  readonly label = computed(() => {
    const raw = this.loading.loading_message();
    return raw?.trim() ? raw.trim() : 'Chargement en cours ...';
  });
}
