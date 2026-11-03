import { ApiProperty } from '@nestjs/swagger';
import { CreditPaymentMethod } from '../credit-payment.entity.js';
import { CreditStatus } from '../credit-sale.entity.js';

export class CustomerResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Marie Kabongo' })
  name: string;

  @ApiProperty({ nullable: true, example: '+243810000000' })
  phone: string | null;

  @ApiProperty({ example: '50000.000000' })
  creditLimit: string;

  @ApiProperty({ example: '11500.000000', description: 'Encours actuel' })
  outstanding: string;

  @ApiProperty({
    example: '38500.000000',
    description: 'Crédit encore disponible',
  })
  available: string;

  @ApiProperty({ example: false })
  hasLateCredit: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ nullable: true })
  note: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;
}

export class CreditPaymentResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: '5000.000000' })
  amount: string;

  @ApiProperty({ enum: CreditPaymentMethod })
  method: CreditPaymentMethod;

  @ApiProperty({ type: String, format: 'date-time' })
  paidAt: Date;
}

export class CreditResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'CR-000001' })
  number: string;

  @ApiProperty({ format: 'uuid', nullable: true })
  saleId: string | null;

  @ApiProperty({ format: 'uuid' })
  customerId: string;

  @ApiProperty({ example: 'Marie Kabongo' })
  customerName: string;

  @ApiProperty({ example: '11500.000000' })
  total: string;

  @ApiProperty({ example: '5000.000000' })
  paidTotal: string;

  @ApiProperty({ example: '6500.000000' })
  remaining: string;

  @ApiProperty({ nullable: true, example: '2026-11-26' })
  dueDate: string | null;

  @ApiProperty({ example: '2026-10-27', nullable: true })
  daysLate: number | null;

  @ApiProperty({ enum: CreditStatus })
  status: CreditStatus;

  @ApiProperty({ nullable: true })
  note: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: [CreditPaymentResponseDto] })
  payments: CreditPaymentResponseDto[];
}

export class CreditSummaryDto {
  @ApiProperty({ example: '125000.000000' })
  outstanding: string;

  @ApiProperty({ example: 3 })
  openCount: number;

  @ApiProperty({ example: 1 })
  lateCount: number;

  @ApiProperty({ example: '25000.000000' })
  lateAmount: string;

  @ApiProperty({ example: 2 })
  customerCount: number;
}

export class CreditReminderResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  creditId: string;

  @ApiProperty({ enum: ['sent', 'failed'] })
  status: string;

  @ApiProperty({ nullable: true, example: '+243810000001' })
  recipient: string | null;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: String, format: 'date-time' })
  sentAt: Date;
}

export class ReminderRunResponseDto {
  @ApiProperty({ example: 2 })
  sent: number;

  @ApiProperty({ example: 1, description: 'Clients ignorés (déjà relancés, sans téléphone)' })
  skipped: number;

  @ApiProperty({ example: 0 })
  failed: number;

  @ApiProperty({ example: 3 })
  candidates: number;

  @ApiProperty({ example: true })
  smsConfigured: boolean;

  @ApiProperty({ nullable: true })
  message: string | null;
}
