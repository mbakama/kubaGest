import { Global, Module } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PlatformAdminGuard } from '../auth/guards/platform-admin.guard.js';
import { SmsController } from './sms.controller.js';
import { SmsService } from './sms.service.js';

@Global()
@Module({
  controllers: [SmsController],
  providers: [SmsService, JwtAuthGuard, PlatformAdminGuard],
  exports: [SmsService],
})
export class SmsModule {}
