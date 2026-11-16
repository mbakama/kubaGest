export interface AppEnvironment {
  production: boolean;
  /** Préfixe HTTP des appels API (ex. `/api` derrière le proxy de dev). */
  apiBaseUrl: string;
}
