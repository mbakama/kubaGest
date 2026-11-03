import 'package:flutter/material.dart';

import '../../core/theme/kuba_tokens.dart';

/// Fonction prévue d'un module du point de vente.
class PosFeature {
  const PosFeature({
    required this.icon,
    required this.title,
    required this.text,
  });

  final IconData icon;
  final String title;
  final String text;
}

/// Description d'un module POS, affichée tant que le module n'est pas branché.
///
/// Aucun montant ni compteur n'y figure : l'écran présente la mise en page et
/// les fonctions prévues, sans simuler de données métier.
class PosModule {
  const PosModule({
    required this.label,
    required this.tagline,
    required this.description,
    required this.icon,
    required this.accent,
    required this.features,
    required this.checklist,
    required this.previewNote,
  });

  final String label;
  final String tagline;
  final String description;
  final IconData icon;
  final Color accent;
  final List<PosFeature> features;
  final List<String> checklist;
  final String previewNote;
}

/// Catalogue des modules annoncés sur l'accueil, dans l'ordre du comptoir.
abstract final class PosModules {
  static const ventes = PosModule(
    label: 'Ventes',
    tagline: 'Encaisser sans quitter le comptoir.',
    description:
        'Le panier, le paiement et le reçu tiendront dans un seul geste. Chaque vente viendra alimenter la caisse et le stock du commerce.',
    icon: Icons.point_of_sale_rounded,
    accent: KubaPalette.sales,
    previewNote:
        'Aperçu de la mise en page : la liste des articles, le total et le bouton d’encaissement.',
    features: [
      PosFeature(
        icon: Icons.shopping_basket_outlined,
        title: 'Panier rapide',
        text:
            'Recherche par nom, code-barres ou conditionnement, avec quantités et remises contrôlées.',
      ),
      PosFeature(
        icon: Icons.payments_outlined,
        title: 'Encaissement',
        text:
            'Espèces, mobile money ou crédit client, avec le montant rendu calculé automatiquement.',
      ),
      PosFeature(
        icon: Icons.receipt_long_outlined,
        title: 'Reçu et historique',
        text:
            'Un reçu numéroté par vente, et le journal de la journée consultable à tout moment.',
      ),
    ],
    checklist: [
      'Le catalogue du commerce saisi',
      'Les prix de vente de chaque conditionnement',
      'Les moyens de paiement acceptés au comptoir',
    ],
  );

  static const stock = PosModule(
    label: 'Stock',
    tagline: 'Savoir ce qui reste, avant la rupture.',
    description:
        'Les entrées et les sorties de marchandises seront suivies produit par produit, avec les seuils de réapprovisionnement de votre commerce.',
    icon: Icons.inventory_2_rounded,
    accent: KubaPalette.stock,
    previewNote:
        'Aperçu de la mise en page : les niveaux de stock, les seuils et les alertes de réassort.',
    features: [
      PosFeature(
        icon: Icons.inventory_outlined,
        title: 'Niveaux de stock',
        text:
            'Le disponible par produit et par lot, mis à jour à chaque vente et à chaque réception.',
      ),
      PosFeature(
        icon: Icons.notification_important_outlined,
        title: 'Alertes de rupture',
        text:
            'Un seuil par produit, et une liste des articles à recommander avant la rupture.',
      ),
      PosFeature(
        icon: Icons.event_busy_outlined,
        title: 'Lots et péremptions',
        text:
            'Les dates de péremption suivies de près, indispensables pour une pharmacie ou une alimentation.',
      ),
    ],
    checklist: [
      'Les produits et leurs conditionnements',
      'Le stock initial de chaque article',
      'Le seuil d’alerte souhaité par produit',
    ],
  );

  static const caisse = PosModule(
    label: 'Caisse',
    tagline: 'Ouvrir, clôturer, justifier.',
    description:
        'Chaque journée de caisse sera ouverte puis clôturée, avec le détail des encaissements et l’écart éventuel expliqué.',
    icon: Icons.account_balance_wallet_rounded,
    accent: KubaPalette.cash,
    previewNote:
        'Aperçu de la mise en page : le fond de caisse, les encaissements et l’écart de clôture.',
    features: [
      PosFeature(
        icon: Icons.lock_open_outlined,
        title: 'Ouverture de caisse',
        text:
            'Le fond de caisse déclaré au début du service, rattaché au caissier qui ouvre la journée.',
      ),
      PosFeature(
        icon: Icons.calculate_outlined,
        title: 'Suivi des encaissements',
        text:
            'Le détail par moyen de paiement, sans ressaisie : il provient directement des ventes.',
      ),
      PosFeature(
        icon: Icons.fact_check_outlined,
        title: 'Clôture justifiée',
        text:
            'Le comptage final, l’écart constaté et son motif, conservés dans le journal du commerce.',
      ),
    ],
    checklist: [
      'Le fond de caisse de départ',
      'Les caissiers autorisés à ouvrir une caisse',
      'La procédure de comptage de fin de journée',
    ],
  );

  static const credits = PosModule(
    label: 'Crédits',
    tagline: 'Garder la trace de chaque avance.',
    description:
        'Les ventes à crédit et les règlements seront suivis client par client, pour savoir qui doit quoi et depuis quand.',
    icon: Icons.credit_score_rounded,
    accent: KubaPalette.credit,
    previewNote:
        'Aperçu de la mise en page : les clients, leur encours et les échéances à venir.',
    features: [
      PosFeature(
        icon: Icons.people_outline_rounded,
        title: 'Encours par client',
        text:
            'Le solde de chaque client, mis à jour à chaque vente à crédit et à chaque règlement.',
      ),
      PosFeature(
        icon: Icons.event_repeat_outlined,
        title: 'Échéances',
        text:
            'Les dates de règlement convenues, avec les retards signalés sans relance automatique.',
      ),
      PosFeature(
        icon: Icons.history_rounded,
        title: 'Historique des règlements',
        text:
            'Les paiements partiels conservés dans l’ordre, pour reconstituer un solde contesté.',
      ),
    ],
    checklist: [
      'Les clients autorisés à acheter à crédit',
      'Le plafond d’encours accepté par client',
      'Le rythme de règlement habituel',
    ],
  );

  static const all = <PosModule>[ventes, stock, caisse, credits];

  /// Retrouve un module par son libellé, ou `null` s'il n'est pas annoncé.
  static PosModule? byLabel(String label) {
    for (final module in all) {
      if (module.label == label) return module;
    }
    return null;
  }
}
