import 'package:flutter/material.dart';

/// Jetons du design system KubaGest.
///
/// Source de vérité : `stitch_maquette_interface_kubagest/DESIGN.md`. Toute
/// couleur, taille de texte, espacement ou ombre utilisée dans l'application
/// doit provenir de ce fichier plutôt que d'une valeur écrite sur place.
abstract final class KubaPalette {
  // Vert de marque : actions décisives, onglet actif, en-tête mobile.
  static const brand = Color(0xff007a55);
  static const brandPressed = Color(0xff006345);

  /// Fond vert clair d'un bouton principal désactivé ou en chargement.
  static const brandMuted = Color(0xff99cabb);
  static const brandDeep = Color(0xff005f41);
  static const brandSoft = Color(0xffe6f6f0);
  static const onBrand = Color(0xffffffff);
  static const onBrandSoft = Color(0xffa3ffd2);

  // Bleu nuit : bannières institutionnelles et surfaces de contraste.
  static const midnight = Color(0xff0b2545);
  static const midnightDeep = Color(0xff091e3a);
  static const onMidnight = Color(0xffffffff);
  static const onMidnightMuted = Color(0xffc7d5e8);

  // Surfaces claires.
  static const surface = Color(0xfff8fafc);
  static const surfaceRaised = Color(0xffffffff);
  static const surfaceSunken = Color(0xfff1f5f9);
  static const surfaceDim = Color(0xffe6e8ea);

  // Texte.
  static const textPrimary = Color(0xff0b1e33);
  static const textMuted = Color(0xff64748b);
  static const textOnDark = Color(0xffffffff);

  // Traits.
  static const border = Color(0xffe2e8f0);
  static const borderStrong = Color(0xffcbd5e1);
  static const outline = Color(0xff6e7a72);

  // Accents fonctionnels POS.
  static const growth = Color(0xff10b981);
  static const sales = brand;
  static const stock = Color(0xff0284c7);
  static const cash = Color(0xfff59e0b);
  static const credit = Color(0xff8b5cf6);
  static const alert = Color(0xffef4444);
  static const alertSoft = Color(0xfffef2f2);
  static const successSoft = Color(0xffecfdf5);
  static const warningSoft = Color(0xfffffbeb);
  static const infoSoft = Color(0xffeff6ff);

  // Texte et contours des tons d'état (badges, bandeaux).
  static const successStrong = Color(0xff047857);
  static const warningStrong = Color(0xffb45309);
  static const dangerStrong = Color(0xffb91c1c);
  static const infoStrong = Color(0xff1d4ed8);

  static const brandBorder = Color(0xffa7e8d3);
  static const successBorder = Color(0xffa7f3d0);
  static const warningBorder = Color(0xfffde68a);
  static const dangerBorder = Color(0xfffecaca);
  static const infoBorder = Color(0xffbfdbfe);
}

/// Échelle d'espacement : multiples de 4 px.
abstract final class KubaSpace {
  static const xs = 4.0;
  static const sm = 8.0;
  static const md = 16.0;
  static const lg = 24.0;
  static const xl = 32.0;
  static const xxl = 48.0;

  /// Gouttière latérale des écrans mobiles.
  static const gutter = 16.0;

  /// Marge extérieure d'un écran mobile.
  static const margin = 16.0;

  /// Hauteur de la barre de navigation inférieure.
  static const navBar = 64.0;

  /// Cible tactile minimale.
  static const touch = 44.0;
}

/// Arrondis, en pixels.
abstract final class KubaRadius {
  static const sm = 4.0;
  static const base = 8.0;
  static const md = 12.0;
  static const lg = 16.0;
  static const xl = 24.0;
  static const pill = 999.0;

  static const smAll = BorderRadius.all(Radius.circular(sm));
  static const baseAll = BorderRadius.all(Radius.circular(base));
  static const mdAll = BorderRadius.all(Radius.circular(md));
  static const lgAll = BorderRadius.all(Radius.circular(lg));
  static const xlAll = BorderRadius.all(Radius.circular(xl));
  static const pillAll = BorderRadius.all(Radius.circular(pill));
}

/// Profondeur : séparation nette par cartes blanches sur fond ardoise.
abstract final class KubaShadow {
  /// Niveau 1 : cartes de métriques, listes d'articles.
  static const level1 = <BoxShadow>[
    BoxShadow(color: Color(0x0d0b2545), blurRadius: 3, offset: Offset(0, 1)),
  ];

  /// Niveau 2 : cartes actives, éléments flottants.
  static const level2 = <BoxShadow>[
    BoxShadow(
      color: Color(0x140b2545),
      blurRadius: 8,
      offset: Offset(0, 4),
      spreadRadius: -2,
    ),
  ];

  /// Niveau 3 : tiroirs, feuilles modales, paiement.
  static const level3 = <BoxShadow>[
    BoxShadow(
      color: Color(0x240b2545),
      blurRadius: 24,
      offset: Offset(0, 12),
      spreadRadius: -4,
    ),
  ];
}

