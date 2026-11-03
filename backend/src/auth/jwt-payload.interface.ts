import type { MembershipRole } from '../users/membership-role.enum.js';

/**
 * Contenu du JWT. Le contexte tenant vient du jeton, jamais d'un paramètre
 * fourni par le client (cahier des charges §9 et §28.1).
 */
export interface JwtPayload {
  sub: string;
  email: string;
  /** Tenant actif ; absent pour un super administrateur plateforme. */
  tenantId?: string;
  establishmentId?: string;
  role?: MembershipRole;
  isPlatformAdmin: boolean;
}

export type AuthPrincipal = JwtPayload;
