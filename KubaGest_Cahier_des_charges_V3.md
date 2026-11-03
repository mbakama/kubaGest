# KUBAGEST

**CAHIER DES CHARGES FONCTIONNEL ET TECHNIQUE**

Source : [cahier des charges Word V3](KubaGest_Cahier_des_charges_V3_Backend_Electron_Mobile.docx). Transcription du contenu en Markdown ; les propositions et points restant à valider sont conservés. Décision projet du 24 octobre 2026 : Flutter est retenu pour le mobile ; les passages concernés ci-dessous sont actualisés. Le document Word V3 reste la source historique et n’a pas été modifié.

Application SaaS de gestion commerciale pour boutiques, alimentations et pharmacies à Kinshasa

Version 3.0  |  23 octobre 2026  |  Statut : proposition à valider

Périmètre : backend unique, application de bureau Angular et Electron, application mobile, MVP et modèle économique

## 1. Synthèse exécutive

KubaGest est une application de gestion destinée aux boutiques, alimentations et pharmacies de Kinshasa. Sa promesse est de permettre au propriétaire de contrôler les ventes, les stocks, les encaissements et les écarts de caisse à distance. Le produit sera commercialisé par abonnement, avec installation, import initial des articles et formation.

Le MVP privilégie une boutique, un propriétaire et deux employés maximum, un usage connecté et une interface simple sur ordinateur et smartphone. Les fonctions hors ligne avancées, WhatsApp automatisé et multi-boutiques sont hors MVP, sauf validation contraire lors des entretiens terrain.

## 2. Contexte, objectifs et indicateurs

| Objectif | Indicateur / critère |
| --- | --- |
| Réduire les erreurs de caisse | Écart visible et justifié à chaque clôture |
| Suivre le stock | Tout mouvement traçable et valorisé |
| Accélérer la vente | Parcours de vente simple, objectif < 30 s pour une vente courante (à tester) |
| Permettre le pilotage à distance | Tableau de bord mobile accessible au propriétaire |
| Valider la commercialisation | 5 entretiens, 2 pilotes, au moins 1 conversion payante ciblée |

Les indicateurs sont des objectifs de validation, non des résultats garantis.

## 3. Parties prenantes et rôles

| Rôle | Droits essentiels |
| --- | --- |
| Propriétaire / administrateur boutique | Paramètres, utilisateurs, produits, prix, rapports, clôtures, audit |
| Caissier | Ouverture de caisse, ventes, encaissements, clôture de sa session |
| Gestionnaire stock (optionnel) | Réception, inventaire et ajustements autorisés |
| Super administrateur plateforme | Gestion des abonnements et tenants; pas d’accès implicite aux données métier |

Principe : moindre privilège; toute action sensible nécessite autorisation explicite et journalisation.

## 4. Périmètre du MVP

| Inclus en V1 | Reporté |
| --- | --- |
| Inscription/activation d’une boutique, comptes et rôles | Multi-boutiques et franchise |
| Produits, catégories, codes-barres facultatifs, unités pièce/carton | Gestion complète des fournisseurs et commandes |
| Stock, entrées, ajustements, inventaire | Prévisions de réapprovisionnement |
| Vente rapide, remise encadrée, paiement USD/CDF/mixte | Intégration terminal de paiement / Mobile Money |
| Ouverture, mouvements et clôture de caisse | WhatsApp automatisé |
| Dépenses, dashboard, rapports PDF/CSV | Comptabilité OHADA complète |
| Audit, sauvegardes, abonnement | Mode hors ligne avec synchronisation bidirectionnelle |

## 5. Exigences fonctionnelles détaillées

### F01 — Boutiques et utilisateurs

- Créer un tenant boutique avec nom, devise de référence, adresse facultative, statut et formule.

- À la création du compte, enregistrer le prénom et le nom, un téléphone facultatif, l’email et le mot de passe. Une photo de profil est facultative. Le prénom sert à la salutation de l’accueil ; la photo s’affiche à côté lorsqu’elle existe.

- Inviter/créer les utilisateurs; activer, suspendre et réinitialiser leurs accès. Chaque compte porte aussi un prénom et un nom.

- Empêcher l’accès aux données d’une autre boutique, y compris via identifiants d’URL.

### F02 — Catalogue produits

- Créer article avec SKU unique par boutique, nom, catégorie, prix de vente, coût d’achat, seuil d’alerte et unité de base.

- Définir conditionnements : ex. 1 carton = 24 pièces; conversions entières positives.

- Gérer plusieurs prix par unité, code-barres facultatif et statut actif/inactif.

- Bloquer la suppression physique d’un article référencé par une transaction.

### F03 — Stocks et inventaires

- Enregistrer entrées initiales et réceptions avec référence, auteur et date.

- Décrémenter le stock uniquement lors de la validation d’une vente; transaction atomique.

- Journaliser chaque mouvement (vente, retour, réception, ajustement) avec motif.

- Inventaire physique : compter, calculer écart et exiger une validation pour ajuster.

- Empêcher le stock négatif par défaut, sauf permission spécifique documentée.

