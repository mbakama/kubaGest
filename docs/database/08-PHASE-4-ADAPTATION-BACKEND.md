# KubaGest — phase 4 : adaptation du backend

**Date :** 7 novembre 2026  
**Statut :** en cours — socle catalogue/stock/vente adapté

## Sous-phase 4.1 terminée — organisation multi-établissements

Le backend expose désormais les opérations nécessaires au nouveau socle :

- création d'un établissement par le propriétaire ;
- création atomique de son entrepôt secondaire principal ;
- création d'entrepôts secondaires supplémentaires ;
- liste des entrepôts du tenant ;
- contrôle des codes uniques dans le tenant ;
- vérification tenant-scoped de l'établissement parent ;
- audit transactionnel des créations.

### Routes ajoutées

- `POST /tenants/current/establishments`
- `GET /tenants/current/warehouses`
- `POST /tenants/current/establishments/:establishmentId/warehouses`

### DTO ajoutés

- `CreateEstablishmentDto`
- `CreateWarehouseDto`
- `WarehouseResponseDto`

## Sous-phase 4.2 terminée — catalogue partagé

- `PhysicalProduct` porte l'identité commune au tenant.
- `EstablishmentProduct` porte l'activation, le seuil, la taxe et la stratégie d'allocation locale.
- `ProductPrice` historise le prix par établissement et conditionnement.
- catégories, conditionnements, codes-barres et données pharmaceutiques ne dépendent plus de l'ancienne entité `Product`.
- les SKU et libellés sont normalisés et contrôlés sans tenir compte de la casse.
- un médicament est automatiquement configuré en suivi lot/péremption et allocation FEFO.

## Sous-phase 4.3 terminée — stock par entrepôt

- `StockBalance` est identifié par tenant, entrepôt et produit physique.
- `StockMovement` ne conserve plus les colonnes historiques établissement/produit.
- les écritures de solde utilisent une version optimiste pour détecter les mises à jour concurrentes.
- la réception directe et le déstockage des ventes écrivent le mouvement dans la même transaction que le solde.
- la liste du stock combine produit physique et paramètres propres à l'établissement.

## Sous-phase 4.4 terminée — ventes alignées

- une vente référence obligatoirement l'entrepôt secondaire actif de l'établissement.
- une ligne de vente référence uniquement `physical_product_id`.
- le tarif est résolu depuis `ProductPrice` pour l'établissement courant.
- le contrôle et la sortie de stock utilisent le même entrepôt que la vente.
- les réponses API restent compatibles : le champ public `productId` désigne désormais l'identifiant du produit physique.

## Vérifications au 7 novembre 2026

- TypeScript : réussi.
- Build NestJS : réussi.
- Tests E2E : 87/87 réussis (catalogue, stock, ventes, caisse, crédit et isolation tenant).

## Sous-phases suivantes

1. Implémenter `ProductValuation` et le calcul transactionnel du CUMP lors des réceptions.
2. Ajouter achats, fournisseurs et réceptions.
3. Ajouter transferts, inventaires, lots et péremptions.
4. Ajouter dépenses, terminaux autorisés et synchronisation idempotente.
5. Retirer les derniers fichiers historiques devenus inaccessibles et ajouter les tests PostgreSQL critiques.
