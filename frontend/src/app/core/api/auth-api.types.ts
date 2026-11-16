export type ActivityType = 'boutique' | 'alimentation' | 'pharmacie';

export type UserSex = 'male' | 'female';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  sex: UserSex;
  tenantName: string;
  activityType: ActivityType;
  email: string;
  password: string;
  phone?: string;
  currency?: string;
  address?: string;
}

export interface RegisterResponse {
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  tenantId?: string;
  platform?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    sex: UserSex | null;
  };
  context: {
    tenantId: string;
    tenantName: string;
    role: string;
  } | null;
}
