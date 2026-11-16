# KUBAGEST — MLD CIBLE V1 ACTUALISÉ

**Version :** 1.1  
**Date :** 06 novembre 2026  
**Statut :** Modèle cible proposé — à valider avant implémentation

---

## 1. Principes structurants

KubaGest est un ERP SaaS multi-tenant.

Le modèle cible repose sur les principes suivants :

1. Un tenant peut gérer plusieurs établissements.
2. Chaque tenant possède un entrepôt central unique.
3. Chaque établissement peut posséder plusieurs entrepôts secondaires.
4. L'entrepôt central peut approvisionner les établissements.
5. Le stock est géré par entrepôt.
6. Les mouvements de stock sont historisés et traçables.
7. La valorisation du stock utilise le CUMP.
8. Les ventes ne peuvent jamais dépasser le stock disponible.
9. Les données sont isolées par tenant.
10. Les opérations sensibles doivent être transactionnelles et auditées.

## 2. Organisation générale

```text
TENANT
│
├── UTILISATEURS
├── ABONNEMENT
│
├── ÉTABLISSEMENT 1
│   ├── Entrepôt secondaire A
│   ├── Entrepôt secondaire B
│   └── Entrepôt secondaire C
│
├── ÉTABLISSEMENT 2
│   ├── Entrepôt secondaire D
│   └── Entrepôt secondaire E
│
├── ÉTABLISSEMENT 3
│   └── Entrepôt secondaire F
│
└── ENTREPÔT CENTRAL
    ├── Approvisionne l'établissement 1
    ├── Approvisionne l'établissement 2
    └── Approvisionne l'établissement 3
```

L'entrepôt central appartient directement au tenant. Il n'est pas rattaché à un établissement particulier.

## 3. Structure des entités

### 3.1. Gestion des tenants et établissements

**tenants**
- id (PK)
- name
- slug
- status
- created_at
- updated_at

**establishments**
- id (PK)
- tenant_id (FK)
- code
- name
- address
- phone
- email
- is_active
- created_at
- updated_at

Contraintes :
- FK tenant_id → tenants.id
- UNIQUE (tenant_id, code)
- Suppression de l'ancienne contrainte UNIQUE (tenant_id), après adaptation du code applicatif.

### 3.2. Entrepôts

**warehouses**
- id (PK)
- tenant_id (FK)
- establishment_id (FK, nullable)
- code
- name
- kind (`central`, `secondary`)
- is_active
- created_at
- updated_at

Règles :
- Un entrepôt central appartient directement au tenant : establishment_id = NULL.
- Un entrepôt secondaire appartient à un établissement : establishment_id obligatoire.
- Un tenant ne possède qu'un seul entrepôt central actif.
- Un établissement peut posséder plusieurs entrepôts secondaires.
- UNIQUE (tenant_id, code).
- Une contrainte CHECK garantit la cohérence entre kind et establishment_id.
- Les références doivent être protégées par des clés étrangères composites tenant-scoped.

**membership_warehouses** (optionnel, selon les besoins de permissions)
- id (PK)
- tenant_id
- membership_id
- warehouse_id
- created_at

Cette table permettra de limiter les accès d'un membre à certains entrepôts.

### 3.3. Utilisateurs et autorisations

**users**
- id (PK)
- email
- password_hash
- status
- created_at
- updated_at

**memberships**
- id (PK)
- tenant_id
- user_id
- role
- status
- created_at

**membership_permissions**
- id (PK)
- membership_id
- permission
- created_at

**auth_sessions**
- id (PK)
- user_id
- tenant_id
- expires_at
- created_at

**access_tokens**
- id (PK)
- user_id
- tenant_id
- token_hash
- expires_at
- created_at

### 3.4. Catalogue des produits

Le produit représente une identité physique commune au tenant. Son activation commerciale et ses prix peuvent varier selon l'établissement.

**physical_products**
- id (PK)
- tenant_id
- sku
- name
- description
- base_unit
- tracking_mode
- is_active
- created_at
- updated_at

**establishment_products**
- id (PK)
- tenant_id
- establishment_id
- physical_product_id
- is_active
- created_at
- updated_at

**product_prices**
- id (PK)
- tenant_id
- establishment_id
- physical_product_id
- packaging_id
- sale_price
- currency
- valid_from
- valid_to
- created_at

**product_categories**
- id (PK)
- tenant_id
- name
- parent_id (FK, nullable)

**product_packagings**
- id (PK)
- tenant_id
- physical_product_id
- name
- factor_to_base
- is_base
- created_at

**product_barcodes**
- id (PK)
- tenant_id
- physical_product_id
- barcode
- packaging_id

**drug_details**
- id (PK)
- physical_product_id
- active_ingredient
- dosage
- form

Les produits physiques sont partagés dans le tenant. Chaque établissement peut activer les produits qu'il commercialise et disposer de ses propres prix.

### 3.5. Gestion du stock

Le stock est désormais rattaché à un entrepôt et non uniquement à un établissement.

