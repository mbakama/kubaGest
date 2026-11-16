/**
 * Modèle de menu latéral (inspiré eRecettes `MenuItem` / `subItems`).
 * Les données vivent dans `*-menu.ts`, le rendu dans `*-sidebar`.
 */
export interface LayoutMenuItem {
  id: string;
  label: string;
  icon?: string;
  /** Route Angular ; absent = groupe ou entrée non cliquable */
  link?: string;
  disabled?: boolean;
  /** Libellé de section (pas de lien) */
  isTitle?: boolean;
  badge?: string;
  children?: LayoutMenuItem[];
}