### F04 — Point de vente

- Recherche par nom/SKU/code-barres, ajout au panier, choix pièce/carton, quantité, remise.

- Calculer total, taxes si paramétrées, monnaie à rendre et détail de paiement.

- Supporter USD, CDF et paiement mixte avec taux figé sur la vente.

- Créer numéro de ticket unique par boutique; générer ticket imprimable/PDF.

- Annuler ou rembourser avec motif, autorisation et mouvement inverse; jamais effacer une vente.

### F05 — Caisse

- Ouvrir une session par caissier avec fonds initial par devise.

- Enregistrer encaissements, sorties autorisées et transferts avec pièces justificatives facultatives.

- Clôturer en saisissant les espèces comptées par devise.

- Comparer espèces attendues et comptées; distinguer ventes à crédit et paiements non espèces.

- Après clôture, verrouiller la session; corrections via écritures de régularisation auditables.

### F06 — Dépenses et rapports

- Enregistrer une dépense avec catégorie, montant, devise, caisse, auteur et justificatif facultatif.

- Dashboard : ventes, encaissements, dépenses, marge brute estimée, produits à faible stock, écarts.

- Filtrer par période, utilisateur, catégorie, devise; exporter PDF et CSV.

- Ne pas confondre chiffre d’affaires, encaissements, marge brute et bénéfice net.

### F07 — Paramètres et abonnement

- Paramétrer taux USD/CDF, unités, autorisations de remise, seuils et devise d’affichage.

- Afficher formule, échéance, statut essai/actif/suspendu.

- Conserver un accès lecture/export raisonnable après suspension selon politique contractuelle.

## 6. Règles métier et calculs

| Règle | Définition |
| --- | --- |
| Stock en unité de base | Stock = entrées − sorties ± ajustements; vente d’un carton de 24 = sortie de 24 pièces |
| Montant vente | Somme (quantité × prix unitaire − remise ligne), avec arrondi monétaire documenté |
| Conversion devise | Montant converti = montant × taux applicable; enregistrer taux et sens de conversion |
| Marge brute estimée | Ventes nettes − coût des marchandises vendues; méthode de coût moyen pondéré recommandée pour V1 |
| Espèces attendues | Fonds initial + encaissements espèces + entrées caisse − sorties caisse − remboursements espèces |
| Écart caisse | Espèces comptées − espèces attendues, calcul séparé par devise |
| Paiement mixte | Somme des équivalents dans devise de référence = total dû, tolérance d’arrondi paramétrée |
| Stock concurrent | Verrouillage ou contrôle de version lors des validations simultanées |

Le crédit client, si demandé pendant le pilote, fera l’objet d’une extension dédiée avec échéancier et paiements partiels.

## 7. Parcours utilisateurs et écrans

| Écran | Actions |
| --- | --- |
| Inscription | Activité, commerce, puis la personne : prénom, nom, téléphone facultatif, photo facultative, email et mot de passe |
| Connexion / sélection boutique | Authentification, récupération, sélection du contexte autorisé |
| Accueil propriétaire | KPI, ventes, stock critique, alertes de caisse |
| Caisse / POS | Recherche, panier, remise, paiement, ticket |
| Ouverture / clôture | Fonds, mouvements, comptage, écart, validation |
| Produits et stock | CRUD, conditionnements, réceptions, inventaires |
| Rapports | Filtres, détails, exports |
| Administration | Utilisateurs, taux, permissions, abonnement |

Scénario principal : connexion caissier → ouverture caisse → sélection d’articles → paiement → émission ticket → mise à jour stock → clôture → vérification par propriétaire.

## 8. Critères d’acceptation — scénarios Gherkin

### AC-01 Vente carton

Étant donné 50 pièces en stock et un carton de 24, quand un carton est vendu, alors le stock restant est 26 pièces.

### AC-02 Paiement mixte

Étant donné une vente de 10 USD et un taux de 2 500 CDF/USD, quand 5 USD et 12 500 CDF sont encaissés, alors la vente est soldée et le taux enregistré.

### AC-03 Clôture

Étant donné 100 USD attendus et 95 USD comptés, quand la caisse est clôturée, alors l’écart affiché est −5 USD et la session est verrouillée.

### AC-04 Isolation

Étant donné deux boutiques A et B, quand un utilisateur A tente de consulter une vente B, alors l’API refuse l’accès.

### AC-05 Annulation

Étant donné une vente validée, quand elle est annulée par un utilisateur autorisé, alors un événement inverse de stock et de caisse est créé, avec motif.

### AC-06 Concurrence

Étant donné 1 pièce restante, quand deux caissiers vendent simultanément 1 pièce, alors une seule vente est confirmée.

## 9. Architecture technique

