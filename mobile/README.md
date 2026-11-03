# KubaGest mobile — Flutter

Flutter est retenu pour le mobile depuis le 24 octobre 2026. Le projet contient les cibles Android et iOS et utilise la même API NestJS `/api/v1` que le bureau. Aucune base métier autonome ou vente hors ligne.

## État actuel

Le [parcours de démarrage et ses choix de conception](ONBOARDING.md) détaille les écrans, la navigation et les états d'erreur de cet incrément.

Socle Flutter, thème français cohérent avec le frontend, configuration du serveur et appel de contrôle `GET /api/v1/health`. Le succès exige une réponse HTTP 200 avec `status=ok` et `database=ok`. Délai maximal de 12 secondes, état de chargement et possibilité de réessayer après une erreur.

Le parcours mobile comprend :

- une présentation en trois étapes, suivie du choix « Créer mon commerce » ou « Se connecter » ; la présentation n’est rejouée qu’une fois ;
- la connexion (`POST /auth/login`) avec validation du formulaire, messages d’erreur français et blocage des envois multiples ;
- la création d’un commerce en trois étapes (activité, nom et devise, compte propriétaire) vers `POST /auth/register` ;
- un écran de confirmation après création, avant l’ouverture de l’espace ;
- un espace d’accueil à trois rubriques — **Accueil**, **Commerce** et **Compte** — dont toutes les informations proviennent de la session (nom, activité, devise, rôle, email) ;
- le stockage chiffré de la session (`flutter_secure_storage` : Keystore Android, Keychain iOS) et sa restauration au lancement ; la déconnexion efface la session.

Les écrans de vente, de stock et de caisse restent annoncés comme à venir ; aucune donnée commerciale fictive n’est affichée. Les actions métier autorisées sur mobile restent à valider selon le cahier des charges.

## Design system

L’interface suit la maquette [`stitch_maquette_interface_kubagest/DESIGN.md`](../stitch_maquette_interface_kubagest/DESIGN.md). La source de vérité du code est `lib/core/theme/kuba_tokens.dart` : aucune couleur, taille ou ombre n’est écrite sur place dans un écran.

- **Couleurs** : vert de marque `#007A55` pour l’en-tête, les actions décisives et l’onglet actif ; bleu nuit `#0B2545`/`#091E3A` pour les bannières ; fond ardoise `#F8FAFC` et surfaces blanches ; accents POS stock `#0284C7`, caisse `#F59E0B`, crédits `#8B5CF6`, alerte `#EF4444`.
- **Typographie** : Inter embarquée (Regular, Medium, SemiBold, Bold). Les montants et les métriques activent les chiffres tabulaires avec `KubaType.amount`.
- **Mesures** : rythme de 4 px, marges et gouttières de 16 px, cibles tactiles et boutons de 44 px, barre de navigation de 64 px ; arrondis de 8 px pour les champs et boutons, 12 à 16 px pour les cartes, pilules pour les badges.
- **Profondeur** : cartes blanches bordées `#E2E8F0` et ombre de niveau 1 ; éléments flottants au niveau 2 ; feuilles modales au niveau 3.

| Composant (`lib/shared/ui/`) | Usage |
| --- | --- |
| `KubaAppHeader` | En-tête vert de marque, retour et actions blanches, titre et sous-titre. |
| `KubaBottomNav` | Barre de 64 px à filet supérieur, pastille verte et libellé de 11 px pour l’onglet actif. |
| `KubaCard`, `KubaCardTone` | Surface blanche bordée, déclinée en tons marque, notice, danger et info. |
| `KpiCard` | Pastille, montant tabulaire et état « À venir » : jamais de donnée inventée. |
| `KubaQuickActions` | Raccourcis Ventes, Stock, Caisse et Crédits ; chaque module ouvre son écran de présentation. |
| `KubaBadge`, `KubaOnDarkBadge` | États en pilule sur fond clair ou sur bannière nuit. |
| `KubaIconPastille` | Pastille circulaire d’icône, colorée selon l’accent métier. |
| `SectionHeader`, `InfoRow`, `KubaTile`, `EmptyState` | Rubriques, fiches clé/valeur, listes cliquables et états vides. |

