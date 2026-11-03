import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { normalizeDecimal } from '../../common/decimal.js';

const MONEY = /^\d{1,14}(\.\d{1,6})?$/;

export class OpenCashSessionDto {
  @ApiPropertyOptional({
    example: '0.000000',
    description: 'Fonds de caisse à l’ouverture',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeDecimal(value))
  @IsString()
  @Matches(MONEY, { message: 'openingAmount doit être un montant positif' })
  openingAmount?: string;

  @ApiPropertyOptional({ example: 'Caisse principale' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  registerName?: string;
}

export class CloseCashSessionDto {
  @ApiPropertyOptional({
    example: '142000.000000',
    description: 'Espèces comptées à la clôture',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeDecimal(value))
  @IsString()
  @Matches(MONEY, { message: 'countedAmount doit être un montant positif' })
  countedAmount?: string;

  @ApiPropertyOptional({ example: 'Fin de journée' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

export class CashSessionResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ enum: ['open', 'closed'] })
  status: string;

  @ApiProperty({ example: 'Caisse principale' })
  registerName: string;

  @ApiProperty({ example: '0.000000' })
  openingAmount: string;

  @ApiProperty({ example: '125000.000000', description: 'Somme du journal' })
  movementsTotal: string;

  @ApiProperty({ example: '125000.000000' })
  expectedAmount: string;

  @ApiProperty({ type: String, format: 'date-time' })
  openedAt: Date;

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  closedAt: Date | null;
}
