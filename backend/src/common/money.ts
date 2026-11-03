/**
 * Arithmétique des montants `numeric(20,6)`.
 *
 * L'API transporte les montants en chaîne décimale ; les calculs passent par
 * des entiers (6 décimales) pour ne jamais introduire d'erreur de flottant.
 */
export const MONEY_SCALE = 6n;
const FACTOR = 10n ** MONEY_SCALE;

/** Convertit un montant en unités entières (10^-6). */
export function toUnits(value: string | number): bigint {
  const raw =
    typeof value === 'number' ? value.toFixed(Number(MONEY_SCALE)) : value.trim();
  const [whole = '0', fraction = ''] = raw.split('.');
  const padded = (fraction + '0'.repeat(Number(MONEY_SCALE))).slice(
    0,
    Number(MONEY_SCALE),
  );
  return BigInt(whole || '0') * FACTOR + BigInt(padded || '0');
}

/** Rend la forme décimale à 6 décimales attendue par l'API. */
export function fromUnits(units: bigint): string {
  const negative = units < 0n;
  const absolute = negative ? -units : units;
  const whole = absolute / FACTOR;
  const fraction = (absolute % FACTOR)
    .toString()
    .padStart(Number(MONEY_SCALE), '0');
  return `${negative ? '-' : ''}${whole}.${fraction}`;
}

export function addMoney(...values: Array<string | number>): string {
  return fromUnits(
    values.reduce<bigint>((sum, value) => sum + toUnits(value), 0n),
  );
}

export function subtractMoney(left: string | number, right: string | number): string {
  return fromUnits(toUnits(left) - toUnits(right));
}

export function multiplyMoney(
  value: string | number,
  quantity: number | bigint,
): string {
  return fromUnits(toUnits(value) * BigInt(quantity));
}

export function isZero(value: string | number): boolean {
  return toUnits(value) === 0n;
}

export function greaterThan(
  left: string | number,
  right: string | number,
): boolean {
  return toUnits(left) > toUnits(right);
}

/**
 * Applique un taux en pourcentage, arrondi au plus proche (demi vers le haut),
 * à six décimales.
 */
export function applyRate(value: string | number, percent: string | number): string {
  const base = toUnits(value);
  const rate = toUnits(percent);
  const denominator = 100n * FACTOR;
  const numerator = base * rate;
  const rounded = (numerator * 2n + denominator) / (denominator * 2n);
  return fromUnits(rounded);
}
