import { Injectable } from '@angular/core';
import type { ActivityType } from '../../../core/api/auth-api.types';
import type { LoginLocale } from '../login/login';
const STORAGE_KEY = 'kubagest-register-draft';

export type RegisterEmailAvailability = 'idle' | 'checking' | 'available' | 'taken';

export type RegisterDraftForm = {
  firstName: string;
  lastName: string;
  sex: 'male' | 'female';
  tenantName: string;
  activityType: ActivityType;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  locale: LoginLocale;
};

export type RegisterDraft = {
  step: number;
  form: RegisterDraftForm;
  emailAvailability: RegisterEmailAvailability;
  emailLastChecked: string;
};

@Injectable({ providedIn: 'root' })
export class RegisterDraftStore {
  save(draft: RegisterDraft): void {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* quota / mode privé */
    }
  }

  load(): RegisterDraft | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as RegisterDraft;
      if (!parsed?.form || typeof parsed.step !== 'number') {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }

  clear(): void {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
}
