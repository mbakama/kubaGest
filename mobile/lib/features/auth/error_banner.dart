import 'package:flutter/material.dart';

import '../../core/theme/kuba_tokens.dart';

/// Message d'erreur de formulaire, annoncé aux lecteurs d'écran.
class ErrorBanner extends StatelessWidget {
  const ErrorBanner({super.key, required this.message});

  final String message;

  @override
  Widget build(BuildContext context) => Semantics(
    liveRegion: true,
    child: Container(
      padding: const EdgeInsets.all(KubaSpace.md),
      decoration: BoxDecoration(
        color: KubaPalette.alertSoft,
        borderRadius: KubaRadius.baseAll,
        border: Border.all(color: const Color(0xfffecaca)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.only(top: 1),
            child: Icon(
              Icons.error_outline_rounded,
              color: Color(0xffb91c1c),
              size: 19,
            ),
          ),
          const SizedBox(width: KubaSpace.sm),
          Expanded(
            child: Text(
              message,
              style: KubaType.bodySm.copyWith(
                color: const Color(0xff991b1b),
                height: 1.45,
              ),
            ),
          ),
        ],
      ),
    ),
  );
}
