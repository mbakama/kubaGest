import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { Environment } from '../config/env.validation.js';
import { MailModule } from '../mail/mail.module.js';
import { UsersModule } from '../users/users.module.js';
import { AccessToken } from './access-token.entity.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard, TenantGuard } from './guards/jwt-auth.guard.js';
import { PasswordResetService } from './password-reset.service.js';
import { RolesGuard } from './guards/roles.guard.js';
import { PlatformAdminBootstrap } from './platform-admin.bootstrap.js';

@Module({
  imports: [
    UsersModule,
    MailModule,
    TypeOrmModule.forFeature([AccessToken]),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService<Environment, true>) => ({
        secret: config.get('JWT_SECRET', { infer: true }),
        signOptions: {
          expiresIn: config.get('JWT_EXPIRES_IN', { infer: true }),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordResetService,
    JwtAuthGuard,
    TenantGuard,
    RolesGuard,
    PlatformAdminBootstrap,
  ],
  exports: [AuthService],
})
export class AuthModule {}
