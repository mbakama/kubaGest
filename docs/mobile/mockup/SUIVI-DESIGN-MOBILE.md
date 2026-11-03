# Suivi du design mobile KubaGest

## Objectif

Ce document sert de référence pour suivre l'évolution du design mobile de KubaGest. Il s'appuie sur la capture d'inspiration analysée le 26 octobre 2026 et doit être mis à jour à chaque nouvelle version de la maquette.

## Direction visuelle retenue

- Interface claire, douce et moderne.
- Cartes blanches très arrondies sur un fond légèrement teinté.
- Hiérarchie forte entre le message d'accueil, les indicateurs et les actions.
- Navigation inférieure flottante, accessible au pouce.
- Valeurs importantes affichées avec une grande taille de texte.
- Couleur d'accent utilisée avec parcimonie pour les états et actions importantes.
- Ombres légères et espacements généreux.

## Structure de l'écran d'accueil

1. **Zone supérieure**
   - Photo de la personne, ou un visuel neutre si elle n'en a pas fourni.
   - Salutation par le prénom.
   - Bouton de notifications, avec un point lorsqu'un message non lu existe.

2. **Résumé principal**
   - Question ou phrase orientée vers l'action.
   - État synthétique de l'activité du jour.

3. **Recherche**
   - Recherche de produit, client, vente ou opération.
   - Le champ ne doit être affiché que s'il apporte une action immédiate.

4. **Indicateurs clés**
   - Ventes du jour.
   - Solde de caisse.
   - Stock faible ou alertes.
   - Crédits clients en attente.

5. **Activité récente ou graphique**
   - Résumé de la semaine.
   - Valeurs, unités et période toujours visibles.
   - État actif distingué autrement que par la couleur seule.

6. **Navigation inférieure**
   - Accueil.
   - Ventes.
   - Stock ou caisse.
   - Compte ou paramètres.

## Principes UI à respecter

### Typographie

- Une police sans-serif lisible.
- Trois niveaux principaux : titre, libellé et donnée.
- Taille minimale recommandée pour le texte courant : 14 px.
- Éviter les textes gris trop pâles.

### Couleurs

| Usage | Recommandation |
|---|---|
| Fond principal | Ton très clair, neutre ou légèrement teinté |
| Cartes | Blanc ou quasi blanc |
| Texte principal | Noir doux ou gris très foncé |
| Texte secondaire | Gris suffisamment contrasté |
| Action principale | Couleur de marque KubaGest |
| Succès | Vert avec libellé ou icône explicite |
| Alerte | Orange avec libellé explicite |
| Erreur | Rouge avec libellé explicite |

Les couleurs exactes doivent être synchronisées avec la charte graphique du produit avant validation finale.

### Formes et espacements

- Rayon des cartes : 20 à 24 px.
- Rayon des boutons et champs : 16 à 24 px.
- Espacement extérieur recommandé : 16 à 24 px.
- Espacement entre cartes : 12 à 16 px.
- Zone tactile minimale : 44 × 44 px.
- Prévoir un espace inférieur suffisant pour que la navigation ne masque aucun contenu.

### Accessibilité

- Contraste WCAG AA pour les textes essentiels.
- Ne jamais communiquer un état uniquement par une couleur.
- Ajouter un texte, une icône ou une forme pour chaque succès, alerte et erreur.
- Fournir des libellés accessibles aux icônes.
- Respecter l'agrandissement du texte sans casser la mise en page.

## Notifications prévues

Le bouton de l'accueil ouvre un centre de notifications. Il est dans le périmètre, pas un ornement. Chaque message respecte le rôle du destinataire : un caissier ne reçoit pas les alertes d'un autre commerce, ni celles réservées au propriétaire.

