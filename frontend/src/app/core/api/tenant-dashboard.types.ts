export interface TenantDashboardDay {
  date: string;
  label: string;
  amount: string;
}

export interface TenantDashboardActivity {
  kind: 'sale' | 'stock';
  title: string;
  subtitle: string;
  amount: string | null;
  label: string | null;
  tone: 'positive' | 'warning';
}

export interface TenantDashboardResponse {
  currency: string;
  timezone: string;
  asOf: string;
  salesToday: { amount: string; changePercent: number | null; saleCount: number };
  cashBalance: { amount: string; status: 'none' | 'open' | 'closed'; badge: string | null };
  salesTrend: { amount: string; changePercent: number | null; days: TenantDashboardDay[] };
  recentActivity: TenantDashboardActivity[];
}
