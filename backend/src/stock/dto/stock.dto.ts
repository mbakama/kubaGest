import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';

export class ReceiveStockDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  productId: string;

  @ApiProperty({
    example: 48,
    description: 'Quantité reçue, exprimée dans l’unité de base de l’article',
  })
  @IsInt()
  @Min(1)
  @Max(1_000_000_000)
  quantity: number;

  @ApiPropertyOptional({ example: 'Facture fournisseur 112' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  reference?: string;
}

export class StockLineResponseDto {
  @ApiProperty({ format: 'uuid' })
  productId: string;

  @ApiProperty({ example: 'PARA-500' })
  sku: string;

  @ApiProperty({ example: 'Paracétamol 500 mg' })
  name: string;

  @ApiProperty({ example: 'boîte' })
  baseUnit: string;

  @ApiProperty({ example: 10 })
  reorderLevel: number;

  @ApiProperty({ example: 42, description: 'Stock disponible en unité de base' })
  quantityBase: number;

  @ApiProperty({ example: false })
  belowThreshold: boolean;
}