| Famille | Exemples | Qui la voit |
|---|---|---|
| Application | Nouvelle version disponible, mise à jour installée, maintenance annoncée | Toute personne connectée |
| Stock | Article sous le seuil, lot proche de la péremption | Propriétaire, gestionnaire stock |
| Caisse | Session encore ouverte, écart à la clôture | Propriétaire, caissier de la session |
| Abonnement | Échéance proche, formule suspendue | Propriétaire |
| Crédit | Échéance client dépassée | Propriétaire |

La mise à jour de l'application est le premier motif : le point sur la cloche peut signaler une version disponible sans afficher un chiffre inventé. Les alertes métier n'apparaissent que lorsque la donnée existe vraiment. Aucun secret, mot de passe ou jeton ne figure dans un message. Le canal push reste à trancher avec le cahier des charges (section 28.3) ; le centre dans l'application est prévu dès maintenant.

## Points de vigilance issus de la capture

- Éviter les formulations redondantes ou ambiguës.
- Toujours afficher l'unité et la période des indicateurs.
- Donner une légende ou une échelle aux graphiques.
- Ne pas laisser une section partiellement cachée par la barre de navigation.
- Vérifier la lisibilité des petits textes et des éléments gris clair.
- Donner la priorité aux actions métier plutôt qu'à un champ de recherche générique.
- Rendre claire la différence entre une donnée mesurée, un objectif et une plage recommandée.

## Suivi des versions

| Version | Fichier | Statut | Date | Changements principaux | À vérifier |
|---|---|---|---|---|---|
| V2 | `kubagest-maquette-v2.html` | Historique | À compléter | Version initiale conservée | Cohérence générale |
| V3 | `kubagest-maquette-v3.html` | Historique | À compléter | Évolution de la maquette | Navigation et contraste |
| V4 | `kubagest-maquette-v4.html` | Historique | À compléter | Évolution de la maquette | États et données métier |
| V5 | `kubagest-maquette-v5.html` | Historique | 2026-10-26 | Salutation par le prénom, photo, inscription avec identité | Le bouton de notifications manque |
| V6 | `kubagest-maquette-v6.html` | À auditer | 2026-10-26 | Accueil, ventes, stock, paramètres, et centre de notifications | Stock : seuil, péremption, réception. Notifications : mise à jour puis alertes du propriétaire |

Statuts conseillés : `Brouillon`, `À auditer`, `En validation`, `Validé` ou `Historique`.

## Checklist avant validation

- [ ] L'identité KubaGest est immédiatement reconnaissable.
- [ ] Le rôle de chaque carte est compris sans explication.
- [ ] Les données comportent une unité, une période et un libellé précis.
- [ ] Les actions principales sont visibles dès l'ouverture.
- [ ] La navigation indique clairement l'écran actif.
- [ ] Aucun contenu n'est masqué par la navigation ou les zones système.
- [ ] Tous les textes essentiels ont un contraste suffisant.
- [ ] Les états succès, alerte et erreur ne reposent pas uniquement sur la couleur.
- [ ] Les zones tactiles mesurent au minimum 44 × 44 px.
- [ ] La mise en page fonctionne sur petits et grands écrans mobiles.
- [ ] Les états vide, chargement, erreur et hors connexion ont été prévus.
- [ ] Le centre de notifications distingue mise à jour, stock, caisse, abonnement et crédit.
- [ ] Une notification n'est visible que pour le rôle autorisé.
- [ ] Une capture de la version validée est enregistrée dans `docs/mobile/screenshots`.

## Journal des décisions

