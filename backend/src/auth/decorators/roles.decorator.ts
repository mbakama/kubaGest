import { SetMetadata } from '@nestjs/common';
import { MembershipRole } from '../../users/membership-role.enum.js';

export const ROLES_KEY = 'roles';

/** Restreint une route aux rôles tenant indiqués (avec RolesGuard). */
export const Roles = (...roles: MembershipRole[]) =>
  SetMetadata(ROLES_KEY, roles);
