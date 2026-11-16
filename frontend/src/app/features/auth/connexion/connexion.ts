import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ApiService } from '../../../core/api/api.service';

@Component({
  imports: [],
  selector: 'app-connexion',
  styleUrl: './connexion.scss',
  templateUrl: './connexion.html',
})
export class Connexion {
  private readonly api = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);
  readonly state = signal<'idle' | 'loading' | 'success' | 'error'>('idle');

  check() {   
    if (this.state() === 'loading') return;
    this.state.set('loading');
  }
}