**stock_balances**
- id (PK)
- tenant_id
- warehouse_id
- physical_product_id
- bucket (`available`, `quarantine`)
- batch_id (nullable)
- quantity
- updated_at

Contrainte d'unicité à définir selon le suivi des lots :
- UNIQUE (tenant_id, warehouse_id, physical_product_id, bucket, batch_id).

**stock_movements**
- id (PK)
- tenant_id
- warehouse_id
- physical_product_id
- batch_id (nullable)
- movement_type
- quantity_delta
- unit_cost
- total_cost
- source_type
- source_id
- actor_membership_id
- created_at

Les mouvements sont immuables. Une correction doit produire un mouvement compensatoire plutôt que modifier l'historique.

**product_valuations**
- id (PK)
- tenant_id
- warehouse_id
- physical_product_id
- quantity
- average_cost
- total_value
- updated_at

Le CUMP est calculé par produit et par entrepôt.

### 3.6. Transferts entre entrepôts

**stock_transfers**
- id (PK)
- tenant_id
- source_warehouse_id
- destination_warehouse_id
- reference
- status
- created_by
- validated_by
- transferred_at
- received_at
- created_at

**stock_transfer_items**
- id (PK)
- transfer_id
- physical_product_id
- quantity_requested
- quantity_sent
- quantity_received
- unit_cost

Règles :
- Un transfert possède un entrepôt source et un entrepôt destination.
- Les deux entrepôts doivent appartenir au même tenant.
- Un transfert ne peut pas être validé si le stock disponible est insuffisant.
- L'expédition et la réception génèrent des mouvements de stock traçables.
- Les transferts doivent être exécutés dans des transactions sécurisées.

### 3.7. Achats et approvisionnements

**suppliers**
- id (PK)
- tenant_id
- name
- phone
- email
- address
- created_at

**purchases**
- id (PK)
- tenant_id
- supplier_id
- destination_warehouse_id
- reference
- status
- currency
- total_amount
- created_by
- created_at

**purchase_items**
- id (PK)
- purchase_id
- physical_product_id
- quantity_ordered
- unit_cost
- total_cost

**goods_receipts**
- id (PK)
- tenant_id
- purchase_id
- warehouse_id
- reference
- status
- received_by
- received_at

**goods_receipt_items**
- id (PK)
- goods_receipt_id
- physical_product_id
- quantity_received
- unit_cost
- batch_id (nullable)

La réception effective des marchandises augmente le stock et participe au calcul du CUMP.

### 3.8. Lots et péremption

**product_batches**
- id (PK)
- tenant_id
- physical_product_id
- warehouse_id
- batch_number
- expiration_date
- quantity
- created_at

**expiry_alert_rules**
- id (PK)
- tenant_id
- days_before_expiration
- is_active

Le système doit permettre la traçabilité des lots et appliquer la méthode FEFO lorsque le suivi par lot est activé.

### 3.9. Ventes

**sales**
- id (PK)
- tenant_id
- establishment_id
- warehouse_id
- reference
- customer_id (nullable)
- status
- currency
- subtotal
- discount
- tax_amount
- total_amount
- created_by
- created_at

**sale_items**
- id (PK)
- sale_id
- physical_product_id
- packaging_id
- quantity
- unit_price
- unit_cost
- total_amount

**sale_line_batch_allocations**
- id (PK)
- sale_item_id
- batch_id
- quantity

**payments**
- id (PK)
- tenant_id
- sale_id
- amount
- currency
- payment_method
- created_at

Règles :
- Une vente est réalisée dans un établissement et un entrepôt.
- Le stock est contrôlé dans cet entrepôt.
- Aucun dépassement du stock disponible n'est autorisé.
- La confirmation d'une vente et ses mouvements de stock doivent être transactionnels.
- La vente à crédit n'est pas activée dans le flux V1 ; les anciennes données de crédit sont conservées pendant la transition.

### 3.10. Clients et crédits historiques

**customers**
- id (PK)
- tenant_id
- name
- phone
- email
- address

**credit_sales**
- id (PK)
- tenant_id
- customer_id
- sale_id
- amount
- balance
- status
- created_at

**credit_payments**
- id (PK)
- credit_sale_id
- amount
- payment_date

**credit_reminders**
- id (PK)
- credit_sale_id
- reminder_date
- status

Les tables historiques de crédit ne doivent pas être supprimées sans décision spécifique et stratégie de conservation.

### 3.11. Caisse et finances

**cash_registers**
- id (PK)
- tenant_id
- establishment_id
- name
- is_active

**cash_sessions**
- id (PK)
- tenant_id
- cash_register_id
- opened_by
- closed_by
- opening_amount
- closing_amount
- status
- opened_at
- closed_at

**cash_session_currencies**
- id (PK)
- cash_session_id
- currency
- opening_amount
- closing_amount

**cash_movements**
- id (PK)
- tenant_id
- cash_session_id
- movement_type
- amount
- currency
- source_type
- source_id
- created_by
- created_at

**expenses**
- id (PK)
- tenant_id
- establishment_id
- amount
- currency
- description
- created_by
- created_at