L’accueil reprend la hiérarchie de la maquette : salutation et date, bannière du commerce en bleu nuit, deux indicateurs, raccourcis POS puis rubriques de repérage. Les modules non branchés restent annoncés comme à venir.

### Écrans des modules POS

`lib/features/pos/pos_module.dart` décrit les quatre modules (Ventes, Stock, Caisse, Crédits) : accent, accroche, description, fonctions prévues et informations à préparer. `PosModuleScreen` en affiche un sans jamais présenter de donnée simulée :

- en-tête vert avec retour et sous-titre « Module du point de vente » ;
- carte d’introduction teintée de l’accent métier, badge « Bientôt disponible » ;
- aperçu de la mise en page en silhouette — des blocs neutres, aucun montant ni compteur ;
- liste des fonctions prévues, puis des informations à préparer avant l’ouverture ;
- rappel que le module arrivera avec les prochains lots, et retour à l’accueil.

Un test dédié (`test/pos_module_test.dart`) vérifie que chaque raccourci ouvre le bon module, que le retour ramène à l’accueil, qu’aucun nombre n’est affiché et que les libellés du catalogue restent uniques.

### Cas limites traités

| Cas | Comportement |
| --- | --- |
| Formulaire invalide (activité, nom, email, mot de passe, confirmation) | Message sous le champ concerné, focus placé sur le premier champ fautif, aucun appel réseau. |
| Retour à l’étape précédente | Les champs déjà saisis sont conservés ; le retour système recule d’une étape au lieu de fermer le formulaire ; le retour est désactivé pendant l’envoi. |
| Échec réseau à la création | Bandeau d’erreur, aucune session enregistrée, nouveau bouton qui réessaie l’appel au serveur. |
| Création réussie mais enregistrement local impossible | Le commerce n’est pas recréé : le bouton « Ouvrir mon espace » retente uniquement l’enregistrement de la session. |
| Session existante | L’application ouvre directement l’espace, sans repasser par la présentation ni par la confirmation. |


## Démarrage

SDK utilisé lors de la création : Flutter 3.38.4 stable / Dart 3.10.3.

```powershell
cd E:\Kubagest\mobile
flutter pub get
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:3000/api/v1
```

Lancer le backend séparément avec `npm run start:dev` depuis `backend/`.

- Émulateur Android : `10.0.2.2` désigne le PC hôte (valeur de développement par défaut).
- Téléphone Android physique : utiliser l’adresse IP locale du PC ; même réseau et port serveur accessible.
- Simulateur iOS sur Mac : utiliser l’adresse du backend accessible depuis ce Mac.
- Production : fournir une URL HTTPS avec `/api/v1`, par exemple `--dart-define=API_BASE_URL=https://api.votre-domaine.tld/api/v1`.

L’HTTP non chiffré est autorisé uniquement dans le manifeste Android de debug. Les builds de production doivent utiliser HTTPS. Aucune exception ATS iOS n’est ajoutée ; utiliser un serveur HTTPS accessible pour les essais iOS.

Le préfixe `/api/v1` doit être fourni une seule fois. L’URL et les valeurs `dart-define` ne constituent pas un stockage de secrets.

## Organisation

- `lib/app.dart` : application, restauration de session, passage de la confirmation à l’espace, thème.
- `lib/core/config/api_config.dart` : URL de l’API par environnement.
- `lib/core/api/health_api.dart` : vérification HTTP de l’API et fermeture du client.
- `lib/core/api/auth_api.dart` : connexion et création de commerce, traduction des erreurs en messages français.
- `lib/core/auth/token_store.dart` : persistance chiffrée de la session ; `AuthSession` décrit le jeton, l’utilisateur et le contexte tenant.
- `lib/core/validation.dart` : règles de validation partagées par les formulaires.
- `lib/features/auth/` : présentation, connexion, création en trois étapes, confirmation.
- `lib/features/home/home_screen.dart` : espace à trois rubriques.
- `test/` : vérifications automatisées, dont `registration_edge_cases_test.dart` pour les cas limites.

