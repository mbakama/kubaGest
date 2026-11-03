import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { AuthPrincipal } from '../jwt-payload.interface.js';

/**
 * Réserve une route au super administrateur plateforme (§3) : gestion des
 * tenants et des abonnements, sans accès implicite aux données métier.
 */
@Injectable()
export class PlatformAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<{ user?: AuthPrincipal }>();

    if (!request.user?.isPlatformAdmin) {
      throw new ForbiddenException(
        'Action réservée au super administrateur plateforme',
      );
    }

    return true;
  }
}
