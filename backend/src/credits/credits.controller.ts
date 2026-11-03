import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { JwtAuthGuard, TenantGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import type { AuthPrincipal } from '../auth/jwt-payload.interface.js';
import { MembershipRole } from '../users/membership-role.enum.js';
import { CreditsService } from './credits.service.js';
import {
  CancelCreditDto,
  CreateCreditDto,
  CreateCreditPaymentDto,
  CreateCustomerDto,
  ListCreditsQueryDto,
  ListCustomersQueryDto,
  UpdateCustomerDto,
} from './dto/credit.dto.js';
import {
  CreditReminderResponseDto,
  CreditResponseDto,
  CreditSummaryDto,
  CustomerResponseDto,
  ReminderRunResponseDto,
} from './dto/credit-response.dto.js';

@ApiTags('credit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly credits: CreditsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les clients et leur encours' })
  @ApiResponse({ status: 200, type: [CustomerResponseDto] })
  list(
    @CurrentUser() user: AuthPrincipal,
    @Query() query: ListCustomersQueryDto,
  ): Promise<CustomerResponseDto[]> {
    return this.credits.listCustomers(user.tenantId as string, query);
  }

  @Post()
  @Roles(MembershipRole.OWNER, MembershipRole.CASHIER)
  @ApiOperation({ summary: 'Enregistrer un client du comptoir' })
  @ApiResponse({ status: 201, type: CustomerResponseDto })
  @ApiResponse({ status: 409, description: 'Numéro déjà utilisé' })
  create(
    @CurrentUser() user: AuthPrincipal,
    @Body() dto: CreateCustomerDto,
  ): Promise<CustomerResponseDto> {
    return this.credits.createCustomer(user.tenantId as string, user.sub, dto);
  }

  @Patch(':customerId')
  @Roles(MembershipRole.OWNER, MembershipRole.CASHIER)
  @ApiOperation({ summary: 'Modifier un client ou son plafond de crédit' })
  @ApiResponse({ status: 200, type: CustomerResponseDto })
  update(
    @CurrentUser() user: AuthPrincipal,
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Body() dto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    return this.credits.updateCustomer(
      user.tenantId as string,
      user.sub,
      customerId,
      dto,
    );
  }
}

@ApiTags('credit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller('credits')
export class CreditsController {
  constructor(private readonly credits: CreditsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister le carnet de crédit' })
  @ApiResponse({ status: 200, type: [CreditResponseDto] })
  list(
    @CurrentUser() user: AuthPrincipal,
    @Query() query: ListCreditsQueryDto,
  ): Promise<CreditResponseDto[]> {
    return this.credits.listCredits(user.tenantId as string, query);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Encours total et retards' })
  @ApiResponse({ status: 200, type: CreditSummaryDto })
  summary(@CurrentUser() user: AuthPrincipal): Promise<CreditSummaryDto> {
    return this.credits.summary(user.tenantId as string);
  }

  @Post()
  @Roles(MembershipRole.OWNER, MembershipRole.CASHIER)
  @ApiOperation({ summary: 'Laisser une vente à crédit' })
  @ApiResponse({ status: 201, type: CreditResponseDto })
  @ApiResponse({ status: 409, description: 'Plafond de crédit atteint' })
  create(
    @CurrentUser() user: AuthPrincipal,
    @Body() dto: CreateCreditDto,
  ): Promise<CreditResponseDto> {
    return this.credits.createCredit(user.tenantId as string, user.sub, dto);
  }

  @Post(':creditId/payments')
  @Roles(MembershipRole.OWNER, MembershipRole.CASHIER)
  @ApiOperation({ summary: 'Encaisser un règlement, total ou partiel' })
  @ApiResponse({ status: 201, type: CreditResponseDto })
  @ApiResponse({ status: 400, description: 'Règlement supérieur au reste dû' })
  pay(
    @CurrentUser() user: AuthPrincipal,
    @Param('creditId', ParseUUIDPipe) creditId: string,
    @Body() dto: CreateCreditPaymentDto,
  ): Promise<CreditResponseDto> {
    return this.credits.recordPayment(
      user.tenantId as string,
      user.sub,
      creditId,
      dto,
    );
  }

  @Post(':creditId/cancel')
  @Roles(MembershipRole.OWNER)
  @ApiOperation({ summary: 'Annuler un crédit non réglé (propriétaire)' })
  @ApiResponse({ status: 201, type: CreditResponseDto })
  cancel(
    @CurrentUser() user: AuthPrincipal,
    @Param('creditId', ParseUUIDPipe) creditId: string,
    @Body() dto: CancelCreditDto,
  ): Promise<CreditResponseDto> {
    return this.credits.cancelCredit(
      user.tenantId as string,
      user.sub,
      creditId,
      dto,
    );
  }

  @Get('reminders')
  @Roles(MembershipRole.OWNER)
  @ApiOperation({ summary: 'Historique des relances de crédit échu' })
  @ApiResponse({ status: 200, type: [CreditReminderResponseDto] })
  reminders(
    @CurrentUser() user: AuthPrincipal,
    @Query('creditId') creditId?: string,
  ): Promise<CreditReminderResponseDto[]> {
    return this.credits.listReminders(user.tenantId as string, creditId);
  }

  @Post('reminders/run')
  @Roles(MembershipRole.OWNER)
  @ApiOperation({
    summary: 'Relancer par SMS les clients dont un crédit est échu',
  })
  @ApiResponse({ status: 201, type: ReminderRunResponseDto })
  runReminders(
    @CurrentUser() user: AuthPrincipal,
  ): Promise<ReminderRunResponseDto> {
    return this.credits.sendReminders(user.tenantId as string, user.sub);
  }
}