## Vérifications

```powershell
flutter analyze
flutter test
flutter build apk --debug
```

Le build Android nécessite Android SDK et Java compatibles. Le build iOS nécessite macOS, Xcode et les paramètres de signature Apple. La présence des dossiers natifs ne constitue pas une validation sur appareil.

Vérifications du 25 octobre 2026 : `flutter analyze` sans erreur et **42 tests réussis**, dont le retour à la présentation depuis l’aide et 14 cas limites du parcours de création réunis dans `test/registration_edge_cases_test.dart` :

- formulaires invalides : email mal formé, mot de passe de moins de 8 caractères, nom composé d’espaces, correction puis envoi — le serveur n’est jamais appelé tant que la saisie est invalide ;
- retour : conservation des champs, retour système d’une étape, sortie du formulaire depuis la première étape, retour désactivé pendant l’envoi ;
- échec réseau : bandeau d’erreur, aucune session enregistrée, nouvel essai qui rappelle le serveur, et création non rejouée quand seul l’enregistrement local échoue ;
- session : confirmation avant l’espace, un seul enregistrement, rubriques alimentées par la session, connexion existante, et relance de l’application qui rouvre l’espace sans repasser par la présentation.

Ces tests s’exécutent avec une API simulée : ils ne constituent pas une connexion réelle au backend NestJS ni un essai sur téléphone.

### Vérification sur émulateur (25 octobre 2026)

APK `--debug --target-platform=android-x64` (151 Mo) construit puis installé sur `Pixel_9_Pro_E` (`emulator-5554`), backend NestJS et PostgreSQL démarrés. Constats relevés dans l’arbre d’accessibilité de l’appareil :

- la présentation s’affiche avec ses libellés, la pagination « Présentation 1 sur 3 » et les actions « Passer », « Commencer », « Se connecter » ;
- « Aide et connexion » → « Vérifier la connexion » affiche **« Le serveur est accessible. »** : l’émulateur joint bien `http://10.0.2.2:3000/api/v1` ;
- « Se connecter » ouvre le formulaire, et une validation à vide affiche « L’adresse email est obligatoire. » sans appel réseau.

La création réelle d’un commerce n’a pas été rejouée sur l’appareil afin de ne pas insérer de données de test dans la base de développement ; ce parcours reste couvert par les tests automatisés.

Dernière compilation : `BUILD SUCCESSFUL` (29 s), APK final réinstallé et ouvert après redémarrage de l’émulateur. Le manque d’espace avait bloqué le remplacement ; les données de KubaGest ont été conservées. La présentation complète, sa relecture depuis l’aide, la connexion et l’entrée de l’inscription ont été contrôlées visuellement. Les formulaires défilent lorsque le contenu dépasse la hauteur disponible.

### Refonte visuelle et captures (25 octobre 2026)

Après l’alignement sur la maquette Stitch, l’APK release (`android-x64`, 18,3 Mo) a été installé sur `Pixel_9_Pro_E` et parcouru avec le compte de démonstration `admin@kubagest.io` : accueil, actions rapides, écrans Ventes, Stock, Caisse et Crédits, fiche du commerce et compte. La connexion réelle, la navigation inférieure et l’ouverture des modules ont été vérifiées, sans erreur de débordement dans le journal de l’appareil. `flutter analyze` reste sans erreur et les 45 tests passent.

Captures actualisées dans `../docs/mobile/screenshots/` : `01-presentation.png`, `02-presentation-gestion.png`, `03-presentation-lien.png`, `04-choix.png`, `05-aide.png`, `06-connexion.png`, `07-inscription-activite.png`, `08-inscription-commerce.png`, `09-inscription-compte.png`, `10-confirmation.png`, `11-accueil.png`, `12-actions-rapides.png`, `13-module-ventes.png`, `14-module-stock.png`, `15-module-caisse.png`, `16-module-credits.png`, `17-commerce.png` et `18-compte.png`.

