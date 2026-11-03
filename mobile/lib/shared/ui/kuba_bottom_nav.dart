import 'package:flutter/material.dart';

import '../../core/theme/kuba_tokens.dart';
import 'kuba_motion.dart';

/// Onglet de la barre de navigation inférieure.
class KubaNavItem {
  const KubaNavItem({
    required this.icon,
    required this.selectedIcon,
    required this.label,
  });

  final IconData icon;
  final IconData selectedIcon;
  final String label;
}

/// Barre de navigation basse du design system : 64 px, fond blanc, filet
/// supérieur `#E2E8F0`, icône 24 px et libellé 11 px.
///
/// Elle remplace la `NavigationBar` Material afin de tenir exactement les
/// mesures de `DESIGN.md` (hauteur, filet, absence d'ombre lourde).
class KubaBottomNav extends StatelessWidget {
  const KubaBottomNav({
    super.key,
    required this.selectedIndex,
    required this.onSelected,
    required this.items,
  });

  final int selectedIndex;
  final ValueChanged<int> onSelected;
  final List<KubaNavItem> items;

  @override
  Widget build(BuildContext context) => DecoratedBox(
    decoration: const BoxDecoration(
      color: KubaPalette.surfaceRaised,
      border: Border(top: BorderSide(color: KubaPalette.border)),
      boxShadow: [
        BoxShadow(
          color: Color(0x0a0b2545),
          blurRadius: 16,
          offset: Offset(0, -4),
        ),
      ],
    ),
    child: SafeArea(
      top: false,
      child: SizedBox(
        height: KubaSpace.navBar,
        child: Row(
          children: [
            for (var index = 0; index < items.length; index++)
              Expanded(
                child: _KubaNavButton(
                  item: items[index],
                  selected: index == selectedIndex,
                  onTap: () => onSelected(index),
                ),
              ),
          ],
        ),
      ),
    ),
  );
}

class _KubaNavButton extends StatelessWidget {
  const _KubaNavButton({
    required this.item,
    required this.selected,
    required this.onTap,
  });

  final KubaNavItem item;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => Semantics(
    button: true,
    selected: selected,
    label: item.label,
    onTap: onTap,
    excludeSemantics: true,
    child: KubaPressable(
      scale: 0.94,
      child: InkWell(
        onTap: onTap,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            AnimatedContainer(
              duration: KubaMotion.of(context, KubaMotion.fast),
              curve: KubaMotion.emphasized,
              width: 44,
              height: 28,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: selected
                    ? KubaPalette.brandSoft
                    : KubaPalette.surfaceRaised,
                borderRadius: KubaRadius.pillAll,
              ),
              child: AnimatedSwitcher(
                duration: KubaMotion.of(context, KubaMotion.fast),
                transitionBuilder: (child, animation) => ScaleTransition(
                  scale: animation,
                  child: FadeTransition(opacity: animation, child: child),
                ),
                child: Icon(
                  selected ? item.selectedIcon : item.icon,
                  key: ValueKey(selected),
                  size: 22,
                  color: selected ? KubaPalette.brand : KubaPalette.textMuted,
                ),
              ),
            ),
            const SizedBox(height: 3),
            MediaQuery.withClampedTextScaling(
              maxScaleFactor: 1.25,
              child: Text(
                item.label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: KubaType.labelSm.copyWith(
                  color: selected ? KubaPalette.brand : KubaPalette.textMuted,
                  fontWeight: selected ? FontWeight.w700 : FontWeight.w600,
                  letterSpacing: 0.1,
                ),
              ),
            ),
          ],
        ),
      ),
    ),
  );
}
