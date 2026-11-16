export interface PlatformTenantSubscription {
  plan: string;
  status: string;
  startAt: string;
  endAt: string | null;
}

export interface PlatformTenantSummary {
  id: string;
  name: string;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  subscription: PlatformTenantSubscription | null;
}
