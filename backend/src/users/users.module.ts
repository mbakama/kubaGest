import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Establishment } from '../tenants/entities/establishment.entity.js';
import { Tenant } from '../tenants/entities/tenant.entity.js';
import { Membership } from './membership.entity.js';
import { User } from './user.entity.js';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { AvatarStorageService } from './avatar-storage.service.js';
import { AvatarsController } from './avatars.controller.js';
import { MembershipPermission } from './membership-permission.entity.js';
import { AuthSession } from '../auth/auth-session.entity.js';
import { MailModule } from '../mail/mail.module.js';

@Module({
  imports: [
    MailModule,
    TypeOrmModule.forFeature([
      User,
      Membership,
      MembershipPermission,
      AuthSession,
      Tenant,
      Establishment,
    ]),
  ],
  controllers: [UsersController, AvatarsController],
  providers: [UsersService, AvatarStorageService, JwtAuthGuard, RolesGuard],
  exports: [UsersService, AvatarStorageService],
})
export class UsersModule {}
