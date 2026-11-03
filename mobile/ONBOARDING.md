# Parcours de démarrage KubaGest

Le parcours est implémenté en Flutter. Il reprend les comptes et le contexte commerce du backend NestJS existant ; aucune base métier mobile séparée n'est ajoutée.

## Direction visuelle

Vert profond, fond ivoire, accents ocre et illustrations de commerce dessinées avec les composants natifs Flutter. Les textes sont en français. Les illustrations sont décoratives et ne représentent aucun indicateur réel. Les formulaires utilisent les mêmes couleurs, espacements et boutons que l'espace connecté.

## Parcours d'un premier lancement

1. **Ouverture** : marque KubaGest pendant la lecture du stockage sécurisé. Une session déjà enregistrée ouvre directement l'espace du commerce.
2. **Découverte** : trois écrans — « Gérer votre commerce, l'esprit tranquille », « Chaque article, à sa place », « Gardez le lien avec votre commerce ». La présentation peut être passée et la connexion reste accessible. Sa lecture est mémorisée sur l'appareil, sans être effacée par la déconnexion.
3. **Choix** : « Créer mon commerce » ou « Se connecter ». Le bouton d'aide permet de vérifier l'accès au serveur ; ce contrôle reste facultatif et ne bloque pas l'accès aux formulaires.
4. **Activité** : sélection explicite entre boutique, alimentation et pharmacie. Aucune activité n'est choisie à la place de l'utilisateur.
5. **Commerce** : nom, devise de référence CDF ou USD, adresse facultative. Le caractère définitif du type d'activité et de la devise après activation est annoncé avant validation.
6. **Compte propriétaire** : email, mot de passe et confirmation. Le nom du commerce et sa devise restent visibles. Les retours aux étapes précédentes conservent les champs saisis.
7. **Création** : un seul appel à `POST /api/v1/auth/register`, après validation locale. Le bouton et le retour sont bloqués pendant l'envoi. Le compte n'est pas créé à chaque changement d'étape.
8. **Confirmation** : elle apparaît après réception de la session et réussite de son stockage local. « Découvrir mon espace » ouvre l'accueil connecté.

## Parcours d'un utilisateur existant

Le choix « Se connecter » ouvre directement le formulaire email/mot de passe. Les erreurs sont affichées sans effacer les identifiants saisis. Après `POST /api/v1/auth/login`, le jeton et le contexte sont conservés dans le stockage sécurisé existant, puis l'espace est affiché.

« Mot de passe oublié » envoie un code à 6 chiffres seulement si l'adresse correspond à un compte actif. L'application demande ensuite ce code, puis le nouveau mot de passe. Une adresse inconnue, un compte désactivé ou un code incorrect affiche une erreur.

## Espace connecté

- **Accueil** : commerce courant, email, activité, rôle et devise issus de la session ; liens vers les informations du commerce, le compte et les informations de préparation du catalogue.
- **Commerce** : consultation des informations du contexte courant. Un compte plateforme sans établissement voit une explication adaptée.
- **Compte** : email, rôle et déconnexion avec confirmation.

Les ventes, stocks, caisses et la saisie mobile du catalogue restent hors de cet incrément. Ils ne sont pas présentés comme des écrans déjà opérationnels ; aucun chiffre d'affaires ou stock fictif n'est affiché. Chaque module dispose toutefois d'un écran de présentation (`lib/features/pos/`) qui décrit sa mise en page et ses fonctions prévues, sans donnée simulée.

## États et cas limites

- Un formulaire invalide reste accessible : le clic révèle les erreurs et place le focus sur le premier champ à corriger.
- Les mots de passe peuvent être affichés ou masqués. Les champs respectent les limites du contrat existant et les indications d'autoremplissage.
- L'erreur réseau laisse l'utilisateur dans le formulaire, avec possibilité de réessayer.
- Si le commerce a été créé mais que le stockage de session échoue, « Ouvrir mon espace » retente uniquement l'enregistrement local, sans recréer le commerce.
- La déconnexion est confirmée avant d'effacer la session. Un échec du stockage affiche une erreur.
- Les pages sont défilables, les messages importants sont annoncés aux lecteurs d'écran, et la marque s'adapte aux petits écrans avec grands caractères.
- Les tests avec une API simulée ne constituent pas une recette de création de commerce réelle. Les résultats d'exécution et la validation Android sont consignés dans le guide mobile.

## Fichiers principaux

- `lib/core/theme/kuba_theme.dart` et `lib/shared/brand.dart` : thème et composants partagés.
- `lib/features/auth/onboarding_screen.dart` : découverte et choix du parcours.
- `lib/features/auth/commerce_illustration.dart` : illustrations natives.
- `lib/features/auth/login_screen.dart` : connexion.
- `lib/features/auth/register_screen.dart` : création en trois étapes.
- `lib/features/auth/activation_screen.dart` : confirmation après création.
- `lib/features/home/home_screen.dart` : espace connecté.
- `lib/features/pos/` : présentation des modules Ventes, Stock, Caisse et Crédits.
- `lib/app.dart` : restauration de session et navigation racine.
