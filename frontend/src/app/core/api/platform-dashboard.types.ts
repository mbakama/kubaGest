import type { PlatformTenantSummary } from './platform-api.types';

export interface PlatformDashboardKpis {
  userCount: number;
  tenantCount: number;
  activeSubscriptions: number;
  monthlyRevenue: { available: boolean; amount?: string; currency?: string } | null;
}

export interface PlatformDashboardPlanSlice {
  plan: string;
  count: number;
}

export interface PlatformDashboardMonthCount {
  period: string;
  count: number;
}

export interface PlatformDashboardActivity {
  id: string;
  kind: string;
  title: string;
  detail: string;
  actorName: string | null;
  actorEmail: string | null;
  tenantId: string | null;
  occurredAt: string;
}

export interface PlatformDashboardResponse {
  generatedAt: string;
  kpis: PlatformDashboardKpis;
  planDistribution: PlatformDashboardPlanSlice[];
  creationsByMonth: PlatformDashboardMonthCount[];
  recentTenants: PlatformTenantSummary[];
  recentActivity: PlatformDashboardActivity[];
}
