import 'package:flutter/material.dart';

import '../../core/theme/kuba_tokens.dart';
import 'kuba_badge.dart';
import 'kuba_motion.dart';

/// Intitulé de rubrique, avec action facultative alignée à droite.
class SectionHeader extends StatelessWidget {
  const SectionHeader({
    super.key,
    required this.title,
    this.subtitle,
    this.actionLabel,
    this.onAction,
  });

  final String title;
  final String? subtitle;
  final String? actionLabel;
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: KubaSpace.sm),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Semantics(
                header: true,
                child: Text(title, style: KubaType.headlineSm),
              ),
              if (subtitle != null) ...[
                const SizedBox(height: 2),
                Text(subtitle!, style: KubaType.bodySm),
              ],
            ],
          ),
        ),
        if (actionLabel != null && onAction != null)
          TextButton(onPressed: onAction, child: Text(actionLabel!)),
      ],
    ),
  );
}

/// Ligne clé / valeur d'une fiche de consultation.
class InfoRow extends StatelessWidget {
  const InfoRow({
    super.key,
    required this.icon,
    required this.label,
    required this.value,
    this.accent = KubaPalette.brand,
    this.copyable = false,
  });

  final IconData icon;
  final String label;
  final String value;
  final Color accent;
  final bool copyable;

  @override
  Widget build(BuildContext context) => MergeSemantics(
    child: Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 20, color: accent),
          const SizedBox(width: KubaSpace.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: KubaType.labelSm),
                const SizedBox(height: 3),
                SelectableText(
                  value,
                  style: KubaType.headlineSm,
                  enableInteractiveSelection: copyable,
                ),
              ],
            ),
          ),
        ],
      ),
    ),
  );
}

/// Rubrique cliquable : icône, intitulé, précision et chevron.
class KubaTile extends StatelessWidget {
  const KubaTile({
    super.key,
    required this.icon,
    required this.title,
    this.subtitle,
    this.trailing,
    this.onTap,
    this.enabled = true,
  });

  final IconData icon;
  final String title;
  final String? subtitle;
  final Widget? trailing;
  final VoidCallback? onTap;
  final bool enabled;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: KubaSpace.sm),
    child: KubaPressable(
      enabled: enabled && onTap != null,
      child: Material(
        color: KubaPalette.surfaceRaised,
        shape: const RoundedRectangleBorder(
          borderRadius: KubaRadius.mdAll,
          side: BorderSide(color: KubaPalette.border),
        ),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: enabled ? onTap : null,
          child: Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: KubaSpace.md,
              vertical: 14,
            ),
            child: Row(
              children: [
                KubaIconPastille(
                  icon: icon,
                  diameter: 38,
                  background: enabled
                      ? KubaPalette.brandSoft
                      : KubaPalette.surfaceSunken,
                  color: enabled ? KubaPalette.brand : KubaPalette.textMuted,
                ),
                const SizedBox(width: KubaSpace.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: KubaType.headlineSm.copyWith(
                          fontSize: 15,
                          color: enabled
                              ? KubaPalette.textPrimary
                              : KubaPalette.textMuted,
                        ),
                      ),
                      if (subtitle != null) ...[
                        const SizedBox(height: 2),
                        Text(subtitle!, style: KubaType.bodySm),
                      ],
                    ],
                  ),
                ),
                const SizedBox(width: KubaSpace.sm),
                trailing ??
                    Icon(
                      Icons.chevron_right_rounded,
                      size: 20,
                      color: enabled
                          ? KubaPalette.textMuted
                          : KubaPalette.borderStrong,
                    ),
              ],
            ),
          ),
        ),
      ),
    ),
  );
}

/// État vide ou module à venir : icône, intitulé, explication.
class EmptyState extends StatelessWidget {
  const EmptyState({
    super.key,
    required this.icon,
    required this.title,
    required this.message,
    this.action,
    this.tone = KubaTone.brand,
  });

  final IconData icon;
  final String title;
  final String message;
  final Widget? action;
  final KubaTone tone;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(vertical: KubaSpace.lg),
    child: Column(
      children: [
        KubaIconPastille(
          icon: icon,
          diameter: 56,
          iconSize: 26,
          color: tone.foreground,
          background: tone.background,
        ),
        const SizedBox(height: KubaSpace.md),
        Text(title, textAlign: TextAlign.center, style: KubaType.headlineSm),
        const SizedBox(height: KubaSpace.xs),
        Text(message, textAlign: TextAlign.center, style: KubaType.bodySm),
        if (action != null) ...[const SizedBox(height: KubaSpace.md), action!],
      ],
    ),
  );
}
