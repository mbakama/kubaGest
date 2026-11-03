# KubaGest — conception de la base de données

Version 0.1 — 24 octobre 2026. **Proposition de conception à valider avant migrations.**

Source : [cahier des charges V3](../../KubaGest_Cahier_des_charges_V3.md), notamment F01–F17 et §§6, 9–13, 21–28. Les addenda prévalent sur le modèle initial. Ce document définit le modèle cible PostgreSQL ; il ne décrit pas un schéma déjà déployé.

Diagramme : [relations Mermaid](relations.mmd). Le dictionnaire ci-dessous fait autorité pour les contraintes ; le diagramme montre les relations principales sans représenter toutes les colonnes.

## 1. Périmètre et décisions proposées

- Un tenant correspond au commerce abonné ; un établissement correspond au point de vente. Une contrainte `UNIQUE(tenant_id)` sur `establishments` limite le MVP à un établissement par tenant. Les clés conservent les deux dimensions pour une extension future contrôlée.
- Une base PostgreSQL centrale est partagée par Electron et l’application mobile Flutter (technologie retenue le 24 octobre 2026). Aucun stock autonome côté client.
- `product_packagings` unifie les anciens noms `product_units` et `product_packagings`. Toutes les conversions vont directement vers l'unité de base : aucune chaîne de conversions.
- FEFO choisit les lots physiques. Proposition distincte de valorisation : coût moyen pondéré par produit et établissement, dans la devise de référence. Ce choix reste à valider.
- Proposition MVP : aucune réservation de stock. Un panier ne bloque rien ; la validation verrouille les soldes. Cela résout le point ouvert du §28.9, sous réserve de validation. Ne pas ajouter une colonne `reserved_quantity` sans cycle de réservation.
- Le crédit client est traité comme un carnet séparé du cycle de vente : `customers` porte l'identité et le plafond d'encours, `credit_sales` la dette et son échéance, `credit_payments` les règlements partiels. Une vente à crédit n'est donc pas « entièrement réglée » à la validation ; le reste dû est suivi jusqu'au solde. Les échéanciers multiples par vente restent hors périmètre.
- Les retours physiques sont toujours distincts des annulations administratives. Un retour client alimente la quarantaine, jamais directement le stock vendable.
- Les documents validés et les journaux sont conservés. Une correction produit un document ou une écriture compensatoire.
- Les obligations fiscales, de conservation et de pharmacie ne sont pas déduites ici. Les décisions métier encore ouvertes figurent en section 11.

## 2. Conventions du dictionnaire et intégrité

### Types et colonnes communes

Chaque table possède `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`, sauf indication contraire. Chaque champ est `NOT NULL` sauf suffixe `?`. `text` signifie texte libre ; les codes à liste fermée utilisent `varchar` avec `CHECK` et non des valeurs libres.

- `money = numeric(20,6)` ; `rate = numeric(20,10)` ; `qty = bigint`. Aucune quantité fractionnaire dans le MVP : choisir gramme, millilitre ou unité comme unité de base si nécessaire. La vente au poids fractionnaire nécessite un arbitrage supplémentaire.
- `currency = varchar(3) CHECK IN ('USD','CDF')`. Les calculs applicatifs utilisent une bibliothèque décimale, jamais `Number` pour les montants. Le maximum de quantité et de montant est contrôlé avant multiplication.
- Horodatages : `timestamptz`, stockés comme instants UTC. Péremption : `date` interprétée dans le fuseau IANA de l'établissement.
- `C` signifie `created_at timestamptz DEFAULT now()` et `U` signifie `updated_at timestamptz DEFAULT now()`. La mise à jour de `U` doit être assurée par trigger ou explicitement dans toute écriture.
- `T` signifie `tenant_id uuid REFERENCES tenants(id)` ; `E` signifie `establishment_id uuid` avec FK composite vers `establishments(tenant_id,id)`.
- Toutes les tables métier portent `T`, et `E` lorsqu'elles concernent un point de vente. Elles possèdent une clé candidate `UNIQUE(tenant_id,id)`, ou `UNIQUE(tenant_id,establishment_id,id)` si elles portent `E`, en plus de leur PK UUID.
- `actor_id`, `created_by`, `cashier_id`, `approved_by`, `opened_by`, `closed_by` désignent un **membership**, pas directement un utilisateur. Une FK composite `(tenant_id,actor_id)` cible `memberships(tenant_id,id)`. Le rattachement est conservé après désactivation.
- Une référence de produit inclut toujours `(tenant_id,establishment_id,product_id)`. Pour un lot, un conditionnement ou une ligne, elle inclut aussi le produit ou le document parent lorsque nécessaire : voir section 9.
- Suppression : `ON DELETE RESTRICT` sur références métier. Archivage par `is_active` pour le catalogue et les comptes. Aucun `CASCADE` depuis un tenant vers l'historique financier ou de stock. Purge éventuelle par procédure dédiée après politique de conservation.
- Les champs `jsonb` servent aux métadonnées d'audit et réponses d'idempotence, jamais aux lignes de vente, paiements ou relations métier.

### Valeurs historiques

Une vente garde le libellé/SKU, le conditionnement, le facteur, le prix, la remise, les taxes, le coût et le taux utilisés. Une modification du catalogue ne recalcule aucun document historique. Un changement de devise de référence est interdit après la première opération comptabilisée, sauf migration contrôlée.

## 3. Comptes, droits et abonnement

### tenants — commerce abonné (F01, F07)

`name varchar(150)`, `reference_currency currency`, `address text?`, `status varchar(20) CHECK IN ('trial','active','suspended','closed')`, `C`, `U`.

Le statut contrôle l'accès opérationnel ; une politique de lecture/export après suspension reste à contractualiser. Le prix et le statut d'un abonnement ne sont pas déduits d'un simple champ `plan` sur le tenant.

### establishments — point de vente (F01, F08–F17)

`T`, `name varchar(150)`, `activity_type varchar(20) CHECK IN ('boutique','alimentation','pharmacie')`, `timezone varchar(60)`, `address text?`, `is_active boolean DEFAULT true`, `C`, `U`.

