/** Vente déjà comptabilisée, lue depuis le journal des tickets. */
export interface DashboardSaleFact {
  number: string;
  /** Montant en devise de référence, chaîne `numeric(20,6)`. */
  total: string;
  postedAt: Date;
  /** Libellé déjà en français : Espèces, Mobile Money, Virement. */
  paymentLabel: string | null;
}

export type CashSessionStatus = 'none' | 'open' | 'closed';

/** Position de caisse dérivée du journal des espèces, pas d'un compteur. */
export interface DashboardCashFact {
  balance: string;
  status: CashSessionStatus;
}

/** Article dont le disponible est sous le seuil. */
export interface DashboardStockAlert {
  productName: string;
  quantity: number;
}

export interface DashboardFacts {
  sales: DashboardSaleFact[];
  cash: DashboardCashFact;
  stockAlerts: DashboardStockAlert[];
}

export const EMPTY_DASHBOARD_FACTS: DashboardFacts = {
  sales: [],
  cash: { balance: '0.000000', status: 'none' },
  stockAlerts: [],
};
