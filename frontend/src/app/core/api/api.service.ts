import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { timeout } from 'rxjs';
import { API_BASE_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL).replace(/\/$/, '');

  // GET / retourne du texte. Ceci ne valide pas les futurs services métier.
  checkConnection() {
    return this.http.get(`${this.baseUrl}/`, { responseType: 'text' }).pipe(timeout(8000));
  }
}
