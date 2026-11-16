import { Injectable, signal } from '@angular/core';
import { AUTH_SESSION_STORAGE_KEY } from './auth-session.types';
import * as i0 from "@angular/core";
export class AuthSessionService {
    sessionSignal = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "sessionSignal" }] : /* istanbul ignore next */ []));
    session = this.sessionSignal.asReadonly();
    constructor() {
        this.sessionSignal.set(this.readPersisted());
    }
    accessToken() {
        return this.sessionSignal()?.accessToken ?? null;
    }
    hasSession() {
        return this.accessToken() !== null;
    }
    /** Session plateforme : jeton valide sans établissement actif (context null). */
    isPlatformSession() {
        const session = this.sessionSignal();
        return !!session?.accessToken && session.context === null;
    }
    /** Session établissement : jeton avec contexte tenant. */
    isTenantSession() {
        const session = this.sessionSignal();
        return !!session?.accessToken && session.context !== null;
    }
    /** Après connexion : accueil unique `/` (layout résolu par `canMatch`). */
    homeRoute() {
        if (this.hasSession()) {
            return '/';
        }
        return null;
    }
    saveFromLogin(response, remember) {
        const session = {
            accessToken: response.accessToken,
            user: response.user,
            context: response.context,
        };
        this.sessionSignal.set(session);
        this.persist(session, remember);
    }
    clear() {
        this.sessionSignal.set(null);
        localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
        sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    }
    /** Met à jour l’identité affichée (ex. après PATCH platform/profile). */
    mergeUser(user) {
        const current = this.sessionSignal();
        if (!current) {
            return;
        }
        const session = {
            ...current,
            user: { ...current.user, ...user },
        };
        this.sessionSignal.set(session);
        if (localStorage.getItem(AUTH_SESSION_STORAGE_KEY)) {
            localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
        }
        else if (sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY)) {
            sessionStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
        }
    }
    persist(session, remember) {
        const raw = JSON.stringify(session);
        if (remember) {
            localStorage.setItem(AUTH_SESSION_STORAGE_KEY, raw);
            sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
        }
        else {
            sessionStorage.setItem(AUTH_SESSION_STORAGE_KEY, raw);
            localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
        }
    }
    readPersisted() {
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
    parseSession(raw) {
        try {
            const data = JSON.parse(raw);
            if (!data || typeof data !== 'object') {
                return null;
            }
            const record = data;
            if (typeof record['accessToken'] !== 'string' || record['accessToken'].length === 0) {
                return null;
            }
            return data;
        }
        catch {
            return null;
        }
    }
    static ɵfac = function AuthSessionService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AuthSessionService)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: AuthSessionService, factory: AuthSessionService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AuthSessionService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [], null); })();