Contraintes : `UNIQUE(tenant_id)` au MVP et `UNIQUE(tenant_id,id)`. Type d'activité immuable après activation, sauf migration contrôlée. Fuseau validé côté serveur ; toute modification est auditée.

### users — identité globale

`first_name varchar(80)`, `last_name varchar(80)`, `email varchar(255)`, `phone varchar(30)?`, `avatar_key text?`, `password_hash text`, `is_active boolean DEFAULT true`, `is_platform_admin boolean DEFAULT false`, `password_changed_at timestamptz?`, `C`, `U`.

Le prénom et le nom sont exigés à la création du compte, y compris pour un employé invité. Le prénom alimente la salutation de l'accueil. `avatar_key` désigne un fichier image facultatif téléversé par l'API ; la photo n'est pas stockée dans la ligne. Sans photo, l'accueil affiche un visuel neutre. Index unique sur `lower(email)`. Téléphone non utilisé comme identifiant unique avant validation du mode de connexion. Le super administrateur n'obtient aucun accès implicite aux données métier.

### memberships — appartenance et rôle dans un commerce

`T`, `user_id uuid → users`, `role varchar(30) CHECK IN ('owner','cashier','stock_manager')`, `is_active boolean DEFAULT true`, `C`, `U`.

`UNIQUE(tenant_id,user_id)`. Au MVP, l'accès couvre l'unique établissement du tenant ; pas de table d'affectation multi-sites. Conserver au moins un propriétaire actif par tenant via service transactionnel et verrou du tenant.

### membership_permissions — dérogations explicites

`T`, `membership_id uuid`, `permission_code varchar(80)`, `allowed boolean`, `granted_by uuid`, `reason text`, `C`, `U` ; `UNIQUE(tenant_id,membership_id,permission_code)`.

Les permissions autorisées sont définies par le serveur : remise exceptionnelle, ajustement de stock, annulation, remboursement, libération de quarantaine et, si validé, stock négatif. Les droits effectifs combinent rôle et dérogation, sans pouvoir contourner le contexte tenant. Chaque changement est audité.

### auth_sessions — sessions révocables bureau/mobile (§28.5)

`user_id uuid → users`, `refresh_token_hash text UNIQUE`, `client_type varchar(20) CHECK IN ('desktop','mobile','web')`, `expires_at timestamptz`, `last_seen_at timestamptz?`, `revoked_at timestamptz?`, `replaced_by_id uuid? → auth_sessions`, `C`.

Aucun jeton brut en base ou dans les logs. Rotation atomique des jetons ; détection de réutilisation et révocation de la chaîne. L'access token porte l'identifiant de session ; les opérations contrôlent session, utilisateur, membership et statut tenant actuels. Cette table est globale, pas une source d'autorisation tenant.

### access_tokens — invitations et réinitialisations

`user_id uuid → users`, `tenant_id uuid? → tenants`, `purpose varchar(20) CHECK IN ('invitation','password_reset')`, `token_hash text UNIQUE`, `expires_at timestamptz`, `consumed_at timestamptz?`, `created_by uuid? → users`, `C`.

Jeton à usage unique, consommation conditionnelle atomique. Les invitations créent/réactivent un membership dans le tenant indiqué après authentification de l'identité destinataire. Jamais de mot de passe d'un compte global existant remplacé lors d'un rattachement.

### plans — formules commerciales

`code varchar(40) UNIQUE`, `name varchar(100)`, `monthly_price money`, `currency currency`, `max_employees integer?`, `is_active boolean DEFAULT true`, `C`, `U`.

`monthly_price >= 0`, `max_employees >= 0` si renseigné. Tarifs contractuels proposés à confirmer ; aucune valeur commerciale définitive imposée par le modèle.

### subscriptions — périodes d'abonnement

`T`, `plan_id uuid → plans`, `status varchar(20) CHECK IN ('trial','active','suspended','expired','cancelled')`, `starts_at timestamptz`, `ends_at timestamptz?`, `agreed_price money?`, `currency currency`, `employee_limit integer?`, `C`, `U`.

`ends_at > starts_at` si renseigné. Exclusion PostgreSQL des périodes qui se chevauchent pour un tenant, via `tstzrange(starts_at,ends_at,'[)')` et GiST (`btree_gist`). Une modification de formule termine une période et en crée une nouvelle ; prix et limites contractuels sont figés. Les changements de statut restent dans l'audit.

## 4. Paramètres et catalogue

### establishment_settings — configuration typée (F07)

`T`, `E`, `max_discount_percent numeric(5,2) DEFAULT 0`, `payment_tolerance money DEFAULT 0`, `expiry_boundary varchar(20) CHECK IN ('start_of_day','end_of_day')`, `C`, `U` ; `UNIQUE(tenant_id,establishment_id)`.

`0 <= max_discount_percent <= 100`, `payment_tolerance >= 0`. Pas de paramétrage libre permettant de désactiver le blocage des lots périmés ou la FEFO obligatoire en pharmacie. L'absence de convention de péremption validée bloque l'activation des ventes concernées.

### expiry_alert_rules — seuils d'alerte

`T`, `E`, `days_before integer CHECK >= 0`, `is_active boolean`, `C`, `U` ; unicité `(tenant_id,establishment_id,days_before)`. J-90/J-60/J-30 sont des valeurs initiales proposées, modifiables.

### exchange_rates — historique USD/CDF

`T`, `E`, `cdf_per_usd rate CHECK > 0`, `effective_at timestamptz`, `created_by uuid`, `C`.

Sens unique documenté : 1 USD = `cdf_per_usd` CDF. Unicité `(tenant_id,establishment_id,effective_at)`. Les taux passés ne sont pas écrasés. La transaction fige sa valeur, même si elle référence aussi ce taux.

### product_categories — catégories d'articles

`T`, `E`, `name varchar(100)`, `is_active boolean`, `C`, `U`. Unicité du nom normalisé par établissement.

### products — catalogue commun (F02, F08)

