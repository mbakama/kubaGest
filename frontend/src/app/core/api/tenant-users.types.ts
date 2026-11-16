export type TenantMemberRole = 'owner' | 'cashier' | 'stock_manager';
export type UserSex = 'male' | 'female';

export interface TenantMember {
  membershipId: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  sex: UserSex | null;
  phone: string | null;
  avatarKey: string | null;
  role: TenantMemberRole;
  isActive: boolean;
  invitationPending: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTenantMemberResponse extends TenantMember {
  invitationEmailSent: boolean;
  invitationUrl: string;
}

export interface CreateTenantMemberRequest {
  firstName: string;
  lastName: string;
  sex: UserSex;
  phone?: string;
  email: string;
  role: Exclude<TenantMemberRole, 'owner'>;
}

export type MemberPermissionGroup = 'pos' | 'stock';
export type MemberPermissionBadgeTone = 'amber' | 'danger' | 'muted';

export interface MemberPermissionCatalogItem {
  code: string;
  label: string;
  group?: MemberPermissionGroup;
  description?: string;
  badge?: { text: string; tone: MemberPermissionBadgeTone };
}

export interface MemberPermission {
  id: string;
  permissionCode: string;
  allowed: boolean;
  reason: string | null;
}

export interface MemberSession {
  id: string;
  clientType: 'desktop' | 'mobile' | 'web';
  expiresAt: string;
  lastSeenAt: string | null;
  revokedAt: string | null;
  createdAt: string;
}

export interface TenantAuditEntry {
  id: string;
  action: string;
  actionLabel?: string;
  entityType: string;
  entityLabel?: string;
  entityId: string | null;
  actorUserId: string | null;
  actorMembershipId: string | null;
  reason: string | null;
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  occurredAt: string;
}
