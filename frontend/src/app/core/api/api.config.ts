import { InjectionToken } from '@angular/core';

/** Fourni dans `app.config.ts` à partir de `src/environments/environment*.ts`. */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
