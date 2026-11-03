import 'package:flutter/material.dart';

import '../../core/theme/kuba_tokens.dart';

/// Pastille circulaire portant l'icône d'un indicateur ou d'une rubrique.
class KubaIconPastille extends StatelessWidget {
  const KubaIconPastille({
    super.key,
    required this.icon,
    this.color = KubaPalette.brand,
    this.background,
    this.diameter = 36,
    this.iconSize = 19,
  });

  final IconData icon;
  final Color color;
  final Color? background;
  final double diameter;
  final double iconSize;

  @override
  Widget build(BuildContext context) => Container(
    width: diameter,
    height: diameter,
    decoration: BoxDecoration(
      color: background ?? color.withValues(alpha: 0.12),
      shape: BoxShape.circle,
    ),
    child: Icon(icon, size: iconSize, color: color),
  );
}

/// Tons d'état d'un badge ou d'un bandeau.
enum KubaTone { neutral, brand, success, warning, danger, info }

extension KubaToneColors on KubaTone {
  Color get foreground => switch (this) {
    KubaTone.neutral => KubaPalette.textMuted,
    KubaTone.brand => KubaPalette.brandDeep,
    KubaTone.success => KubaPalette.successStrong,
    KubaTone.warning => KubaPalette.warningStrong,
    KubaTone.danger => KubaPalette.dangerStrong,
    KubaTone.info => KubaPalette.infoStrong,
  };

  Color get background => switch (this) {
    KubaTone.neutral => KubaPalette.surfaceSunken,
    KubaTone.brand => KubaPalette.brandSoft,
    KubaTone.success => KubaPalette.successSoft,
    KubaTone.warning => KubaPalette.warningSoft,
    KubaTone.danger => KubaPalette.alertSoft,
    KubaTone.info => KubaPalette.infoSoft,
  };

  Color get border => switch (this) {
    KubaTone.neutral => KubaPalette.border,
    KubaTone.brand => KubaPalette.brandBorder,
    KubaTone.success => KubaPalette.successBorder,
    KubaTone.warning => KubaPalette.warningBorder,
    KubaTone.danger => KubaPalette.dangerBorder,
    KubaTone.info => KubaPalette.infoBorder,
  };

  IconData get icon => switch (this) {
    KubaTone.neutral => Icons.info_outline_rounded,
    KubaTone.brand => Icons.storefront_rounded,
    KubaTone.success => Icons.check_circle_outline_rounded,
    KubaTone.warning => Icons.warning_amber_rounded,
    KubaTone.danger => Icons.error_outline_rounded,
    KubaTone.info => Icons.info_outline_rounded,
  };
}

/// Étiquette d'état compacte, en forme de pilule.
class KubaBadge extends StatelessWidget {
  const KubaBadge({
    super.key,
    required this.label,
    this.tone = KubaTone.neutral,
    this.icon,
  });

  final String label;
  final KubaTone tone;
  final IconData? icon;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
    decoration: BoxDecoration(
      color: tone.background,
      borderRadius: KubaRadius.pillAll,
      border: Border.all(color: tone.border),
    ),
    child: Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (icon != null) ...[
          Icon(icon, size: 13, color: tone.foreground),
          const SizedBox(width: 5),
        ],
        Text(
          label,
          style: KubaType.labelSm.copyWith(
            color: tone.foreground,
            letterSpacing: 0.1,
          ),
        ),
      ],
    ),
  );
}

/// Badge sombre posé sur un fond de marque ou une bannière nuit.
class KubaOnDarkBadge extends StatelessWidget {
  const KubaOnDarkBadge({super.key, required this.label});

  final String label;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
    decoration: BoxDecoration(
      color: Colors.white.withValues(alpha: 0.14),
      borderRadius: KubaRadius.pillAll,
      border: Border.all(color: Colors.white.withValues(alpha: 0.22)),
    ),
    child: Text(
      label,
      style: KubaType.labelSm.copyWith(
        color: KubaPalette.onMidnight,
        letterSpacing: 0.1,
      ),
    ),
  );
}
