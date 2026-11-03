# Design QA — Accueil mobile V6

Date : 26 octobre 2026

## Référence

- Maquette : `docs/mobile/mockup/kubagest-maquette-v6.html`
- Capture de référence : maquette V6 fournie dans la conversation.
- Format contrôlé : 390 × 844 pixels logiques.

## Capture de l’implémentation

- Golden Flutter : `test/goldens/home_v6.png`
- État : propriétaire authentifié, commerce « Boutique Hector », onglet Accueil.

## Contrôles

- Fond vert pâle et cartes blanches/noires : conformes à la direction V6.
- En-tête avec photo, identité et notification : présent.
- La capture attend le décodage de la photo : l'avatar de l'en-tête est bien rendu.
- Titre court « Aperçu du jour » : présent.
- Recherche, cartes Ventes/Solde, graphique et activité récente : présents.
- Les cartes Ventes/Solde restent côte à côte et défilent horizontalement.
- La barre de défilement horizontale est masquée.
- Le contenu général reste défilable verticalement.
- Navigation inférieure : Accueil, Ventes, Stock et Paramètres.
- Aucun débordement Flutter observé au format contrôlé.

## Validation

- Capture golden générée depuis le widget complet `HomeScreen`.
- Analyse statique Flutter : réussie.
- Tests widget et golden : réussis.

final result: passed
