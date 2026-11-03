import { Controller, Get, Version, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { AppService } from './app.service.js';

/**
 * Sonde de disponibilité brute conservée hors versionnement pour rester
 * compatible avec le client de bureau (`GET /api/`). Les routes métier sont
 * exposées sous `/api/v1` ; l'état détaillé est sur `/api/v1/health`.
 */
@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Version(VERSION_NEUTRAL)
  getHello(): string {
    return this.appService.getHello();
  }
}
