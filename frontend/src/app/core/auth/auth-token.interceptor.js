import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AUTHENTICATION_PATH } from './auth.paths';
import { AuthSessionService } from './auth-session.service';
/** Routes où un 401 fait partie du flux (identifiants incorrects, etc.). */
function isPublicAuthUrl(url) {
    return /\/v1\/auth\/(login|register|check-email|forgot-password)/.test(url);
}
export const authTokenInterceptor = (req, next) => {
    const authSession = inject(AuthSessionService);
    const router = inject(Router);
    const token = authSession.accessToken();
    const authReq = token
        ? req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
        })
        : req;
    return next(authReq).pipe(catchError((err) => {
        if (err instanceof HttpErrorResponse &&
            err.status === 401 &&
            token &&
            !isPublicAuthUrl(req.url)) {
            authSession.clear();
            const onLoginScreen = router.url.startsWith(AUTHENTICATION_PATH) || router.url.startsWith('/connexion');
            if (!onLoginScreen) {
                void router.navigate([AUTHENTICATION_PATH], { replaceUrl: true });
            }
        }
        return throwError(() => err);
    }));
};
