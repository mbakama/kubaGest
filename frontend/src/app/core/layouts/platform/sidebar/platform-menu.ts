import type { LayoutMenuItem } from '../../layout-menu.model';

/** Données du menu administration plateforme (évolutif, sans toucher au layout). */
export const PLATFORM_MENU: LayoutMenuItem[] = [
  {
    id: 'dashboard',
    label: 'Tableau de bord',
    icon: 'fa-gauge-high',
    link: '/',
  },
  {
    id: 'spaces',
    label: 'Espaces / Entreprises',
    icon: 'fa-building',
    children: [
      {
        id: 'spaces-list',
        label: 'Liste des espaces',
        link: '/espaces',
        disabled: true,
      },
      {
        id: 'spaces-trials',
        label: 'Essais en cours',
        link: '/espaces/essais',
        disabled: true,
      },
    ],
  },
  {
    id: 'users',
    label: 'Utilisateurs',
    icon: 'fa-users',
    disabled: true,
  },
  {
    id: 'roles',
    label: 'Rôles & Permissions',
    icon: 'fa-user-shield',
    disabled: true,
  },
  {
    id: 'subscriptions',
    label: 'Abonnements',
    icon: 'fa-file-lines',
    children: [
      {
        id: 'subscriptions-active',
        label: 'Abonnements actifs',
        link: '/abonnements',
        disabled: true,
      },
      {
        id: 'subscriptions-plans',
        label: 'Formules',
        link: '/abonnements/formules',
        disabled: true,
      },
    ],
  },
  {
    id: 'payments',
    label: 'Paiements',
    icon: 'fa-credit-card',
    disabled: true,
  },
  {
    id: 'activity',
    label: 'Journal d’activité',
    icon: 'fa-clock-rotate-left',
    link: '/journal-activite',
  },
  {
    id: 'settings',
    label: 'Paramètres',
    icon: 'fa-gear',
    disabled: true,
  },
];
