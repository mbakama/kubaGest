# KubaGest — analyse des écarts entre le MLD actuel et la cible V1

## État d’implémentation au 6 novembre 2026

La migration additive `1730400000000-target-v1-foundation` traduit désormais
la fondation du MLD cible V1.1 dans le backend. Elle est enregistrée dans la
configuration de l’application et dans la source de données de la CLI, mais
elle n’a pas été exécutée sur une base PostgreSQL de production.

Elle introduit les entrepôts, le produit physique et son activation locale,
les prix par établissement, fournisseurs et achats, réceptions, lots, CUMP,
transferts, inventaires, dépenses, terminaux autorisés, allocations hors ligne
et synchronisation idempotente. Elle ajoute également les références de
transition aux ventes, lignes de vente, soldes et mouvements de stock.

Les anciennes colonnes et tables restent présentes afin de préserver les API
et données existantes. Les nouvelles références restent nullable là où les
services actuels ne les écrivent pas encore systématiquement. Une seconde
phase sera nécessaire pour adapter les services métier, réconcilier les
données, rendre ces références obligatoires puis retirer le modèle hérité.

L’exécution reste conditionnée à l’audit réel de PostgreSQL, à une sauvegarde
restaurable et à une répétition de la migration sur une copie des données.

## 1. Synthèse

Le socle multi-tenant, l'identité, l'abonnement, le catalogue local, les ventes, la caisse et un stock agrégé existent dans le code. La cible V1 nécessite toutefois une transformation structurelle : passage d'un seul établissement à plusieurs, introduction d'entrepôts, séparation produit physique/catalogue/prix, achats et fournisseurs, CUMP, transferts, inventaires, dépenses, terminaux et synchronisation hors ligne.

La migration doit être additive et progressive. Il ne faut ni réécrire les migrations appliquées, ni supprimer immédiatement les tables de crédit, ni basculer les API avant réconciliation des données.

## 2. Matrice des écarts

| Domaine / table actuelle | Couverture | Action proposée | Justification et dépendances | Risques / impact API |
|---|---|---|---|---|
| `tenants` | Existant | Conserver, compléter si nécessaire | Bonne racine multi-tenant; dépend de tout le modèle | Faible, vérifier devise et statuts déployés |
| `establishments` | Partiel | Modifier | Retirer UQ `(tenant_id)` pour multi-établissements; dépend des portées catalogue/caisse/vente | Élevé : hypothèses « premier établissement » dans services et API |
| `users`, `memberships` | Partiel | Conserver/compléter | Identité globale correcte; droits éventuellement limités par entrepôt | Moyen : nouveaux contrôles d'autorisation |
| `membership_permissions` | Partiel | Compléter | Peut porter les nouvelles permissions, mais pas forcément la portée entrepôt | Moyen |
| Plans/abonnements/auth | Existant | Conserver | Hors du cœur logistique | Faible; confirmer migrations réellement appliquées |
| `audit_logs` | Partiel | Compléter | Base utile, mais audit hors ligne et références d'acteur doivent être systématiques | Moyen : volume, rétention, données sensibles |
| `document_counters` | Partiel | Compléter | Réutilisable pour nouveaux documents | Moyen : ajouter FK/portée/période sans casser numéros |
| `establishment_settings`, taux, alertes | Partiel | Compléter | Paramètres locaux utiles; ajouter décisions entrepôt/hors ligne | Faible à moyen |
| `product_categories` | Existant local | Conserver/admettre portée locale | Compatible avec catalogue par établissement | Faible |
| `products` | Partiel | Scinder/migrer | Mélange identité physique et référencement établissement | Élevé : toutes les FK stock/vente/catalogue |
| `drug_details` | Partiel | Rattacher au produit physique | Propriété intrinsèque partagée | Moyen |
| `product_packagings` | Partiel | Modifier | Conditionnement partageable; prix doit sortir de cette table | Élevé : DTO et calculs de vente |
| `product_barcodes` | Partiel | Modifier | Doit suivre le produit physique/conditionnement | Moyen |
| Prix globaux/locaux | Absent | Créer `product_prices` | Besoin explicite de la cible | Élevé : résolution de prix, cache PWA, snapshots |
| Entrepôts | Absent | Créer `warehouses` | Axe central du stock V1 | Élevé : toute quantité acquiert une localisation |
| Fournisseurs | Absent | Créer | Prérequis achats/réceptions | Moyen |
| Commandes d'achat | Absent | Créer | Cycle d'achat traçable | Élevé : nouveaux services/API/permissions |
| Réceptions | Absent | Créer | Entrée de stock et coût documenté | Élevé : mouvements et CUMP atomiques |
| `stock_balances` | Partiel | Migrer/compléter | Actuellement par établissement/produit, sans entrepôt ni lot/version | Très élevé : réconciliation des quantités |
| `stock_movements` | Partiel | Renforcer | Journal pauvre, sans valeur ni origines complètes | Très élevé : historique antérieur incomplet pour CUMP |
| CUMP / `product_valuations` | Absent | Créer | Exigence cible | Très élevé : coût initial à reconstruire ou saisir |
| Transferts | Absent | Créer | Nécessaire entre entrepôts | Élevé : états transit/réception à décider |
| Inventaires | Absent | Créer | Ajustements contrôlés et auditables | Élevé : concurrence avec ventes |
| `sales`, `sale_items` | Partiel | Compléter | Bon socle documentaire; manque entrepôt, terminal, CUMP/allocations | Élevé : contrat API et historiques |
| `payments` | Partiel | Compléter | Paiement présent; manque taux/équivalent de référence et FK complètes | Moyen à élevé |
| Caisses et sessions | Partiel | Compléter | Structure utile; invariants de clôture et origines à renforcer | Moyen |
| Dépenses | Absent | Créer | Fonction cible caisse | Moyen : journal de caisse et justificatifs |
| Crédit (`customers`, `credit_*`) | Existant mais hors cible | Reporter/geler | V1 exclut le crédit du parcours commercial | Élevé si données existantes; ne pas supprimer |
| Terminaux autorisés | Absent | Créer | Prérequis de confiance hors ligne | Élevé : enrôlement, révocation, secrets |
| Allocations de stock | Absent | Créer | Plafond de vente hors ligne sans stock négatif | Critique : concurrence et récupération |
| Synchronisation/idempotence | Absent | Créer | Empêche doublons et conflits de rejeu | Critique : contrats client/serveur |
| Pièces jointes | Absent | Créer/report ciblé | Utile aux dépenses/achats | Moyen : stockage privé, antivirus, rétention |

