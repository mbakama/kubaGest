import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { PlatformAdminGuard } from '../../auth/guards/platform-admin.guard.js';
import type { AuthPrincipal } from '../../auth/jwt-payload.interface.js';
import {
  AvatarStorageService,
  MAX_AVATAR_SIZE,
} from '../../users/avatar-storage.service.js';
import { UsersService } from '../../users/users.service.js';
import { PlatformAdminProfileResponseDto } from '../dto/platform-admin-profile-response.dto.js';
import { UpdatePlatformAdminProfileDto } from '../dto/update-platform-admin-profile.dto.js';
import { PlatformProfileService } from './platform-profile.service.js';

@ApiTags('platform')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PlatformAdminGuard)
@Controller('platform/profile')
export class PlatformProfileController {
  constructor(
    private readonly profile: PlatformProfileService,
    private readonly usersService: UsersService,
    private readonly avatars: AvatarStorageService,
  ) {}

  @Get()
  @ApiOperation({
    summary:
      'Profil du super administrateur : identité, coordonnées, résumé et sécurité',
  })
  @ApiResponse({ status: 200, type: PlatformAdminProfileResponseDto })
  @ApiResponse({ status: 403, description: 'Super administrateur requis' })
  @ApiResponse({ status: 404, description: 'Compte administrateur introuvable' })
  me(
    @CurrentUser() principal: AuthPrincipal,
  ): Promise<PlatformAdminProfileResponseDto> {
    return this.profile.getAdminProfile(principal.sub);
  }

  @Patch()
  @ApiOperation({
    summary:
      'Mettre à jour les coordonnées personnelles du super administrateur',
  })
  @ApiResponse({ status: 200, type: PlatformAdminProfileResponseDto })
  @ApiResponse({ status: 400, description: 'Corps de requête vide ou invalide' })
  @ApiResponse({ status: 403, description: 'Super administrateur requis' })
  updateMe(
    @CurrentUser() principal: AuthPrincipal,
    @Body() dto: UpdatePlatformAdminProfileDto,
  ): Promise<PlatformAdminProfileResponseDto> {
    return this.profile.updateAdminProfile(principal.sub, dto);
  }

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MAX_AVATAR_SIZE } }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({
    summary: 'Téléverser la photo de profil du super administrateur',
  })
  @ApiResponse({ status: 201, type: PlatformAdminProfileResponseDto })
  async uploadAvatar(
    @CurrentUser() principal: AuthPrincipal,
    @UploadedFile()
    file?: { buffer: Buffer; mimetype: string; size: number },
  ): Promise<PlatformAdminProfileResponseDto> {
    if (!file) throw new BadRequestException('Le fichier image est requis');
    const current = await this.usersService.findById(principal.sub);
    const key = await this.avatars.save(file);
    try {
      await this.usersService.setAvatar(principal.sub, key);
      await this.avatars.remove(current?.avatarKey ?? null);
      return this.profile.getAdminProfile(principal.sub);
    } catch (error) {
      await this.avatars.remove(key);
      throw error;
    }
  }

  @Delete('avatar')
  @ApiOperation({
    summary: 'Supprimer la photo de profil du super administrateur',
  })
  @ApiResponse({ status: 200, type: PlatformAdminProfileResponseDto })
  async deleteAvatar(
    @CurrentUser() principal: AuthPrincipal,
  ): Promise<PlatformAdminProfileResponseDto> {
    const current = await this.usersService.findById(principal.sub);
    await this.usersService.setAvatar(principal.sub, null);
    await this.avatars.remove(current?.avatarKey ?? null);
    return this.profile.getAdminProfile(principal.sub);
  }
}
