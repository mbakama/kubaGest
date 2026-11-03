import 'package:flutter/material.dart';

import '../../core/theme/kuba_tokens.dart';
import '../../shared/brand.dart';

/// Fond menthe des écrans d'accueil, d'inscription et de connexion.
///
/// Reprend la maquette V6 : pas de barre verte pleine, titre ou marque dans
/// la page, contenu sur le dégradé.
class KubaAuthCanvas extends StatelessWidget {
  const KubaAuthCanvas({
    super.key,
    required this.child,
    this.title,
    this.onBack,
    this.showBack = false,
    this.showBrand = false,
    this.actions = const [],
  });

  final Widget child;
  final String? title;
  final VoidCallback? onBack;
  final bool showBack;
  final bool showBrand;
  final List<Widget> actions;

  static const background = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [Color(0xfff5fcf8), Color(0xffe6f6f0), Color(0xffd8eee5)],
  );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xffe6f6f0),
      body: DecoratedBox(
        decoration: const BoxDecoration(gradient: background),
        child: SafeArea(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(8, 4, 8, 0),
                child: Row(
                  children: [
                    if (showBack || onBack != null)
                      Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: Material(
                          color: Colors.white.withValues(alpha: 0.9),
                          shape: const CircleBorder(),
                          clipBehavior: Clip.antiAlias,
                          child: SizedBox(
                            width: 40,
                            height: 40,
                            child: IconButton(
                              tooltip: 'Retour',
                              padding: EdgeInsets.zero,
                              onPressed: onBack,
                              icon: const Icon(
                                Icons.arrow_back_rounded,
                                color: Color(0xff151616),
                                size: 20,
                              ),
                            ),
                          ),
                        ),
                      ),
                    if (showBrand) const KubaBrand(),
                    if (title != null)
                      Expanded(
                        child: Text(
                          title!,
                          style: KubaType.headlineSm.copyWith(fontSize: 18),
                        ),
                      )
                    else
                      const Spacer(),
                    ...actions,
                  ],
                ),
              ),
              Expanded(child: child),
            ],
          ),
        ),
      ),
    );
  }
}