## 3. Incohérences et informations à confirmer

### Entre le code et la cible

1. L'unicité `establishments(tenant_id)` interdit le multi-établissement demandé.
2. `products.establishment_id` rend le produit physique non partageable.
3. `product_packagings.sale_price` ne permet ni historique de prix, ni prix global/local.
4. `stock_balances` et `stock_movements` n'ont pas de `warehouse_id`.
5. Aucun coût d'entrée ni CUMP n'est stocké; l'historique actuel ne suffit pas à reconstruire une valorisation fiable.
6. La vente possède un canal `credit` et le dépôt contient un module crédit, alors que la V1 cible exclut ce parcours.
7. Le mode hors ligne n'a pas de terminal autorisé, allocation, idempotence ou journal de synchronisation.

### État réel à confirmer

- Quelles migrations figurent dans la table TypeORM de chaque PostgreSQL déployé ?
- Les environnements ayant utilisé `DB_SYNCHRONIZE=true` contiennent-ils des contraintes différentes ?
- Existe-t-il déjà des données de ventes, crédit, stock ou caisse à préserver ?
- Les colonnes UUID d'acteur correspondent-elles toujours à un membership ou parfois à un user ?
- Les stocks actuels ont-ils un coût disponible dans une source externe permettant l'initialisation du CUMP ?
- Les API clientes utilisent-elles directement les identifiants `products`, `product_packagings` et `establishment_id` ?

## 4. Stratégie de migration progressive

### Phase 0 — Audit préalable sans écriture

1. Sauvegarder et restaurer une copie de chaque base cible.
2. Inventorier migrations appliquées, contraintes, index, volumes et orphelins via PostgreSQL.
3. Comparer le schéma PostgreSQL aux entités TypeORM et au chemin SQL.js.
4. Mesurer les dépendances API/PWA/Flutter sur les identifiants et formes actuelles.
5. Décider les questions bloquantes : entrepôts, allocations, prix, lots, transit, coûts CUMP et crédit.

**Critère de sortie :** cartographie vérifiée, sauvegarde restaurable, décisions fonctionnelles signées.

### Phase 1 — Socle multi-établissements et entrepôts

1. Ajouter `warehouses` et éventuellement `membership_warehouses` sans toucher aux colonnes existantes.
2. Créer un entrepôt central pour chaque tenant et un entrepôt par établissement existant selon la décision retenue.
3. Ajouter des FK nullable `warehouse_id` aux nouvelles projections/documents concernés, puis remplir et valider.
4. Retirer l'unicité tenant/établissement seulement après adaptation des services qui supposent un établissement unique.

**Retour arrière :** les anciennes colonnes restent la source tant que le double-read n'est pas activé.

### Phase 2 — Produit physique, catalogue et prix

1. Créer `physical_products`, `establishment_products` et `product_prices`.
2. Copier chaque `products` actuel vers un produit physique avec table de correspondance stable.
3. Dédupliquer uniquement après règles métier; ne pas fusionner sur le seul nom.
4. Créer le référencement local et convertir `sale_price` en prix daté.
5. Adapter les API en lecture duale, puis en écriture sur le nouveau modèle. Conserver les anciens identifiants/mappings pour les historiques.

