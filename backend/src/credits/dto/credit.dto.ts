import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { normalizeDecimal } from '../../common/decimal.js';
import { E164_PATTERN } from '../../common/phone.js';
import { CreditPaymentMethod } from '../credit-payment.entity.js';
import { CreditStatus } from '../credit-sale.entity.js';

const MONEY = /^\d{1,14}(\.\d{1,6})?$/;

export class CreateCustomerDto {
  @ApiProperty({ example: 'Marie Kabongo', maxLength: 160 })
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  name: string;

  @ApiPropertyOptional({ example: '+243810000000', nullable: true })
  @IsOptional()
  @IsString()
  @Matches(E164_PATTERN, {
    message: 'phone doit être un numéro au format international (+243…)',
  })
  phone?: string;

  @ApiPropertyOptional({
    example: '50000.000000',
    description: 'Plafond d’encours. 0 : crédit fermé.',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeDecimal(value))
  @IsString()
  @Matches(MONEY, {
    message: 'creditLimit doit être un montant décimal positif',
  })
  creditLimit?: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}

export class UpdateCustomerDto {
  @ApiPropertyOptional({ example: 'Marie Kabongo', maxLength: 160 })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  name?: string;

  @ApiPropertyOptional({ example: '+243810000000', nullable: true })
  @IsOptional()
  @IsString()
  @Matches(E164_PATTERN, {
    message: 'phone doit être un numéro au format international (+243…)',
  })
  phone?: string;

  @ApiPropertyOptional({ example: '50000.000000' })
  @IsOptional()
  @Transform(({ value }) => normalizeDecimal(value))
  @IsString()
  @Matches(MONEY, {
    message: 'creditLimit doit être un montant décimal positif',
  })
  creditLimit?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}

export class ListCustomersQueryDto {
  @ApiPropertyOptional({ description: 'Recherche par nom ou téléphone' })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  query?: string;
}

export class CreateCreditDto {
  @ApiProperty({ format: 'uuid' })
  @IsString()
  @MinLength(1)
  customerId: string;

  @ApiProperty({ example: '11500.000000' })
  @Transform(({ value }) => normalizeDecimal(value))
  @IsString()
  @Matches(MONEY, { message: 'total doit être un montant décimal positif' })
  total: string;

  @ApiPropertyOptional({
    example: '2026-11-26',
    description: 'Échéance convenue. Par défaut : 30 jours.',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dueDate doit être une date au format AAAA-MM-JJ',
  })
  dueDate?: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}

export class CreateCreditPaymentDto {
  @ApiProperty({ example: '5000.000000' })
  @Transform(({ value }) => normalizeDecimal(value))
  @IsString()
  @Matches(MONEY, { message: 'amount doit être un montant décimal positif' })
  amount: string;

  @ApiPropertyOptional({ enum: CreditPaymentMethod })
  @IsOptional()
  @IsEnum(CreditPaymentMethod)
  method?: CreditPaymentMethod;

  @ApiPropertyOptional({
    description: 'Date du règlement (défaut : maintenant)',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'paidAt doit être une date au format AAAA-MM-JJ',
  })
  paidAt?: string;
}

export enum CreditFilter {
  OPEN = 'open',
  LATE = 'late',
  PAID = 'paid',
  ALL = 'all',
}

export class ListCreditsQueryDto {
  @ApiPropertyOptional({ enum: CreditFilter })
  @IsOptional()
  @IsEnum(CreditFilter)
  status?: CreditFilter;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsString()
  customerId?: string;
}

export class CancelCreditDto {
  @ApiPropertyOptional({ example: 'Erreur de saisie au comptoir' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

export class CreditSummaryQueryDto {
  @ApiPropertyOptional({ default: 30, description: 'Fenêtre des échéances' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(365)
  days?: number;
}

export { CreditStatus };
