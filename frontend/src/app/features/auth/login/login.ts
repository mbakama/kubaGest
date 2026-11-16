import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Select } from 'primeng/select';
import { AUTH_FORM_PRIME_IMPORTS } from '../auth-prime-fields';
import { AuthLegalNotice } from '../auth-legal-notice';
import { ApiService } from '../../../core/api/api.service';
import type { LoginResponse } from '../../../core/api/auth-api.types';
import { AuthSessionService } from '../../../core/auth/auth-session.service';

export type LoginLocale = 'fr' | 'en' | 'ln' | 'sw';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, Select, AuthLegalNotice, ...AUTH_FORM_PRIME_IMPORTS],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly api = inject(ApiService);
  private readonly authSession = inject(AuthSessionService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly showPassword = signal(false);
  readonly submitting = signal(false);
  readonly loginError = signal<string | null>(null);
  readonly apiState = signal<'idle' | 'loading' | 'success' | 'error'>('idle');

  readonly localeOptions: { label: string; value: LoginLocale }[] = [
    { label: 'FR', value: 'fr' },
    { label: 'EN', value: 'en' },
    { label: 'LN', value: 'ln' },
    { label: 'SW', value: 'sw' },
  ];

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
    rememberMe: new FormControl(true, { nonNullable: true }),
    locale: new FormControl<LoginLocale>('fr', { nonNullable: true }),
  });

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.submitting()) return;
    this.loginError.set(null);
    this.submitting.set(true);

    const { email, password, rememberMe } = this.form.getRawValue();
    this.api
      .login({ email: email.trim(), password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: LoginResponse) => {
          this.submitting.set(false);
          this.authSession.saveFromLogin(response, rememberMe);
          const home = this.authSession.homeRoute();
          if (home) {
            void this.router.navigateByUrl(home);
          }
        },
        error: (err: unknown) => {
          this.submitting.set(false);
          this.loginError.set(this.readLoginError(err));
        },
      });
  }

  private readLoginError(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 0) {
        return 'Serveur inaccessible. Vérifiez que l’API est démarrée.';
      }
      if (err.status === 401) {
        return 'E-mail ou mot de passe incorrect.';
      }
      const message = err.error?.message;
      if (typeof message === 'string') {
        return message;
      }
    }
    return 'Connexion impossible. Réessayez.';
  }

  checkApi() {
    if (this.apiState() === 'loading') return;
    this.apiState.set('loading');
    this.api
      .checkConnection()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (body) => this.apiState.set(body.trim() === 'Hello World!' ? 'success' : 'error'),
        error: () => this.apiState.set('error'),
      });
  }
}