Un backend NestJS modulaire expose une API REST commune /api/v1 aux deux clients : une application de bureau dont le frontend Angular est intégré dans Electron, et une application mobile distincte. L’application mobile est développée avec Flutter (décision du 24 octobre 2026). PostgreSQL avec TypeORM et migrations versionnées assure la persistance. Le backend centralise les règles métier, transactions, permissions et contrôles de tenant. Déploiement serveur : conteneurs, reverse proxy HTTPS, logs, sauvegardes et supervision. La version Angular 18 mentionnée au cadrage initial est une référence historique ; les versions et leur compatibilité avec Electron seront validées au démarrage.

Approche multi-tenant initiale : base partagée avec tenant_id sur chaque table métier, index composites et filtrage systématique côté service/repository; envisager PostgreSQL RLS comme défense complémentaire après tests. Aucun tenant_id fourni par le client ne doit faire autorité.

## 10. Modèle de données conceptuel

| Entité | Champs principaux / relations |
| --- | --- |
| tenants | id, name, status, plan_id, created_at |
| users / memberships | id, first_name, last_name, email, phone?, avatar?, password_hash; tenant_id, user_id, role |
| products | id, tenant_id, sku, name, category_id, base_unit, cost, active |
| product_units | id, product_id, label, factor_to_base, sale_price |
| stock_movements | id, tenant_id, product_id, quantity_base, type, source_type/id, actor_id |
| stock_counts | id, tenant_id, status, created_by; lignes de comptage |
| sales / sale_items | id, tenant_id, cashier_id, session_id, currency, fx_rate, totals; product, qty, price, cost_snapshot |
| payments | id, sale_id, method, currency, amount, fx_rate |
| cash_sessions / cash_movements | id, tenant_id, cashier_id, opened_at, closed_at, expected, counted; type, amount |
| expenses | id, tenant_id, category_id, amount, currency, cash_session_id |
| audit_logs | id, tenant_id, actor_id, action, entity, entity_id, timestamp, metadata |
| subscriptions | id, tenant_id, plan_id, start_at, end_at, status |

Utiliser UUID ou identifiants non prédictibles pour les ressources exposées; montants DECIMAL/NUMERIC, jamais float; dates UTC stockées et affichées selon le fuseau du commerce.

## 11. Contrats API indicatifs

| Méthode | Route | Usage |
| --- | --- | --- |
| POST | /api/v1/auth/register | Créer le commerce et le compte du propriétaire |
| POST | /api/v1/auth/login | Connexion |
| GET/POST | /api/v1/products | Lister/créer produit |
| POST | /api/v1/stock/receipts | Réception stock |
| POST | /api/v1/sales | Valider vente atomique |
| POST | /api/v1/sales/{id}/void | Annulation autorisée |
| POST | /api/v1/cash-sessions/open | Ouvrir caisse |
| POST | /api/v1/cash-sessions/{id}/close | Clôturer caisse |
| GET | /api/v1/reports/daily | Rapport journalier |
| GET | /api/v1/dashboard | Indicateurs propriétaire |

Toutes les routes métier exigent authentification, contexte tenant dérivé du jeton/session et contrôles d’autorisation. Prévoir idempotency-key sur ventes et paiements pour éviter les doublons lors de reprises réseau.

## 12. Exigences non fonctionnelles

- Sécurité : HTTPS, mots de passe hachés Argon2id/bcrypt, limitation de débit, journal d’audit, gestion des secrets et protection contre injection/XSS/CSRF selon architecture.

- Performance : objectif indicatif p95 < 2 secondes sur actions usuelles avec réseau normal, à mesurer sur appareils d’entrée de gamme.

- Disponibilité : cible de service 99,5 % mensuelle hors maintenances planifiées, à ajuster selon budget d’hébergement.

- Résilience : sauvegarde quotidienne minimum, restauration testée mensuellement; définir RPO 24 h et RTO 8 h au lancement.

- Accessibilité et ergonomie : gros boutons POS, recherche clavier, lisibilité mobile, français clair, messages d’erreur actionnables.

- Données : séparation des boutiques, chiffrement en transit, politique de conservation, export client, gestion des incidents.

- Compatibilité : application Angular et Electron, Windows cible initiale à confirmer ; application mobile, systèmes et versions à valider. Tester le scanner et l'imprimante ticket sur le matériel pilote. La diffusion du frontend Angular dans un navigateur reste une décision ouverte.

- Observabilité : erreurs applicatives, métriques, logs sans secrets ni données sensibles excessives.

## 13. Qualité et stratégie de tests

- Tests unitaires : conversions d’unités, calculs USD/CDF, marge, arrondis, écarts de caisse.

- Tests d’intégration : transactions SQL, concurrence, droits d’accès, tenant isolation, idempotence.

- Tests E2E : ouverture → vente → paiement → stock → clôture → rapport.

- Tests sécurité : tentatives cross-tenant, élévation de privilèges, brute force, injection et accès direct aux ressources.

- Tests de restauration : restaurer une sauvegarde dans un environnement isolé.

- Recette pilote : deux boutiques, scénarios réels, incidents consignés, validation écrite du responsable.

## 14. UX et principes d’interface

- Navigation propriétaire : Accueil, Ventes, Produits, Stock, Caisse, Rapports, Paramètres.

- Navigation caissier : Vendre, Historique de session, Clôturer.

