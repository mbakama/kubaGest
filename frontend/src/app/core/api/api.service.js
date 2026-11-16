import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, throwError, timeout } from 'rxjs';
import { API_BASE_URL } from './api.config';
import * as i0 from "@angular/core";
export class ApiService {
    http = inject(HttpClient);
    baseUrl = inject(API_BASE_URL).replace(/\/$/, '');
    // GET / retourne du texte. Ceci ne valide pas les futurs services métier.
    checkConnection() {
        return this.http.get(`${this.baseUrl}/`, { responseType: 'text' }).pipe(timeout(8000));
    }
    login(body) {
        return this.http
            .post(`${this.baseUrl}/v1/auth/login`, body)
            .pipe(timeout(15000));
    }
    listPlatformTenants() {
        return this.http
            .get(`${this.baseUrl}/v1/platform/tenants`)
            .pipe(timeout(15000));
    }
    getPlatformDashboard() {
        return this.http
            .get(`${this.baseUrl}/v1/platform/dashboard`)
            .pipe(timeout(15000));
    }
    getPlatformActivityLog() {
        return this.http
            .get(`${this.baseUrl}/v1/audit/platform`)
            .pipe(timeout(15000), catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 404) {
                return this.getPlatformDashboard().pipe(map((dashboard) => dashboard.recentActivity));
            }
            return throwError(() => error);
        }));
    }
    getTenantDashboard() {
        return this.http
            .get(`${this.baseUrl}/v1/dashboard`)
            .pipe(timeout(15000));
    }
    getTenantCurrentExchangeRate() {
        return this.http
            .get(`${this.baseUrl}/v1/tenants/current/exchange-rate`)
            .pipe(timeout(15000));
    }
    getPlatformProfile() {
        return this.http
            .get(`${this.baseUrl}/v1/platform/profile`)
            .pipe(timeout(15000));
    }
    updatePlatformProfile(body) {
        return this.http
            .patch(`${this.baseUrl}/v1/platform/profile`, body)
            .pipe(timeout(15000));
    }
    uploadPlatformProfileAvatar(file) {
        const form = new FormData();
        form.append('file', file);
        return this.http
            .post(`${this.baseUrl}/v1/platform/profile/avatar`, form)
            .pipe(timeout(30000));
    }
    deletePlatformProfileAvatar() {
        return this.http
            .delete(`${this.baseUrl}/v1/platform/profile/avatar`)
            .pipe(timeout(15000));
    }
    register(body) {
        return this.http
            .post(`${this.baseUrl}/v1/auth/register`, body)
            .pipe(timeout(20000));
    }
    checkRegistrationEmail(email) {
        return this.http
            .post(`${this.baseUrl}/v1/auth/check-email`, { email })
            .pipe(timeout(8000));
    }
    requestPasswordReset(email) {
        return this.http
            .post(`${this.baseUrl}/v1/auth/forgot-password`, { email })
            .pipe(timeout(15000));
    }
    verifyPasswordResetCode(email, code) {
        return this.http
            .post(`${this.baseUrl}/v1/auth/forgot-password/verify`, {
            email,
            code,
        })
            .pipe(timeout(15000));
    }
    confirmPasswordReset(resetToken, password) {
        return this.http
            .post(`${this.baseUrl}/v1/auth/forgot-password/confirm`, {
            resetToken,
            password,
        })
            .pipe(timeout(15000));
    }
    listTenantMembers() {
        return this.http.get(`${this.baseUrl}/v1/users`).pipe(timeout(15000));
    }
    createTenantMember(body) {
        return this.http
            .post(`${this.baseUrl}/v1/users`, body)
            .pipe(timeout(15000));
    }
    acceptMemberInvitation(token, password) {
        return this.http
            .post(`${this.baseUrl}/v1/auth/invitations/accept`, { token, password })
            .pipe(timeout(15000));
    }
    updateTenantMemberRole(membershipId, role, reason) {
        return this.http
            .patch(`${this.baseUrl}/v1/users/${membershipId}/role`, { role, reason })
            .pipe(timeout(15000));
    }
    updateTenantMemberStatus(membershipId, isActive, reason) {
        return this.http
            .patch(`${this.baseUrl}/v1/users/${membershipId}/status`, { isActive, reason })
            .pipe(timeout(15000));
    }
    resetTenantMemberPassword(membershipId, password, reason) {
        return this.http
            .post(`${this.baseUrl}/v1/users/${membershipId}/reset-password`, {
            password,
            reason,
        })
            .pipe(timeout(15000));
    }
    getMemberPermissionCatalog() {
        return this.http
            .get(`${this.baseUrl}/v1/users/permissions/catalog`)
            .pipe(timeout(15000));
    }
    listMemberPermissions(membershipId) {
        return this.http
            .get(`${this.baseUrl}/v1/users/${membershipId}/permissions`)
            .pipe(timeout(15000));
    }
    setMemberPermission(membershipId, permissionCode, allowed, reason) {
        return this.http
            .put(`${this.baseUrl}/v1/users/${membershipId}/permissions/${encodeURIComponent(permissionCode)}`, { allowed, reason })
            .pipe(timeout(15000));
    }
    removeMemberPermission(membershipId, permissionCode) {
        return this.http
            .delete(`${this.baseUrl}/v1/users/${membershipId}/permissions/${encodeURIComponent(permissionCode)}`)
            .pipe(timeout(15000));
    }
    listMemberSessions(membershipId) {
        return this.http
            .get(`${this.baseUrl}/v1/users/${membershipId}/sessions`)
            .pipe(timeout(15000));
    }
    revokeMemberSession(membershipId, sessionId) {
        return this.http
            .delete(`${this.baseUrl}/v1/users/${membershipId}/sessions/${sessionId}`)
            .pipe(timeout(15000));
    }
    listTenantAuditLog() {
        return this.http.get(`${this.baseUrl}/v1/audit/tenant`).pipe(timeout(15000));
    }
    static ɵfac = function ApiService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ApiService)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ApiService, factory: ApiService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ApiService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
