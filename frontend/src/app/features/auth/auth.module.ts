import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Connexion } from './connexion/connexion';
import { Register } from './register/register';
import { VerifyOpt } from './verify-opt/verify-opt';
import { ForgotPassword } from './forgot-password/forgot-password';

@NgModule({
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
})
export class AuthModule { }