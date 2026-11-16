import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
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
import { MONEY_PATTERN, normalizeDecimal } from '../../common/decimal.js';
import {
  GoodsReceiptStatus,
  PurchaseCurrency,
  PurchaseStatus,
} from '../purchasing.enums.js';

export class CreateSupplierDto {
  @ApiProperty()
  @IsString()
  @MaxLength(180)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;
}

export class PurchaseLineDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  physicalProductId: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(1_000_000_000)
  quantityOrdered: number;

  @ApiProperty({ example: '12.500000' })
  @Transform(({ value }) => normalizeDecimal(value))
  @IsString()
  @Matches(MONEY_PATTERN)
  unitCost: string;
}

export class CreatePurchaseDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  supplierId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  destinationWarehouseId: string;

  @ApiProperty({ enum: PurchaseCurrency })
  @IsEnum(PurchaseCurrency)
  currency: PurchaseCurrency;

  @ApiProperty({ example: 'PO-2026-001' })
  @IsString()
  @MaxLength(60)
  reference: string;

  @ApiProperty({ type: [PurchaseLineDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PurchaseLineDto)
  items: PurchaseLineDto[];
}

export class GoodsReceiptLineDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  physicalProductId: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(1_000_000_000)
  quantityReceived: number;

  @ApiProperty({ example: '12.500000' })
  @Transform(({ value }) => normalizeDecimal(value))
  @IsString()
  @Matches(MONEY_PATTERN)
  unitCost: string;
}

export class CreateGoodsReceiptDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  purchaseId: string;

  @ApiProperty({ example: 'GR-2026-001' })
  @IsString()
  @MaxLength(60)
  reference: string;

  @ApiProperty({ type: [GoodsReceiptLineDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => GoodsReceiptLineDto)
  items: GoodsReceiptLineDto[];
}

export class SupplierResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class PurchaseItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  physicalProductId: string;

  @ApiProperty()
  quantityOrdered: number;

  @ApiProperty()
  unitCost: string;

  @ApiProperty()
  totalCost: string;
}

export class PurchaseResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  reference: string;

  @ApiProperty({ enum: PurchaseStatus })
  status: PurchaseStatus;

  @ApiProperty()
  supplierId: string;

  @ApiProperty()
  destinationWarehouseId: string;

  @ApiProperty()
  totalAmount: string;

  @ApiProperty({ type: [PurchaseItemResponseDto] })
  items: PurchaseItemResponseDto[];
}

export class GoodsReceiptItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  physicalProductId: string;

  @ApiProperty()
  quantityReceived: number;

  @ApiProperty()
  unitCost: string;
}

export class GoodsReceiptResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  reference: string;

  @ApiProperty({ enum: GoodsReceiptStatus })
  status: GoodsReceiptStatus;

  @ApiProperty()
  purchaseId: string;

  @ApiProperty()
  warehouseId: string;

  @ApiProperty({ type: [GoodsReceiptItemResponseDto] })
  items: GoodsReceiptItemResponseDto[];
}
