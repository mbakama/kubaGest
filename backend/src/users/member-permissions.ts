import type { MembershipRole } from './membership-role.enum.js';

export type MemberPermissionGroup = 'pos' | 'stock';

export type MemberPermissionBadgeTone = 'amber' | 'danger' | 'muted';

export type MemberPermissionCatalogEntry = {
  code: string;
  label: string;
  group: MemberPermissionGroup;
  description: string;
  badge?: { text: string; tone: MemberPermissionBadgeTone };
};

export const MEMBER_PERMISSION_CATALOG = [
  {
    code: 'discount.exceptional',
    label: 'Appliquer des remises commerciales directes',
    group: 'pos',
    description:
      'Remise au-delà du plafond habituel en caisse. Toute exception est tracée dans le journal.',
    badge: { text: 'Plafond magasin', tone: 'amber' },
  },
  {
    code: 'sale.cancel',
    label: 'Annuler des tickets de vente',
    group: 'pos',
    description: 'Annulation d’une vente déjà enregistrée, avec motif obligatoire.',
    badge: { text: 'Validation superviseur', tone: 'danger' },
  },
  {
    code: 'sale.refund',
    label: 'Effectuer des remboursements',
    group: 'pos',
    description: 'Remboursement client après vente validée.',
    badge: { text: 'Validation superviseur', tone: 'danger' },
  },
  {
    code: 'stock.adjust',
    label: 'Ajuster manuellement les écarts d’inventaire ou casses',
    group: 'stock',
    description: 'Correction de quantités en stock (entrée ou sortie) avec motif enregistré.',
  },
  {
    code: 'quarantine.release',
    label: 'Libérer un lot en quarantaine qualité',
    group: 'stock',
    description: 'Sortie d’un lot bloqué après contrôle qualité.',
  },
] as const satisfies readonly MemberPermissionCatalogEntry[];

export const MEMBER_PERMISSION_CODES = MEMBER_PERMISSION_CATALOG.map(
  (permission) => permission.code,
);

type PermissionCode = (typeof MEMBER_PERMISSION_CATALOG)[number]['code'];

const allAllowed = Object.fromEntries(
  MEMBER_PERMISSION_CODES.map((code) => [code, true]),
) as Record<PermissionCode, boolean>;

const allDenied = Object.fromEntries(
  MEMBER_PERMISSION_CODES.map((code) => [code, false]),
) as Record<PermissionCode, boolean>;

/** Droits effectifs lorsqu’aucune dérogation n’est enregistrée pour le membership. */
export const MEMBER_PERMISSION_ROLE_DEFAULTS: Record<
  MembershipRole,
  Record<PermissionCode, boolean>
> = {
  owner: allAllowed,
  cashier: { ...allDenied },
  stock_manager: {
    ...allDenied,
    'stock.adjust': true,
    'quarantine.release': true,
  },
};