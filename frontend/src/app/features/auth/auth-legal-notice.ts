import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  PRIVACY_POLICY_PATH,
  TERMS_OF_USE_PATH,
} from '../../core/auth/auth.paths';

@Component({
  selector: 'app-auth-legal-notice',
  imports: [RouterLink],
  styleUrl: './auth-legal-notice.scss',
  template: `
    <p class="auth-data-privacy" role="note">
      <i class="fa-solid fa-shield-halved auth-data-privacy__icon" aria-hidden="true"></i>
      <span>
        Vos données personnelles sont traitées de manière
        <strong>confidentielle et sécurisée</strong>, uniquement pour l’authentification et la gestion de
        votre espace KubaGest. Consultez notre
        <a
          [routerLink]="privacyPath"
          [queryParams]="legalReturnQuery"
          (click)="beforeLegalNavigate()"
          >politique de confidentialité</a
        >
        et nos
        <a
          [routerLink]="termsPath"
          [queryParams]="legalReturnQuery"
          (click)="beforeLegalNavigate()"
          >conditions d’utilisation</a
        >.
      </span>
    </p>
  `,
})
export class AuthLegalNotice {
  private readonly router = inject(Router);

  /** Appelé avant ouverture d’une page légale (ex. sauvegarder le brouillon d’inscription). */
  readonly saveDraft = input<(() => void) | undefined>();

  readonly privacyPath = PRIVACY_POLICY_PATH;
  readonly termsPath = TERMS_OF_USE_PATH;
  readonly legalReturnQuery = { retour: this.router.url.split('?')[0] ?? '' };

  beforeLegalNavigate(): void {
    this.saveDraft()?.();
  }
}
