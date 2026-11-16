# KubaGest — audit technique avant reconstruction DEV

**Date :** 7 novembre 2026  
**Référence :** MLD cible V1.1  
**Décision :** reconstruction autorisée sur une base DEV vierge; aucune action destructive sur une base non formellement identifiée DEV

## 1. Résultat exécutif

Le backend utilise encore deux modèles de catalogue en parallèle : l'entité historique `Product`, rattachée à un établissement, et la nouvelle entité `PhysicalProduct`, rattachée au tenant. Cette coexistence se propage dans le catalogue, le stock et les ventes. Elle ne doit pas être conservée dans la reconstruction.

La migration `1730400000000-target-v1-foundation.ts` ajoute correctement les principaux concepts V1.1, mais elle a été conçue comme migration de compatibilité. Elle conserve donc les tables et colonnes historiques, ajoute des références nullable et duplique certaines responsabilités. Elle doit être remplacée par une baseline DEV propre, et non empilée telle quelle.

## 2. Inventaire audité

- 37 fichiers contenant des entités TypeORM après la première fondation V1.
- 8 migrations PostgreSQL, de `1729700000000` à `1730400000000`.
- 14 modules NestJS.
- Services directement dépendants du modèle historique : `CatalogService`, `StockService`, `SalesService`, `CashService`, `CreditsService`, `AuthService`, `TenantsService`, `UsersService`, `DashboardService` et `DocumentNumberService`.
- 6 suites E2E et 5 suites unitaires.

## 3. Entités à conserver

Ces responsabilités restent valides, sous réserve d'harmonisation des FK tenant-scoped :

- `Tenant`
- `User`
- `Membership`
- `MembershipPermission`
- `Plan`
- `Subscription`
- `AuthSession`
- `AccessToken`
- `AuditLog`
- `EstablishmentSettings`
- `ExchangeRate`
- `ExpiryAlertRule`
- `DocumentCounter`
- `CashRegister`
- `CashSession`
- `CashSessionCurrency`
- `CashMovement`
- `Customer` et tables de crédit uniquement comme historique/fonction reportée

## 4. Entités à restructurer

| Responsabilité | État historique | Cible propre |
|---|---|---|
| Établissement | Un seul par tenant | Plusieurs établissements; code unique par tenant |
| Entrepôt | Ajouté récemment | Central sans établissement; secondaire rattaché à un établissement |
| Produit | `Product` local + `PhysicalProduct` | Une seule entité produit physique tenant-scoped |
| Activation commerciale | Mélangée dans `Product` | `EstablishmentProduct` |
| Catégorie | Locale à l'établissement | Catégorie tenant-scoped hiérarchique |
| Conditionnement | Local avec prix | Produit physique, sans prix |
| Prix | Dans le conditionnement + `ProductPrice` | `ProductPrice` par établissement |
| Lot | Ajouté seulement en migration | Entité dédiée, tenant/entrepôt/produit |
| Solde de stock | Établissement + ancien produit | Entrepôt + produit physique + compartiment + lot |
| Mouvement de stock | Origines faibles | Journal immuable, valorisé, origines contrôlées |
| Vente | Entrepôt nullable, ancien produit | Entrepôt obligatoire, produit physique, coût snapshot |
| Paiement | Partiellement valorisé | Devise/taux/équivalent de référence et session cohérente |

## 5. Entités doublonnées à supprimer

- L'ancien `Product` local doit disparaître comme table/responsabilité distincte.
- `PhysicalProduct` devient l'unique produit de stock.
- Le prix ne doit plus être conservé dans `ProductPackaging`.
- Les colonnes de transition `legacy_product_id`, ancien `product_id` et anciens axes établissement/stock ne doivent pas exister dans la baseline propre.
- La migration additive `1730400000000-target-v1-foundation.ts` ne doit pas rester dans l'historique final DEV.

## 6. Dépendances applicatives

### Catalogue

`CatalogService` filtre actuellement `Product` par `tenantId + establishmentId`, crée le produit, le conditionnement tarifé, les codes-barres et les informations médicament dans une transaction. Il doit créer : produit physique, activation établissement, conditionnement, prix établissement, codes-barres et éventuelle fiche médicament.

### Stock

`StockService` utilise `Product`, `StockBalance` et `StockMovement` avec l'établissement implicite unique. Toutes ses opérations doivent recevoir ou résoudre un `warehouseId`, verrouiller le solde correspondant et mettre à jour le CUMP.

### Ventes

`SalesService` résout prix et conditionnements depuis le catalogue historique, puis appelle le stock par produit local. Il doit résoudre `EstablishmentProduct`, `ProductPrice`, l'entrepôt de vente, les lots FEFO et le CUMP dans une transaction unique. Le canal crédit doit être exclu du nouveau flux V1.

### Inscription et tenants

`AuthService` crée déjà un entrepôt central et un entrepôt secondaire. Cette responsabilité est valide, mais doit être garantie par la baseline et par des tests multi-établissements.

### Caisse et crédit

La caisse peut être conservée et reliée strictement à l'établissement. Le crédit ne doit plus être proposé lors d'une nouvelle vente V1; les tables peuvent rester isolées pour la responsabilité historique tant qu'une décision de suppression fonctionnelle n'est pas prise.

## 7. Tests impactés

- `catalog.e2e-spec.ts` : adapter au produit partagé, activation locale et prix local.
- `sales.e2e-spec.ts` : imposer entrepôt, prix local et stock suffisant.
- `credits.e2e-spec.ts` : dissocier du nouveau flux de vente.
- `tenants.e2e-spec.ts` et `auth.e2e-spec.ts` : vérifier entrepôt central et secondaire.
- Ajouter des tests PostgreSQL pour CUMP, transferts, inventaires, concurrence et idempotence hors ligne.

## 8. Stratégie de migration retenue

1. Remplacer les huit migrations DEV par une baseline V1.1 unique pour base vierge.
2. Conserver `synchronize: false` sur PostgreSQL.
3. Réserver SQL.js aux tests unitaires rapides; les invariants critiques sont testés sur PostgreSQL.
4. Supprimer les entités de transition et renommer les références sans préfixe `legacy`.
5. Adapter les services avant de déclarer la reconstruction terminée.
6. Ne supprimer la base qu'après vérification explicite de l'environnement DEV.

## 9. Points non inventés

Les règles suivantes restent à décider et ne seront pas déduites arbitrairement : politique de stock en transit, permissions fines par entrepôt, durée d'allocation hors ligne, traitement des coûts accessoires d'achat et politique de retour fournisseur. Le schéma peut accueillir ces décisions sans activer de comportement métier non validé.

