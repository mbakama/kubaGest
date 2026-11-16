import { Injectable, signal } from '@angular/core';
import type { LoginResponse } from '../api/auth-api.types';
import { AUTH_SESSION_STORAGE_KEY, type AuthSession } from './auth-session.types';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly sessionSignal = signal<AuthSession | null>(null);

  readonly session = this.sessionSignal.asReadonly();

  constructor() {
    this.sessionSignal.set(this.readPersisted());
  }

  accessToken(): string | null {
    return this.sessionSignal()?.accessToken ?? null;
  }

  hasSession(): boolean {
    return this.accessToken() !== null;
  }

  /** Session plateforme : jeton valide sans établissement actif (context null). */
  isPlatformSession(): boolean {
    const session = this.sessionSignal();
    return !!session?.accessToken && session.context === null;
  }

  /** Session établissement : jeton avec contexte tenant. */
  isTenantSession(): boolean {
    const session = this.sessionSignal();
    return !!session?.accessToken && session.context !== null;
  }

  /** Après connexion : accueil unique `/` (layout résolu par `canMatch`). */
  homeRoute(): '/' | null {
    if (this.hasSession()) {
      return '/';
    }
    return null;
  }

  saveFromLogin(response: LoginResponse, remember: boolean): void {
    const session: AuthSession = {
      accessToken: response.accessToken,
      user: response.user,
      context: response.context,
    };
    this.sessionSignal.set(session);
    this.persist(session, remember);
  }

  clear(): void {
    this.sessionSignal.set(null);
    localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
  }

  /** Met à jour l’identité affichée (ex. après PATCH platform/profile). */
  mergeUser(user: Partial<AuthSession['user']>): void {
    const current = this.sessionSignal();
    if (!current) {
      return;
    }
    const session: AuthSession = {
      ...current,
      user: { ...current.user, ...user },
    };
    this.sessionSignal.set(session);
    if (localStorage.getItem(AUTH_SESSION_STORAGE_KEY)) {
      localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
    } else if (sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY)) {
      sessionStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
    }
  }

  private persist(session: AuthSession, remember: boolean): void {
    const raw = JSON.stringify(session);
    if (remember) {
      localStorage.setItem(AUTH_SESSION_STORAGE_KEY, raw);
      sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    } else {
      sessionStorage.setItem(AUTH_SESSION_STORAGE_KEY, raw);
      localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    }
  }

  private readPersisted(): AuthSession | null {
    for (const store of [localStorage, sessionStorage]) {
      const raw = store.getItem(AUTH_SESSION_STORAGE_KEY);
      if (!raw) {
        continue;
      }
      const parsed = this.parseSession(raw);
      if (parsed) {
        return parsed;
      }
    }
    return null;
  }

  private parseSession(raw: string): AuthSession | null {
    try {
      const data: unknown = JSON.parse(raw);
      if (!data || typeof data !== 'object') {
        return null;
      }
      const record = data as Record<string, unknown>;
      if (typeof record['accessToken'] !== 'string' || record['accessToken'].length === 0) {
        return null;
      }
      return data as AuthSession;
    } catch {
      return null;
    }
  }
}