**exchange_rates**
- id (PK)
- tenant_id
- base_currency
- target_currency
- rate
- effective_date

Les monnaies principales sont USD et CDF.

### 3.12. Fonctionnement hors ligne

**authorized_terminals**
- id (PK)
- tenant_id
- establishment_id
- warehouse_id
- device_identifier
- status
- last_sync_at

**stock_allocations**
- id (PK)
- tenant_id
- warehouse_id
- terminal_id
- status
- expires_at
- created_at

**stock_allocation_items**
- id (PK)
- allocation_id
- physical_product_id
- allocated_quantity
- consumed_quantity

**sync_operations**
- id (PK)
- tenant_id
- terminal_id
- operation_uuid
- operation_type
- payload
- status
- created_at
- processed_at

Les opérations hors ligne doivent être idempotentes. Les terminaux ne peuvent utiliser que les quantités qui leur ont été autorisées.

### 3.13. Documents et audit

**document_counters**
- id (PK)
- tenant_id
- establishment_id
- document_type
- current_value

**audit_logs**
- id (PK)
- tenant_id
- actor_membership_id
- action
- entity_type
- entity_id
- old_values
- new_values
- created_at

**subscriptions**
- id (PK)
- tenant_id
- plan_id
- status
- starts_at
- expires_at

**plans**
- id (PK)
- name
- description
- price
- duration

## 4. Relations principales

- tenants 1:N establishments
- tenants 1:1 warehouses (entrepôt central, selon la règle métier)
- tenants 1:N warehouses
- establishments 1:N warehouses (entrepôts secondaires)
- tenants 1:N memberships
- tenants 1:N physical_products
- physical_products 1:N establishment_products
- establishments 1:N establishment_products
- warehouses 1:N stock_balances
- physical_products 1:N stock_balances
- warehouses 1:N stock_movements
- warehouses 1:N product_valuations
- warehouses 1:N stock_transfers (comme source ou destination)
- establishments 1:N sales
- warehouses 1:N sales
- sales 1:N sale_items
- sales 1:N payments
- suppliers 1:N purchases
- purchases 1:N goods_receipts

## 5. Contraintes de sécurité et d'intégrité

1. Toutes les entités opérationnelles doivent être isolées par tenant.
2. Les clés étrangères importantes doivent utiliser des contraintes composites incluant tenant_id.
3. Un entrepôt ne peut être utilisé par une vente appartenant à un autre tenant.
4. Une vente doit utiliser un entrepôt cohérent avec son établissement.
5. Un entrepôt secondaire doit être rattaché à un établissement du même tenant.
6. Un entrepôt central ne doit pas être rattaché à un établissement.
7. Les quantités et montants doivent utiliser des types numériques adaptés, jamais des nombres flottants imprécis.
8. Les mouvements de stock et les journaux d'audit doivent être conservés.
9. Les validations de stock et de caisse doivent être transactionnelles.
10. Les opérations synchronisées depuis les terminaux doivent être idempotentes.

## 6. Stratégie de migration

Aucune migration ne doit être exécutée avant l'audit réel de la base PostgreSQL de production.

Ordre recommandé :

1. Vérifier la structure réelle de PostgreSQL et comparer avec les entités TypeORM et les migrations.
2. Introduire les entrepôts sans supprimer les anciennes colonnes.
3. Créer l'entrepôt central et les entrepôts secondaires pour les données existantes.
4. Ajouter progressivement warehouse_id aux tables de stock et aux opérations concernées.
5. Adapter les services et les API.
6. Réconcilier les quantités historiques et les nouveaux soldes par entrepôt.
7. Introduire le catalogue physique partagé et les prix par établissement.
8. Introduire les achats, réceptions et valorisations CUMP.
9. Introduire les transferts et inventaires.
10. Finaliser le fonctionnement hors ligne.
11. Supprimer les anciennes contraintes ou colonnes uniquement après validation et réconciliation.

**Règle absolue :** ne jamais modifier une migration déjà appliquée en production. Toute évolution doit être additive, progressive et accompagnée d'une stratégie de retour arrière lorsque cela est possible.

## 7. Points restant à valider

- Les permissions des utilisateurs sont-elles limitées à certains entrepôts ?
- Le catalogue des produits est-il partagé par défaut entre tous les établissements, avec activation locale ?
- Quelle règle de priorité appliquer aux prix : prix global ou prix local ?
- Le suivi des lots est-il obligatoire pour tous les produits ou uniquement certains ?
- Comment traiter les réceptions partielles et les retours fournisseurs ?
- Comment gérer la perte d'un terminal ayant reçu une allocation de stock hors ligne ?
- Quelles règles de numérotation des documents appliquer par établissement ?

---

**Important :** ce MLD constitue la cible fonctionnelle et relationnelle de KubaGest. Il ne certifie pas que toutes ces tables existent déjà dans la base de production. Le MLD actuel, les migrations TypeORM et la base PostgreSQL doivent rester trois références distinctes pendant l'audit.
