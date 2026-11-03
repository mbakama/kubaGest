import type {
  CashSessionStatus,
  DashboardFacts,
  DashboardSaleFact,
  DashboardStockAlert,
} from './dashboard.facts.js';

export interface DashboardDay {
  date: string;
  label: string;
  amount: string;
}

export interface DashboardActivity {
  kind: 'sale' | 'stock';
  title: string;
  subtitle: string;
  amount: string | null;
  label: string | null;
  tone: 'positive' | 'warning';
}

export interface DashboardSnapshot {
  currency: string;
  timezone: string;
  asOf: string;
  salesToday: {
    amount: string;
    changePercent: number | null;
    saleCount: number;
  };
  cashBalance: {
    amount: string;
    status: CashSessionStatus;
    badge: string | null;
  };
  salesTrend: {
    amount: string;
    changePercent: number | null;
    days: DashboardDay[];
  };
  recentActivity: DashboardActivity[];
}

const WEEKDAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'] as const;
const SCALE = 1_000_000n;

interface CivilDate {
  y: number;
  m: number;
  d: number;
}

/**
 * Agrège l'accueil à partir des faits déjà lus (ventes, caisse, stock).
 * Aucun montant n'est inventé : sans écriture, les totaux valent zéro et
 * la variation reste absente.
 */
export function buildDashboardSnapshot(input: {
  currency: string;
  timezone: string;
  now: Date;
  facts: DashboardFacts;
}): DashboardSnapshot {
  const today = zonedDate(input.now, input.timezone);
  const yesterday = addDays(today, -1);
  const week = range(addDays(today, -6), today);
  const previousWeek = range(addDays(today, -13), addDays(today, -7));

  const dated = input.facts.sales.map((sale) => ({
    sale,
    date: zonedDate(sale.postedAt, input.timezone),
  }));

  const todaySales = dated.filter((entry) => sameDate(entry.date, today));
  const yesterdayTotal = sum(
    dated
      .filter((entry) => sameDate(entry.date, yesterday))
      .map((entry) => entry.sale.total),
  );
  const todayTotal = sum(todaySales.map((entry) => entry.sale.total));
  const weekTotal = sum(inRange(dated, week).map((entry) => entry.sale.total));
  const previousWeekTotal = sum(
    inRange(dated, previousWeek).map((entry) => entry.sale.total),
  );

  const byDay = new Map<number, bigint>();
  for (const entry of inRange(dated, week)) {
    const key = dateKey(entry.date);
    byDay.set(key, (byDay.get(key) ?? 0n) + minor(entry.sale.total));
  }

  return {
    currency: input.currency,
    timezone: input.timezone,
    asOf: input.now.toISOString(),
    salesToday: {
      amount: formatMinor(todayTotal),
      changePercent: changePercent(todayTotal, yesterdayTotal),
      saleCount: todaySales.length,
    },
    cashBalance: {
      amount: formatMinor(minor(input.facts.cash.balance)),
      status: input.facts.cash.status,
      badge: cashBadge(input.facts.cash.status),
    },
    salesTrend: {
      amount: formatMinor(weekTotal),
      changePercent: changePercent(weekTotal, previousWeekTotal),
      days: week.map((date) => ({
        date: isoDate(date),
        label: WEEKDAYS[weekday(date)],
        amount: formatMinor(byDay.get(dateKey(date)) ?? 0n),
      })),
    },
    recentActivity: [
      ...recentSales(dated, input.now),
      ...input.facts.stockAlerts.slice(0, 3).map(stockActivity),
    ].slice(0, 6),
  };
}

function recentSales(
  dated: { sale: DashboardSaleFact; date: CivilDate }[],
  now: Date,
): DashboardActivity[] {
  return [...dated]
    .sort((a, b) => b.sale.postedAt.getTime() - a.sale.postedAt.getTime())
    .slice(0, 4)
    .map(({ sale }) => ({
      kind: 'sale' as const,
      title: sale.number.startsWith('Vente')
        ? sale.number
        : `Vente Nº ${sale.number}`,
      subtitle: sale.paymentLabel
        ? `${relativeTime(sale.postedAt, now)} · ${sale.paymentLabel}`
        : relativeTime(sale.postedAt, now),
      amount: formatMinor(minor(sale.total)),
      label: null,
      tone: 'positive' as const,
    }));
}

