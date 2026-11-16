import type { PlatformDashboardKpis } from './platform-dashboard.types';

export type PlatformAdminProfileResponse = {
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    avatar: string | null;
    createdAt: string;
  };
  identity: {
    displayId: string;
    roleLabel: string;
    status: 'active' | 'inactive';
    memberSince: string;
    managedSpacesCount: number;
  };
  personal: {
    fullName: string;
    roleLabel: string;
    email: string;
    organization: string;
    phone: string | null;
    location: string | null;
  };
  accountSummary: PlatformDashboardKpis;
  security: {
    passwordLastChangedAt: string | null;
    twoFactor: { available: boolean; enabled: boolean };
    recoveryEmail: string;
  };
};

export type UpdatePlatformAdminProfileRequest = {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
};
