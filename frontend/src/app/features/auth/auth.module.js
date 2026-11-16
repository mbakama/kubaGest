import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Connexion } from './connexion/connexion';
import { Register } from './register/register';
import { VerifyOpt } from './verify-opt/verify-opt';
import { ForgotPassword } from './forgot-password/forgot-password';
import * as i0 from "@angular/core";
export class AuthModule {
    static ɵfac = function AuthModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AuthModule)(); };
    static ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: AuthModule });
    static ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [CommonModule,
            FormsModule,
            RouterModule,
            HttpClientModule,
            Register,
            ForgotPassword] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AuthModule, [{
        type: NgModule,
        args: [{
                imports: [
                    CommonModule,
                    FormsModule,
                    RouterModule,
                    HttpClientModule,
                    Connexion,
                    Register,
                    VerifyOpt,
                    ForgotPassword,
                ],
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(AuthModule, { imports: [CommonModule,
        FormsModule,
        RouterModule,
        HttpClientModule,
        Connexion,
        Register,
        VerifyOpt,
        ForgotPassword] }); })();
