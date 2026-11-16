import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthSessionService } from './auth-session.service';
import { AUTHENTICATION_PATH, APP_HOME_PATH } from './auth.paths';
function protectedBranchFallback(route, segments) {
    const requestedPath = segments[0]?.path;
    const isProtectedChild = !!requestedPath && route.children?.some((child) => child.path === requestedPath);
    if (!isProtectedChild) {
        return false;
    }
    const auth = inject(AuthSessionService);
    const router = inject(Router);
    return router.createUrlTree([auth.hasSession() ? APP_HOME_PATH : AUTHENTICATION_PATH]);
}
export const platformSessionCanMatch = (route, segments) => {
    if (inject(AuthSessionService).isPlatformSession()) {
        return true;
    }
    return protectedBranchFallback(route, segments);
};
export const tenantSessionCanMatch = (route, segments) => {
    if (inject(AuthSessionService).isTenantSession()) {
        return true;
    }
    return protectedBranchFallback(route, segments);
};
export const guestAtHomeCanMatch = () => !inject(AuthSessionService).hasSession();
/** Bloque l’accès aux écrans de connexion si une session est déjà active. */
export const guestGuard = () => {
    const auth = inject(AuthSessionService);
    const router = inject(Router);
    const home = auth.homeRoute();
    if (!home) {
        return true;
    }
    return router.createUrlTree([home]);
};
/** Réservé au super administrateur plateforme (context null). */
export const platformSessionGuard = () => {
    const auth = inject(AuthSessionService);
    const router = inject(Router);
    if (auth.isPlatformSession()) {
        return true;
    }
    if (auth.isTenantSession()) {
        return router.createUrlTree([APP_HOME_PATH]);
    }
    return router.createUrlTree([AUTHENTICATION_PATH]);
};
/** Réservé aux comptes rattachés à un établissement. */
export const tenantSessionGuard = () => {
    const auth = inject(AuthSessionService);
    const router = inject(Router);
    if (auth.isTenantSession()) {
        return true;
    }
    if (auth.isPlatformSession()) {
        return router.createUrlTree([APP_HOME_PATH]);
    }
    return router.createUrlTree([AUTHENTICATION_PATH]);
};
/** Réserve les écrans d'administration de l'établissement au propriétaire. */
export const tenantOwnerGuard = () => {
    const auth = inject(AuthSessionService);
    const router = inject(Router);
    if (auth.session()?.context?.role === 'owner') {
        return true;
    }
    return router.createUrlTree([APP_HOME_PATH]);
};
