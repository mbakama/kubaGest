import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { normalizeDecimal } from '../../common/decimal.js';
import { SaleChannel } from '../sale.entity.js';

const MONEY = /^\d{1,14}(\.\d{1,6})?$/;

export class SaleItemInputDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  productId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  packagingId: string;

  @ApiProperty({ example: 2, description: 'Nombre de conditionnements vendus' })
  @IsInt()
  @Min(1)
  @Max(100_000)
  quantity: number;
}

export class CreateSaleDto {
  @ApiProperty({ type: [SaleItemInputDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => SaleItemInputDto)
  items: SaleItemInputDto[];

  @ApiProperty({ enum: SaleChannel, description: 'Moyen de règlement' })
  @IsEnum(SaleChannel)
  channel: SaleChannel;

  @ApiPropertyOptional({
    example: '20000.000000',
    description: 'Espèces remises par le client (obligatoire en espèces)',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeDecimal(value))
  @IsString()
  @Matches(MONEY, { message: 'received doit être un montant positif' })
  received?: string;

  @ApiPropertyOptional({ format: 'uuid', description: 'Obligatoire à crédit' })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiPropertyOptional({ example: '2026-11-26' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dueDate doit être une date au format AAAA-MM-JJ',
  })
  dueDate?: string;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}

export class SaleLineResponseDto {
  @ApiProperty({ format: 'uuid' })
  productId: string;

  @ApiProperty({ example: 'Paracétamol 500 mg' })
  name: string;

  @ApiProperty({ example: 'boîte' })
  packaging: string;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 30 })
  factor: number;

  @ApiProperty({ example: 60, description: 'Quantité en unité de base' })
  quantityBase: number;

  @ApiProperty({ example: '2500.000000' })
  unitPrice: string;

  @ApiProperty({ example: '5000.000000' })
  lineTotal: string;
}

export class SaleCreditInfoDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'CR-000001' })
  number: string;

  @ApiProperty({ example: '2026-11-26' })
  dueDate: string;

  @ApiProperty({ example: '5000.000000' })
  remaining: string;
}

export class SaleResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'T-000001' })
  number: string;

  @ApiProperty({ enum: SaleChannel })
  channel: SaleChannel;

  @ApiProperty({ example: '5000.000000' })
  subtotal: string;

  @ApiProperty({ example: '0.000000' })
  taxTotal: string;

  @ApiProperty({ example: '5000.000000' })
  total: string;

  @ApiProperty({ example: '10000.000000', nullable: true })
  received: string | null;

  @ApiProperty({ example: '5000.000000', nullable: true })
  change: string | null;

  @ApiProperty({ example: 'Caisse principale', nullable: true })
  registerName: string | null;

  @ApiProperty({ format: 'uuid', nullable: true })
  sessionId: string | null;

  @ApiProperty({ nullable: true, example: 'Marie Kabongo' })
  customerName: string | null;

  @ApiProperty({ type: SaleCreditInfoDto, nullable: true })
  credit: SaleCreditInfoDto | null;

  @ApiProperty({ type: [SaleLineResponseDto] })
  items: SaleLineResponseDto[];

  @ApiProperty({ type: String, format: 'date-time' })
  postedAt: Date;
}
