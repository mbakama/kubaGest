import 'package:flutter/material.dart';

import '../../core/theme/kuba_tokens.dart';

/// Surface blanche arrondie, contour discret et ombre de niveau 1.
///
/// C'est la brique de base des listes et des indicateurs ; l'`onTap` ajoute
/// l'effet d'enfoncement sans changer l'apparence au repos.
class KubaCard extends StatelessWidget {
  const KubaCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(KubaSpace.md),
    this.onTap,
    this.radius = KubaRadius.md,
    this.tone = KubaCardTone.plain,
    this.semanticLabel,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;
  final VoidCallback? onTap;
  final double radius;
  final KubaCardTone tone;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final shape = RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(radius),
      side: BorderSide(color: tone.border),
    );

    return Semantics(
      container: true,
      label: semanticLabel,
      button: onTap != null,
      child: DecoratedBox(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(radius),
          boxShadow: KubaShadow.level1,
        ),
        child: Material(
          color: tone.background,
          shape: shape,
          clipBehavior: Clip.antiAlias,
          child: InkWell(
            onTap: onTap,
            child: Padding(padding: padding, child: child),
          ),
        ),
      ),
    );
  }
}

/// Nuanciers de carte : neutre, mise en avant de marque, alerte.
enum KubaCardTone {
  plain(KubaPalette.surfaceRaised, KubaPalette.border),
  brand(KubaPalette.brandSoft, KubaPalette.brandBorder),
  notice(KubaPalette.warningSoft, KubaPalette.warningBorder),
  danger(KubaPalette.alertSoft, KubaPalette.dangerBorder),
  info(KubaPalette.infoSoft, KubaPalette.infoBorder);

  const KubaCardTone(this.background, this.border);

  final Color background;
  final Color border;
}
