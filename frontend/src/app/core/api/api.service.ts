import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, throwError, timeout } from 'rxjs';
import { API_BASE_URL } from './api.config';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from './auth-api.types';
import type {
  PlatformDashboardActivity,
  PlatformDashboardResponse,
} from './platform-dashboard.types';
import type {
  PlatformAdminProfileResponse,
  UpdatePlatformAdminProfileRequest,
} from './platform-profile.types';
import type { PlatformTenantSummary } from './platform-api.types';
import type { TenantCurrentExchangeRateResponse } from './tenant-exchange-rate.types';
import type { TenantDashboardResponse } from './tenant-dashboard.types';
import type {
  CreateTenantMemberRequest,
  CreateTenantMemberResponse,
  MemberPermission,
  MemberPermissionCatalogItem,
  MemberSession,
  TenantAuditEntry,
  TenantMember,
  TenantMemberRole,
} from './tenant-users.types';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL).replace(/\/$/, '');

  // GET / retourne du texte. Ceci ne valide pas les futurs services métier.
  checkConnection() {
    return this.http.get(`${this.baseUrl}/`, { responseType: 'text' }).pipe(timeout(8000));
  }

  login(body: LoginRequest) {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/v1/auth/login`, body)
      .pipe(timeout(15000));
  }

  listPlatformTenants() {
    return this.http
      .get<PlatformTenantSummary[]>(`${this.baseUrl}/v1/platform/tenants`)
      .pipe(timeout(15000));
  }

  getPlatformDashboard() {
    return this.http
      .get<PlatformDashboardResponse>(`${this.baseUrl}/v1/platform/dashboard`)
      .pipe(timeout(15000));
  }

  getPlatformActivityLog() {
    return this.http
      .get<PlatformDashboardActivity[]>(`${this.baseUrl}/v1/audit/platform`)
      .pipe(
        timeout(15000),
        catchError((error: unknown) => {
          if (error instanceof HttpErrorResponse && error.status === 404) {
            return this.getPlatformDashboard().pipe(map((dashboard) => dashboard.recentActivity));
          }
          return throwError(() => error);
        }),
      );
  }

  getTenantDashboard() {
    return this.http
      .get<TenantDashboardResponse>(`${this.baseUrl}/v1/dashboard`)
      .pipe(timeout(15000));
  }

  getTenantCurrentExchangeRate() {
    return this.http
      .get<TenantCurrentExchangeRateResponse>(`${this.baseUrl}/v1/tenants/current/exchange-rate`)
      .pipe(timeout(15000));
  }

  getPlatformProfile() {
    return this.http
      .get<PlatformAdminProfileResponse>(`${this.baseUrl}/v1/platform/profile`)
      .pipe(timeout(15000));
  }

  updatePlatformProfile(body: UpdatePlatformAdminProfileRequest) {
    return this.http
      .patch<PlatformAdminProfileResponse>(`${this.baseUrl}/v1/platform/profile`, body)
      .pipe(timeout(15000));
  }

  uploadPlatformProfileAvatar(file: File) {
    const form = new FormData();
    form.append('file', file);
    return this.http
      .post<PlatformAdminProfileResponse>(`${this.baseUrl}/v1/platform/profile/avatar`, form)
      .pipe(timeout(30000));
  }

  deletePlatformProfileAvatar() {
    return this.http
      .delete<PlatformAdminProfileResponse>(`${this.baseUrl}/v1/platform/profile/avatar`)
      .pipe(timeout(15000));
  }

  register(body: RegisterRequest) {
    return this.http
      .post<RegisterResponse>(`${this.baseUrl}/v1/auth/register`, body)
      .pipe(timeout(20000));
  }

  checkRegistrationEmail(email: string) {
    return this.http
      .post<{ available: boolean }>(`${this.baseUrl}/v1/auth/check-email`, { email })
      .pipe(timeout(8000));
  }

  requestPasswordReset(email: string) {
    return this.http
      .post<{ sent: boolean }>(`${this.baseUrl}/v1/auth/forgot-password`, { email })
      .pipe(timeout(15000));
  }

  verifyPasswordResetCode(email: string, code: string) {
    return this.http
      .post<{ resetToken: string }>(`${this.baseUrl}/v1/auth/forgot-password/verify`, {
        email,
        code,
      })
      .pipe(timeout(15000));
  }

  confirmPasswordReset(resetToken: string, password: string) {
    return this.http
      .post<{ updated: boolean }>(`${this.baseUrl}/v1/auth/forgot-password/confirm`, {
        resetToken,
        password,
      })
      .pipe(timeout(15000));
  }

  listTenantMembers() {
    return this.http.get<TenantMember[]>(`${this.baseUrl}/v1/users`).pipe(timeout(15000));
  }

  createTenantMember(body: CreateTenantMemberRequest) {
    return this.http
      .post<CreateTenantMemberResponse>(`${this.baseUrl}/v1/users`, body)
      .pipe(timeout(15000));
  }

  acceptMemberInvitation(token: string, password: string) {
    return this.http
      .post<{ activated: true }>(`${this.baseUrl}/v1/auth/invitations/accept`, { token, password })
      .pipe(timeout(15000));
  }

  updateTenantMemberRole(
    membershipId: string,
    role: Exclude<TenantMemberRole, 'owner'>,
    reason?: string,
  ) {
    return this.http
      .patch<TenantMember>(`${this.baseUrl}/v1/users/${membershipId}/role`, { role, reason })
      .pipe(timeout(15000));
  }

  updateTenantMemberStatus(membershipId: string, isActive: boolean, reason?: string) {
    return this.http
      .patch<TenantMember>(`${this.baseUrl}/v1/users/${membershipId}/status`, { isActive, reason })
      .pipe(timeout(15000));
  }

  resetTenantMemberPassword(membershipId: string, password: string, reason?: string) {
    return this.http
      .post<{ updated: true }>(`${this.baseUrl}/v1/users/${membershipId}/reset-password`, {
        password,
        reason,
      })
      .pipe(timeout(15000));
  }

  getMemberPermissionCatalog() {
    return this.http
      .get<MemberPermissionCatalogItem[]>(`${this.baseUrl}/v1/users/permissions/catalog`)
      .pipe(timeout(15000));
  }

  listMemberPermissions(membershipId: string) {
    return this.http
      .get<MemberPermission[]>(`${this.baseUrl}/v1/users/${membershipId}/permissions`)
      .pipe(timeout(15000));
  }

  setMemberPermission(
    membershipId: string,
    permissionCode: string,
    allowed: boolean,
    reason: string,
  ) {
    return this.http
      .put<MemberPermission>(
        `${this.baseUrl}/v1/users/${membershipId}/permissions/${encodeURIComponent(permissionCode)}`,
        { allowed, reason },
      )
      .pipe(timeout(15000));
  }

  removeMemberPermission(membershipId: string, permissionCode: string) {
    return this.http
      .delete<{ removed: true }>(
        `${this.baseUrl}/v1/users/${membershipId}/permissions/${encodeURIComponent(permissionCode)}`,
      )
      .pipe(timeout(15000));
  }

  listMemberSessions(membershipId: string) {
    return this.http
      .get<MemberSession[]>(`${this.baseUrl}/v1/users/${membershipId}/sessions`)
      .pipe(timeout(15000));
  }

  listMyAuthSessions() {
    return this.http
      .get<MemberSession[]>(`${this.baseUrl}/v1/users/me/sessions`)
      .pipe(timeout(15000));
  }

  revokeMyAuthSession(sessionId: string) {
    return this.http
      .delete<{ revoked: true }>(`${this.baseUrl}/v1/users/me/sessions/${sessionId}`)
      .pipe(timeout(15000));
  }

  revokeMemberSession(membershipId: string, sessionId: string) {
    return this.http
      .delete<{ revoked: true }>(`${this.baseUrl}/v1/users/${membershipId}/sessions/${sessionId}`)
      .pipe(timeout(15000));
  }

  listTenantAuditLog() {
    return this.http.get<TenantAuditEntry[]>(`${this.baseUrl}/v1/audit/tenant`).pipe(timeout(15000));
  }
}
