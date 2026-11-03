import { InjectionToken } from '@angular/core';

// En production, configurer un reverse proxy /api ou fournir une autre valeur.
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => '/api',
});
