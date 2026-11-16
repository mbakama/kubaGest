import { AUTHENTICATION_PATH } from '../auth/auth.paths';
/** Retour interne autorisé après lecture d’un document légal (évite les URL externes). */
export function safeLegalReturnUrl(raw) {
    if (!raw) {
        return AUTHENTICATION_PATH;
    }
    const path = raw.trim();
    if (!path.startsWith('/') || path.startsWith('//')) {
        return AUTHENTICATION_PATH;
    }
    return path;
}
