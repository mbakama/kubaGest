import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { DataSource } from 'typeorm';
import { assertTenantUsable } from '../../tenants/tenant-access.js';
import { Tenant } from '../../tenants/tenant.entity.js';
import type { AuthPrincipal } from '../jwt-payload.interface.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthPrincipal }>();

    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException("Jeton d'authentification manquant");
    }

    try {
      request.user = await this.jwtService.verifyAsync<AuthPrincipal>(token);
      return true;
    } catch {
      throw new UnauthorizedException(
        "Jeton d'authentification invalide ou expiré",
      );
    }
  }
}

/**
 * Exige un contexte tenant dans le jeton. Protège les routes métier contre un
 * jeton plateforme ou un jeton sans établissement, et refuse tout accès d'un
 * tenant suspendu (y compris avec un jeton encore valide, F07).
 */
@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly dataSource: DataSource) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<{ user?: AuthPrincipal }>();

    const tenantId = request.user?.tenantId;

    if (!tenantId) {
      throw new ForbiddenException(
        'Aucun établissement actif dans le contexte du jeton',
      );
    }

    const tenant = await this.dataSource
      .getRepository(Tenant)
      .findOne({ where: { id: tenantId } });

    // Statut relu en base à chaque requête : une suspension prend effet
    // immédiatement, sans attendre l'expiration du jeton.
    assertTenantUsable(tenant);

    return true;
  }
}