/// Durées et courbes du mouvement.
///
/// Une seule échelle pour toute l'application : les interactions restent
/// vives (moins de 250 ms) et les entrées d'écran plus posées. Les animations
/// sont neutralisées quand le système demande de réduire les animations.
abstract final class KubaMotion {
  /// Enfoncement d'un élément, changement d'état local.
  static const micro = Duration(milliseconds: 120);

  /// Bascule d'onglet, apparition d'un message.
  static const fast = Duration(milliseconds: 180);

  /// Transition d'écran, changement d'étape.
  static const base = Duration(milliseconds: 240);

  /// Défilement de la présentation, feuille modale.
  static const slow = Duration(milliseconds: 360);

  /// Entrée d'un bloc de contenu.
  static const entrance = Duration(milliseconds: 520);

  static const standard = Curves.easeOutCubic;
  static const emphasized = Cubic(0.2, 0, 0, 1);
  static const overshoot = Curves.easeOutBack;

  /// Durée nulle si le système demande de réduire les animations.
  static Duration of(BuildContext context, Duration duration) =>
      MediaQuery.disableAnimationsOf(context) ? Duration.zero : duration;
}

/// Échelle typographique Inter.
///
/// Les styles destinés aux montants activent les chiffres tabulaires pour que
/// les colonnes de prix restent alignées.
abstract final class KubaType {
  static const family = 'Inter';

  /// Chiffres de largeur fixe, indispensables aux montants et aux stocks.
  static const tabular = <FontFeature>[FontFeature.tabularFigures()];

  static const headlineXl = TextStyle(
    fontFamily: family,
    fontSize: 32,
    height: 40 / 32,
    fontWeight: FontWeight.w700,
    letterSpacing: -0.64,
    color: KubaPalette.textPrimary,
  );

  static const headlineXlMobile = TextStyle(
    fontFamily: family,
    fontSize: 26,
    height: 32 / 26,
    fontWeight: FontWeight.w700,
    letterSpacing: -0.39,
    color: KubaPalette.textPrimary,
  );

  static const headlineLg = TextStyle(
    fontFamily: family,
    fontSize: 24,
    height: 32 / 24,
    fontWeight: FontWeight.w600,
    letterSpacing: -0.36,
    color: KubaPalette.textPrimary,
  );

  static const headlineMd = TextStyle(
    fontFamily: family,
    fontSize: 20,
    height: 28 / 20,
    fontWeight: FontWeight.w600,
    letterSpacing: -0.2,
    color: KubaPalette.textPrimary,
  );

  static const headlineSm = TextStyle(
    fontFamily: family,
    fontSize: 16,
    height: 24 / 16,
    fontWeight: FontWeight.w600,
    color: KubaPalette.textPrimary,
  );

  static const bodyLg = TextStyle(
    fontFamily: family,
    fontSize: 16,
    height: 24 / 16,
    color: KubaPalette.textMuted,
  );

  static const bodyMd = TextStyle(
    fontFamily: family,
    fontSize: 14,
    height: 20 / 14,
    color: KubaPalette.textMuted,
  );

  static const bodySm = TextStyle(
    fontFamily: family,
    fontSize: 12,
    height: 16 / 12,
    color: KubaPalette.textMuted,
  );

  static const labelLg = TextStyle(
    fontFamily: family,
    fontSize: 15,
    height: 20 / 15,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.15,
    color: KubaPalette.textPrimary,
  );

  static const labelMd = TextStyle(
    fontFamily: family,
    fontSize: 13,
    height: 18 / 13,
    fontWeight: FontWeight.w500,
    letterSpacing: 0.13,
    color: KubaPalette.textMuted,
  );

  static const labelSm = TextStyle(
    fontFamily: family,
    fontSize: 11,
    height: 14 / 11,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.22,
    color: KubaPalette.textMuted,
  );

  /// Montant mis en valeur : grand, tabulaire, contraste maximal.
  static const amount = TextStyle(
    fontFamily: family,
    fontSize: 20,
    height: 28 / 20,
    fontWeight: FontWeight.w600,
    letterSpacing: -0.2,
    fontFeatures: tabular,
    color: KubaPalette.textPrimary,
  );

  /// Variante de montant pour les affichages compacts de liste.
  static const amountCompact = TextStyle(
    fontFamily: family,
    fontSize: 16,
    height: 24 / 16,
    fontWeight: FontWeight.w600,
    fontFeatures: tabular,
    color: KubaPalette.textPrimary,
  );

  /// Intitulé de section en capitales espacées.
  static const eyebrow = TextStyle(
    fontFamily: family,
    fontSize: 11,
    height: 14 / 11,
    fontWeight: FontWeight.w700,
    letterSpacing: 1.6,
    color: KubaPalette.brand,
  );
}
