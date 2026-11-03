import 'dart:ui';

import 'package:flutter/material.dart';

import '../../core/theme/kuba_tokens.dart';
import 'kuba_bottom_nav.dart';
import 'kuba_motion.dart';

export 'kuba_bottom_nav.dart' show KubaNavItem;

class KubaV6BottomNav extends StatelessWidget {
  const KubaV6BottomNav({
    super.key,
    required this.selectedIndex,
    required this.onSelected,
    required this.items,
    this.backgroundColor = const Color(0xffe6f6f0),
  });

  final int selectedIndex;
  final ValueChanged<int> onSelected;
  final List<KubaNavItem> items;
  final Color backgroundColor;

  @override
  Widget build(BuildContext context) => ColoredBox(
    color: backgroundColor,
    child: SafeArea(
      top: false,
      minimum: const EdgeInsets.fromLTRB(28, 8, 28, 12),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(32),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 14, sigmaY: 14),
          child: Container(
            height: 62,
            padding: const EdgeInsets.all(5),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: .9),
              borderRadius: BorderRadius.circular(32),
              border: Border.all(color: const Color(0x14111214)),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x24303d35),
                  blurRadius: 26,
                  offset: Offset(0, 12),
                ),
              ],
            ),
            child: LayoutBuilder(
              builder: (context, constraints) {
                final activeWidth = constraints.maxWidth * .43;
                final idleWidth =
                    (constraints.maxWidth - activeWidth) / (items.length - 1);
                return Row(
                  children: [
                    for (var index = 0; index < items.length; index++)
                      AnimatedContainer(
                        duration: KubaMotion.of(context, KubaMotion.base),
                        curve: KubaMotion.emphasized,
                        width: index == selectedIndex ? activeWidth : idleWidth,
                        child: _V6NavButton(
                          item: items[index],
                          selected: index == selectedIndex,
                          onTap: () => onSelected(index),
                        ),
                      ),
                  ],
                );
              },
            ),
          ),
        ),
      ),
    ),
  );
}

class _V6NavButton extends StatelessWidget {
  const _V6NavButton({
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
    excludeSemantics: true,
    child: KubaPressable(
      scale: .95,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(27),
          child: AnimatedContainer(
            duration: KubaMotion.of(context, KubaMotion.fast),
            curve: KubaMotion.emphasized,
            height: 52,
            padding: EdgeInsets.symmetric(horizontal: selected ? 12 : 8),
            decoration: BoxDecoration(
              color: selected ? const Color(0xff151616) : Colors.transparent,
              borderRadius: BorderRadius.circular(27),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  selected ? item.selectedIcon : item.icon,
                  size: 20,
                  color: selected ? Colors.white : const Color(0xff747873),
                ),
                AnimatedSize(
                  duration: KubaMotion.of(context, KubaMotion.fast),
                  curve: KubaMotion.emphasized,
                  child: selected
                      ? Padding(
                          padding: const EdgeInsets.only(left: 7),
                          child: Text(
                            item.label,
                            maxLines: 1,
                            overflow: TextOverflow.fade,
                            softWrap: false,
                            style: KubaType.labelSm.copyWith(
                              color: Colors.white,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        )
                      : const SizedBox.shrink(),
                ),
              ],
            ),
          ),
        ),
      ),
    ),
  );
}
