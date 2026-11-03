<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

API de **Kubagest**, construite avec [Nest](https://github.com/nestjs/nest) (TypeScript, ESM, Vitest).

## Prérequis

- Node.js >= 22 (npm >= 10)
- Copier la configuration locale :

```bash
$ cp .env.example .env
```

## Configuration

Les variables d'environnement sont chargées et **validées au démarrage** via
`@nestjs/config` (`src/config/env.validation.ts`). Une valeur invalide empêche
le démarrage avec un message explicite.

| Variable              | Description                                              | Défaut             |
| --------------------- | -------------------------------------------------------- | ------------------ |
| `NODE_ENV`            | `development`, `test` ou `production`                    | `development`      |
| `PORT`                | Port HTTP de l'API                                       | `3000`             |
| `CORS_ORIGIN`         | Origines autorisées, séparées par des virgules (`*` = toutes) | `*`            |
| `SWAGGER_ENABLED`     | Expose la documentation OpenAPI sur `/docs`              | `true`             |
| `DB_TYPE`             | `sqljs` (local, sans serveur) ou `postgres`              | `postgres`         |
| `DB_LOCATION`         | Fichier SQLite (vide = base en mémoire)                  | —                  |
| `DATABASE_URL`        | URL PostgreSQL (requise si `DB_TYPE=postgres`)           | —                  |
| `DB_SYNCHRONIZE`      | Création automatique du schéma ; `true` avec `sqljs`, `false` en production | `false` |
| `DB_LOGGING`          | Journalise les requêtes SQL                              | `false`            |
| `JWT_SECRET`          | Secret de signature JWT (32 caractères minimum)          | —                  |
| `JWT_EXPIRES_IN`      | Durée de validité des jetons                             | `1h`               |
| `OBSERVE_APP_KEY`     | Clé NestJS Observe (optionnelle, avec le secret)         | —                  |
| `OBSERVE_APP_SECRET`  | Secret NestJS Observe (optionnel, avec la clé)           | —                  |
| `OBSERVE_SERVICE_ID`  | Identifiant du service dans Observe                      | `kubagest-backend` |
| `PLATFORM_ADMIN_EMAIL`    | Email du super administrateur plateforme (optionnel, avec le mot de passe) | — |
| `PLATFORM_ADMIN_PASSWORD` | Mot de passe du super administrateur (créé ou promu au démarrage) | — |

La télémétrie [NestJS Observe](https://observe.nestjs.com) n'est activée que si
`OBSERVE_APP_KEY` et `OBSERVE_APP_SECRET` sont renseignées ensemble.

Le compte défini par `PLATFORM_ADMIN_EMAIL` / `PLATFORM_ADMIN_PASSWORD` est créé
au démarrage s'il n'existe pas, ou promu s'il existe déjà. Il ne reçoit aucun
rattachement tenant : ses jetons n'ouvrent aucune route métier (§3).

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Vérifications statiques

```bash
# types
$ npm run typecheck

# lint
$ npm run lint

# format
$ npm run format:check
```

## Base de données

PostgreSQL est la base de référence (cahier des charges §9 et §27) : le schéma
est versionné par migrations TypeORM dans `src/database/migrations/`, exécutées
au démarrage lorsque `DB_SYNCHRONIZE=false`.

Le fichier `.env.example` utilise **SQLite (sqljs)** pour permettre de démarrer
sans serveur : dans ce mode, `DB_SYNCHRONIZE` doit être `true` et les migrations
PostgreSQL ne s'appliquent pas.

### PostgreSQL en local

Le serveur PostgreSQL doit être joignable, le rôle applicatif et la base créés,
puis les migrations jouées. Sous Windows, un script idempotent s'en charge
(mot de passe superutilisateur demandé en saisie masquée, aucun secret écrit
sur le disque) :

```powershell
npm run db:setup        # crée le rôle et la base
npm run migration:run   # applique src/database/migrations
npm run start:dev
```

Avec Docker, le service `db` de `docker-compose.yml` fait la même chose :

```bash
docker compose up -d db
# puis dans .env :
# DB_TYPE=postgres
# DATABASE_URL=postgresql://kubagest:kubagest_dev_pwd@localhost:5432/kubagest
# DB_SYNCHRONIZE=false
$ npm run start:dev
```

Avec `DB_SYNCHRONIZE=false`, l'application exécute automatiquement les
migrations au démarrage. La CLI reste utile pour générer et annuler des
migrations :

| Script | Effet |
| --- | --- |
| `npm run migration:run` | applique les migrations en attente |
| `npm run migration:show` | affiche l'état des migrations |
| `npm run migration:revert` | annule la dernière migration |
| `npm run migration:generate -- src/database/migrations/Nom` | génère une migration par diff avec les entités |

La CLI lit `DATABASE_URL` depuis `.env` via `src/database/data-source.ts`.

## Architecture multi-tenant

- `tenants` : établissement commercial abonné (nom, devise de référence,
  adresse facultative, statut d'essai/actif/suspendu, formule).
- `establishments` : point de vente d'un tenant, avec son type d'activité
  (`boutique`, `alimentation`, `pharmacie`) et son fuseau horaire.
- `users` : comptes globaux (email, mot de passe haché) et indicateur
  `isPlatformAdmin` sans accès métier implicite.
- `memberships` : rattachement d'un compte à un tenant avec son rôle
  (`owner`, `cashier`, `stock_manager`).
- `audit_logs` : journal des actions sensibles (auteur, cible, motif,
  avant/après). Lignes en insertion seule.
- `subscriptions` : période d'abonnement d'un tenant (F07) : formule
  référencée par `plan_id`, statut, échéance, prix et limite contractuels. Un
  chevauchement de périodes pour un même tenant est exclu en base PostgreSQL.
- `plans` : formules commerciales (`essential`, `control`). Tarifs
  contractuels à confirmer : aucune valeur commerciale n'est imposée.
- `establishment_settings`, `expiry_alert_rules`, `exchange_rates` : paramètres
  du point de vente (remise maximale, tolérance de paiement, convention de
  péremption, seuils d'alerte, historique USD/CDF).
- `auth_sessions`, `access_tokens` : sessions révocables (refresh token haché)
  et jetons à usage unique (invitation, réinitialisation).
- `membership_permissions` : dérogations explicites combinées au rôle.

Le dictionnaire complet et l'ordre des migrations se trouvent dans
[`docs/database/SCHEMA.md`](../docs/database/SCHEMA.md) et le diagramme dans
[`docs/database/relations.mmd`](../docs/database/relations.mmd).

### Essai et suspension

- L'activation accorde un **essai de 30 jours** : `subscriptions.ends_at` est
  fixée à `now() + 30 jours` (`TRIAL_PERIOD_DAYS` dans
  `src/tenants/tenant.constants.ts`).
- Un tenant `suspended` ne peut **plus rien faire** : la connexion est refusée
  (`403`) et les jetons déjà émis sont rejetés à chaque requête, car
  `TenantGuard` relit le statut en base. Seul le super administrateur
  plateforme conserve l'accès pour réactiver le tenant.

Le contexte tenant est porté par le jeton JWT ; aucun `tenant_id` fourni par le
client ne fait autorité (§9, §28.1). Toutes les routes métier sont filtrées côté
serveur.

## Documentation de l'API

Avec `SWAGGER_ENABLED=true`, OpenAPI est servi sur
[http://localhost:3000/docs](http://localhost:3000/docs). Le bouton
« Authorize » accepte un jeton JWT `Bearer`.

Toutes les routes métier sont versionnées sous `/api/v1`. `GET /api` reste une
sonde non versionnée utilisée par le client de bureau.

## Authentification

| Méthode | Route                  | Accès            | Description                                 |
| ------- | ---------------------- | ---------------- | ------------------------------------------- |
| `GET`   | `/api/v1/health`       | Public           | État de l'API et de la base                 |
| `POST`  | `/api/v1/auth/register`| Public           | Activer un établissement et son propriétaire |
| `POST`  | `/api/v1/auth/login`   | Public           | Obtenir un jeton et un contexte tenant      |
| `GET`   | `/api/v1/auth/me`      | Authentifié      | Profil et établissements rattachés          |
| `GET`   | `/api/v1/tenants/current` | Authentifié (tenant) | Profil, établissements et abonnement    |
| `PATCH` | `/api/v1/tenants/current` | Rôle `owner`     | Nom, devise de référence, adresse           |
| `GET`   | `/api/v1/tenants/current/establishments` | Authentifié (tenant) | Établissements du tenant |
| `GET`   | `/api/v1/users`        | Rôle `owner`     | Utilisateurs de l'établissement             |
| `POST`  | `/api/v1/users`        | Rôle `owner`     | Créer un caissier ou gestionnaire de stock  |
| `GET`   | `/api/v1/platform/tenants` | Super admin plateforme | Tenants et abonnements               |
| `PATCH` | `/api/v1/platform/tenants/{id}/subscription` | Super admin plateforme | Formule, statut, échéance |

## Catalogue produits

| Méthode | Route | Accès | Description |
| ------- | ----- | ----- | ----------- |
| `GET`   | `/api/v1/product-categories` | Authentifié (tenant) | Catégories du point de vente |
| `POST`  | `/api/v1/product-categories` | Rôle `owner` | Créer une catégorie (nom unique, insensible à la casse) |
| `PATCH` | `/api/v1/product-categories/{id}` | Rôle `owner` | Renommer ou désactiver |
| `GET`   | `/api/v1/products` | Authentifié (tenant) | Catalogue ; filtres `search`, `categoryId`, `isActive` |
| `GET`   | `/api/v1/products/{id}` | Authentifié (tenant) | Détail avec conditionnements, codes-barres et fiche médicament |
| `POST`  | `/api/v1/products` | Rôle `owner` | Créer un article et son conditionnement de base |
| `PATCH` | `/api/v1/products/{id}` | Rôle `owner` | Nom, SKU, unité, seuil, suivi, taxe, activation |
| `POST`  | `/api/v1/products/{id}/packagings` | Rôle `owner` | Ajouter un conditionnement (facteur > 0) |
| `PATCH` | `/api/v1/products/{id}/packagings/{packagingId}` | Rôle `owner` | Libellé, facteur, prix, activation, promotion en base |
| `POST`  | `/api/v1/products/{id}/barcodes` | Rôle `owner` | Ajouter un code-barres (base par défaut) |
| `DELETE`| `/api/v1/products/{id}/barcodes/{barcodeId}` | Rôle `owner` | Retirer un code-barres |

Règles appliquées :

- un article possède exactement un conditionnement de base actif, de facteur 1
  et porteur du prix unitaire (index partiel PostgreSQL) ;
- le `sku` est normalisé en majuscules et unique par commerce ; les codes-barres
  sont uniques par commerce et rattachés à un conditionnement ;
- en pharmacie, toute fiche médicament impose `tracking_mode=batch_expiry` et
  `allocation_policy=fefo` ; ailleurs, les informations médicament sont
  refusées ;
- les montants sont exposés en chaîne décimale (`numeric(20,6)` pour les prix,
  `numeric(7,4)` pour la taxe) afin d'éviter toute perte de précision.

```json
{
  "sku": "PARA-500",
  "name": "Paracétamol 500 mg",
  "baseUnit": "comprimé",
  "categoryId": "…",
  "basePackaging": { "label": "Plaquette", "salePrice": "1500" },
  "barcodes": ["0123456789012"]
}
```

Le profil tenant n'accepte jamais d'identifiant fourni par le client : le tenant
est déduit du jeton (`/tenants/current`). Les routes `platform` exigent
`isPlatformAdmin` et n'exposent aucune donnée métier.

Le super administrateur plateforme demande un jeton sans contexte tenant avec
`{"email": "...", "password": "...", "platform": true}` sur `/auth/login`.

Exemple :

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "tenantName": "Boutique Kintambo",
    "activityType": "boutique",
    "currency": "CDF",
    "address": "12, avenue de la Libération",
    "email": "admin@kubagest.io",
    "password": "MotDePasse123!"
  }'
```

Les mots de passe sont hachés avec bcrypt (12 rounds). Les jetons sont signés
avec `JWT_SECRET` et expirent selon `JWT_EXPIRES_IN`. L'inscription crée
atomiquement le tenant (nom, devise, adresse, statut d'essai, formule
essentielle), son abonnement, son établissement, le compte et le rattachement
propriétaire, avec une entrée d'audit.

La devise de référence (`currency`, ISO 4217) est normalisée en majuscules et
renvoyée dans le contexte d'authentification des deux clients.

Les routes d'authentification sont limitées en débit (5 inscriptions et
10 connexions par minute et par adresse), et l'ensemble de l'API à 100 requêtes
par minute.

## Docker

```bash
# API + PostgreSQL
docker compose up --build
```

L'API est exposée sur `http://localhost:3000` (ou `$PORT`) et PostgreSQL sur
`5432`. Les identifiants de la base se configurent avec `POSTGRES_USER`,
`POSTGRES_PASSWORD`, `POSTGRES_DB` et `POSTGRES_PORT`.

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Observability

In production applications, observability is essential for understanding how your system behaves, detecting issues early, and maintaining reliable performance.

[NestJS Observe](https://observe.nestjs.com) automatically instruments your NestJS application, giving you deep visibility into your system with minimal setup:

- **Distributed tracing:** Follow requests across services and understand how they flow through your system.
- **Waterfall analysis:** Visualize request execution and identify slow operations, bottlenecks, and unexpected delays.
- **Performance analysis:** Analyze application performance in real time and quickly pinpoint areas that need optimization.
- **Metrics:** Track key application and infrastructure metrics to understand system health and performance trends.
- **Logging:** Centralize and correlate logs with traces and other telemetry to make debugging easier.
- **Error tracking:** Detect errors quickly and investigate their root causes with the surrounding context.
- **SLA monitoring:** Track service-level objectives and identify when your application is approaching or exceeding defined thresholds.
- **Alarms and alerts:** Set up alerts for critical errors, performance degradation, SLA violations, and other anomalies so your team can react quickly.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Auto-instrument your application with [NestJS Observer](https://observer.nestjs.com). Distributed tracing, metrics, and logging made easy. Error tracking and performance monitoring for your NestJS applications.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
