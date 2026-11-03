import { ApiProperty } from '@nestjs/swagger';
import { AllocationPolicy, TrackingMode } from '../catalog.enums.js';

export class ProductCategoryResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Boissons' })
  name: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}

export class PackagingResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Boîte de 30' })
  label: string;

  @ApiProperty({ example: 30, description: 'Unités de base par conditionnement' })
  factorToBase: number;

  @ApiProperty({ example: '45000.000000', description: 'Devise de référence' })
  salePrice: string;

  @ApiProperty({ example: false })
  isBase: boolean;

  @ApiProperty({ example: true })
  isActive: boolean;
}

export class BarcodeResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: '0123456789012' })
  code: string;

  @ApiProperty({ format: 'uuid' })
  packagingId: string;
}

export class DrugDetailsResponseDto {
  @ApiProperty({ example: 'Paracétamol' })
  activeIngredient: string;

  @ApiProperty({ example: '500 mg' })
  strength: string;

  @ApiProperty({ example: 'Comprimé' })
  dosageForm: string;

  @ApiProperty({ nullable: true })
  prescriptionRequired: boolean | null;
}

export class ProductResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'PARA-500' })
  sku: string;

  @ApiProperty({ example: 'Paracétamol 500 mg' })
  name: string;

  @ApiProperty({ format: 'uuid', nullable: true })
  categoryId: string | null;

  @ApiProperty({ example: 'comprimé' })
  baseUnit: string;

  @ApiProperty({ example: 10 })
  reorderLevel: number;

  @ApiProperty({ enum: TrackingMode })
  trackingMode: TrackingMode;

  @ApiProperty({ enum: AllocationPolicy })
  allocationPolicy: AllocationPolicy;

  @ApiProperty({ example: '0.0000' })
  taxRate: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ type: [PackagingResponseDto] })
  packagings: PackagingResponseDto[];

  @ApiProperty({ type: [BarcodeResponseDto] })
  barcodes: BarcodeResponseDto[];

  @ApiProperty({ type: DrugDetailsResponseDto, nullable: true })
  drugDetails: DrugDetailsResponseDto | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
