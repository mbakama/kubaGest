import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { debounceTime } from 'rxjs';
import { RegisterDraftStore, type RegisterEmailAvailability } from './register-draft.store';
import { Select } from 'primeng/select';
import { Step, StepList, Stepper } from 'primeng/stepper';
import { AUTH_FORM_PRIME_IMPORTS } from '../auth-prime-fields';
import { AuthLegalNotice } from '../auth-legal-notice';
import type { ActivityType, RegisterRequest, UserSex } from '../../../core/api/auth-api.types';
import { ApiService } from '../../../core/api/api.service';
import {
  AUTHENTICATION_PATH,
  PRIVACY_POLICY_PATH,
  REGISTRATION_PATH,
  TERMS_OF_USE_PATH,
} from '../../../core/auth/auth.paths';
import {
  formatRdcPhoneLocalDisplay,
  formatTelephoneWithCountryCode,
  RDC_DIAL,
  rdcPhoneErrorMessage,
  rdcPhoneValidator,
  rdcPhoneValueFromInput,
} from '../../../core/utils/rdc-phone.util';
import { FORGOT_PASSWORD_PATH } from '../forgot-password/forgot-password.routes';
import type { LoginLocale } from '../login/login';

export type { RegisterEmailAvailability };

function confirmPassword(control: AbstractControl): ValidationErrors | null {
  const parent = control.parent;
  if (!parent) return null;
  const password = parent.get('password')?.value;
  if (control.value && password !== control.value) {
    return { mismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    Select,
    Stepper,
    StepList,
    Step,
    AuthLegalNotice,
    ...AUTH_FORM_PRIME_IMPORTS,
  ],
  templateUrl: './register.html',
  styleUrls: ['../login/login.scss', './register.scss'],
})
export class Register {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly registerDraft = inject(RegisterDraftStore);

  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  readonly submitting = signal(false);
  readonly registerError = signal<string | null>(null);
  readonly registerSuccess = signal(false);
  readonly currentStep = signal(1);
  readonly emailAvailability = signal<RegisterEmailAvailability>('idle');
  private readonly emailLastChecked = signal('');

  readonly authPath = AUTHENTICATION_PATH;
  readonly forgotPasswordPath = FORGOT_PASSWORD_PATH;
  readonly privacyPath = PRIVACY_POLICY_PATH;
  readonly termsPath = TERMS_OF_USE_PATH;
  readonly registrationPath = REGISTRATION_PATH;
  readonly rdcDial = RDC_DIAL;

  readonly localeOptions: { label: string; value: LoginLocale }[] = [
    { label: 'FR', value: 'fr' },
    { label: 'EN', value: 'en' },
    { label: 'LN', value: 'ln' },
    { label: 'SW', value: 'sw' },
  ];

  readonly activityOptions: { label: string; value: ActivityType }[] = [
    { label: 'Boutique', value: 'boutique' },
    { label: 'Alimentation', value: 'alimentation' },
    { label: 'Pharmacie', value: 'pharmacie' },
  ];
  readonly sexOptions: { label: string; value: UserSex }[] = [
    { label: 'Masculin', value: 'male' },
    { label: 'Féminin', value: 'female' },
  ];

