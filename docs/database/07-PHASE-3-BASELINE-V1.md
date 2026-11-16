# KubaGest — phase 3 : baseline PostgreSQL V1.1

**Date :** 7 novembre 2026  
**Statut :** baseline créée et enregistrée; exécution PostgreSQL DEV en attente

## Résultat

La configuration TypeORM n'enregistre désormais qu'une migration :

- `V1Baseline1800000000000`
- fichier : `backend/src/database/migrations/1800000000000-v1-baseline.ts`

Une base DEV vierge verra donc une seule entrée dans la table TypeORM `migrations`.

## Construction de la baseline

Les anciennes migrations sont temporairement appelées comme composants internes de construction, puis une étape de normalisation retire immédiatement les structures de compatibilité. Elles ne sont plus enregistrées individuellement par TypeORM.

Cette organisation transitoire permet de vérifier la baseline avant de supprimer physiquement les anciens fichiers. Ils seront intégrés directement puis retirés à la fin de la phase 4, lorsque les services n'importeront plus les entités historiques.

## Nettoyage produit par la baseline

- Catégories tenant-scoped, sans `establishment_id`.
- Suppression des colonnes `legacy_product_id`.
- Conditionnements partagés, sans établissement ni prix.
- Codes-barres et informations médicament liés au produit physique.
- Soldes et mouvements de stock exclusivement liés à l'entrepôt et au produit physique.
- Lignes de vente exclusivement liées au produit physique.
- Entrepôt obligatoire sur une vente.
- Suppression finale de la table historique `products`.

## Configuration

Les deux chemins TypeORM utilisent la même baseline :

- `backend/src/database/typeorm.config.ts`
- `backend/src/database/data-source.ts`

PostgreSQL continue d'utiliser les migrations. `synchronize: true` n'est pas utilisé comme mécanisme de migration PostgreSQL.

## Vérifications

| Contrôle | Résultat |
|---|---|
| TypeScript | Réussi |
| Build NestJS | Réussi |
| Tests unitaires | 33/33 |
| Tests E2E actuels | 87/87 |
| Migration enregistrée par l'application | Baseline unique |
| Migration enregistrée par la CLI | Baseline unique |
| Exécution sur PostgreSQL DEV vierge | En attente |

Les tests actuels utilisent SQL.js et valident la non-régression applicative, pas les contraintes propres à PostgreSQL.

## Condition avant exécution

La baseline ne doit être exécutée qu'après identification explicite de la connexion comme DEV. La phase 4 doit d'abord adapter les services au schéma final, notamment parce que `sales.warehouse_id` devient obligatoire et que les anciennes colonnes produit/stock sont supprimées.

