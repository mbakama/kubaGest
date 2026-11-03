# Déploiement du backend KubaGest sur Contabo (VPS)

Ce guide décrit comment mettre en production **uniquement l’API NestJS** (`backend/`), alors que le dépôt Git contient aussi `frontend/` (Angular) et `mobile/` (Flutter). Ces clients ne sont **pas** déployés sur le VPS : seul le dossier `backend/` est utilisé pour Docker.

## Vue d’ensemble

| Composant | Rôle sur le VPS |
| --- | --- |
| **Docker** | Image `api` (Node 22 + `dist/`) + conteneur **PostgreSQL 16** |
| **Nginx** | Reverse proxy HTTPS vers l’API (port local 3000) |
| **Certbot** | Certificat Let’s Encrypt pour le domaine API |

Fichiers utiles dans ce dossier :

- `Dockerfile` — build de l’image API
- `docker-compose.yml` — services `api` + `db`
- `docker-compose.prod.yml` — surcharge production (API en `127.0.0.1`, PostgreSQL non exposé)
- `.env.production.example` — modèle de variables pour le serveur
- `deploy/nginx-api.conf.example` — exemple de site Nginx

## Prérequis

- Un **VPS Contabo** (Ubuntu 22.04 ou 24.04 recommandé)
- Un **nom de domaine** (ex. `api.votredomaine.com`) pointant en **A** vers l’IP du VPS
- Accès **SSH** root ou utilisateur sudo
- Le dépôt sur GitHub : `https://github.com/mbakama/kubaGest` (branche `main` ou `dev`)

## 1. Préparer le serveur

Connectez-vous en SSH :

```bash
ssh root@IP_DU_VPS
# ou : ssh utilisateur@IP_DU_VPS
```

Mises à jour et outils de base :

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git nginx certbot python3-certbot-nginx ufw
```

Pare-feu (SSH + HTTP/HTTPS) :

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

### Installer Docker

Script officiel :

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

Déconnectez-vous puis reconnectez-vous en SSH pour que le groupe `docker` soit actif.

Vérification :

```bash
docker --version
docker compose version
```

## 2. DNS

Chez votre registrar (ou DNS Contabo), créez :

| Type | Nom | Valeur |
| --- | --- | --- |
| A | `api` (ou sous-domaine choisi) | IP publique du VPS |

Attendez la propagation (quelques minutes à quelques heures), puis :

```bash
dig +short api.votredomaine.com
```

## 3. Récupérer le code

### Option A — clone complet (recommandé, le plus simple)

```bash
cd ~
git clone https://github.com/mbakama/kubaGest.git
cd kubaGest/backend
```

Les dossiers `frontend/` et `mobile/` restent sur le disque mais **ne sont pas exécutés**.

### Option B — clone partiel (moins d’espace disque)

```bash
cd ~
git clone --filter=blob:none --sparse https://github.com/mbakama/kubaGest.git
cd kubaGest
git sparse-checkout set backend
cd backend
```

## 4. Configuration `.env` de production

```bash
cp .env.production.example .env
nano .env
```

Variables **obligatoires** à personnaliser :

| Variable | Description |
| --- | --- |
| `POSTGRES_PASSWORD` | Mot de passe PostgreSQL fort (unique) |
| `JWT_SECRET` | Au moins 32 caractères aléatoires |
| `CORS_ORIGIN` | Origine(s) autorisée(s) pour le mobile / le web (ex. `https://app.votredomaine.com` ou plusieurs URLs séparées par des virgules) |
| `APP_PUBLIC_URL` | URL publique de l’API, ex. `https://api.votredomaine.com` (emails de réinitialisation) |

Générer un secret JWT :

```bash
openssl rand -hex 32
```

Règles importantes :

- `NODE_ENV=production`
- `DB_TYPE=postgres`
- `DB_SYNCHRONIZE=false` — **obligatoire** en production (schéma via migrations TypeORM)
- Ne **jamais** committer le fichier `.env` (déjà ignoré par Git)

Optionnel :

- `PLATFORM_ADMIN_EMAIL` + `PLATFORM_ADMIN_PASSWORD` — super administrateur plateforme au premier démarrage
- Bloc `MAIL_*` — envoi d’emails (mot de passe oublié)
- Twilio — voir `.env.example` pour les SMS

## 5. Démarrer l’API et PostgreSQL

Depuis `backend/` :

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Ce que fait la surcharge `docker-compose.prod.yml` :

- L’API écoute sur **127.0.0.1:3000** (accessible seulement depuis le VPS, idéal derrière Nginx)
- PostgreSQL **n’est pas publié** sur Internet (pas de port 5432 exposé)

