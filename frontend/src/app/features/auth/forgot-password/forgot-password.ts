import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ApiService } from '../../../core/api/api.service';
import { AUTHENTICATION_PATH } from '../../../core/auth/auth.paths';
import { ForgotPasswordFlowStore } from './forgot-password-flow.store';
import {
  FORGOT_PASSWORD_NEW_PATH,
  FORGOT_PASSWORD_PATH,
  FORGOT_PASSWORD_VERIFY_PATH,
} from './forgot-password.routes';
import { Step, StepList, Stepper } from 'primeng/stepper';
import { AUTH_FORM_PRIME_IMPORTS } from '../auth-prime-fields';

export type ForgotPasswordStep = 'email' | 'verify' | 'reset';

function confirmNewPassword(control: AbstractControl): ValidationErrors | null {
  const parent = control.parent;
  if (!parent) return null;
  const password = parent.get('password')?.value;
  if (control.value && password !== control.value) {
    return { mismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-forgot-password',
  imports: [RouterLink, ReactiveFormsModule, Stepper, StepList, Step, ...AUTH_FORM_PRIME_IMPORTS],
  templateUrl: './forgot-password.html',
  styleUrls: ['../login/login.scss', './forgot-password.scss'],
})
export class ForgotPassword {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly flow = inject(ForgotPasswordFlowStore);
  private readonly destroyRef = inject(DestroyRef);

  readonly forgotPath = FORGOT_PASSWORD_PATH;
  readonly verifyPath = FORGOT_PASSWORD_VERIFY_PATH;

  readonly step = toSignal(
    this.route.data.pipe(map((data) => (data['forgotStep'] as ForgotPasswordStep) ?? 'email')),
    { initialValue: 'email' as ForgotPasswordStep },
  );

  readonly recoveryStepValue = computed(() => {
    switch (this.step()) {
      case 'email':
        return 1;
      case 'verify':
        return 2;
      default:
        return 3;
    }
  });

  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly completed = signal(false);
  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);

  readonly emailForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(255)],
    }),
  });

  readonly codeForm = new FormGroup({
    code: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\d{6}$/)],
    }),
  });

  readonly resetForm = new FormGroup({
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8), Validators.maxLength(72)],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, confirmNewPassword],
    }),
  });

  constructor() {
    this.resetForm.controls.password.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.resetForm.controls.confirmPassword.updateValueAndValidity());

    effect(() => {
      const step = this.step();
      if (step === 'verify' && !this.flow.email()) {
        void this.router.navigate([FORGOT_PASSWORD_PATH]);
        return;
      }
      if (step === 'reset' && !this.flow.resetToken()) {
        void this.router.navigate([FORGOT_PASSWORD_VERIFY_PATH]);
      }
    });
  }

  maskedEmail(): string {
    const email = this.flow.email();
    const at = email.indexOf('@');
    if (at <= 1) return email;
    return `${email.slice(0, 2)}•••${email.slice(at)}`;
  }

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  toggleConfirmPassword() {
    this.showConfirmPassword.update((v) => !v);
  }

  submitEmail() {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }
    if (this.submitting()) return;

    this.error.set(null);
    this.submitting.set(true);
    const email = this.emailForm.controls.email.value.trim();

    this.api
      .requestPasswordReset(email)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.flow.email.set(email);
          void this.router.navigate([FORGOT_PASSWORD_VERIFY_PATH]);
        },
        error: (err) => {
          this.submitting.set(false);
          this.error.set(this.readError(err));
        },
      });
  }

  submitCode() {
    if (this.codeForm.invalid) {
      this.codeForm.markAllAsTouched();
      return;
    }
    if (this.submitting()) return;

    this.error.set(null);
    this.submitting.set(true);
    const code = this.codeForm.controls.code.value.trim();

    this.api
      .verifyPasswordResetCode(this.flow.email(), code)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (body) => {
          this.submitting.set(false);
          this.flow.resetToken.set(body.resetToken);
          void this.router.navigate([FORGOT_PASSWORD_NEW_PATH]);
        },
        error: (err) => {
          this.submitting.set(false);
          this.error.set(this.readError(err));
        },
      });
  }

  submitReset() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }
    if (this.submitting()) return;

    this.error.set(null);
    this.submitting.set(true);

    this.api
      .confirmPasswordReset(this.flow.resetToken(), this.resetForm.controls.password.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.completed.set(true);
          this.flow.reset();
        },
        error: (err) => {
          this.submitting.set(false);
          this.error.set(this.readError(err));
        },
      });
  }

  goToLogin() {
    this.flow.reset();
    void this.router.navigate([AUTHENTICATION_PATH]);
  }

  private readError(err: unknown): string {
    if (!(err instanceof HttpErrorResponse)) {
      return 'Une erreur est survenue. Réessayez.';
    }
    if (err.status === 0) {
      return 'Serveur inaccessible. Vérifiez que l’API est démarrée.';
    }
    const body = err.error;
    if (typeof body === 'object' && body !== null && 'message' in body) {
      const message = body.message;
      if (typeof message === 'string') return message;
      if (Array.isArray(message) && message.length > 0) {
        return message.map(String).join(' ');
      }
    }
    return 'Impossible de poursuivre. Vérifiez vos informations.';
  }
}
