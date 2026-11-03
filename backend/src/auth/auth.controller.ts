import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ProfileResponseDto } from '../users/user.mapper.js';
import { AuthService } from './auth.service.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import { AuthResponseDto } from './dto/auth-response.dto.js';
import {
  ConfirmResetPasswordDto,
  ConfirmResetPasswordResponseDto,
  ForgotPasswordDto,
  ForgotPasswordResponseDto,
  VerifyResetCodeDto,
  VerifyResetCodeResponseDto,
} from './dto/forgot-password.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import type { AuthPrincipal } from './jwt-payload.interface.js';
import { PasswordResetService } from './password-reset.service.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly passwordReset: PasswordResetService,
  ) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Activer un établissement et son compte propriétaire',
  })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @ApiOperation({ summary: 'Se connecter et activer un contexte tenant' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  @ApiResponse({ status: 403, description: 'Aucun accès à cet établissement' })
  login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Envoyer un code de nouveau mot de passe si le compte existe',
  })
  @ApiResponse({ status: 200, type: ForgotPasswordResponseDto })
  @ApiResponse({ status: 404, description: 'Aucun compte pour cette adresse' })
  @ApiResponse({ status: 403, description: 'Compte désactivé' })
  forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto> {
    return this.passwordReset.request(dto.email);
  }

  @Post('forgot-password/verify')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Vérifier le code reçu par email' })
  @ApiResponse({ status: 200, type: VerifyResetCodeResponseDto })
  @ApiResponse({ status: 400, description: 'Code incorrect ou expiré' })
  verifyResetCode(
    @Body() dto: VerifyResetCodeDto,
  ): Promise<VerifyResetCodeResponseDto> {
    return this.passwordReset.verify(dto.email, dto.code);
  }

  @Post('forgot-password/confirm')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Enregistrer le nouveau mot de passe' })
  @ApiResponse({ status: 200, type: ConfirmResetPasswordResponseDto })
  @ApiResponse({ status: 400, description: 'Code plus valable' })
  confirmResetPassword(
    @Body() dto: ConfirmResetPasswordDto,
  ): Promise<ConfirmResetPasswordResponseDto> {
    return this.passwordReset.confirm(dto.resetToken, dto.password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Profil et établissements de l'utilisateur connecté",
  })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  @ApiResponse({ status: 401, description: 'Jeton invalide ou manquant' })
  me(@CurrentUser() user: AuthPrincipal): Promise<ProfileResponseDto> {
    return this.authService.getProfile(user.sub);
  }
}