| Date | Décision | Motif | Responsable |
|---|---|---|---|
| 2026-10-26 | Utiliser la capture comme référence d'ambiance et de composition, sans reprendre son domaine médical | Adapter les bonnes pratiques visuelles aux besoins de gestion de KubaGest | À compléter |
| 2026-10-26 | Prévoir les notifications, d'abord pour les mises à jour de l'application, puis pour le stock, la caisse, l'abonnement et les crédits | Le cahier des charges laisse le canal push ouvert ; le centre dans l'application est retenu. Chaque message suit les droits du destinataire | À compléter |
| 2026-10-26 | Dessiner le centre de notifications dans la V6, ouvert par la cloche | La mise à jour est en tête. Les quatre alertes métier sont celles visibles par le propriétaire | À compléter |
| 2026-10-27 | L'inscription enregistre la personne : prénom, nom, photo facultative, téléphone facultatif, email et mot de passe | Le cahier ne prévoyait que l'email, le téléphone et le mot de passe. L'accueil salue par le prénom et montre la photo | À compléter |
| 2026-10-27 | La photo de profil est sélectionnable : galerie, appareil photo ou retrait, avec aperçu rond et badge de modification | La maquette montrait un bouton sans effet. L'aperçu est partagé entre la création du commerce, les paramètres et l'accueil | À compléter |
| 2026-10-27 | L'écran « Commerce créé » suit la maquette d'accueil : fond menthe, sceau, carte du commerce, puis accès à l'espace | Cette confirmation n'existait pas dans la V6. L'ancienne page gardait la barre verte | À compléter |
| 2026-10-27 | La page Ventes de la V6 est le comptoir : recherche d’article, panier, quantités, remise, moyen de paiement, monnaie à rendre et encaissement. Le journal du jour est une action secondaire | L’ancienne page annonçait le panier, l’encaissement et le reçu, sans être l’écran. Le chiffre du jour reste sur l’accueil | À compléter |
| 2026-10-27 | En espèces, le caissier saisit le montant remis par le client. La monnaie, ou le manque, se calcule tout de suite | Le total du panier était affiché, sans l’endroit où taper ce que le client tend | À compléter |
| 2026-10-27 | Le comptoir Ventes est implémenté dans Flutter tel que la V6 le décrit : recherche, panier, quantités, moyen de paiement, montant remis, monnaie et encaissement | La maquette est validée. Le catalogue vient de l’API ; aucune vente n’est écrite tant que la caisse n’est pas branchée | À compléter |
| 2026-10-27 | Le crédit client est un carnet complet : identité du client, plafond d’encours, vente à crédit, échéance, règlements partiels et alerte de retard | Le comptoir ne pouvait pas laisser une dette sans trace. Le carnet simple (nom, téléphone, dette) est complété par le plafond et l’échéance, comme convenu | À compléter |
| 2026-10-27 | Le caissier choisit ou enregistre le client au moment du crédit ; le plafond est vérifié avant l’encaissement et l’échéance est proposée à 30 jours | Le client est devant le comptoir : une recherche, une création rapide et une date modifiable évitent de quitter la vente | À compléter |

## Prochaine mise à jour

Lors de la prochaine révision, relier la réception de stock et le détail d'un article. Les quatre onglets ont maintenant une page.

L'écran Ventes de l'application reprend la V6 : le panier lit le catalogue du commerce (`GET /api/v1/products`), le montant remis est saisi en espèces et la monnaie se calcule à la frappe. L'encaissement espèces n'est pas encore écrit dans la caisse ; le crédit client, lui, est enregistré. Capture : `docs/mobile/screenshots/ventes-comptoir.png`.

Le crédit client dispose d'un carnet côté serveur : `POST /api/v1/customers` enregistre le client et son plafond, `POST /api/v1/credits` laisse la vente à crédit avec son échéance, `POST /api/v1/credits/:id/payments` encaisse un règlement partiel. Le plafond est refusé s'il est dépassé et l'échéance dépassée remonte en retard (`GET /api/v1/credits?status=late`). Dans l'application, le comptoir ouvre le choix du client et le carnet de crédit se parcourt depuis l'encaissement.

La photo de profil est choisie et prévisualisée, puis téléversée vers `POST /api/v1/users/me/avatar`. L'API valide les formats JPEG, PNG et WebP, conserve le fichier et renseigne `users.avatar_key`. La suppression passe par `DELETE /api/v1/users/me/avatar`; la référence renvoyée dans la session permet de retrouver la photo après reconnexion.