Suivre les logs :

```bash
docker compose logs -f api
```

Attendre un message du type « Nest application successfully started ».

Test local sur le VPS :

```bash
curl -s http://127.0.0.1:3000/api
```

Les **migrations** PostgreSQL dans `src/database/migrations/` s’exécutent **automatiquement** au démarrage lorsque `DB_SYNCHRONIZE=false`.

Données persistantes (volumes Docker) :

- `db-data` — base PostgreSQL
- `avatar-data` — fichiers avatars (`AVATAR_STORAGE_DIR=/app/data/avatars`)

## 6. Nginx et HTTPS

Copier et adapter l’exemple :

```bash
sudo cp deploy/nginx-api.conf.example /etc/nginx/sites-available/kubagest-api
sudo nano /etc/nginx/sites-available/kubagest-api
```

Remplacez `api.votredomaine.com` par votre sous-domaine réel.

Activer le site :

```bash
sudo ln -sf /etc/nginx/sites-available/kubagest-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Certificat TLS (Let’s Encrypt) :

```bash
sudo certbot --nginx -d api.votredomaine.com
```

Test public :

```bash
curl -s https://api.votredomaine.com/api
```

Documentation OpenAPI : désactivée en production par défaut (`SWAGGER_ENABLED=false` dans Compose). Pour la réactiver temporairement, modifiez `.env` / la section `environment` du compose et redémarrez l’API — **déconseillé** sur un serveur public sans protection.

## 7. Clients (mobile / frontend)

Le backend est sous le préfixe **`/api/v1`**.

### Application mobile (Flutter)

Rebuild avec l’URL de production :

```bash
flutter run --dart-define=API_BASE_URL=https://api.votredomaine.com/api/v1
```

Pour une release APK/AAB, utilisez la même `--dart-define` dans votre commande de build.

### Frontend Angular

En production, le front est généralement servi ailleurs (Electron, hébergement statique) avec un proxy ou une `API_BASE_URL` pointant vers `https://api.votredomaine.com`. Le déploiement du frontend **n’est pas couvert** par ce document.

## 8. Mises à jour après un `git push`

Sur le VPS :

```bash
cd ~/kubaGest/backend
git pull
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
docker compose logs -f api
```

## 9. Commandes utiles

```bash
# État des conteneurs
docker compose ps

# Arrêter
docker compose -f docker-compose.yml -f docker-compose.prod.yml down

# Arrêter et supprimer les volumes (⚠️ efface la base et les avatars)
docker compose -f docker-compose.yml -f docker-compose.prod.yml down -v

# Shell dans le conteneur API
docker compose exec api sh

# Logs PostgreSQL
docker compose logs db
```

Migrations manuelles (si besoin, depuis la machine de dev ou un conteneur avec les sources) :

```bash
npm run migration:show
npm run migration:run
```

(Voir `README.md` — en production, le démarrage de l’app applique déjà les migrations en attente.)

## 10. Dépannage

| Symptôme | Piste |
| --- | --- |
| L’API redémarre en boucle | `docker compose logs api` — souvent `.env` invalide (`JWT_SECRET` trop court, mail partiellement renseigné, etc.) |
| `502 Bad Gateway` (Nginx) | L’API n’écoute pas : `curl http://127.0.0.1:3000/api` sur le VPS |
| Erreur CORS depuis le mobile | Ajuster `CORS_ORIGIN` dans `.env`, rebuild / redémarrer `docker compose up -d` |
| Certificat SSL | `sudo certbot renew --dry-run` |
| Disque plein | `docker system df` puis nettoyage prudents des images inutilisées |

## 11. Sécurité — checklist

- [ ] `.env` avec mots de passe forts, jamais versionné
- [ ] `docker-compose.prod.yml` utilisé en production
- [ ] PostgreSQL non exposé sur Internet
- [ ] UFW actif (22, 80, 443)
- [ ] `SWAGGER_ENABLED=false` en production
- [ ] Sauvegardes régulières du volume `db-data` (snapshot Contabo ou `pg_dump`)

## 12. Développement local vs production

| | Local (dev) | Contabo (prod) |
| --- | --- | --- |
| Compose | `docker compose up --build` | `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build` |
| PostgreSQL | Port `5432` exposé (pratique pour outils locaux) | Port non publié |
| API | Port `3000` sur toutes les interfaces | `127.0.0.1:3000` + Nginx |
| Base | Souvent `sqljs` dans `.env.example` | **PostgreSQL** obligatoire |

Pour plus de détails sur l’architecture API, l’authentification et la base de données, voir [`README.md`](README.md) et [`../docs/database/SCHEMA.md`](../docs/database/SCHEMA.md).
