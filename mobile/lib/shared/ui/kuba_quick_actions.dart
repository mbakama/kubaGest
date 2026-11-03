import 'package:flutter/material.dart';

import '../../core/theme/kuba_tokens.dart';
import 'kuba_card.dart';
import 'kuba_motion.dart';

/// Raccourci vers un module du point de vente (ventes, stock, caisse…).
class KubaQuickAction {
  const KubaQuickAction({
    required this.icon,
    required this.label,
    required this.accent,
  });

  final IconData icon;
  final String label;
  final Color accent;
}

/// Grille de raccourcis POS : pastille 44 px, libellé 13 px.
///
/// Le pied de carte explique l'état des modules ; chaque raccourci reste
/// actionnable pour présenter ce qui arrivera, sans jamais afficher de
/// montant inventé.
class KubaQuickActions extends StatelessWidget {
  const KubaQuickActions({
    super.key,
    required this.actions,
    required this.onSelected,
    this.footer,
  });

  final List<KubaQuickAction> actions;
  final ValueChanged<KubaQuickAction> onSelected;
  final String? footer;

  @override
  Widget build(BuildContext context) => KubaCard(
    padding: EdgeInsets.zero,
    child: Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: KubaSpace.sm,
            vertical: KubaSpace.md,
          ),
          child: Row(
            children: [
              for (final action in actions)
                Expanded(
                  child: _QuickActionButton(
                    action: action,
                    onTap: () => onSelected(action),
                  ),
                ),
            ],
          ),
        ),
        if (footer != null) ...[
          const Divider(height: 1),
          Padding(
            padding: const EdgeInsets.fromLTRB(
              KubaSpace.md,
              10,
              KubaSpace.md,
              12,
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(
                  Icons.schedule_rounded,
                  size: 14,
                  color: KubaPalette.textMuted,
                ),
                const SizedBox(width: 6),
                Expanded(child: Text(footer!, style: KubaType.bodySm)),
              ],
            ),
          ),
        ],
      ],
    ),
  );
}

class _QuickActionButton extends StatelessWidget {
  const _QuickActionButton({required this.action, required this.onTap});

  final KubaQuickAction action;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => Semantics(
    button: true,
    label: '${action.label} — module à venir',
    onTap: onTap,
    excludeSemantics: true,
    child: KubaPressable(
      child: InkWell(
        borderRadius: KubaRadius.mdAll,
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: KubaSpace.sm),
          child: Column(
            children: [
              Container(
                width: 44,
                height: 44,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: action.accent.withValues(alpha: 0.12),
                  shape: BoxShape.circle,
                ),
                child: Icon(action.icon, size: 22, color: action.accent),
              ),
              const SizedBox(height: KubaSpace.sm),
              MediaQuery.withClampedTextScaling(
                maxScaleFactor: 1.3,
                child: Text(
                  action.label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: KubaType.labelMd.copyWith(
                    color: KubaPalette.textPrimary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    ),
  );
}
