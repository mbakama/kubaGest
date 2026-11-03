/**
 * Montants `numeric(20,6)` du dictionnaire (`money`). Les calculs applicatifs
 * doivent utiliser une bibliothèque décimale : l'API transporte donc les
 * montants sous forme de chaîne décimale, jamais en `Number`.
 */
export const MONEY_PATTERN = /^\d{1,14}(\.\d{1,6})?$/;

/** Normalise une valeur numérique en chaîne décimale (entrée JSON tolérante). */
export function normalizeDecimal(value: unknown): unknown {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value.toString() : value;
  }

  if (typeof value === 'string') {
    return value.trim();
  }

  return value;
}

/** `numeric(7,4)` : taux de taxe en pourcentage. */
export const TAX_RATE_PATTERN = /^\d{1,3}(\.\d{1,4})?$/;

/**
 * Colonnes `numeric(p,s)` : PostgreSQL renvoie une chaîne déjà mise à
 * l'échelle, SQLite (tests) un nombre. On normalise toujours vers une chaîne
 * à échelle fixe, sans passer par un flottant pour les chaînes.
 */
export function numericString(scale: number) {
  return {
    to(value: string | number | null | undefined): string | number | null | undefined {
      return value;
    },
    from(value: string | number | null): string | null {
      if (value === null) {
        return null;
      }

      const raw =
        typeof value === 'number' ? value.toFixed(scale) : value.trim();
      const [integerPart, fractionPart = ''] = raw.split('.');
      const fraction = (fractionPart + '0'.repeat(scale)).slice(0, scale);

      return `${integerPart === '' || integerPart === '-' ? `${integerPart}0` : integerPart}.${fraction}`;
    },
  };
}