- Une action primaire visible par écran; clavier et lecteur de code-barres si disponibles.

- Affichage explicite de la devise et du taux sur chaque vente; confirmations pour annulations.

- Prévoir un mode démonstration avec données fictives pour les prospects.

## 15. Planning indicatif et livrables

| Période | Livrable / jalon |
| --- | --- |
| S1 | 5 entretiens terrain, processus observés, backlog priorisé, maquettes |
| S2 | Base NestJS/Angular, auth, tenant, catalogue, unités |
| S3 | Stock, POS, paiements, transactions, tickets |
| S4 | Caisse, dépenses, dashboard, rapports, tests |
| S5 | Pilote 1 et 2, correctifs, formation, support |
| S6 | Bilan pilote, tarification finale, lancement commercial |

Ce calendrier provient du cadrage initial et ne constitue plus une estimation de livraison V3. La section 28 définit les jalons à réestimer pour le backend, Electron et le mobile.

## 16. Offre commerciale et opérations

| Formule indicative | Prix | Périmètre |
| --- | --- | --- |
| Essentiel | 10 USD/mois + 25 USD installation | Vente, stock, caisse, rapports simples |
| Contrôle+ | 20 USD/mois + 40 USD installation | 2 employés, audit, écarts et tableau de bord avancé |

Ces prix sont des hypothèses à tester; ils ne constituent pas une étude de marché. Définir contrat, durée d’essai, facturation, suspension, export, confidentialité, assistance, modalités de résiliation et réversibilité des données. L’installation comprend paramétrage, import limité de produits et formation initiale selon devis.

## 17. Acquisition et communication WhatsApp

- Créer un compte WhatsApp Business dédié, catalogue, réponses rapides et lien de contact.

- Publier 3 statuts par semaine : problème concret, démonstration courte, témoignage autorisé ou appel à démo.

- Approcher 20 commerces qualifiés; proposer une démo de 10 minutes et 14 jours de pilote.

- Mesurer : contacts, réponses, démos, essais, conversions, motifs de refus, coûts de support.

- Ne pas annoncer des fonctions non développées; recueillir le consentement avant messages commerciaux répétés.

Exemple de message : « Votre caisse correspond-elle vraiment à vos ventes ? Avec KubaGest, suivez ventes, stock et écarts de caisse depuis votre téléphone. Demandez une démonstration gratuite. »

## 18. Risques, hypothèses et arbitrages

| Risque | Réponse |
| --- | --- |
| Connexion instable | Tester la connectivité des pilotes; prioriser mode hors ligne si blocage commercial |
| Adoption faible | Parcours simple, formation, accompagnement et import initial |
| Prix trop bas pour le support | Mesurer heures/support/client; limiter périmètre et frais inclus |
| Erreurs de caisse ou stock | Transactions atomiques, audit, tests et procédures de correction |
| Pertes de données | Sauvegardes vérifiées, restauration et export |
| Confidentialité multi-tenant | Tests automatiques d’isolation et revue sécurité |
| Périmètre excessif | Backlog MoSCoW et validation stricte du MVP |

## 19. Définition de terminé et recette finale

- Toutes les fonctionnalités MVP sont opérationnelles et documentées.

- Les 6 scénarios d’acceptation critiques passent en environnement de recette.

- Aucune faille critique/haute non corrigée connue; isolation multi-tenant vérifiée.

- Sauvegarde et restauration démontrées; rapports cohérents avec ventes et mouvements.

- Guide propriétaire et guide caissier disponibles; formation pilote réalisée.

- Au moins deux boutiques pilotes ont réalisé des journées de ventes et une clôture réelle ou simulée.

- Procès-verbal de recette et liste des limites connues signés avant commercialisation.

## 20. Questions ouvertes à valider avant implémentation

- Les premiers clients possèdent-ils un PC, un smartphone Android ou les deux ?

- Connexion Internet stable pendant les heures d’ouverture ?

- Combien de caissiers et de caisses par boutique ?

- Quels moyens de paiement sont réellement utilisés ?

- Crédit client indispensable dès la V1 ?

- Imprimante ticket et scanner disponibles ?

- Mode de calcul des coûts accepté : coût moyen pondéré ou FIFO ?

- Exigences locales de facturation, fiscalité, confidentialité et conservation à faire vérifier par un professionnel compétent.

Document de cadrage. Les fonctionnalités, prix, SLA et délais restent à confirmer après entretiens et pilote terrain.

## 21. Addendum V2.0 — extension boutiques, alimentations et pharmacies

Cet addendum complète et prévaut sur les sections 1 à 20 en cas de contradiction. Le MVP vise trois types d’établissement. Le périmètre connecté, mono-établissement, un propriétaire et deux employés maximum demeure l’hypothèse de dimensionnement initiale ; il reste à confirmer commercialement.

### 21.1 Positionnement et activation métier

KubaGest permet aux propriétaires de boutiques, d’alimentations et de pharmacies de gérer leurs ventes, leurs stocks et leur caisse, et de suivre leur activité à distance. L’application adapte la gestion des produits, des conditionnements, des lots et des péremptions aux besoins de chaque établissement.

