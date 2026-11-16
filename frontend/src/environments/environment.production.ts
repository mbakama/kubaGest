import type { AppEnvironment } from './environment.model';

/** Build production : même origine, reverse proxy `/api` vers NestJS. */
export const environment: AppEnvironment = {
  production: true,
  apiBaseUrl: '/api',
};
