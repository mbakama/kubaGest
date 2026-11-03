import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Establishment } from '../tenants/establishment.entity.js';
import { Tenant } from '../tenants/tenant.entity.js';
import { Membership } from './membership.entity.js';
import { User } from './user.entity.js';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { AvatarStorageService } from './avatar-storage.service.js';
import { AvatarsController } from './avatars.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Membership, Tenant, Establishment]),
  ],
  controllers: [UsersController, AvatarsController],
  providers: [UsersService, AvatarStorageService, JwtAuthGuard, RolesGuard],
  exports: [UsersService],
})
export class UsersModule {}