`T`, `E`, `category_id uuid?`, `sku varchar(80)`, `name varchar(200)`, `base_unit varchar(30)`, `reorder_level qty DEFAULT 0`, `tracking_mode varchar(20) CHECK IN ('none','batch','batch_expiry')`, `allocation_policy varchar(10) CHECK IN ('fifo','fefo')`, `tax_rate numeric(7,4) DEFAULT 0`, `is_active boolean DEFAULT true`, `C`, `U`.

`UNIQUE(tenant_id,sku)` après normalisation documentée ; seuil et taxe non négatifs. Le SKU est unique par boutique comme demandé. Une pharmacie exige `batch_expiry` et `fefo` pour ses médicaments. Un produit périssable exige `batch_expiry`. La règle traversant produit et établissement nécessite service et trigger à la validation des opérations. Le mode de suivi et l'unité de base ne changent plus librement dès qu'un mouvement existe.

### drug_details — complément médicament

`T`, `E`, `product_id uuid`, `active_ingredient varchar(200)`, `strength varchar(100)`, `dosage_form varchar(100)`, `prescription_required boolean?`, `C`, `U` ; unicité `(tenant_id,establishment_id,product_id)`.

Le nom commercial est `products.name`. `prescription_required` reste facultatif en attente de décision ; aucune ordonnance ni donnée patient.

### product_packagings — pièce, carton, boîte, plaquette

`T`, `E`, `product_id uuid`, `label varchar(60)`, `factor_to_base qty CHECK > 0`, `sale_price money CHECK >= 0`, `is_base boolean DEFAULT false`, `is_active boolean DEFAULT true`, `C`, `U`.

`UNIQUE(tenant_id,establishment_id,product_id,label)` ; index unique partiel par produit `WHERE is_base`. `CHECK (NOT is_base OR factor_to_base=1)`. Le service garantit exactement un conditionnement de base actif par produit. Prix dans la devise de référence. Exemple : unité=1, plaquette=10, boîte=30 ; le facteur 30 ne dépend pas d'une jointure avec la plaquette.

### product_barcodes — recherche scanner

`T`, `E`, `product_id uuid`, `packaging_id uuid`, `code varchar(100)`, `C` ; `UNIQUE(tenant_id,code)`.

Un code identifie un seul conditionnement dans le commerce. Plusieurs codes peuvent identifier le même conditionnement. FK composite incluant produit et conditionnement ; code stocké comme texte pour conserver les zéros initiaux.

## 5. Réceptions, lots et stock

### receipts — entrées initiales et réceptions (F03, F10)

`T`, `E`, `number varchar(60)`, `kind varchar(20) CHECK IN ('opening','purchase')`, `status varchar(20) CHECK IN ('draft','posted','cancelled')`, `supplier_name text?`, `external_reference text?`, `currency currency`, `cdf_per_usd rate`, `received_at timestamptz`, `created_by uuid`, `posted_by uuid?`, `posted_at timestamptz?`, `reason text?`, `C`, `U`.

`UNIQUE(tenant_id,number)`. Fournisseur réduit à un libellé historique facultatif : pas de gestion des commandes ou dettes fournisseurs dans le MVP. La date effective ne permet pas de rétroagir sur un stock déjà vendu. Annuler un brouillon n'a aucun effet de stock ; corriger une réception comptabilisée nécessite un document inverse autorisé.

### product_batches — identité du lot (F10–F15)

`T`, `E`, `product_id uuid`, `batch_number varchar(100)?`, `expiry_date date?`, `first_received_at timestamptz`, `restriction varchar(20) CHECK IN ('active','blocked','recalled') DEFAULT 'active'`, `C`, `U`.

Proposition d'unicité : `(tenant_id,establishment_id,product_id,batch_number,expiry_date) NULLS NOT DISTINCT` (PostgreSQL 15+). Plusieurs réceptions du même lot alimentent la même identité ; leurs coûts restent dans les lignes de réception. Même numéro avec échéance différente : alerte et contrôle requis avant acceptation. Pour un produit sans suivi, un seul lot technique avec numéro/date nuls simplifie les soldes sans inventer de lot fabricant. Les produits suivis exigent le numéro ; `batch_expiry` exige aussi la date. Vérification inter-tables à la comptabilisation.

Un lot n'est pas globalement « en quarantaine » : une partie de ses quantités peut l'être et une autre rester disponible. `restriction` bloque toutes les quantités du lot. L'expiration est calculée en temps réel, sans dépendre d'une tâche de nuit.

### receipt_items — détail et coût d'entrée

`T`, `E`, `receipt_id uuid`, `line_number integer`, `product_id uuid`, `batch_id uuid`, `packaging_id uuid`, `quantity_packages qty CHECK > 0`, `factor_snapshot qty CHECK > 0`, `quantity_base qty CHECK > 0`, `unit_cost money CHECK >= 0`, `unit_cost_reference money CHECK >= 0`, `destination_bucket varchar(20) CHECK IN ('available','quarantine')`, `C`.

`UNIQUE(tenant_id,establishment_id,receipt_id,line_number)` ; `quantity_base = quantity_packages * factor_snapshot` avec contrôle de dépassement. `unit_cost` est le coût d'un conditionnement dans la devise du document ; `unit_cost_reference` est le coût d'une unité de base converti dans la devise de référence. Arrondi de calcul conservé à six décimales. Une entrée expirée est refusée ou orientée en quarantaine, jamais vendable.

### stock_balances — projection verrouillable par lot et compartiment

`T`, `E`, `product_id uuid`, `batch_id uuid`, `bucket varchar(20) CHECK IN ('available','quarantine')`, `quantity_base qty DEFAULT 0`, `version bigint DEFAULT 0`, `U`.

`UNIQUE(tenant_id,establishment_id,product_id,batch_id,bucket)` ; `quantity_base >= 0` dans la proposition MVP. Aucune mise à jour hors transaction de mouvement. Les soldes sont reconstruisibles depuis le journal. La quantité réellement vendable est le solde `available` filtré sur restriction, péremption et activité produit.