| Type | Fonctions obligatoires | Fonctions spécifiques |
| --- | --- | --- |
| Boutique | Catalogue, ventes, achats/réceptions, stock, caisse, dépenses, rapports | Unités pièce/carton, remises, crédits selon activation |
| Alimentation | Socle commun et réceptions | Lots et dates de péremption pour produits concernés ; alertes et FEFO configurable |
| Pharmacie | Socle commun et gestion des lots | Médicaments, FEFO obligatoire, blocage périmés, conversions boîte/plaquette/unité, retraits/retours tracés |

Le type d’établissement est fixé à l’activation. Les fonctionnalités sont pilotées par configuration serveur et autorisations ; une modification ultérieure de type nécessite une migration de données contrôlée.

## 22. Exigences fonctionnelles supplémentaires — pharmacie et alimentation

| ID | Exigence | Priorité MVP |
| --- | --- | --- |
| F08 | Fiche médicament : nom commercial, substance active, dosage, forme pharmaceutique, code interne/code-barres, unité de base. | Obligatoire pharmacie |
| F09 | Conditionnements par produit : boîte, plaquette, unité ; facteur de conversion entier strictement positif vers unité de base. | Obligatoire pharmacie |
| F10 | Réception par lot : identifiant de lot, date de péremption, quantité, conditionnement, fournisseur facultatif, prix de revient, auteur et horodatage. | Obligatoire pharmacie |
| F11 | Stock par établissement + produit + lot, avec quantité disponible et réservée, mouvements immuables. | Obligatoire pharmacie |
| F12 | Vente FEFO : allocation automatique sur lots vendables dont l’échéance est la plus proche ; affichage du ou des lots utilisés. | Obligatoire pharmacie |
| F13 | Blocage serveur des lots expirés, retirés, bloqués ou insuffisants ; impossibilité de contourner par API. | Obligatoire pharmacie |
| F14 | Alertes configurables de péremption à J-90/J-60/J-30 (valeurs par défaut proposées). | Obligatoire pharmacie ; configurable alimentation |
| F15 | Retrait, quarantaine, retour fournisseur et retour client par lot, avec motif, auteur, date et historique. | Obligatoire pharmacie |
| F16 | Inventaire et correction par lot avec justification, permission spécifique et journal d’audit. | Obligatoire pharmacie |
| F17 | Rapports par lot : stock, produits proches de péremption, pertes, retours et historique de vente. | Obligatoire pharmacie |

### 22.1 Réception de produits

- Une réception peut contenir plusieurs lignes et plusieurs lots pour un même produit.

- Pour un médicament soumis au suivi par lot, le numéro de lot et la date de péremption sont obligatoires avant validation.

- Une réception ne doit pas rendre vendable un lot déjà périmé ; l’enregistrer uniquement en quarantaine ou la refuser selon le flux défini.

- La conversion en unité de base est enregistrée avec son facteur historique afin de préserver la traçabilité en cas de modification future des conditionnements.

- Toute validation génère un mouvement d’entrée atomique et un événement d’audit.

### 22.2 Vente et allocation FEFO

- Le serveur trie les lots vendables par date de péremption croissante ; à égalité, par date de réception puis identifiant.

- Une vente peut consommer plusieurs lots : chaque affectation est conservée dans une ligne de ventilation vente-lot.

- La quantité totale affectée doit égaler la quantité vendue, exprimée en unité de base.

- Le stock disponible est vérifié et verrouillé transactionnellement pour empêcher les ventes concurrentes au-delà du disponible.

- Un lot périmé à la date locale de vente n’est jamais proposé à la vente. Un lot bloqué ou rappelé est exclu.

- Une vente annulée produit des mouvements compensatoires traçables, sans effacer les lignes d’origine.

### 22.3 Retours, retraits et péremptions

- Retour client : rattacher si possible la vente et le lot d’origine ; retour en quarantaine par défaut, jamais en stock vendable sans contrôle autorisé.

- Retrait/rappel : marquer le lot bloqué, interdire immédiatement la vente, enregistrer motif, initiateur, horodatage et destination.

- Péremption : changement automatique d’éligibilité à la vente selon la date, sans suppression des données ; comptabilisation des pertes après validation d’une opération de sortie.

- Une correction manuelle de date de péremption ou de numéro de lot requiert permission et historique avant/après.

## 23. Règles métier et calculs propres aux lots

| Règle | Définition |
| --- | --- |
| Unité de base | Quantité_stock_base = quantité_saisie × facteur_conversion ; exemple 2 boîtes × 30 comprimés = 60 unités. |
| Disponibilité | Disponible = entrées - ventes - sorties - retours en quarantaine + réintégrations autorisées - réservations. |
| FEFO | Ordre d’allocation = date_péremption ASC, date_réception ASC ; seuls lots actifs et non périmés. |
| Date d’expiration | Convention MVP : lot non vendable à partir de 00h00, date de péremption incluse, dans le fuseau de l’établissement. Convention à valider métier. |
| Paiements | Montants et taux USD/CDF enregistrés au moment de chaque transaction ; le suivi par lot n’altère pas la clôture de caisse. |
| Traçabilité | Aucune suppression physique de mouvements ; correction par écriture compensatoire avec auteur et motif. |
| Isolation | Toutes les requêtes métier sont filtrées par tenant_id et établissement_id côté serveur. |

