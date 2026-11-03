import 'package:flutter/material.dart';

import '../../core/theme/kuba_tokens.dart';
import 'kuba_badge.dart';
import 'kuba_card.dart';
import 'kuba_motion.dart';

/// Carte d'indicateur : pastille d'icône, valeur mise en avant, libellé.
///
/// La valeur peut être vide ("—") tant que le module concerné n'est pas
/// alimenté par une donnée réelle : on n'affiche jamais de montant inventé.
class KpiCard extends StatelessWidget {
  const KpiCard({
    super.key,
    required this.icon,
    required this.label,
    this.value,
    this.caption,
    this.accent = KubaPalette.brand,
    this.tone = KubaTone.neutral,
    this.badge,
    this.onTap,
  });

  final IconData icon;
  final String label;
  final String? value;
  final String? caption;
  final Color accent;
  final KubaTone tone;
  final String? badge;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) => KubaPressable(
    enabled: onTap != null,
    child: KubaCard(
      onTap: onTap,
      semanticLabel: value == null ? label : '$label : $value',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              KubaIconPastille(icon: icon, color: accent),
              const Spacer(),
              if (badge != null || value == null)
                KubaBadge(
                  label: badge ?? 'À venir',
                  tone: value == null ? KubaTone.neutral : tone,
                ),
            ],
          ),
          const SizedBox(height: KubaSpace.md),
          Text(
            value ?? '—',
            style: KubaType.amount.copyWith(
              color: value == null ? KubaPalette.textMuted : null,
            ),
          ),
          const SizedBox(height: 2),
          Text(label, style: KubaType.labelMd),
          if (caption != null) ...[
            const SizedBox(height: KubaSpace.xs),
            Text(caption!, style: KubaType.bodySm),
          ],
        ],
      ),
    ),
  );
}
