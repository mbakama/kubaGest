import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
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
import type { ChartData, ChartOptions } from 'chart.js';
import { ChartModule } from 'primeng/chart';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/api/api.service';
import type {
  PlatformDashboardActivity,
  PlatformDashboardResponse,
} from '../../../core/api/platform-dashboard.types';
import type { PlatformTenantSummary } from '../../../core/api/platform-api.types';

interface PlanSlice {
  plan: string;
  count: number;
}

interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  actor: string;
  actorInitials: string;
  occurredAt: string;
  when: string;
  icon: string;
}

const ACTIVITY_ICONS: Record<string, string> = {
  'tenant.registered': 'fa-building',
  'tenant.subscription.updated': 'fa-file-lines',
};

@Component({
  selector: 'app-platform-dashboard',
  imports: [ChartModule, RouterLink],
  templateUrl: './platform-dashboard.html',
  styleUrls: ['./platform-dashboard.scss'],
})
export class PlatformDashboard implements OnInit {
  private readonly api = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);
  readonly dashboard = signal<PlatformDashboardResponse | null>(null);
  readonly polarAreaPalette = signal(['#2563eb', '#0284c7', '#7c3aed', '#f59e0b', '#ec4899']);
  readonly chartTextColor = signal('#64748b');
  readonly chartBorderColor = signal('rgba(148, 163, 184, 0.25)');

  readonly userCount = computed(() => this.dashboard()?.kpis.userCount ?? 0);
  readonly spaceCount = computed(() => this.dashboard()?.kpis.tenantCount ?? 0);
  readonly activeSubscriptions = computed(() => this.dashboard()?.kpis.activeSubscriptions ?? 0);

  readonly recentTenants = computed(
    () => this.dashboard()?.recentTenants ?? ([] as PlatformTenantSummary[]),
  );

  readonly planDistribution = computed((): PlanSlice[] => {
    return this.dashboard()?.planDistribution ?? [];
  });

  readonly polarAreaData = computed((): ChartData<'polarArea'> => {
    const slices = this.planDistribution();
    const palette = this.polarAreaPalette();
    return {
      labels: slices.map((slice) => slice.plan),
      datasets: [
        {
          label: 'Espaces par formule',
          data: slices.map((slice) => slice.count),
          backgroundColor: slices.map((_, index) => palette[index % palette.length]),
          borderColor: this.chartBorderColor(),
          borderWidth: 2,
        },
      ],
    };
  });

  readonly polarAreaOptions = computed((): ChartOptions<'polarArea'> => {
    const textColor = this.chartTextColor();
    const borderColor = this.chartBorderColor();
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 350 },
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: textColor,
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 16,
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const count = Number(context.raw ?? 0);
              return ` ${context.label}: ${count} espace${count > 1 ? 's' : ''}`;
            },
          },
        },
      },
      scales: {
        r: {
          beginAtZero: true,
          grid: { color: borderColor },
          angleLines: { color: borderColor },
          ticks: { display: false, precision: 0 },
          pointLabels: { display: false, color: textColor },
        },
      },
    };
  });

  readonly creationChartData = computed((): ChartData<'bar'> => {
    const rows = this.dashboard()?.creationsByMonth ?? [];
    const labels = rows.map((item) => {
      const [year, month] = item.period.split('-').map(Number);
      return new Date(year, month - 1, 1).toLocaleDateString('fr-FR', {
        month: 'short',
      });
    });

    return {
      labels,
      datasets: [
        {
          label: 'Espaces créés',
          data: rows.map((item) => item.count),
          backgroundColor: 'rgba(37, 99, 235, 0.78)',
          hoverBackgroundColor: '#1d4ed8',
          borderColor: '#2563eb',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: 42,
        },
      ],
    };
  });

  readonly creationChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 350 },
    plugins: {
      legend: { display: false },
      tooltip: {
        displayColors: false,
        callbacks: {
          label: (context) => {
            const count = Number(context.raw ?? 0);
            return `${count} espace${count > 1 ? 's' : ''} créé${count > 1 ? 's' : ''}`;
          },
        },
      },
    },
    scales: {
      x: {
        border: { display: false },
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: 'rgba(148, 163, 184, 0.18)' },
        ticks: { color: '#64748b', precision: 0, stepSize: 1 },
      },
    },
  };

  readonly activityFeed = computed((): ActivityItem[] => {
    const rows = this.dashboard()?.recentActivity ?? [];
    return rows.map((item) => this.toActivityItem(item));
  });

  ngOnInit(): void {
    this.initChartTheme();
    this.api
      .getPlatformDashboard()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (body) => {
          this.dashboard.set(body);
          this.loading.set(false);
        },
        error: (err: unknown) => {
          this.loading.set(false);
          this.loadError.set(this.readError(err));
        },
      });
  }

  private initChartTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const style = getComputedStyle(this.document.documentElement);
    const value = (token: string, fallback: string) =>
      style.getPropertyValue(token).trim() || fallback;
    this.chartTextColor.set(value('--p-text-color', '#64748b'));
    this.chartBorderColor.set(value('--p-content-border-color', 'rgba(148, 163, 184, 0.25)'));
    this.polarAreaPalette.set([
      value('--color-primary', '#2563eb'),
      value('--p-cyan-500', '#0284c7'),
      value('--p-purple-500', '#7c3aed'),
      value('--p-orange-500', '#f59e0b'),
      value('--p-pink-500', '#ec4899'),
    ]);
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  private toActivityItem(item: PlatformDashboardActivity): ActivityItem {
    const actor = item.actorName ?? 'Système';
    return {
      id: item.id,
      title: item.title,
      detail: item.detail,
      actor,
      actorInitials: actor
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase(),
      occurredAt: this.formatDateTime(item.occurredAt),
      when: this.formatRelative(item.occurredAt),
      icon: ACTIVITY_ICONS[item.kind] ?? 'fa-circle-info',
    };
  }

  private formatDateTime(iso: string): string {
    return new Date(iso).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private formatRelative(iso: string): string {
    const diffMs = Date.now() - Date.parse(iso);
    const hours = Math.floor(diffMs / 3_600_000);
    if (hours < 1) {
      return 'À l’instant';
    }
    if (hours < 48) {
      return `Il y a ${hours} h`;
    }
    const days = Math.floor(hours / 24);
    return `Il y a ${days} j`;
  }

  private readError(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 0) {
        return 'Serveur inaccessible.';
      }
      if (err.status === 403) {
        return 'Accès plateforme refusé.';
      }
      const message = err.error?.message;
      if (typeof message === 'string') {
        return message;
      }
    }
    return 'Impossible de charger le tableau de bord.';
  }
}
