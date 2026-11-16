/**
 * Périmètre d’affichage du journal côté établissement (gérant).
 * Les ventes, stocks, caisse, etc. restent dans leurs propres écrans.
 */
export const TENANT_AUDIT_ACTIONS = [
  'membership.created',
  'membership.invitation.accepted',
  'membership.role.updated',
  'membership.activated',
  'membership.suspended',
  'membership.password.reset',
  'membership.permission.set',
  'membership.permission.removed',
  'auth.session.revoked',
  'establishment.created',
  'warehouse.created',
  'tenant.updated',
] as const;

/**
 * Périmètre du journal plateforme (super administrateur).
 */
export const PLATFORM_AUDIT_ACTIONS = [
  'tenant.registered',
  'tenant.subscription.updated',
  'platform_admin.profile.updated',
] as const;

export type TenantAuditAction = (typeof TENANT_AUDIT_ACTIONS)[number];
export type PlatformAuditAction = (typeof PLATFORM_AUDIT_ACTIONS)[number];

/**
 * Libellés interface (le champ `action` en base/API reste le code technique).
 */
export const AUDIT_ACTION_LABELS: Record<string, string> = {
  'membership.created': 'Collaborateur ajouté',
  'membership.invitation.accepted': 'Invitation acceptée',
  'membership.role.updated': 'Rôle du collaborateur modifié',
  'membership.activated': 'Compte réactivé',
  'membership.suspended': 'Compte suspendu',
  'membership.password.reset': 'Mot de passe réinitialisé',
  'membership.permission.set': 'Dérogation de droit enregistrée',
  'membership.permission.removed': 'Dérogation retirée',
  'auth.session.revoked': 'Session déconnectée',
  'establishment.created': 'Établissement créé',
  'warehouse.created': 'Entrepôt créé',
  'tenant.updated': 'Paramètres de l’établissement modifiés',
  'tenant.registered': 'Nouvel espace créé',
  'tenant.subscription.updated': 'Abonnement modifié',
  'platform_admin.profile.updated': 'Profil administrateur modifié',
};

export const AUDIT_ENTITY_LABELS: Record<string, string> = {
  auth_session: 'Session',
  establishment: 'Établissement',
  membership: 'Utilisateur et droits',
  membership_permission: 'Droit exceptionnel',
  tenant: 'Organisation',
  warehouse: 'Entrepôt',
};

export function resolveAuditActionLabel(actionCode: string): string {
  return AUDIT_ACTION_LABELS[actionCode] ?? 'Action enregistrée';
}

export function resolveAuditEntityLabel(entityType: string): string {
  return AUDIT_ENTITY_LABELS[entityType] ?? 'Élément';
}