## 24. Modèle de données — extensions V2.0

| Entité | Champs clés / contraintes |
| --- | --- |
| establishments | id, tenant_id, activity_type [BOUTIQUE, ALIMENTATION, PHARMACIE], timezone, currency_settings |
| products | id, tenant_id, establishment_id, category_id, name, sku, barcode, product_kind, requires_lot, requires_expiry |
| medication_details | product_id (unique), trade_name, active_ingredient, strength, pharmaceutical_form |
| product_packagings | id, product_id, label, units_per_pack, barcode nullable, is_base_unit ; contrainte units_per_pack > 0 |
| purchase_receipts | id, establishment_id, received_at, status, created_by, supplier_id nullable |
| receipt_lines | id, receipt_id, product_id, batch_id, packaging_id, quantity_packages, quantity_base, unit_cost |
| product_batches | id, establishment_id, product_id, batch_number, expiry_date, received_at, status ; index produit/date/statut |
| stock_movements | id, establishment_id, product_id, batch_id nullable, type, quantity_base signed, source_type, source_id, reason, actor_id, created_at |
| sale_line_batch_allocations | id, sale_line_id, batch_id, quantity_base ; somme = quantité ligne |
| batch_actions | id, batch_id, action [BLOCK, UNBLOCK, RECALL, RETURN, QUARANTINE, DISPOSE], reason, actor_id, occurred_at |
| audit_logs | id, tenant_id, entity_type, entity_id, action, old_values, new_values, actor_id, occurred_at |

Les clés étrangères doivent garantir la cohérence entre tenant, établissement, produit et lot. Une unicité métier (établissement, produit, numéro de lot, date de péremption) est à préciser après validation des cas de réceptions multiples. Utiliser des transactions SQL et des contraintes d’intégrité ; ne jamais se fier uniquement à l’interface.

## 25. Écrans et API — modifications V2.0

| Écran | Comportement attendu |
| --- | --- |
| Configuration établissement | Sélection boutique / alimentation / pharmacie ; options de suivi par lot selon métier. |
| Fiche produit | Informations communes, médicaments si pharmacie, conditionnements et conversions. |
| Réception | Saisie multi-lots, échéances, conditionnements, contrôles de cohérence. |
| Stock | Vue produit puis lots, quantités disponibles, état et échéance ; filtres par statut. |
| Point de vente | FEFO automatique, ventilation des lots, message de blocage explicite. |
| Retours et retraits | Recherche par produit/lot, motif obligatoire, historique et droits. |
| Tableau de bord | Alertes lots proches de péremption, expirés, bloqués, valeur des pertes. |
| Rapports | Export CSV/PDF des mouvements, lots, pertes et échéances. |

API indicatives : GET/POST /api/v1/products ; POST /api/v1/receipts ; GET /api/v1/products/{id}/batches ; GET /api/v1/batches/expiring ; POST /api/v1/sales ; POST /api/v1/batches/{id}/actions ; POST /api/v1/returns ; GET /api/v1/reports/batches. Toutes les mutations utilisent validation DTO, RBAC, transaction et audit.

## 26. Tests de recette supplémentaires

| Test | Critère d’acceptation |
| --- | --- |
| AC-07 FEFO | Avec lot A expirant avant B, une vente utilise A d’abord ; si A insuffisant, complète sur B. |
| AC-08 Périmé | Une vente incluant un lot expiré est rejetée côté API, même si la requête est forgée. |
| AC-09 Conversion | Une boîte de 3 plaquettes de 10 unités décompte exactement 30 unités de base. |
| AC-10 Retrait | Un lot rappelé disparaît des choix de vente immédiatement et l’auteur/motif restent consultables. |
| AC-11 Retour | Un retour client est enregistré par lot et mis en quarantaine sans réintégration automatique. |
| AC-12 Concurrence | Deux caissiers ne peuvent vendre simultanément au-delà de la quantité disponible sur un lot. |
| AC-13 Multi-tenant | Aucun lot, mouvement ou rapport d’un établissement n’est accessible à un autre tenant. |
| AC-14 Péremption | Le passage de la date limite désactive la vente du lot selon la convention horaire retenue. |
| AC-15 Alimentations | Une alimentation peut activer les lots et alertes sur les produits périssables sans champs pharmaceutiques. |

## 27. Architecture, planning, conformité et arbitrages

Architecture V3 : backend unique NestJS REST, PostgreSQL et TypeORM ; frontend Angular intégré dans Electron pour le bureau ; application mobile distincte utilisant la même API. JWT, RBAC et isolation multi-tenant sont communs aux deux clients. FEFO, péremption, conversions, calculs et transactions sont appliqués côté serveur. HTTPS, sauvegardes et audit sont obligatoires. Le MVP reste connecté ; la synchronisation hors ligne est exclue.

