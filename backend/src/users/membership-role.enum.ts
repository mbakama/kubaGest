/**
 * Rôles d'un utilisateur au sein d'un tenant (cahier des charges §3).
 * Le super administrateur plateforme n'est pas un rôle tenant : il est porté
 * par `User.isPlatformAdmin` et n'a aucun accès implicite aux données métier.
 */
export enum MembershipRole {
  OWNER = 'owner',
  CASHIER = 'cashier',
  STOCK_MANAGER = 'stock_manager',
}
