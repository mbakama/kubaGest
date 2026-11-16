/** Navigation établissement — libellés alignés sur la maquette Stitch (web_dashboard). */
export const TENANT_MENU = [
    {
        id: 'dashboard',
        label: 'Tableau de bord',
        icon: 'fa-gauge-high',
        link: '/',
    },
    {
        id: 'pos',
        label: 'Point de Vente (POS)',
        icon: 'fa-cash-register',
        disabled: true,
    },
    {
        id: 'stock',
        label: 'Stocks & FEFO',
        icon: 'fa-boxes-stacked',
        disabled: true,
    },
    {
        id: 'cash',
        label: 'Clôtures & Caisses',
        icon: 'fa-wallet',
        disabled: true,
    },
    {
        id: 'history',
        label: 'Historique des Transactions',
        icon: 'fa-receipt',
        disabled: true,
    },
    {
        id: 'reports',
        label: 'Rapports & Marges',
        icon: 'fa-chart-line',
        disabled: true,
    },
    {
        id: 'users',
        label: 'Utilisateurs & Rôles',
        icon: 'fa-id-badge',
        link: 'utilisateurs-roles',
        disabled: false,
    },
    {
        id: 'settings',
        label: 'Paramètres',
        icon: 'fa-gear',
        link: 'settings',
        disabled: false,
    },
];