### product_valuations — coût moyen et valeur comptable

`T`, `E`, `product_id uuid`, `quantity_base qty`, `inventory_value money`, `average_unit_cost money`, `version bigint`, `U` ; unicité produit/établissement.

Projection verrouillée avant les lots pour sérialiser calcul du coût moyen et écritures concurrentes d'un même produit. Inclut le stock disponible et en quarantaine : un transfert entre compartiments ne crée ni coût ni perte. Une destruction sort de la valeur ; un retour reprend le coût historique de la sortie d'origine si connu. Un retour sans origine exige un coût documenté et autorisé. Le coût moyen = valeur / quantité quand quantité > 0 ; lors de la dernière sortie, le mouvement emporte exactement la valeur résiduelle, avec ajustement d'arrondi tracé dans l'audit, pour laisser quantité et valeur à zéro.

### stock_movements — journal immuable des quantités et valeurs

`T`, `E`, `product_id uuid`, `batch_id uuid`, `bucket varchar(20)`, `quantity_delta qty CHECK <> 0`, `value_delta money`, `kind varchar(30)`, `receipt_item_id uuid?`, `sale_allocation_id uuid?`, `return_item_id uuid?`, `stock_operation_item_id uuid?`, `count_item_id uuid?`, `reverses_movement_id uuid?`, `actor_id uuid`, `reason text?`, `occurred_at timestamptz`, `C`.

Exactement une origine non nulle parmi les cinq FK de ligne (`num_nonnulls(...)=1`). Types : réception, vente, retour, correction d'inventaire, transfert de quarantaine, retour fournisseur, destruction, compensation. La quantité est signée ; `bucket` utilise la même liste que `stock_balances`. Coût de sortie figé à la validation. Une compensation référence le mouvement original ; les compensations cumulées ne dépassent pas l'original, sous verrou transactionnel.

Un transfert disponible → quarantaine crée deux mouvements opposés de même valeur absolue, dans une seule opération. Pas de champ polymorphe `source_id` sans FK. Interdire `UPDATE` et `DELETE` du journal au rôle d'exploitation ; trigger d'immutabilité en complément.

### batch_actions — historique des restrictions (F15)

`T`, `E`, `product_id uuid`, `batch_id uuid`, `action varchar(20) CHECK IN ('block','unblock','recall','metadata_change')`, `reason text`, `actor_id uuid`, `old_values jsonb`, `new_values jsonb`, `occurred_at timestamptz`, `C`.

La libération de quarantaine et les destructions utilisent `stock_operations`, car elles ont un effet quantitatif. Une levée de blocage ne lève jamais implicitement un rappel ni une expiration.

### stock_operations / stock_operation_items — sorties et transferts autorisés

En-tête : `T`, `E`, `number varchar(60)`, `kind varchar(30) CHECK IN ('quarantine','release','supplier_return','dispose','adjustment','receipt_reversal')`, `status varchar(20) CHECK IN ('draft','posted','cancelled')`, `reason text`, `created_by uuid`, `approved_by uuid?`, `posted_at timestamptz?`, `C`, `U` ; numéro unique par tenant.

Ligne : `T`, `E`, `operation_id uuid`, `product_id uuid`, `batch_id uuid`, `source_bucket varchar(20)?`, `destination_bucket varchar(20)?`, `quantity_base qty CHECK > 0`, `unit_cost_reference money CHECK >= 0`, `original_movement_id uuid?`, `C`.

Au moins un compartiment non nul ; source et destination distinctes si les deux existent. Le type impose les combinaisons permises. Une libération exige contrôle qualité, autorisation et lot non expiré/non rappelé. Retour fournisseur et destruction sont des sorties ; une correction d'entrée référence l'écriture originale. Aucun flux de remboursement fournisseur n'est supposé dans le MVP.

### stock_counts / stock_count_items — inventaire physique (F03, F16)

En-tête : `T`, `E`, `number varchar(60)`, `status varchar(20) CHECK IN ('draft','counting','approved','cancelled')`, `created_by uuid`, `started_at timestamptz?`, `approved_by uuid?`, `approved_at timestamptz?`, `reason text?`, `C`, `U` ; numéro unique par tenant.

Ligne : `T`, `E`, `count_id uuid`, `product_id uuid`, `batch_id uuid`, `bucket varchar(20)`, `expected_quantity qty`, `counted_quantity qty? CHECK >= 0`, `balance_version bigint`, `counted_by uuid?`, `counted_at timestamptz?`, `reason text?`, `C`, `U` ; unicité `(tenant_id,establishment_id,count_id,product_id,batch_id,bucket)`.

Écart calculé = compté − attendu. Proposition : figer les opérations sur les produits comptés pendant le comptage ; la validation vérifie encore la version de chaque solde et rejette un comptage périmé. Toute ligne avec écart exige motif et autorisation. Les écarts validés créent des mouvements, jamais une affectation silencieuse de solde.

## 6. Caisse et dépenses

### cash_registers — caisses physiques/logiques

`T`, `E`, `name varchar(100)`, `is_active boolean`, `C`, `U` ; nom unique par établissement. Cette table permet de distinguer le poste de caisse du caissier et de sa session, sans ajouter de multi-boutiques.

### cash_sessions — ouverture et clôture (F05)

`T`, `E`, `register_id uuid`, `cashier_id uuid`, `status varchar(20) CHECK IN ('open','closed')`, `opened_by uuid`, `opened_at timestamptz`, `closed_by uuid?`, `closed_at timestamptz?`, `closing_reason text?`, `C`, `U`.

Deux index uniques partiels `WHERE status='open'` : par caisse et par caissier dans l'établissement. `closed_at >= opened_at`. Session ouverte exigée pour vente et mouvement d'espèces. Après clôture, aucune écriture supplémentaire dans cette session ; une régularisation est passée dans une session ouverte et référence la session corrigée.

### cash_session_currencies — fonds et comptage par devise

