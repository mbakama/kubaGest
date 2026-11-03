import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
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
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { JwtAuthGuard, TenantGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import type { AuthPrincipal } from '../auth/jwt-payload.interface.js';
import { CreateMemberDto } from './dto/create-member.dto.js';
import { TenantMemberDto } from './dto/tenant-member.dto.js';
import { MembershipRole } from './membership-role.enum.js';
import { UsersService } from './users.service.js';
import {
  AvatarStorageService,
  MAX_AVATAR_SIZE,
} from './avatar-storage.service.js';
import { mapUserResponse, UserResponseDto } from './user.mapper.js';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly avatars: AvatarStorageService,
  ) {}

  @Post('me/avatar')
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
  @ApiOperation({ summary: 'Téléverser la photo de profil du compte connecté' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  async uploadAvatar(
    @CurrentUser() principal: AuthPrincipal,
    @UploadedFile()
    file?: { buffer: Buffer; mimetype: string; size: number },
  ): Promise<UserResponseDto> {
    if (!file) throw new BadRequestException('Le fichier image est requis');
    const current = await this.usersService.findById(principal.sub);
    const key = await this.avatars.save(file);
    try {
      const user = await this.usersService.setAvatar(principal.sub, key);
      await this.avatars.remove(current?.avatarKey ?? null);
      return mapUserResponse(user);
    } catch (error) {
      await this.avatars.remove(key);
      throw error;
    }
  }

  @Delete('me/avatar')
  @ApiOperation({ summary: 'Supprimer la photo de profil du compte connecté' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async deleteAvatar(
    @CurrentUser() principal: AuthPrincipal,
  ): Promise<UserResponseDto> {
    const current = await this.usersService.findById(principal.sub);
    const user = await this.usersService.setAvatar(principal.sub, null);
    await this.avatars.remove(current?.avatarKey ?? null);
    return mapUserResponse(user);
  }

  @Get()
  @Roles(MembershipRole.OWNER)
  @ApiOperation({
    summary: "Lister les utilisateurs de l'établissement (propriétaire)",
  })
  @ApiResponse({ status: 200, type: [TenantMemberDto] })
  @ApiResponse({ status: 403, description: 'Rôle propriétaire requis' })
  findAll(@CurrentUser() user: AuthPrincipal): Promise<TenantMemberDto[]> {
    // Le tenant provient du jeton : aucun identifiant client ne fait autorité.
    return this.usersService.listTenantMembers(user.tenantId as string);
  }

  @Post()
  @Roles(MembershipRole.OWNER)
  @ApiOperation({
    summary: 'Créer ou rattacher un utilisateur (caissier, stock)',
  })
  @ApiResponse({ status: 201, type: TenantMemberDto })
  @ApiResponse({
    status: 409,
    description: 'Déjà rattaché à cet établissement',
  })
  create(
    @CurrentUser() user: AuthPrincipal,
    @Body() dto: CreateMemberDto,
  ): Promise<TenantMemberDto> {
    return this.usersService.createMember(
      user.tenantId as string,
      user.sub,
      dto,
    );
  }
}
