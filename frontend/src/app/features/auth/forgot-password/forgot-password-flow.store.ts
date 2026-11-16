import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ForgotPasswordFlowStore {
  readonly email = signal('');
  readonly resetToken = signal('');

  reset() {
    this.email.set('');
    this.resetToken.set('');
  }
}
