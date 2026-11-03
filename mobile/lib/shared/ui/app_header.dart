import 'package:flutter/material.dart';

import '../../core/theme/kuba_tokens.dart';
import '../brand.dart';

/// En-tête vert de marque, spécifique au mobile.
///
/// Fond `#007A55`, logo blanc, actions claires. Il remplace l'`AppBar`
/// classique sur les écrans qui doivent affirmer l'identité KubaGest.
class KubaAppHeader extends StatelessWidget implements PreferredSizeWidget {
  const KubaAppHeader({
    super.key,
    this.title,
    this.subtitle,
    this.onBack,
    this.showBack = false,
    this.actions = const [],
    this.showBrand = true,
    this.trailing,
  });

  final String? title;
  final String? subtitle;
  final VoidCallback? onBack;

  /// Affiche la flèche de retour même quand [onBack] est nul : le bouton est
  /// alors visible mais désactivé (envoi en cours, par exemple).
  final bool showBack;
  final List<Widget> actions;
  final bool showBrand;
  final Widget? trailing;

  @override
  Size get preferredSize => const Size.fromHeight(64);

  @override
  Widget build(BuildContext context) {
    final media = MediaQuery.of(context);
    return Container(
      color: KubaPalette.brand,
      padding: EdgeInsets.only(top: media.padding.top),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(12, 8, 12, 10),
        child: ConstrainedBox(
          constraints: const BoxConstraints(minHeight: 46),
          child: Row(
            children: [
              if (showBack || onBack != null)
                IconButton(
                  tooltip: 'Retour',
                  onPressed: onBack,
                  icon: const Icon(Icons.arrow_back_rounded),
                  color: Colors.white,
                  disabledColor: Colors.white38,
                )
              else if (showBrand)
                const Padding(
                  padding: EdgeInsets.only(left: 4),
                  child: KubaBrand(inverse: true),
                ),
              if (title != null) ...[
                const SizedBox(width: KubaSpace.md),
                Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title!,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: KubaType.headlineSm.copyWith(
                          color: Colors.white,
                          fontSize: 17,
                        ),
                      ),
                      if (subtitle != null)
                        Text(
                          subtitle!,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: KubaType.bodySm.copyWith(
                            color: KubaPalette.onBrandSoft,
                            fontSize: 11,
                          ),
                        ),
                    ],
                  ),
                ),
              ] else
                const Spacer(),
              ...actions,
              ?trailing,
            ],
          ),
        ),
      ),
    );
  }
}

/// Barre d'action d'icône accordée au vert de marque.
class KubaHeaderAction extends StatelessWidget {
  const KubaHeaderAction({
    super.key,
    required this.icon,
    required this.tooltip,
    this.onPressed,
  });

  final IconData icon;
  final String tooltip;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) => IconButton(
    tooltip: tooltip,
    onPressed: onPressed,
    icon: Icon(icon, size: 22),
    color: Colors.white,
    disabledColor: Colors.white38,
  );
}