Les estimations V2 concernaient surtout l'extension métier pharmacie. Elles ne constituent pas un engagement V3. Le planning doit désormais intégrer les deux applications clientes, leurs distributions, le matériel et les tests croisés ; voir section 28.

Exclusions maintenues pour le MVP : ordonnances, dossiers patients, actes médicaux, comptabilité OHADA complète, paiement Mobile Money intégré, prévisions avancées, multi-boutiques et synchronisation hors ligne. Le module pharmacie n’est pas un dossier médical ni un outil de validation clinique.

Avant mise en production dans une pharmacie en RDC, faire vérifier les obligations applicables à la vente, à la conservation, à la traçabilité et aux retraits de médicaments par un professionnel du secteur et un conseil juridique local. Le cahier des charges ne présume pas de la conformité réglementaire.

### 27.1 Décisions restant à valider

- Date de péremption : convention exacte (début ou fin du jour indiqué) selon les usages réglementaires et fabricants.

- Gestion des médicaments sur ordonnance : hors MVP, mais préciser si une information « ordonnance requise » doit être affichée dès V1.

- Gestion de la vente à crédit : activation selon secteur et autorisations.

- Méthode de valorisation du stock et traitement comptable des pertes : coût moyen pondéré ou FIFO comptable.

- Politique de retour et de remise en vente : contrôle qualité et autorisations requises.

- Seuils d’alerte et canaux de notification ; règles de confidentialité et conservation des données.

## 28. Architecture et livrables V3

La V3 formalise trois composants : un backend unique, une application de bureau Angular intégrée dans Electron et une application mobile. Elle conserve les exigences métier boutiques, alimentations et pharmacies des sections précédentes. Cette section prévaut pour les choix techniques, le périmètre des clients et le planning. L'application mobile est un livrable distinct ; une interface responsive ou une PWA ne la remplace pas.

### 28.1 Backend unique et données communes

NestJS expose une seule API métier versionnée /api/v1. PostgreSQL est la source de référence commune, avec TypeORM et migrations. Les deux applications utilisent les mêmes comptes, établissements, produits, ventes, lots, stocks, caisses et rapports, selon leurs permissions. Aucun backend métier séparé ni base métier autonome dans Electron ou le mobile n'est prévu au MVP.

Le serveur applique systématiquement l'authentification, le contexte tenant et établissement, les autorisations, les calculs monétaires, la FEFO, les péremptions, les conversions et l'audit. Toute vente et ses effets de stock et de caisse sont atomiques. Les clés d'idempotence protègent les reprises après erreur réseau sur les deux clients.

### 28.2 Application de bureau Angular et Electron

Angular fournit les écrans métier ; Electron fournit le conteneur de bureau et les intégrations locales autorisées. L'application couvre le catalogue, les conditionnements, les réceptions, les lots, les inventaires, les ventes, les retours, les caisses, les dépenses, les rapports et les paramètres selon le secteur et le rôle. Windows est la cible initiale proposée ; les autres systèmes restent à décider.

Les imprimantes de tickets et lecteurs de codes-barres sont validés sur le matériel pilote. Le choix du pilote et du mode d'impression est à confirmer. Une installation Electron ne signifie pas fonctionnement hors ligne : la validation des opérations métier exige le backend joignable.

Sécurité Electron : contextIsolation activé, nodeIntegration désactivé dans le renderer, sandbox lorsque compatible ; API preload minimale avec contextBridge, canaux IPC explicitement autorisés et arguments validés. Interdire les navigations non autorisées, appliquer une politique CSP et ne pas exposer de secrets serveur. Prévoir signature des distributions, gestion des mises à jour et compatibilité API.

### 28.3 Application mobile

L'application mobile est distincte de l'application Electron et consomme le même backend. Flutter est retenu pour son développement (décision du 24 octobre 2026). Les projets Android et iOS sont initialisés ; les systèmes effectivement distribués, leurs versions minimales et le canal de distribution restent à valider.

Périmètre proposé pour validation : connexion du propriétaire, tableau de bord, consultation des ventes, encaissements, écarts de caisse, stock, lots et alertes de péremption selon les droits. Ce périmètre est une proposition de cadrage ; il ne vaut pas décision de limiter définitivement le mobile à la consultation.

Avant implémentation, décider explicitement si le mobile autorise aussi les ventes, ouvertures et clôtures de caisse, réceptions, inventaires et retours. Toute opération mobile retenue doit appliquer les mêmes contrôles serveur et la même traçabilité que le bureau. Définir également les besoins caméra et code-barres, impression, exports et notifications push.

### 28.4 Synchronisation et fonctionnement connecté

Les données validées sont enregistrées dans le backend et consultables depuis l'autre application après actualisation. Le mode de rafraîchissement, manuel, périodique ou temps réel, reste à choisir selon les écrans. Ne pas promettre une mise à jour instantanée sans mécanisme défini.