`T`, `E`, `session_id uuid`, `currency currency`, `opening_amount money CHECK >= 0`, `expected_at_close money?`, `counted_at_close money? CHECK >= 0`, `difference_at_close money?`, `C`, `U` ; unicité session/devise.

À la clôture, `expected_at_close = opening_amount + SUM(cash_movements.amount_delta)` et `difference_at_close = counted_at_close − expected_at_close`. Le fonds initial n'est pas aussi ajouté comme mouvement. Les deux devises sont comptées séparément ; aucun taux courant ne masque un écart. Les trois valeurs de clôture sont nulles à l'ouverture et obligatoires à la fermeture (contrôle inter-tables).

### expense_categories / expenses — dépenses (F06)

Catégorie : `T`, `E`, `name varchar(100)`, `is_active boolean`, `C`, `U` ; nom normalisé unique par établissement.

Dépense : `T`, `E`, `category_id uuid`, `number varchar(60)`, `description text`, `amount money CHECK > 0`, `currency currency`, `cdf_per_usd rate CHECK > 0`, `amount_reference money CHECK > 0`, `payment_method varchar(20) CHECK IN ('cash','bank','mobile_money')`, `cash_session_id uuid?`, `status varchar(20) CHECK IN ('draft','posted','reversed')`, `incurred_at timestamptz`, `created_by uuid`, `posted_at timestamptz?`, `C`, `U` ; numéro unique par tenant.

Une dépense espèces exige session ouverte et mouvement de sortie lié ; les autres ne modifient pas la caisse. `mobile_money` signifie enregistrement manuel, sans intégration opérateur. Une annulation compense la sortie initiale, sans supprimer la dépense.

### cash_operations — entrées, sorties, transferts et régularisations

`T`, `E`, `number varchar(60)`, `kind varchar(20) CHECK IN ('cash_in','cash_out','transfer','regularization')`, `currency currency`, `amount money CHECK > 0`, `source_session_id uuid?`, `destination_session_id uuid?`, `corrected_session_id uuid?`, `reason text`, `created_by uuid`, `approved_by uuid`, `posted_at timestamptz`, `C` ; numéro unique par tenant.

Transfert : deux sessions distinctes ouvertes, même devise, débit et crédit égaux dans une transaction. Entrée/sortie : un seul côté renseigné. Régularisation : lien obligatoire avec la session corrigée et nouvelle écriture dans une session ouverte. Change USD/CDF entre caisses hors MVP ; ne pas convertir implicitement un transfert.

### cash_movements — journal immuable des espèces

`T`, `E`, `session_id uuid`, `currency currency`, `amount_delta money CHECK <> 0`, `kind varchar(30)`, `payment_id uuid?`, `expense_id uuid?`, `cash_operation_id uuid?`, `reverses_movement_id uuid?`, `actor_id uuid`, `occurred_at timestamptz`, `C`.

Exactement une origine parmi paiement, dépense, opération. FK composite session/devise vers `cash_session_currencies` ; origine du même tenant/établissement. Les dépenses et paiements espèces ne sont comptés qu'ici pour la caisse, sans second débit/crédit calculé depuis leur document. Entrée du montant reçu et sortie de monnaie rendue sont deux écritures distinctes. La clôture verrouille la session avant de sommer le journal. Immutabilité comme le journal de stock.

## 7. Ventes, règlements et retours

### document_counters — numérotation atomique

`T`, `document_kind varchar(30)`, `period varchar(10)`, `last_value bigint CHECK >= 0`, `U` ; unicité tenant/type/période.

Incrément transactionnel par `INSERT ... ON CONFLICT ... DO UPDATE ... RETURNING`. Le numéro imprimé est unique par tenant ; jamais `MAX(number)+1`. L'UUID reste l'identifiant technique. Les séquences n'ont pas de garantie fiscale de continuité sans exigence validée.

### sales — tickets (F04)

`T`, `E`, `number varchar(60)`, `cashier_id uuid`, `session_id uuid`, `status varchar(25) CHECK IN ('posted','partially_returned','returned','voided')`, `reference_currency currency`, `cdf_per_usd rate CHECK > 0`, `exchange_rate_id uuid?`, `subtotal money CHECK >= 0`, `discount_total money CHECK >= 0`, `tax_total money CHECK >= 0`, `total money CHECK >= 0`, `rounding_adjustment money DEFAULT 0`, `posted_at timestamptz`, `C`.

`UNIQUE(tenant_id,number)`. `total = subtotal − discount_total + tax_total + rounding_adjustment`. Le MVP ne persiste pas de panier comme vente confirmée : document et effets sont créés ensemble. Historique des statuts dans audit/retours ; montants d'origine immuables après validation.

### sale_items — lignes et snapshots

`T`, `E`, `sale_id uuid`, `line_number integer`, `product_id uuid`, `packaging_id uuid`, `sku_snapshot varchar(80)`, `name_snapshot varchar(200)`, `packaging_snapshot varchar(60)`, `factor_snapshot qty CHECK > 0`, `quantity_packages qty CHECK > 0`, `quantity_base qty CHECK > 0`, `unit_price money CHECK >= 0`, `discount_amount money CHECK >= 0`, `tax_rate numeric(7,4) CHECK >= 0`, `tax_amount money CHECK >= 0`, `net_amount money CHECK >= 0`, `unit_cost_snapshot money CHECK >= 0`, `cost_total money CHECK >= 0`, `C`.

Unicité vente/numéro de ligne. Quantité base = quantité saisie × facteur. Remise ≤ brut. Prix dans la devise de référence ; taxes additionnelles proposées, arrondies par ligne. L'autorisation de remise est contrôlée et auditée. Toutes les sommes d'en-tête sont vérifiées contre les lignes avant commit.

### sale_line_batch_allocations — lots réellement vendus

`T`, `E`, `sale_item_id uuid`, `product_id uuid`, `batch_id uuid`, `quantity_base qty CHECK > 0`, `unit_cost_snapshot money CHECK >= 0`, `C` ; unicité ligne/lot.