**Risque majeur :** SKU identique, produit réellement différent, ou prix conditionnement ambigu.

### Phase 3 — Achats, réceptions et initialisation CUMP

1. Créer fournisseurs, commandes, réceptions, lignes, mouvements valorisés et `product_valuations`.
2. Définir une opération contrôlée de « solde d'ouverture valorisé » par entrepôt/produit.
3. Exiger un coût initial documenté quand l'historique ne permet pas de le reconstruire.
4. Réconcilier quantité et valeur avant activation des sorties au CUMP.

**Interdiction :** inventer un coût zéro silencieux pour un stock existant.

### Phase 4 — Transferts et inventaires

Créer en-têtes/lignes/états, utiliser les mêmes verrous produit-entrepôt et le même journal immuable. Tester ventes, transferts, réceptions et comptages concurrents. Activer d'abord sur un tenant pilote.

### Phase 5 — Ventes, paiements, caisse et dépenses

1. Ajouter à la vente l'entrepôt, le terminal éventuel et les snapshots de CUMP.
2. Compléter paiements/taux/FK et invariants de session.
3. Créer dépenses, catégories et pièces jointes privées.
4. Désactiver le canal crédit pour les nouvelles ventes V1 tout en laissant les anciennes dettes consultables/réglables selon décision.

### Phase 6 — Terminaux et hors ligne

1. Déployer l'enrôlement/révocation des terminaux.
2. Créer allocations et opérations de synchronisation.
3. Introduire l'idempotence avant toute vente hors ligne.
4. Tester répétitions, réordonnancement, terminal révoqué, allocation expirée, perte réseau après commit et deux terminaux sur la dernière quantité.
5. Activer progressivement avec quotas faibles et télémétrie.

### Phase 7 — Bascule et retrait différé

Après plusieurs réconciliations réussies : rendre les nouvelles FK non nulles, ajouter contraintes différables/index, basculer toutes les lectures, puis seulement planifier la dépréciation des anciennes colonnes/tables. Toute suppression fait l'objet d'une migration séparée, d'une sauvegarde et d'une politique de conservation.

## 5. Risques principaux

| Risque | Gravité | Mesure proposée |
|---|---:|---|
| Quantités historiques sans coût fiable | Critique | Solde d'ouverture valorisé approuvé et audité |
| Rupture d'identifiants produit | Critique | Tables de correspondance et conservation des PK historiques |
| Double vente hors ligne | Critique | Allocation ferme, idempotence, verrou/version et tests concurrents |
| Fuite inter-tenant | Critique | FK composites, filtres serveur, tests de références forgées, RLS optionnelle |
| Divergence SQL.js/PostgreSQL | Élevée | Tests d'intégration PostgreSQL obligatoires; ne pas valider les contraintes sur SQLite seul |
| Suppression prématurée du crédit | Élevée | Geler les nouvelles opérations, conserver et migrer les données existantes |
| Hypothèse d'un établissement unique dans le code | Élevée | Audit des services et sélection explicite du contexte |
| Arrondis CUMP et devises | Élevée | Décimaux, taux snapshots, règles signées, tests de résidus |
| Journaux modifiables | Élevée | Privilèges INSERT-only et triggers d'immutabilité |
| Volume synchronisation/audit | Moyen | Index, rétention documentée et partitionnement après mesure |

## 6. Impacts applicatifs attendus

- **CatalogModule :** séparation identité/référencement/prix; nouveaux DTO de contexte établissement.
- **StockModule :** refonte autour de l'entrepôt, mouvements valorisés, CUMP, transferts et inventaires.
- **SalesModule :** entrepôt source, coût snapshot, terminal/allocation et suppression du crédit V1.
- **CashModule :** dépenses, origines complètes et clôture renforcée.
- **Auth/Users :** autorisation des terminaux et éventuellement portée entrepôt.
- **Angular PWA :** principal client d'écriture; gestion explicite du contexte établissement/entrepôt et file hors ligne.
- **Flutter :** endpoints de lecture/supervision; aucune écriture opérationnelle V1 sauf décision ultérieure.
- **API :** versionnement recommandé pour éviter de casser les clients actuels pendant la coexistence.

## 7. Décisions requises avant toute migration

1. Structure exacte établissement/entrepôt et entrepôt central.
2. Modèle de réservation/transfert des allocations hors ligne.
3. Source et méthode d'initialisation du CUMP existant.
4. Règles de prix global/local, promotions, taxes et dates d'effet.
5. Gestion des lots, péremptions et stock en transit.
6. Sort du module crédit et de ses données existantes.
7. Identité des acteurs (`user` ou `membership`) dans tous les journaux.
8. Politique d'arrondi, taux de change, conservation et numérotation réglementaire.
