import type { AppEnvironment } from './environment.model';

/** Développement : appels directs vers Nest (CORS requis sur le backend). */
export const environment: AppEnvironment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/api',
};