Somme des quantités allouées = quantité de la ligne, contrôlée par trigger de contrainte différable à la fin de la transaction. Une ligne répartie sur deux lots possède deux allocations et deux mouvements de sortie. Même pour les produits sans suivi, l'allocation référence leur lot technique.

### payments — flux de règlement, y compris monnaie et remboursement

`T`, `E`, `sale_id uuid`, `return_id uuid?`, `session_id uuid?`, `direction varchar(10) CHECK IN ('in','out')`, `purpose varchar(20) CHECK IN ('settlement','change','refund')`, `method varchar(20) CHECK IN ('cash','bank','mobile_money')`, `currency currency`, `amount money CHECK > 0`, `cdf_per_usd rate CHECK > 0`, `amount_reference money CHECK > 0`, `external_reference text?`, `original_payment_id uuid?`, `received_by uuid`, `occurred_at timestamptz`, `C`.

Règlement = entrée ; monnaie rendue = sortie espèces ; remboursement = sortie liée à un retour. Le montant reçu n'est pas confondu avec le montant net affecté à la vente. Paiement espèces exige session ouverte ; non espèces exclu des espèces attendues. Le taux de règlement/monnaie est celui de la vente ; pour un remboursement, proposition de conserver ce taux historique, à valider. Conserver à six décimales les équivalents puis appliquer la règle d'arrondi du document.

À la validation de la vente, somme équivalents des règlements − monnaie rendue = total à tolérance près. La différence tolérée est enregistrée explicitement par `rounding_adjustment` ; elle ne devient pas un crédit caché. Les remboursements ultérieurs sont séparés de ce contrôle initial.

### sale_returns — annulation administrative et retour client

`T`, `E`, `number varchar(60)`, `sale_id uuid?`, `kind varchar(25) CHECK IN ('administrative_void','customer_return')`, `status varchar(20) CHECK IN ('draft','posted','cancelled')`, `reason text`, `created_by uuid`, `approved_by uuid?`, `refund_total_reference money CHECK >= 0`, `posted_at timestamptz?`, `C`, `U` ; numéro unique par tenant.

Annulation administrative : vente obligatoire, complète, sans retour physique antérieur ; vérifier qu'aucune marchandise n'a quitté le commerce. Compense les allocations et règlements d'origine ; si la session d'origine est close, remboursement dans une session ouverte. Un article physiquement rendu utilise `customer_return`, même si la demande est appelée « annulation » dans l'interface.

### sale_return_items — quantités physiques et prix remboursés

`T`, `E`, `return_id uuid`, `sale_item_id uuid?`, `allocation_id uuid?`, `product_id uuid`, `batch_id uuid`, `quantity_base qty CHECK > 0`, `refund_amount_reference money CHECK >= 0`, `unit_cost_snapshot money CHECK >= 0`, `destination_bucket varchar(20) CHECK IN ('available','quarantine')`, `C`.

FK assurant cohérence vente/ligne/allocation/produit/lot. Retours cumulés ≤ quantité vendue par allocation, sous verrou ; remboursements cumulés ≤ montant réellement encaissé et ≤ montant net des lignes retournées, à règle d'arrondi explicitée près. Retour client → quarantaine obligatoire ; annulation administrative → compensation du compartiment original, sous contrôle d'éligibilité. Retour sans preuve : lot identifié obligatoire en pharmacie et validation propriétaire ; dans cette proposition MVP, retour en quarantaine sans remboursement tant que la vente d'origine n'est pas retrouvée. Les paiements exigent une vente ; rembourser sans vente nécessiterait un flux et des contrôles supplémentaires. Une restitution sans origine connue ne recrée pas une vente fictive.

## 8. Audit, idempotence et justificatifs

### audit_logs

`tenant_id uuid?`, `establishment_id uuid?`, `actor_user_id uuid? → users`, `actor_membership_id uuid?`, `action varchar(100)`, `entity_type varchar(60)`, `entity_id uuid?`, `reason text?`, `old_values jsonb?`, `new_values jsonb?`, `request_id uuid?`, `occurred_at timestamptz`, `C`.

Acteur global conservé pour actions plateforme ; si membership renseigné, tenant obligatoire et FK composite. Métadonnées filtrées : aucun mot de passe, jeton ou secret. Journal en insertion seule, dans la transaction de l'action. `entity_type/entity_id` est une référence descriptive d'audit, pas une origine de journal financier.

### idempotency_requests

`T`, `E`, `actor_id uuid`, `operation varchar(80)`, `key varchar(150)`, `request_hash text`, `status varchar(20) CHECK IN ('processing','completed')`, `response_status integer?`, `response_body jsonb?`, `resource_id uuid?`, `completed_at timestamptz?`, `expires_at timestamptz?`, `C`.

`UNIQUE(tenant_id,establishment_id,operation,key)`. La clé est générée par le client et conservée sur reprise. Même clé/autre contenu ou autre acteur : conflit. L'insertion de la clé, l'opération métier et le résultat se valident dans la même transaction ; une seconde requête attend le verrou unique puis relit le résultat. Ne pas committer un état `processing` orphelin. Garder au minimum la clé et le hash des opérations financières après purge éventuelle du corps de réponse pour éviter une nouvelle opération tardive. L'autorisation est recontrôlée avant de restituer un résultat.

### attachments / expense_attachments / cash_operation_attachments

Fichier : `T`, `E`, `storage_key text UNIQUE`, `original_name text`, `media_type varchar(100)`, `size_bytes bigint CHECK > 0`, `sha256 varchar(64)`, `uploaded_by uuid`, `C`.

Liaison dépense : `T`, `E`, `expense_id uuid`, `attachment_id uuid`, `C` ; unicité du couple. Liaison opération de caisse : mêmes colonnes avec `cash_operation_id`. FK composites empêchant une pièce d'un autre commerce. Fichiers en stockage privé, accès via API autorisée ; aucune URL publique pérenne en base. Le binaire n'est pas stocké dans PostgreSQL.

