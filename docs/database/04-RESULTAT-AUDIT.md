# KubaGest — résultat de l’audit de la base de données

**Date :** 7 novembre 2026  
**Périmètre :** backend NestJS, entités TypeORM, migrations versionnées et documentation du modèle cible V1.1  
**Statut :** audit statique du dépôt terminé — audit PostgreSQL réel restant à exécuter

## 1. Conclusion

Le dépôt dispose d’un socle PostgreSQL/TypeORM cohérent pour l’identité, le multi-tenant, le catalogue historique, les ventes, la caisse, le stock simplifié et le crédit client.

Le schéma historique ne couvrait toutefois pas complètement le MLD cible V1.1 : plusieurs établissements par tenant, entrepôts, produits physiques partagés, prix par établissement, achats, réceptions, valorisation CUMP, transferts, inventaires et fonctionnement hors ligne étaient absents ou seulement partiellement représentés.

Une migration additive de fondation a donc été préparée :

- `backend/src/database/migrations/1730400000000-target-v1-foundation.ts`

Elle est enregistrée dans la configuration TypeORM de l’application et dans la source de données de la CLI. Elle n’a pas été exécutée sur une base PostgreSQL de production.

## 2. Sources contrôlées

L’audit a porté sur :

- les 32 entités TypeORM présentes avant l’évolution V1 ;
- les 7 migrations historiques enregistrées ;
- les modules NestJS propriétaires des entités ;
- les services d’inscription, catalogue, ventes, stock, caisse et crédit ;
- `docs/database/01-MLD-ACTUEL.md` ;
- `docs/database/02-MLD-CIBLE-V1.md`, version 1.1 ;
- `docs/database/03-ANALYSE-ECARTS.md` ;
- les configurations `typeorm.config.ts` et `data-source.ts` ;
- les tests unitaires et E2E du backend.

Cet audit ne comprend pas d’introspection de `information_schema`, de lecture de la table TypeORM `migrations`, ni de contrôle des données d’une base PostgreSQL déployée.

## 3. État historique constaté

### Éléments existants

- Isolation logique par `tenant_id`.
- Utilisateurs, memberships, rôles et permissions.
- Plans, abonnements, sessions et jetons d’accès.
- Un établissement par tenant dans le modèle historique.
- Catalogue rattaché à l’établissement.
- Conditionnements, codes-barres et informations pharmaceutiques.
- Ventes, lignes de vente et paiements.
- Caisses, sessions et mouvements de caisse.
- Soldes et mouvements de stock simplifiés par établissement.
- Clients, ventes à crédit, règlements et relances.
- Journal d’audit et compteurs de documents.

### Limites identifiées

1. La contrainte `UNIQUE(tenant_id)` sur `establishments` empêchait le multi-établissement.
2. Le produit historique appartenait directement à un établissement et ne représentait pas une identité physique partagée.
3. Le prix était stocké sur le conditionnement, sans historique de validité ni prix propre à chaque établissement.
4. Le stock ne possédait pas de dimension entrepôt.
5. Aucun cycle complet fournisseur, achat et réception n’était modélisé.
6. Aucun CUMP par produit et entrepôt n’était conservé.
7. Les transferts et inventaires n’étaient pas formalisés.
8. Aucun terminal autorisé, allocation hors ligne ou journal de synchronisation idempotent n’existait.
9. Plusieurs colonnes d’acteur ou d’origine n’avaient pas de clé étrangère physique confirmée.
10. Le chemin SQL.js reposait sur la synchronisation TypeORM, alors que PostgreSQL repose sur les migrations, ce qui peut produire des différences.

## 4. Évolution V1.1 préparée

La migration de fondation crée 22 tables :

1. `warehouses`
2. `membership_warehouses`
3. `physical_products`
4. `establishment_products`
5. `product_prices`
6. `suppliers`
7. `purchases`
8. `purchase_items`
9. `product_batches`
10. `goods_receipts`
11. `goods_receipt_items`
12. `product_valuations`
13. `stock_transfers`
14. `stock_transfer_items`
15. `inventory_counts`
16. `inventory_count_items`
17. `expenses`
18. `authorized_terminals`
19. `stock_allocations`
20. `stock_allocation_items`
21. `sync_operations`
22. `sale_line_batch_allocations`

Elle ajoute également :

- `tenants.slug` ;
- le code et les coordonnées des établissements ;
- les références de produit physique dans le catalogue historique ;
- les références d’entrepôt, produit physique, lot et version dans le stock ;
- l’entrepôt et le terminal sur les ventes ;
- le produit physique et le coût sur les lignes de vente ;
- les informations de coût, origine et acteur sur les mouvements de stock ;
- des protections d’immutabilité pour les mouvements de stock et l’audit.

