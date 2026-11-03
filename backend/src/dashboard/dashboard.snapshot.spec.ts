import { describe, expect, it } from 'vitest';
import { buildDashboardSnapshot } from './dashboard.snapshot.js';
import type { DashboardFacts } from './dashboard.facts.js';

const NOW = new Date('2026-10-27T10:00:00.000Z');

function facts(partial: Partial<DashboardFacts> = {}): DashboardFacts {
  return {
    sales: [],
    cash: { balance: '0.000000', status: 'none' },
    stockAlerts: [],
    ...partial,
  };
}

describe('buildDashboardSnapshot', () => {
  it('reste à zéro quand le commerce n’a encore aucune écriture', () => {
    const snapshot = buildDashboardSnapshot({
      currency: 'CDF',
      timezone: 'Africa/Kinshasa',
      now: NOW,
      facts: facts(),
    });

    expect(snapshot.salesToday).toEqual({
      amount: '0.000000',
      changePercent: null,
      saleCount: 0,
    });
    expect(snapshot.cashBalance).toEqual({
      amount: '0.000000',
      status: 'none',
      badge: null,
    });
    expect(snapshot.salesTrend.amount).toBe('0.000000');
    expect(snapshot.salesTrend.changePercent).toBeNull();
    expect(snapshot.salesTrend.days).toHaveLength(7);
    expect(snapshot.salesTrend.days.map((day) => day.label)).toEqual([
      'Mer',
      'Jeu',
      'Ven',
      'Sam',
      'Dim',
      'Lun',
      'Mar',
    ]);
    expect(snapshot.recentActivity).toEqual([]);
  });

  it('calcule la variation du jour, la semaine et l’activité récente', () => {
    const snapshot = buildDashboardSnapshot({
      currency: 'CDF',
      timezone: 'Africa/Kinshasa',
      now: NOW,
      facts: facts({
        sales: [
          {
            number: '1042',
            total: '100.000000',
            postedAt: new Date('2026-10-20T11:00:00.000Z'),
            paymentLabel: 'Espèces',
          },
          {
            number: '1047',
            total: '100.000000',
            postedAt: new Date('2026-10-26T08:00:00.000Z'),
            paymentLabel: 'Espèces',
          },
          {
            number: '1048',
            total: '112.000000',
            postedAt: new Date('2026-10-27T09:00:00.000Z'),
            paymentLabel: 'Espèces',
          },
        ],
        cash: { balance: '180500.000000', status: 'closed' },
        stockAlerts: [{ productName: 'Huile végétale', quantity: 3 }],
      }),
    });

    expect(snapshot.salesToday).toEqual({
      amount: '112.000000',
      changePercent: 12,
      saleCount: 1,
    });
    expect(snapshot.salesTrend.amount).toBe('212.000000');
    expect(snapshot.salesTrend.changePercent).toBe(112);
    expect(snapshot.salesTrend.days.at(-2)).toMatchObject({
      date: '2026-10-26',
      label: 'Lun',
      amount: '100.000000',
    });
    expect(snapshot.salesTrend.days.at(-1)).toMatchObject({
      date: '2026-10-27',
      label: 'Mar',
      amount: '112.000000',
    });
    expect(snapshot.cashBalance.badge).toBe('À jour');
    expect(snapshot.recentActivity.map((item) => item.title)).toEqual([
      'Vente Nº 1048',
      'Vente Nº 1047',
      'Vente Nº 1042',
      'Stock faible',
    ]);
    expect(snapshot.recentActivity[0]).toMatchObject({
      subtitle: 'Il y a 1 h · Espèces',
      amount: '112.000000',
      tone: 'positive',
    });
    expect(snapshot.recentActivity[3]).toMatchObject({
      subtitle: 'Huile végétale · 3 restants',
      amount: null,
      label: 'À vérifier',
      tone: 'warning',
    });
  });
});