Rapports et alertes sont dérivés des documents et journaux ; aucune table `dashboard` ou compteur de chiffre d'affaires faisant double vérité. `GET /api/v1/dashboard` lit ces documents pour l'accueil (ventes du jour, solde de caisse, sept derniers jours, activité récente) sans les recopier. Les exports persistants/notifications ne seront ajoutés que si leur cycle de vie est retenu.

## 9. Contraintes physiques et transactions obligatoires

### Clés étrangères composites

Une FK simple sur un UUID ne garantit pas la cohérence tenant. Exemples du contrat SQL à transcrire dans les migrations :

```sql
-- Clés candidates supplémentaires nécessaires aux FK ci-dessous.
UNIQUE (tenant_id, establishment_id, id) -- products
UNIQUE (tenant_id, establishment_id, product_id, id) -- batches/packagings
UNIQUE (tenant_id, establishment_id, sale_id, product_id, id) -- sale_items

-- Exemples de références ; ce bloc est illustratif, non une migration.
FOREIGN KEY (tenant_id, establishment_id, product_id)
  REFERENCES products (tenant_id, establishment_id, id) ON DELETE RESTRICT;
FOREIGN KEY (tenant_id, establishment_id, product_id, batch_id)
  REFERENCES product_batches (tenant_id, establishment_id, product_id, id)
  ON DELETE RESTRICT;
FOREIGN KEY (tenant_id, establishment_id, product_id, packaging_id)
  REFERENCES product_packagings (tenant_id, establishment_id, product_id, id)
  ON DELETE RESTRICT;
```

Même principe pour les parents de lignes et pour paiement/retour/vente : ajouter les clés candidates nécessaires afin qu'un retour ne référence pas une ligne d'une autre vente. Les colonnes de contexte répétées sont des clés d'intégrité contrôlées, pas des copies libres.

### Vérifications de fin de transaction

Des `CHECK` ne peuvent pas agréger d'autres lignes. Prévoir des triggers de contrainte différables pour les quantités allouées, totaux de vente/paiements, retours cumulés et cohérence des états comptabilisés. Le service fournit les erreurs métier, la base protège l'intégrité. Les limites sous concurrence exigent en plus des verrous ; un trigger lisant seulement une somme ne suffit pas.

### Validation atomique d'une vente

1. Vérifier utilisateur/session d'authentification, membership, droits et tenant ; acquérir la clé d'idempotence.
2. Verrouiller la session de caisse et exiger son état ouvert.
3. Verrouiller les valorisations produits par UUID croissant, puis les lots/soldes dans un ordre déterministe commun à toutes les opérations. Vérifier un éventuel inventaire bloquant.
4. Recontrôler les statuts du lot et l'expiration à l'instant serveur. Les opérations de rappel/blocage prennent les mêmes verrous.
5. Allouer FEFO (`expiry_date ASC`, `first_received_at ASC`, `id ASC`) ; FIFO pour les produits autorisés sans date. `NULLS LAST` pour dates absentes ; aucune date absente admise en `batch_expiry`.
6. Calculer snapshots, décimaux, remises/taxes, paiements et monnaie ; numéroter le ticket. Insérer vente, lignes, allocations, paiements, journaux, audit et résultat d'idempotence ; mettre à jour les projections sous verrou.
7. Valider les contraintes différables et committer une seule fois. En cas d'échec : rollback intégral. La réponse perdue après commit est récupérable avec la même clé.

Clôture et vente verrouillent la même session, dans le même ordre. Réceptions, comptages, retours, libérations et destructions utilisent le même protocole produit/lot ; gérer les erreurs de sérialisation/deadlock par reprise bornée avec la même clé.

### Index proposés

- Index sur chaque FK référençante, préfixé par `tenant_id, establishment_id` pour les tables métier.
- Produits : unicité SKU, index de catégorie/activité ; recherche nom via `pg_trgm` seulement après mesure. Codes-barres : index unique direct.
- Lots : `(tenant_id,establishment_id,product_id,restriction,expiry_date,first_received_at,id)` ; alertes par `(tenant_id,establishment_id,expiry_date)`.
- Mouvements de stock : `(tenant_id,establishment_id,product_id,batch_id,occurred_at,id)` ; index de chaque origine et compensation.
- Ventes : `(tenant_id,establishment_id,posted_at,id)` et `(tenant_id,establishment_id,cashier_id,posted_at)`.
- Caisse : `(tenant_id,establishment_id,session_id,currency,occurred_at,id)` ; paiements indexés par vente et retour.
- Audit : `(tenant_id,occurred_at,id)` et `(tenant_id,entity_type,entity_id)`.
- Sessions et jetons : index sur expiration/révocation pour entretien, unicité des hash.

RLS reste une défense supplémentaire à implémenter et tester ultérieurement. Les FK composites n'empêchent pas une lecture non filtrée : tous les accès doivent appliquer le contexte serveur, y compris exports, fichiers et rapports.

## 10. Correspondance avec l'existant et ordre des migrations

Le dépôt contient déjà `tenants`, `establishments`, `users`, `memberships`, `audit_logs`, puis une migration de profil tenant et d'abonnements. Le présent document ne les modifie pas. Les modifications en cours dans le backend sont conservées.

Écarts à traiter par migrations additives après validation :

- Harmoniser `tenants.currency` vers le concept `reference_currency` sans perdre les valeurs ; conserver l'adresse tenant existante comme adresse de compte, distincte d'une éventuelle adresse de point de vente.
- Extraire les codes `plan` en `plans`, relier les abonnements, préserver les périodes et l'audit existants. Résoudre les éventuels chevauchements avant d'activer l'exclusion temporelle.
- Ajouter activité des comptes, sessions révocables, invitations, dérogations et acteur global d'audit.
- Ajouter clés candidates/FK composites et protection des historiques ; rechercher les incohérences avant de rendre les contraintes obligatoires.
- Conserver les identifiants existants. Ne pas réécrire une migration déjà appliquée et ne pas recréer la base pour aligner le modèle.

Ordre proposé :

