# Kubagest — frontend Angular

Socle Angular standalone, TypeScript strict, SCSS et routes chargées à la demande.
Le backend existant reste indépendant dans `../backend`.

## Démarrage

Utiliser une version Node compatible : 22.22.3+, 24.15+ ou 26.
Le Node 18 actuellement prioritaire dans le terminal ne convient pas.

```powershell
npm ci
npm start
```

Ouvrir http://localhost:4200. Lancer le backend séparément selon son README.
Le proxy `proxy.conf.json` redirige `/api/**` vers `http://localhost:3000`
et retire `/api`. Adapter sa cible si le backend change de port.

Node 24 est aussi disponible localement, sans modifier la configuration globale :

```powershell
$node24 = 'C:\Users\Hector\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $node24 node_modules/@angular/cli/bin/ng.js serve
& $node24 node_modules/@angular/cli/bin/ng.js build
& $node24 node_modules/@playwright/test/cli.js test
```

## Écrans préparés

- `/accueil` : accueil et navigation responsive.
- `/connexion` : contrôle manuel de `GET /`, états initial, chargement, succès et erreur.
- Toute autre adresse : page introuvable avec retour à l’accueil.

Le contrôle attend le texte `Hello World!` du contrôleur NestJS actuel.
Il ne valide ni une authentification ni les futurs services métier. Une réponse
HTML de repli n’est pas considérée comme un succès. Délai maximal : huit secondes.

## Structure et intégration

- `src/app/core/api` : configuration injectable de l’URL et accès HTTP.
- `src/app/features` : écrans autonomes, séparés par fonctionnalité.
- `src/styles.scss` : couleurs sémantiques, typographie et composants communs.
- `src/app/app.routes.ts` : routes et titres français.

En production, le proxy Angular de développement n’est pas inclus : configurer
un reverse proxy `/api` vers NestJS, ou fournir `API_BASE_URL` dans `app.config.ts`.
Pour une API sur une autre origine, adapter aussi le CORS du serveur.
Le serveur web doit renvoyer `index.html` pour les routes du frontend.

Aucune donnée métier, session ou permission fictive n’a été créée. Les écrans
métier attendent la définition des parcours et des contrats API.

## Vérifications

```powershell
npm run build
npm run typecheck
npm test
```

Les tests navigateur utilisent Microsoft Edge installé sur la machine.
Sur un autre environnement, installer le navigateur correspondant ou adapter
`channel` dans `playwright.config.ts`. Ils démarrent Angular sur le port 49174,
simulent les réponses API et couvrent navigation, erreur, nouvelle tentative,
réponse HTML indésirable et absence de débordement aux largeurs 320, 768,
1024 et 1440 pixels. Les captures sont dans `test-results`.
Ces tests simulés ne remplacent pas la validation avec les futurs services réels.
