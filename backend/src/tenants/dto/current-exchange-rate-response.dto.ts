import { ApiProperty } from '@nestjs/swagger';

/** Taux BCC du jour : 1 USD = `cdfPerUsd` CDF (établissement principal). */
export class CurrentExchangeRateResponseDto {
  @ApiProperty({
    example: '2850.0000000000',
    nullable: true,
    description: 'Taux en vigueur ; null si aucun taux enregistré',
  })
  cdfPerUsd: string | null;

  @ApiProperty({
    type: String,
    format: 'date-time',
    nullable: true,
  })
  effectiveAt: string | null;
}