Les anciennes structures sont conservées pendant la transition. Les nouvelles références restent nullable lorsque les services existants ne les alimentent pas encore systématiquement.

## 5. Compatibilité applicative

Le flux d’inscription a été adapté afin de créer automatiquement :

- un code d’établissement ;
- l’entrepôt central unique du tenant ;
- un entrepôt secondaire principal pour le premier établissement.

Les entités TypeORM principales ont été complétées pour les entrepôts, produits physiques, activation locale, prix et colonnes de transition.

Les API historiques restent utilisables. Elles continuent cependant à exploiter majoritairement les tables et identifiants historiques. Le basculement fonctionnel vers les achats, transferts, inventaires, CUMP et opérations hors ligne nécessite encore des services, DTO, permissions et routes dédiés.

## 6. Vérifications exécutées

| Vérification | Résultat |
|---|---|
| Compilation TypeScript (`tsc --noEmit`) | Réussie |
| Build NestJS | Réussi |
| Tests unitaires | 33/33 réussis |
| Tests E2E | 87/87 réussis |
| Lint | Aucune erreur; deux avertissements préexistants |
| Vérification du diff Git | Aucune erreur d’espace ou de patch |
| Exécution de la migration sur PostgreSQL | Non effectuée |

Les avertissements de lint préexistants concernent un import inutilisé dans `sales.service.ts` et une fonction inutilisée dans `password-reset.service.spec.ts`. Ils ne sont pas causés par la migration V1.

## 7. Risques restant ouverts

### Risques critiques

- Absence de validation SQL réelle de la migration sur PostgreSQL 16.
- Absence de sauvegarde et de test de restauration d’une base contenant les données existantes.
- Quantités historiques sans coût d’achat fiable pour initialiser le CUMP.
- Risque de doublon ou de mauvaise fusion lors du passage du produit local au produit physique partagé.
- Services historiques ne renseignant pas encore toutes les nouvelles colonnes V1.
- Règles métier hors ligne encore à implémenter au niveau applicatif.

### Risques élevés

- Divergence entre le schéma SQL.js de test et PostgreSQL.
- Retour arrière difficile après création de plusieurs établissements ou catégories globales.
- Module de crédit encore actif alors que la vente à crédit est hors du parcours commercial V1.
- Absence de tests PostgreSQL sur les verrous, transactions concurrentes, contraintes composites et triggers d’immutabilité.
- Volumétrie future des journaux d’audit, mouvements de stock et synchronisations.

## 8. Contrôles PostgreSQL obligatoires avant application

Avant toute exécution en production :

1. Réaliser une sauvegarde complète et vérifier sa restauration.
2. Exécuter `typeorm migration:show` sur l’environnement cible.
3. Exporter tables, colonnes, contraintes, index, triggers et extensions depuis `pg_catalog` et `information_schema`.
4. Rechercher les références orphelines et incohérences de tenant.
5. Vérifier l’unicité réelle des SKU, codes d’établissement et conditionnements.
6. Mesurer les volumes des tables de stock, ventes, caisse, audit et crédit.
7. Restaurer une copie isolée de la base.
8. Appliquer la migration sur cette copie.
9. Réconcilier le nombre de tenants, établissements, produits, conditionnements, soldes et mouvements avant/après.
10. Tester le rollback avant d’autoriser une fenêtre de déploiement.

## 9. Recette minimale après migration

- Chaque tenant possède exactement un entrepôt central actif.
- Chaque établissement historique possède un entrepôt secondaire.
- Chaque produit historique possède un `physical_product` et une activation locale.
- Chaque conditionnement, code-barres et fiche médicament retrouve son produit physique.
- Les prix historiques sont repris dans `product_prices` avec la bonne devise.
- Chaque solde et mouvement historique retrouve un entrepôt et un produit physique.
- Aucun stock disponible n’est négatif.
- Les références forgées entre tenants sont rejetées.
- Les mouvements de stock et audits ne peuvent pas être modifiés ou supprimés.
- Une nouvelle inscription crée tenant, établissement, entrepôt central et entrepôt secondaire dans une seule transaction.
- Les ventes historiques restent consultables et les tests de régression passent.

## 10. Décision d’audit

**Avis : favorable sous conditions pour poursuivre sur une copie PostgreSQL.**

La structure préparée couvre la fondation du MLD cible V1.1 et préserve le modèle historique pendant la transition. Elle ne doit pas encore être appliquée directement en production. L’autorisation de déploiement dépend de la réussite de l’audit PostgreSQL réel, de la restauration d’une sauvegarde, de la réconciliation des données et des tests de concurrence propres à PostgreSQL.

