import { DOCUMENT, CurrencyPipe, DatePipe, DecimalPipe, isPlatformBrowser, NgClass } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { ChartData, ChartOptions, TooltipItem } from 'chart.js';
import { ChartModule } from 'primeng/chart';
import { ApiService } from '../../core/api/api.service';
import type { TenantDashboardResponse } from '../../core/api/tenant-dashboard.types';
import { AuthSessionService } from '../../core/auth/auth-session.service';

@Component({
  selector: 'app-dashboard',
  imports: [ChartModule, CurrencyPipe, DatePipe, DecimalPipe, NgClass],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly api = inject(ApiService);
  private readonly authSession = inject(AuthSessionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  readonly session = this.authSession.session;
  readonly dashboard = signal<TenantDashboardResponse | null>(null);
  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);
  readonly chartTextColor = signal('#64748b');
  readonly chartBorderColor = signal('rgba(148, 163, 184, 0.18)');

  readonly tenantName = computed(
    () => this.session()?.context?.tenantName ?? 'Votre établissement',
  );
  readonly firstName = computed(() => this.session()?.user.firstName ?? 'Bonjour');
  readonly maxDailySales = computed(() =>
    Math.max(1, ...(this.dashboard()?.salesTrend.days.map((day) => Number(day.amount)) ?? [1])),
  );

  readonly salesChartData = computed((): ChartData<'bar'> => {
    const trend = this.dashboard()?.salesTrend;
    const days = trend?.days ?? [];
    const amounts = days.map((day) => Number(day.amount));
    const peak = Math.max(0, ...amounts);

    return {
      labels: days.map((day) => day.label),
      datasets: [
        {
          label: 'Ventes',
          data: amounts,
          backgroundColor: amounts.map((value) =>
            value > 0 && value === peak
              ? 'rgba(16, 185, 129, 0.92)'
              : 'rgba(16, 185, 129, 0.72)',
          ),
          hoverBackgroundColor: '#059669',
          borderColor: '#10b981',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: 42,
        },
      ],
    };
  });

  readonly salesChartOptions = computed((): ChartOptions<'bar'> => {
    const textColor = this.chartTextColor();
    const gridColor = this.chartBorderColor();
    const currency = this.dashboard()?.currency ?? 'USD';
    const formatAmount = (value: number) =>
      new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }).format(value);

    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 350 },
      plugins: {
        legend: { display: false },
        tooltip: {
          displayColors: false,
          callbacks: {
            label: (context: TooltipItem<'bar'>) =>
              formatAmount(Number(context.raw ?? 0)),
          },
        },
      },
      scales: {
        x: {
          border: { display: false },
          grid: { display: false },
          ticks: { color: textColor, font: { size: 11 } },
        },
        y: {
          beginAtZero: true,
          border: { display: false },
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            callback: (value) => formatAmount(Number(value)),
            maxTicksLimit: 5,
          },
        },
      },
    };
  });

  ngOnInit(): void {
    this.initChartTheme();
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading.set(true);
    this.loadError.set(null);
    this.api
      .getTenantDashboard()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dashboard) => {
          this.dashboard.set(dashboard);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.loadError.set('Les données du tableau de bord sont momentanément indisponibles.');
        },
      });
  }

  private initChartTheme(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const style = getComputedStyle(this.document.documentElement);
    const value = (token: string, fallback: string) =>
      style.getPropertyValue(token).trim() || fallback;
    this.chartTextColor.set(value('--color-text-muted', '#64748b'));
    this.chartBorderColor.set(value('--color-outline-variant', 'rgba(148, 163, 184, 0.18)'));
  }

  /** Barre de progression décorative sous les KPI (maquette Stitch). */
  kpiMeter(amount: string, cap: number): number {
    const value = Number(amount);
    if (value <= 0 || cap <= 0) {
      return 8;
    }
    return Math.min(100, Math.max(12, Math.round((value / cap) * 100)));
  }

  alertsProgress(count: number): number {
    return count > 0 ? Math.min(100, count * 20) : 8;
  }

  activityIcon(kind: 'sale' | 'stock'): string {
    return kind === 'sale' ? 'fa-receipt' : 'fa-boxes-stacked';
  }
}