function stockActivity(alert: DashboardStockAlert): DashboardActivity {
  const quantity = Number.isInteger(alert.quantity)
    ? String(alert.quantity)
    : String(alert.quantity);
  const restants = alert.quantity === 1 ? '1 restant' : `${quantity} restants`;

  return {
    kind: 'stock',
    title: 'Stock faible',
    subtitle: `${alert.productName} · ${restants}`,
    amount: null,
    label: 'À vérifier',
    tone: 'warning',
  };
}

function cashBadge(status: CashSessionStatus): string | null {
  switch (status) {
    case 'open':
      return 'Ouverte';
    case 'closed':
      return 'À jour';
    default:
      return null;
  }
}

function relativeTime(from: Date, to: Date): string {
  const minutes = Math.max(
    0,
    Math.floor((to.getTime() - from.getTime()) / 60_000),
  );
  if (minutes < 1) return 'À l’instant';
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours} h`;
  return `Il y a ${Math.floor(hours / 24)} j`;
}

function changePercent(current: bigint, previous: bigint): number | null {
  if (previous <= 0n) return null;
  const negative = current < previous;
  const delta = negative ? previous - current : current - previous;
  const tenths = (delta * 1000n + previous / 2n) / previous;
  const value = Number(tenths) / 10;
  return negative ? -value : value;
}

function sum(amounts: string[]): bigint {
  return amounts.reduce((total, amount) => total + minor(amount), 0n);
}

function minor(amount: string): bigint {
  const negative = amount.trim().startsWith('-');
  const [wholeRaw, fractionRaw = ''] = amount.trim().replace('-', '').split('.');
  const whole = wholeRaw === '' ? '0' : wholeRaw;
  const fraction = `${fractionRaw}000000`.slice(0, 6);
  const value = BigInt(whole) * SCALE + BigInt(fraction);
  return negative ? -value : value;
}

function formatMinor(value: bigint): string {
  const negative = value < 0n;
  const absolute = negative ? -value : value;
  const whole = absolute / SCALE;
  const fraction = (absolute % SCALE).toString().padStart(6, '0');
  return `${negative ? '-' : ''}${whole.toString()}.${fraction}`;
}

function zonedDate(instant: Date, timeZone: string): CivilDate {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(instant);
  const read = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);

  return { y: read('year'), m: read('month'), d: read('day') };
}

function addDays(date: CivilDate, days: number): CivilDate {
  const shifted = new Date(Date.UTC(date.y, date.m - 1, date.d + days));
  return {
    y: shifted.getUTCFullYear(),
    m: shifted.getUTCMonth() + 1,
    d: shifted.getUTCDate(),
  };
}

function range(start: CivilDate, end: CivilDate): CivilDate[] {
  const dates: CivilDate[] = [];
  let cursor = start;
  while (dateKey(cursor) <= dateKey(end)) {
    dates.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return dates;
}

function inRange<T extends { date: CivilDate }>(
  entries: T[],
  dates: CivilDate[],
): T[] {
  const keys = new Set(dates.map(dateKey));
  return entries.filter((entry) => keys.has(dateKey(entry.date)));
}

function sameDate(left: CivilDate, right: CivilDate): boolean {
  return dateKey(left) === dateKey(right);
}

function dateKey(date: CivilDate): number {
  return date.y * 10_000 + date.m * 100 + date.d;
}

function isoDate(date: CivilDate): string {
  const month = String(date.m).padStart(2, '0');
  const day = String(date.d).padStart(2, '0');
  return `${date.y}-${month}-${day}`;
}

function weekday(date: CivilDate): number {
  return new Date(Date.UTC(date.y, date.m - 1, date.d)).getUTCDay();
}
