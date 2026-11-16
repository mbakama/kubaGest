# KubaGest — modèle TypeORM V1.1 retenu

**Date :** 7 novembre 2026  
**Statut :** modèle technique figé pour la reconstruction DEV

## 1. Décision de modélisation

Le modèle reconstruit utilise une seule entité pour chaque responsabilité. `PhysicalProduct` devient l'unique produit physique du tenant. L'ancienne entité `Product`, qui mélange produit, activation locale, catégorie, prix et règles de stock, sera supprimée après adaptation des services.

Les noms de tables suivent le MLD cible V1.1. Les imports TypeScript ESM conservent l'extension `.js`.

## 2. Modules et entités propriétaires

### `TenantsModule`

- `Tenant`
- `Establishment`
- `Warehouse`
- `EstablishmentSettings`
- `ExchangeRate`
- `ExpiryAlertRule`
- `Plan`
- `Subscription`

### `UsersModule` / `AuthModule`

- `User`
- `Membership`
- `MembershipPermission`
- `MembershipWarehouse`
- `AuthSession`
- `AccessToken`
- `AuthorizedTerminal`

### `CatalogModule`

- `PhysicalProduct`
- `EstablishmentProduct`
- `ProductCategory`
- `ProductPackaging`
- `ProductPrice`
- `ProductBarcode`
- `DrugDetails`

### `SupplyModule`

- `Supplier`
- `Purchase`
- `PurchaseItem`
- `GoodsReceipt`
- `GoodsReceiptItem`

### `StockModule`

- `ProductBatch`
- `StockBalance`
- `StockMovement`
- `ProductValuation`
- `StockTransfer`
- `StockTransferItem`
- `InventoryCount`
- `InventoryCountItem`

### `SalesModule`

- `Sale`
- `SaleItem`
- `SaleLineBatchAllocation`
- `Payment`

### `CashModule`

- `CashRegister`
- `CashSession`
- `CashSessionCurrency`
- `CashMovement`
- `Expense`

### `SyncModule`

- `StockAllocation`
- `StockAllocationItem`
- `SyncOperation`

### Modules transversaux

- `DocumentCounter`
- `AuditLog`
- `Customer`, `CreditSale`, `CreditPayment`, `CreditReminder` conservés dans `CreditsModule`, hors du nouveau parcours commercial V1.

## 3. Clés de portée obligatoires

Chaque table opérationnelle possède `tenant_id`. Une table rattachée à un établissement, un entrepôt ou un document expose également une clé candidate composite permettant les FK tenant-scoped.

Exemples obligatoires :

- `establishments UNIQUE(tenant_id,id)` ;
- `warehouses UNIQUE(tenant_id,id)` ;
- `physical_products UNIQUE(tenant_id,id)` ;
- `product_packagings UNIQUE(tenant_id,physical_product_id,id)` ;
- `sales UNIQUE(tenant_id,establishment_id,id)` ;
- `sale_items UNIQUE(tenant_id,establishment_id,sale_id,id)`.

Une FK métier ne référence jamais uniquement un UUID lorsque le parent appartient à un tenant.

## 4. Catalogue propre

### `PhysicalProduct`

Porte uniquement les propriétés intrinsèques : tenant, SKU, nom, description, unité de base, mode de suivi et activité.

### `EstablishmentProduct`

Porte l'activation commerciale locale : établissement, produit physique, catégorie, nom local facultatif, seuil de réapprovisionnement, politique FIFO/FEFO, taxe et activité.

### `ProductPackaging`

Porte le conditionnement partagé : produit physique, libellé, facteur vers l'unité de base, indicateur de base et activité. Aucun prix.

### `ProductPrice`

Porte le prix par établissement et conditionnement, la devise et la période de validité. Une seule ligne courante est autorisée pour la même portée.

### `ProductCategory`

Catégorie tenant-scoped avec parent facultatif. L'activation du produit référence la catégorie.

## 5. Stock et valorisation

`StockBalance` est unique par tenant, entrepôt, produit, compartiment et lot éventuel. La quantité est toujours positive ou nulle.

`ProductValuation` est unique par tenant, entrepôt et produit. Il conserve quantité, coût moyen, valeur totale et version de verrouillage.

`StockMovement` est immuable et conserve quantité signée, valeur signée, coût unitaire, origine contrôlée, acteur et compensation éventuelle.

La réception recalcule le CUMP. Une sortie utilise le CUMP courant. La dernière sortie absorbe le résidu d'arrondi. Les écritures de solde, valorisation, mouvement et audit sont atomiques.

## 6. Vente V1

Une vente référence obligatoirement tenant, établissement et entrepôt. Une ligne référence le produit physique et le conditionnement, avec snapshots de libellé, facteur, prix, taxe et coût.

Le stock est contrôlé et verrouillé dans l'entrepôt choisi. Les lots sont alloués en FEFO lorsque requis. La vente, les lignes, paiements, allocations, mouvements, caisse et audit sont validés dans une transaction unique.

Le canal crédit est retiré de `CreateSaleDto` et du nouveau service de vente. Les tables de crédit restent indépendantes jusqu'à une décision de conservation ou suppression.

## 7. Entités historiques supprimées ou renommées

| Élément historique | Décision |
|---|---|
| `Product` / table `products` locale | Supprimer; remplacé par `PhysicalProduct` + `EstablishmentProduct` |
| Prix dans `ProductPackaging.sale_price` | Supprimer; remplacé par `ProductPrice` |
| `StockBalance.establishment_id` | Supprimer; portée par `warehouse_id` |
| `StockBalance.product_id` historique | Remplacer par `physical_product_id` |
| `StockMovement.establishment_id` | Supprimer; entrepôt et tenant suffisent |
| Colonnes `legacy_*` | Supprimer de la baseline |
| `SaleItem.product_id` historique | Remplacer par `physical_product_id` |
| Canal `SaleChannel.CREDIT` | Retirer du flux V1 |
| Migration additive `1730400000000` | Remplacer par la baseline V1.1 |

## 8. Contraintes PostgreSQL non négociables

- Un seul entrepôt central actif par tenant via index unique partiel.
- Cohérence `kind/establishment_id` des entrepôts par `CHECK`.
- Quantités de stock non négatives.
- Montants en `numeric(20,6)` et taux en `numeric(20,10)`.
- USD/CDF contrôlés par `CHECK`.
- Journaux stock/caisse/audit en insertion seule.
- Index sur toutes les FK référençantes.
- Idempotence unique par tenant, terminal et UUID d'opération.
- Aucun `ON DELETE CASCADE` depuis un tenant vers l'historique opérationnel.

## 9. Ordre d'implémentation

1. Créer une baseline PostgreSQL V1.1 unique.
2. Remplacer le catalogue historique par le catalogue physique/local.
3. Adapter stock et CUMP.
4. Adapter achats, réceptions, transferts et inventaires.
5. Adapter ventes, paiements, caisses et dépenses.
6. Adapter terminaux, allocations et synchronisation.
7. Réécrire les tests E2E et ajouter les tests PostgreSQL critiques.

