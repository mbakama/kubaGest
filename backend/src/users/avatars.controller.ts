import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { AvatarStorageService } from './avatar-storage.service.js';
import { UsersService } from './users.service.js';

@ApiTags('users')
@Controller('users')
export class AvatarsController {
  constructor(
    private readonly users: UsersService,
    private readonly avatars: AvatarStorageService,
  ) {}

  @Get(':userId/avatar')
  @ApiOperation({ summary: "Afficher l'avatar public d'un utilisateur" })
  @ApiResponse({ status: 200, description: 'Contenu du fichier image' })
  async getAvatar(
    @Param('userId') userId: string,
    @Res() response: Response,
  ): Promise<void> {
    const user = await this.users.findById(userId);
    if (!user?.avatarKey) throw new NotFoundException('Avatar introuvable');
    const file = await this.avatars.read(user.avatarKey);
    response.setHeader('Content-Type', file.contentType);
    response.setHeader('Cache-Control', 'public, max-age=3600');
    response.send(file.data);
  }
}