1. Renforcement du socle, plans et abonnements, paramètres, taux, sessions d'authentification. **Implémenté** : migration `1729900000000-socle-accounts-plans-settings`.
2. Catalogue, médicaments, conditionnements et codes-barres. **Implémenté** : migration `1730000000000-catalog`.
3. Lots, réceptions, soldes, valorisations, inventaires et opérations de stock.
4. Caisses, sessions, dépenses et opérations financières.
5. Ventes, lignes, allocations, retours et paiements.
6. Journaux de stock/caisse et FK cycliques ajoutées après création des tables sources ; idempotence, pièces et triggers de cohérence.
7. Index, permissions du rôle applicatif, données de référence et tests d'intégration PostgreSQL.

Ces lots de DDL sont une séquence de construction ; ne pas activer un module métier avant ses journaux et contraintes.

### État d'implémentation

Le lot 1 (socle) et le lot 2 (catalogue) sont appliqués en PostgreSQL ; les lots 3 à 7 restent à produire.

| Élément du dictionnaire | État |
| --- | --- |
| `plans` (formules) + seed `essential`/`control` | créé |
| `subscriptions.plan_id`, `starts_at`/`ends_at`, `agreed_price`, `currency`, `employee_limit`, exclusion GiST | créé, valeurs existantes reprises |
| `tenants.plan` retiré (source unique = abonnement), `chk_tenants_status` (`closed` inclus) | fait |
| `establishments.address`, `is_active`, `UNIQUE(tenant_id)` au MVP, clé candidate `(tenant_id,id)` | fait |
| `users.phone`, `is_active`, `password_changed_at`, unicité `lower(email)` | fait |
| `users.first_name`, `users.last_name`, `users.avatar_key` | à prévoir |
| `memberships` : `CHECK role`, clé candidate `(tenant_id,id)` | fait |
| `establishment_settings`, `expiry_alert_rules`, `exchange_rates` | créés |
| `membership_permissions`, `auth_sessions`, `access_tokens` | créés (aucune route ne les utilise encore) |
| `audit_logs` : `establishment_id`, `actor_user_id`, `actor_membership_id`, `reason`, `request_id`, métadonnées `jsonb` | fait |
| `updated_at` garanti par trigger sur les tables à convention `U` | fait |
| `product_categories`, `products`, `drug_details`, `product_packagings`, `product_barcodes` | créés (lot 2) |
| Catalogue : unicité `(tenant_id, sku)`, `lower(name)` des catégories, index partiel « une base par article », FK composites | fait |
| Règles pharmacie : médicament ⇒ `batch_expiry` + `fefo`, informations médicament réservées aux pharmacies | fait (service + tests e2e) |

Points du §11 désormais tranchés côté produit : durée d'essai fixée à 30 jours ; un tenant suspendu perd tout accès (aucune lecture/export). Les autres arbitrages restent ouverts.

## 11. Arbitrages à valider avant de figer le schéma

1. **Valorisation** : coût moyen pondéré proposé ; FEFO conservée pour la sélection physique. Confirmer le traitement des retours sans origine et des résidus de valorisation.
2. **Péremption** : début ou fin du jour indiqué, date fabricant limitée au mois, correction de date et contrôle qualité. Aucune convention réglementaire présumée.
3. **Stock négatif** : proposition de l'interdire strictement au MVP, y compris aux propriétaires. Le CDC évoque une dérogation ; si elle est retenue, concevoir le traitement du coût et des lots manquants avant d'enlever `quantity >= 0`.
4. **Monnaie et fiscalité** : arrondi proposé `half-up`, montants affichés au centime, calculs à six décimales ; confirmer pas d'encaissement CDF, prix taxes incluses ou hors taxes, précision, règle de remise et tolérance. Si taxes incluses retenues, adapter calculs et snapshots avant migration.
5. **Retours** : conditions de remboursement sans ticket, remboursement au taux historique proposé, autorité de libération, distinction retour physique/annulation et traitement des marchandises périmées.
6. **Inventaires** : blocage temporaire des produits comptés proposé ; alternative de comptage avec reconstitution des mouvements à concevoir si nécessaire.
7. **Périmètre** : confirmer exclusion des réservations, du crédit, des quantités fractionnaires et du change entre caisses. Ces exclusions ne sont pas présentées comme déjà approuvées.
8. **Abonnements et accès** : durée d'essai, nombre d'employés, lecture/export après suspension, conservation et purge des données.

## 12. Recette du modèle avant mise en production

- AC-01/09 : carton 24, boîte 30, facteurs modifiés ensuite sans altérer l'historique.
- AC-02 : 10 USD réglés 5 USD + 12 500 CDF au taux 2 500 ; exemple avec monnaie rendue dans une autre devise ; aucun double encaissement dans le journal.
- AC-03 : fonds initial + flux, 100 attendus/95 comptés, écart −5 ; impossibilité d'écrire dans la session close.
- AC-04/13/17 : références forgées produit/lot/vente/justificatif d'un autre tenant rejetées par FK et accès API.
- AC-05/11 : annulation sans sortie physique compensée ; retour physique en quarantaine ; pas de double remboursement ni double retour.
- AC-06/12 : deux transactions pour la dernière unité, une seule validée ; réception, rappel et clôture concurrents testés également.
- AC-07/08/10/14/15/22 : FEFO multi-lots, rappel immédiat, expiration au fuseau local, alimentation périssable, quarantaine partielle et libération contrôlée.
- AC-18/19 : réponse perdue puis reprise même clé, une seule vente et un seul ensemble de mouvements ; clé identique/contenu différent refusé.
- Réconciliation : projections de stock = somme des journaux ; caisse attendue = fonds + journal ; retours et destructions ne gonflent ni marge ni chiffre d'affaires.
- Migration sur copie de l'existant et restauration PostgreSQL vérifiées avant activation. SQLite ne constitue pas une preuve des verrous, exclusions, triggers différables ou contraintes PostgreSQL.

**Validation actuelle : lots 1 et 2 migrés et vérifiés sur PostgreSQL 16 (contraintes, index partiel et triggers contrôlés) ; la recette métier des lots 3 à 7 reste à effectuer.**
