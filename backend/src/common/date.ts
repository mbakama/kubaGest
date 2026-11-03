/** Date `AAAA-MM-JJ` d'un instant, lue dans le fuseau de l'établissement. */
export function dateInZone(timezone: string, date = new Date()): string {
  // `en-CA` rend directement `AAAA-MM-JJ`, le format attendu en base.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/** Période mensuelle d'un document, `AAAA-MM`. */
export function periodInZone(timezone: string, date = new Date()): string {
  return dateInZone(timezone, date).slice(0, 7);
}

export function addDays(date: string, days: number): string {
  const base = new Date(`${date}T00:00:00Z`);
  base.setUTCDate(base.getUTCDate() + days);
  return base.toISOString().slice(0, 10);
}

export function daysBetween(from: string, to: string): number {
  const start = Date.parse(`${from}T00:00:00Z`);
  const end = Date.parse(`${to}T00:00:00Z`);
  return Math.round((end - start) / 86_400_000);
}
