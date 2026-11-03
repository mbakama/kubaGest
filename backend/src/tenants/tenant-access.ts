import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TenantStatus } from './tenant.enums.js';
import type { Tenant } from './tenant.entity.js';

/**
 * Règle d'accès liée au statut de l'abonnement : un tenant suspendu ne peut
 * plus rien faire (aucune route métier, aucune connexion). La réactivation
 * reste possible côté plateforme (§3).
 */
export function assertTenantUsable(
  tenant: Pick<Tenant, 'status'> | null | undefined,
): void {
  if (!tenant) {
    throw new NotFoundException('Établissement introuvable');
  }

  if (tenant.status === TenantStatus.SUSPENDED) {
    throw new ForbiddenException(
      'Cet établissement est suspendu : contactez le support Kubagest',
    );
  }
}