En cas de perte réseau, afficher clairement l'échec ou l'état incertain. Ne pas afficher une vente comme confirmée avant confirmation serveur. Une reprise conserve la clé d'idempotence et permet de vérifier le résultat sans créer de doublon. La vente hors ligne, les files de transactions autonomes et la synchronisation bidirectionnelle restent hors MVP.

### 28.5 Droits et sécurité entre applications

Les permissions dépendent du rôle et du secteur, jamais du seul type de client. Le masquage d'un bouton ne remplace pas un refus côté API. Un utilisateur ne peut consulter ou modifier un autre tenant, un établissement non autorisé ou un lot inaccessible par changement d'identifiant.

Prévoir révocation des sessions, expiration et renouvellement des jetons, déconnexion et stockage protégé des informations de session selon la plateforme. Aucun jeton, mot de passe ou secret ne doit apparaître dans les logs. Les notifications éventuelles respectent les droits du destinataire.

### 28.6 Livrables et déploiement

Livrable backend : code source NestJS, schéma et migrations PostgreSQL, documentation OpenAPI, configuration sans secrets, procédures de déploiement, sauvegarde et restauration.

Livrable bureau : code Angular et Electron, configuration de build, installateur pour le système retenu, procédure d'installation et de mise à jour, validation du matériel de caisse.

Livrable mobile : code source, builds pour les plateformes retenues, procédure de distribution et de mise à jour, configuration des environnements et guide utilisateur.

Livrables communs : tests, comptes de démonstration, guides par rôle, limites connues et procès-verbal de recette. L'accès web par navigateur est une option à valider ; il ne constitue pas un quatrième livrable engagé.

### 28.7 Recette V3 supplémentaire

AC-16 Données communes : une vente confirmée sur le bureau apparaît sur le mobile après actualisation pour un utilisateur autorisé, avec les mêmes montants, devises, taux et quantités.

AC-17 Droits : une opération interdite est refusée côté API depuis Electron comme depuis le mobile, y compris avec une requête forgée.

AC-18 Reprise réseau : après une réponse perdue, la répétition d'une vente avec la même clé d'idempotence ne crée ni seconde vente ni second mouvement de stock ou de caisse.

AC-19 Perte de connexion : aucun client ne présente une opération comme confirmée sans résultat serveur ; un état incertain permet une vérification sans doublon.

AC-20 Bureau : l'installateur fonctionne sur le système pilote ; le ticket est lisible et le lecteur de codes-barres est testé sur le matériel retenu.

AC-21 Mobile : le build fonctionne sur les appareils pilotes ; les écrans retenus, l'expiration de session et les restrictions de rôle sont vérifiés.

AC-22 Règles pharmacie : les règles FEFO, lots bloqués, péremption et retours en quarantaine sont identiques pour toute opération disponible sur les deux clients.

AC-23 Mise à jour : les applications restent compatibles avec la version API supportée ; une version obsolète reçoit un message actionnable selon la politique de maintenance.

### 28.8 Planning et jalons à réestimer

Jalon 1 : décisions produit, répartition bureau/mobile, plateformes, règles pharmacie et maquettes. Jalon 2 : socle backend, authentification, isolation, catalogue et contrats API. Jalon 3 : stocks, lots, ventes, paiements et caisses avec tests de concurrence et d'idempotence.

Jalon 4 : application Angular et Electron, parcours de caisse et matériel. Jalon 5 : application mobile selon périmètre validé. Jalon 6 : rapports, tests croisés, sécurité, distributions, restauration, formation et pilotes. Le travail client peut progresser en parallèle une fois les contrats API stabilisés.

Aucune durée de livraison V3 n'est engagée à ce stade. L'estimation doit tenir compte de la taille de l'équipe, de l'existant, des plateformes, du périmètre mobile et de l'accès au matériel. Le pilote doit couvrir les trois secteurs, dont au moins une pharmacie pour valider réellement les lots et péremptions ; le nombre et le calendrier restent à confirmer.

### 28.9 Décisions avant implémentation

Flutter étant retenu pour le mobile, valider les systèmes cibles et le périmètre exact des actions mobiles ; confirmer Windows et les éventuels autres systèmes bureau ; décider si un accès navigateur est demandé ; fixer le matériel et la distribution des applications.

Résoudre les points métier conservés de la V2 : crédit, convention de péremption, coût moyen pondéré ou FIFO comptable, retours et réintégrations. La FEFO détermine les lots sortants ; elle ne choisit pas à elle seule la méthode de valorisation.

Unifier product_units et product_packagings ainsi que les routes de réception avant de figer le contrat API. Définir le besoin et le cycle des réservations de stock, ou les retirer du MVP. Préciser le traitement d'une annulation administrative par rapport à un retour physique : aucun retour client ne redevient automatiquement vendable.

Les tarifs, modalités de support, politique de mises à jour et charges d'exploitation restent à confirmer pour les trois composants. Les exclusions métier et l'obligation de validation sectorielle de la V2 sont maintenues.
