import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  @ApiOperation({ summary: "État de l'API et de la base de données" })
  async check(): Promise<{
    status: string;
    database: string;
    uptime: number;
    timestamp: string;
  }> {
    let database = 'ok';

    try {
      await this.dataSource.query('SELECT 1');
    } catch {
      database = 'unavailable';
    }

    const payload = {
      status: database === 'ok' ? 'ok' : 'degraded',
      database,
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };

    if (database !== 'ok') {
      throw new ServiceUnavailableException(payload);
    }

    return payload;
  }
}
