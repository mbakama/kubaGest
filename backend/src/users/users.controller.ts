import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
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
import { CreateMemberResponseDto } from './dto/create-member-response.dto.js';
import { TenantMemberDto } from './dto/tenant-member.dto.js';
import {
  ResetMemberPasswordDto,
  SetMemberPermissionDto,
  UpdateMemberRoleDto,
  UpdateMemberStatusDto,
} from './dto/manage-member.dto.js';
import { MEMBER_PERMISSION_CATALOG } from './member-permissions.js';
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

  @Get('me/sessions')
  @ApiOperation({
    summary: 'Lister les sessions de connexion du compte connecté',
  })
  mySessions(@CurrentUser() principal: AuthPrincipal) {
    return this.usersService.listAuthSessionsForUser(principal.sub);
  }

  @Delete('me/sessions/:sessionId')
  @ApiOperation({
    summary: 'Révoquer une session de connexion du compte connecté',
  })
  revokeMySession(
    @CurrentUser() principal: AuthPrincipal,
    @Param('sessionId') sessionId: string,
  ) {
    return this.usersService.revokeAuthSessionForUser(
      principal.sub,
      sessionId,
      principal.sub,
      principal.tenantId,
    );
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

  @Get('permissions/catalog')
  @Roles(MembershipRole.OWNER)
  permissionCatalog() {
    return MEMBER_PERMISSION_CATALOG;
  }

  @Get(':membershipId')
  @Roles(MembershipRole.OWNER)
  findOne(
    @CurrentUser() user: AuthPrincipal,
    @Param('membershipId') membershipId: string,
  ) {
    return this.usersService.getTenantMember(
      user.tenantId as string,
      membershipId,
    );
  }

  @Patch(':membershipId/role')
  @Roles(MembershipRole.OWNER)
  updateRole(
    @CurrentUser() user: AuthPrincipal,
    @Param('membershipId') membershipId: string,
    @Body() dto: UpdateMemberRoleDto,
  ) {
    return this.usersService.updateMemberRole(
      user.tenantId as string,
      membershipId,
      user.sub,
      dto,
    );
  }

  @Patch(':membershipId/status')
  @Roles(MembershipRole.OWNER)
  updateStatus(
    @CurrentUser() user: AuthPrincipal,
    @Param('membershipId') membershipId: string,
    @Body() dto: UpdateMemberStatusDto,
  ) {
    return this.usersService.updateMemberStatus(
      user.tenantId as string,
      membershipId,
      user.sub,
      dto,
    );
  }

  @Post(':membershipId/reset-password')
  @Roles(MembershipRole.OWNER)
  resetPassword(
    @CurrentUser() user: AuthPrincipal,
    @Param('membershipId') membershipId: string,
    @Body() dto: ResetMemberPasswordDto,
  ) {
    return this.usersService.resetMemberPassword(
      user.tenantId as string,
      membershipId,
      user.sub,
      dto,
    );
  }

  @Get(':membershipId/permissions')
  @Roles(MembershipRole.OWNER)
  permissions(
    @CurrentUser() user: AuthPrincipal,
    @Param('membershipId') membershipId: string,
  ) {
    return this.usersService.listMemberPermissions(
      user.tenantId as string,
      membershipId,
    );
  }

  @Put(':membershipId/permissions/:permissionCode')
  @Roles(MembershipRole.OWNER)
  setPermission(
    @CurrentUser() user: AuthPrincipal,
    @Param('membershipId') membershipId: string,
    @Param('permissionCode') permissionCode: string,
    @Body() dto: SetMemberPermissionDto,
  ) {
    return this.usersService.setMemberPermission(
      user.tenantId as string,
      membershipId,
      permissionCode,
      user.sub,
      dto,
    );
  }

  @Delete(':membershipId/permissions/:permissionCode')
  @Roles(MembershipRole.OWNER)
  removePermission(
    @CurrentUser() user: AuthPrincipal,
    @Param('membershipId') membershipId: string,
    @Param('permissionCode') permissionCode: string,
  ) {
    return this.usersService.removeMemberPermission(
      user.tenantId as string,
      membershipId,
      permissionCode,
      user.sub,
    );
  }

  @Get(':membershipId/sessions')
  @Roles(MembershipRole.OWNER)
  sessions(
    @CurrentUser() user: AuthPrincipal,
    @Param('membershipId') membershipId: string,
  ) {
    return this.usersService.listMemberSessions(
      user.tenantId as string,
      membershipId,
    );
  }

  @Delete(':membershipId/sessions/:sessionId')
  @Roles(MembershipRole.OWNER)
  revokeSession(
    @CurrentUser() user: AuthPrincipal,
    @Param('membershipId') membershipId: string,
    @Param('sessionId') sessionId: string,
  ) {
    return this.usersService.revokeMemberSession(
      user.tenantId as string,
      membershipId,
      sessionId,
      user.sub,
    );
  }

  @Post()
  @Roles(MembershipRole.OWNER)
  @ApiOperation({
    summary: 'Créer ou rattacher un utilisateur (caissier, stock)',
  })
  @ApiResponse({ status: 201, type: CreateMemberResponseDto })
  @ApiResponse({
    status: 409,
    description: 'Déjà rattaché à cet établissement',
  })
  create(
    @CurrentUser() user: AuthPrincipal,
    @Body() dto: CreateMemberDto,
  ): Promise<CreateMemberResponseDto> {
    return this.usersService.createMember(
      user.tenantId as string,
      user.sub,
      dto,
    );
  }
}