  readonly form = new FormGroup({
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(80)],
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(80)],
    }),
    sex: new FormControl<UserSex>('male', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    tenantName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(150)],
    }),
    activityType: new FormControl<ActivityType>('boutique', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(255)],
    }),
    phone: new FormControl('', {
      nonNullable: true,
      validators: [rdcPhoneValidator()],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8), Validators.maxLength(72)],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, confirmPassword],
    }),
    acceptTerms: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
    locale: new FormControl<LoginLocale>('fr', { nonNullable: true }),
  });

  constructor() {
    this.restoreRegisterDraft();

    this.form.controls.password.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.form.controls.confirmPassword.updateValueAndValidity());

    this.form.valueChanges
      .pipe(debounceTime(150), takeUntilDestroyed())
      .subscribe(() => this.persistRegisterDraft());

    effect(() => {
      this.currentStep();
      this.persistRegisterDraft();
    });

    this.destroyRef.onDestroy(() => this.persistRegisterDraft());
  }

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  toggleConfirmPassword() {
    this.showConfirmPassword.update((v) => !v);
  }

  goToStep(step: number): void {
    this.currentStep.set(step);
    this.registerError.set(null);
    this.persistRegisterDraft();
  }

  /** Sauvegarde avant navigation (ex. pages légales). */
  persistDraftNow(): void {
    this.persistRegisterDraft();
  }

  nextStep(): void {
    const controls = this.currentStep() === 1
      ? [
          this.form.controls.firstName,
          this.form.controls.lastName,
          this.form.controls.sex,
          this.form.controls.email,
          this.form.controls.phone,
        ]
      : [this.form.controls.tenantName, this.form.controls.activityType];

    controls.forEach((control) => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });

    if (!controls.every((control) => control.valid)) {
      return;
    }

    if (this.currentStep() === 1) {
      const email = this.form.controls.email.value.trim();
      if (this.emailFieldState() === 'taken') {
        return;
      }
      if (this.emailFieldState() !== 'available' || email !== this.emailLastChecked()) {
        this.runEmailAvailabilityCheck(email, () => {
          if (this.emailFieldState() === 'available') {
            this.goToStep(2);
          }
        });
        return;
      }
    }

    this.goToStep(this.currentStep() + 1);
  }

  onEmailInput(): void {
    const email = this.form.controls.email.value.trim();
    if (email !== this.emailLastChecked()) {
      this.emailAvailability.set('idle');
      this.clearEmailTakenError();
    }
  }

  phoneLocalValue(): string {
    return formatRdcPhoneLocalDisplay(this.form.getRawValue().phone);
  }

  phoneFieldError(): string | null {
    const control = this.form.controls.phone;
    if (!control.touched && !control.dirty) {
      return null;
    }
    return rdcPhoneErrorMessage(control.errors);
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const beforeCaret = input.value.slice(0, input.selectionStart ?? input.value.length);
    const value = rdcPhoneValueFromInput(input.value);
    this.form.controls.phone.setValue(value, { emitEvent: true });
    this.form.controls.phone.markAsDirty();
    input.value = this.phoneLocalValue();
    const digitsBeforeCaret = (beforeCaret.match(/\d/g) ?? []).length;
    let position = 0;
    let count = 0;
    while (position < input.value.length && count < digitsBeforeCaret) {
      if (/\d/.test(input.value[position])) {
        count++;
      }
      position++;
    }
    input.setSelectionRange(position, position);
  }

  onPhoneBlur(): void {
    this.form.controls.phone.markAsTouched();
  }

  onEmailBlur(): void {
    const control = this.form.controls.email;
    control.markAsTouched();
    const email = control.value.trim();
    if (!email) {
      this.emailAvailability.set('idle');
      return;
    }
    if (control.hasError('required') || control.hasError('email')) {
      this.emailAvailability.set('idle');
      return;
    }
    if (email === this.emailLastChecked() && this.emailAvailability() !== 'idle') {
      return;
    }
    this.runEmailAvailabilityCheck(email);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.emailAvailability() === 'checking') {
      return;
    }
    if (this.emailAvailability() === 'taken' || this.form.controls.email.hasError('emailTaken')) {
      return;
    }
    const email = this.form.controls.email.value.trim();
    if (this.emailAvailability() !== 'available' || email !== this.emailLastChecked()) {
      this.runEmailAvailabilityCheck(email, () => {
        if (this.emailAvailability() === 'available') {
          this.submit();
        }
      });
      return;
    }
    if (this.submitting()) return;

    this.registerError.set(null);
    this.registerSuccess.set(false);
    this.submitting.set(true);

    const raw = this.form.getRawValue();
    const payload: RegisterRequest = {
      firstName: raw.firstName.trim(),
      lastName: raw.lastName.trim(),
      sex: raw.sex,
      tenantName: raw.tenantName.trim(),
      activityType: raw.activityType,
      email: raw.email.trim(),
      password: raw.password,
      currency: 'CDF',
    };
    const normalizedPhone = formatTelephoneWithCountryCode(raw.phone);
    if (normalizedPhone) {
      payload.phone = normalizedPhone;
    }

    this.api
      .register(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.registerSuccess.set(true);
          this.registerDraft.clear();
        },
        error: (err: unknown) => {
          this.submitting.set(false);
          this.registerError.set(this.readRegisterError(err));
        },
      });
  }

  goToLogin() {
    void this.router.navigate([AUTHENTICATION_PATH]);
  }

  emailFieldState(): RegisterEmailAvailability {
    const control = this.form.controls.email;
    if (this.emailAvailability() === 'checking') {
      return 'checking';
    }
    if (
      this.emailAvailability() === 'taken' ||
      control.hasError('emailTaken')
    ) {
      return 'taken';
    }
    if (this.emailAvailability() === 'available') {
      return 'available';
    }
    return 'idle';
  }

  private runEmailAvailabilityCheck(email: string, after?: () => void): void {
    this.emailAvailability.set('checking');
    this.clearEmailTakenError();
    this.api
      .checkRegistrationEmail(email)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.emailLastChecked.set(email);
          this.emailAvailability.set(res.available ? 'available' : 'taken');
          const control = this.form.controls.email;
          if (!res.available) {
            control.setErrors({ ...(control.errors ?? {}), emailTaken: true });
          } else {
            this.clearEmailTakenError();
          }
          after?.();
        },
        error: () => {
          this.emailAvailability.set('idle');
          after?.();
        },
      });
  }

  private clearEmailTakenError(): void {
    const control = this.form.controls.email;
    if (!control.errors?.['emailTaken']) {
      return;
    }
    const { emailTaken: _removed, ...rest } = control.errors;
    control.setErrors(Object.keys(rest).length ? rest : null);
  }

  private persistRegisterDraft(): void {
    if (this.registerSuccess()) {
      return;
    }
    this.registerDraft.save({
      step: this.currentStep(),
      form: this.form.getRawValue(),
      emailAvailability: this.emailAvailability(),
      emailLastChecked: this.emailLastChecked(),
    });
  }

  private restoreRegisterDraft(): void {
    const draft = this.registerDraft.load();
    if (!draft) {
      return;
    }
    this.form.patchValue(draft.form);
    if (!draft.form.sex) {
      this.form.controls.sex.setValue('male');
    }
    this.currentStep.set(Math.min(3, Math.max(1, draft.step)));
    this.emailAvailability.set(draft.emailAvailability);
    this.emailLastChecked.set(draft.emailLastChecked);
  }

  private readRegisterError(err: unknown): string {
    if (!(err instanceof HttpErrorResponse)) {
      return 'Impossible de créer votre espace. Réessayez plus tard.';
    }
    if (err.status === 0) {
      return 'Serveur inaccessible. Vérifiez que l’API est démarrée.';
    }
    const body = err.error;
    if (typeof body === 'object' && body !== null && 'message' in body) {
      const message = body.message;
      if (typeof message === 'string') {
        return message;
      }
      if (Array.isArray(message) && message.length > 0) {
        return message.map(String).join(' ');
      }
    }
    if (err.status === 409) {
      return 'Un compte ou un établissement existe déjà avec ces informations.';
    }
    return 'Impossible de créer votre espace. Vérifiez les champs et réessayez.';
  }
}
