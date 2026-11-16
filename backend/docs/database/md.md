# Mission : Documentation et audit de la base de données KubaGest

**Dossier cible :** `docs/database/`

Créer les trois documents suivants :

1. `01-MLD-ACTUEL.md`
2. `02-MLD-CIBLE-V1.md`
3. `03-ANALYSE-ECARTS.md`

## 1. MLD actuel

Documenter fidèlement le schéma existant à partir des entités TypeORM et des migrations.

Pour chaque table, préciser :
- Son rôle fonctionnel.
- Ses colonnes et types.
- Sa clé primaire.
- Ses clés étrangères.
- Ses contraintes et index.
- Ses relations avec les autres tables.
- Le module backend propriétaire.

Inclure un diagramme relationnel Mermaid.

Ne pas présenter comme vérifié en production un élément qui n'a été identifié que dans le code. Signaler les éléments dont l'existence réelle dans PostgreSQL reste à confirmer.

## 2. MLD cible V1

Documenter le modèle de données cible de KubaGest en tenant compte des décisions fonctionnelles déjà établies :

- Architecture multi-tenant.
- Entreprises et établissements.
- Entrepôt central et entrepôts secondaires.
- Catalogue par établissement.
- Produits physiques partagés entre établissements.
- Prix globaux et prix spécifiques par établissement.
- Achats et fournisseurs.
- Stocks, mouvements, transferts et inventaires.
- Ventes et paiements.
- Caisses et dépenses.
- Terminaux autorisés.
- Allocations de stock pour le fonctionnement hors ligne.
- Audit et synchronisation.
- Devises USD et CDF.
- Valorisation des stocks selon le CUMP.

Respecter les décisions V1 :
- Pas de ventes à crédit dans le parcours commercial V1.
- Flutter en consultation et supervision.
- Angular PWA pour les opérations.
- Pas de dépassement de stock autorisé.
- Conserver le multi-tenant.

Présenter les relations, contraintes métier, règles d'intégrité et un diagramme Mermaid.

Distinguer les décisions validées des éléments qui nécessitent encore une validation.

## 3. Analyse des écarts

Comparer le MLD actuel au MLD cible.

Pour chaque table ou fonctionnalité, indiquer :
- Existant, absent ou partiellement couvert.
- Action proposée : conserver, modifier, compléter, créer ou reporter.
- Justification fonctionnelle.
- Dépendances avec les autres tables.
- Risques de migration.
- Impact potentiel sur les API et les modules existants.

Proposer une stratégie de migration progressive, compatible avec les données existantes.

## Contraintes impératives

- Ne modifier aucune entité TypeORM.
- Ne créer aucune migration SQL ou TypeORM.
- Ne modifier aucune table PostgreSQL.
- Ne supprimer aucune donnée.
- Ne modifier aucun module backend.
- Ne changer ni la configuration ni les variables d'environnement.
- Ne pas introduire Prisma : le projet utilise TypeORM.
- Respecter l'organisation actuelle des dossiers backend.
- Ne pas inventer de colonnes, de relations ou de contraintes non vérifiées.
- Signaler explicitement les informations manquantes.

## Résultat attendu

Créer uniquement les trois fichiers Markdown dans `docs/database/`.

À la fin, fournir :
1. La liste des fichiers créés.
2. Les principales constatations.
3. Les incohérences ou informations à confirmer.
4. Les risques identifiés.
5. Les questions qui nécessitent une décision avant toute migration.

**Cette mission est exclusivement documentaire et analytique. Aucune modification de la base de données ou du code applicatif n'est autorisée.**