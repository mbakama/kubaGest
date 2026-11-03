/**
 * Colonnes `bigint` (quantités) : PostgreSQL et SQLite les renvoient sous des
 * formes différentes (chaîne ou nombre). L'API expose toujours un nombre, les
 * entrées étant bornées à `Number.MAX_SAFE_INTEGER` par validation.
 */
export const bigintNumber = {
  to(value: number | null | undefined): number | null | undefined {
    return value;
  },
  from(value: string | number | null): number | null {
    return value === null ? null : Number(value);
  },
};
