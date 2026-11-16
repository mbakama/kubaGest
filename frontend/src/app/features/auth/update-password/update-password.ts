import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { finalize } from 'rxjs';
import { ApiService } from '../../../core/api/api.service';

function matchingPassword(control: AbstractControl): ValidationErrors | null {
  const password = control.parent?.get('password')?.value;
  return control.value && password !== control.value ? { mismatch: true } : null;
}

@Component({
  imports: [ReactiveFormsModule, RouterLink, InputText],
  selector: 'app-update-password',
  styleUrl: './update-password.scss',
  templateUrl: './update-password.html',
})
export class UpdatePassword {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  readonly token = this.route.snapshot.queryParamMap.get('token') ?? '';
  readonly submitting = signal(false);
  readonly success = signal(false);
  readonly error = signal<string | null>(this.token ? null : 'Le lien d’invitation est incomplet.');
  readonly showPassword = signal(false);
  readonly showConfirmation = signal(false);

  readonly form = this.fb.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
    confirmPassword: ['', [Validators.required, matchingPassword]],
  });

  constructor() {
    this.form.controls.password.valueChanges.subscribe(() =>
      this.form.controls.confirmPassword.updateValueAndValidity(),
    );
  }

  submit(): void {
    if (!this.token || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.error.set(null);
    this.api
      .acceptMemberInvitation(this.token, this.form.controls.password.value)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => this.success.set(true),
        error: (error: HttpErrorResponse) => {
          const message = error.error?.message;
          this.error.set(
            typeof message === 'string' ? message : 'L’invitation n’a pas pu être activée.',
          );
        },
      });
  }

  controlError(name: 'password' | 'confirmPassword'): string | null {
    const control = this.form.controls[name];
    if (!control.touched || !control.errors) return null;
    if (control.hasError('required')) return 'Ce champ est obligatoire.';
    if (control.hasError('minlength'))
      return 'Le mot de passe doit contenir au moins 8 caractères.';
    if (control.hasError('mismatch')) return 'Les mots de passe ne correspondent pas.';
    return 'Valeur invalide.';
  }
}