La première tentative APK était bloquée par le cache Gradle puis par le téléchargement du moteur Android. Le lancement a ensuite réussi avec Java 17, le moteur officiel téléchargé et vérifié par son empreinte MD5, et un dépôt local temporaire limité à ce module. Le build Gradle a produit `build/app/outputs/flutter-apk/app-debug.apk`. L’application a été installée et ouverte sur `Pixel_9_Pro_E` (`emulator-5554`) ; le bouton « Vérifier la connexion » affiche « Le serveur est accessible. » avec le backend NestJS et PostgreSQL démarrés. Le build standard sans ce contournement local n’a pas été revalidé. Le build iOS n’a pas été exécuté sous Windows.

### Relance depuis un cache Gradle partagé

Le build par défaut peut échouer en `Connection reset` ou `Could not read workspace metadata ...\metadata.bin` lorsque le cache Gradle est vide ou partiellement corrompu. Procédure appliquée et vérifiée le 24 octobre 2026 :

```powershell
flutter emulators --launch Pixel_9_Pro_E
cd E:\Kubagest\mobile\android
$env:GRADLE_USER_HOME='E:\gradle-cache'   # cache déjà peuplé
.\gradlew.bat --stop                        # un démon garde l'ancien état en mémoire
.\gradlew.bat assembleDebug
adb install -r ..\build\app\outputs\apk\debug\app-debug.apk
adb shell am start -n io.kubagest.kubagest_mobile/.MainActivity
```

- `E:\gradle-cache\caches\8.14\transforms` contenait des entrées sans `metadata.bin` : le répertoire a été supprimé et reconstruit localement, sans nouvel artefact à télécharger.
- Un cache vide impose des téléchargements réseau que l’environnement d’exécution peut interrompre ; pointer `GRADLE_USER_HOME` vers un cache déjà peuplé évite le problème.
- `gradlew.bat --stop` est nécessaire après un nettoyage de cache : sinon un démon réutilise la liste de fichiers supprimés et la compilation échoue en une seconde.
- `dl.google.com` est instable sur ce réseau (`Hôte inconnu`, `Read timed out`, `Connection reset`). Deux artefacts du plugin Android — `intellij-core` et `kotlin-compiler` 31.11.1 — sont téléchargés manuellement vers `E:\gradle-cache\offline-m2`, exposé par le script d'init `E:\gradle-cache\init.d\offline-m2.gradle` (hors dépôt) ; le build repart ensuite normalement.
- Le plugin `integration_test` n'est pas utilisable ici : son module Gradle réclame une trentaine d'artefacts AGP 8.2.1 (`gradle-api`, `utp`, `apkzlib`, `netty`, `guava`…) que ce réseau ne peut pas télécharger. Il a été retiré du projet. Les parcours sont donc vérifiés par `flutter test` (API simulée) et par installation manuelle de l'APK sur l'émulateur.
- Prévoir de l’espace disque : Gradle extrait les AAR Flutter et le moteur Android dans le cache. Un build complet demande plusieurs gigaoctets ; un `Espace insuffisant sur le disque` en pleine résolution signifie qu’il faut libérer `build\app\intermediates` (régénérable) ou purger `caches\8.14\transforms`.

L’APK produit par Gradle utilise l’URL par défaut `http://10.0.2.2:3000/api/v1`. Pour une autre adresse, passer par `flutter run -d emulator-5554 --dart-define=API_BASE_URL=...`.

## Base commune

Le modèle de données reste côté PostgreSQL : comptes, établissements, produits, lots, ventes, caisses et audit. Les sessions identifient le client comme `mobile`. Les futurs appels authentifiés devront respecter la révocation, le contexte tenant serveur et les clés d’idempotence pour les mutations. Consulter `../docs/database/SCHEMA.md`.

### Consultation du catalogue
Depuis Accueil, **Consulter le catalogue** charge les articles du commerce via GET /products avec le jeton de session. Recherche locale par nom ou référence, fiche article, conditionnements, prix et fiche médicament. Actualisation et reprise après erreur disponibles. Consultation uniquement ; aucune vente ni modification du catalogue.

