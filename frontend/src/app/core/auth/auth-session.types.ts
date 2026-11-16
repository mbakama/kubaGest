import type { LoginResponse } from '../api/auth-api.types';

export const AUTH_SESSION_STORAGE_KEY = 'kubagest.auth.session';

export type AuthSession = Pick<LoginResponse, 'accessToken' | 'user' | 'context'>;
