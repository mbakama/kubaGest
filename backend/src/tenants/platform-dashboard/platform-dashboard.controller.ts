import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { PlatformAdminGuard } from '../../auth/guards/platform-admin.guard.js';
import { PlatformDashboardResponseDto } from '../dto/platform-dashboard-response.dto.js';
import { PlatformDashboardService } from './platform-dashboard.service.js';

@ApiTags('platform')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PlatformAdminGuard)
@Controller('platform/dashboard')
export class PlatformDashboardController {
  constructor(private readonly dashboard: PlatformDashboardService) {}

  @Get()
  @ApiOperation({
    summary:
      'Vue d’ensemble plateforme : KPI, répartition des formules, activité récente',
  })
  @ApiResponse({ status: 200, type: PlatformDashboardResponseDto })
  @ApiResponse({ status: 403, description: 'Super administrateur requis' })
  summary(): Promise<PlatformDashboardResponseDto> {
    return this.dashboard.getDashboard();
  }

}
