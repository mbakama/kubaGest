import 'package:flutter/material.dart';

import '../core/theme/kuba_tokens.dart';

/// Marque KubaGest : pastille verte et mot-symbole.
///
/// [inverse] s'utilise sur un fond sombre ou vert de marque : le texte passe
/// en blanc et la pastille en blanc translucide.
class KubaBrand extends StatelessWidget {
  const KubaBrand({super.key, this.large = false, this.inverse = false});
  final bool large;
  final bool inverse;

  @override
  Widget build(BuildContext context) {
    final compact =
        MediaQuery.sizeOf(context).width < 360 &&
        (large || MediaQuery.textScalerOf(context).scale(1) > 1.3);
    final markColor = inverse ? Colors.white : KubaPalette.brand;

    return Semantics(
      label: 'KubaGest',
      excludeSemantics: true,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: large ? 56 : 34,
            height: large ? 56 : 34,
            padding: EdgeInsets.all(large ? 4 : 2),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(large ? 16 : 10),
              border: Border.all(
                color: inverse
                    ? Colors.white.withValues(alpha: 0.28)
                    : KubaPalette.brandBorder,
              ),
            ),
            child: Image.asset(
              'assets/brand/kubagest-mark.png',
              fit: BoxFit.contain,
            ),
          ),
          if (!compact) ...[
            const SizedBox(width: 10),
            Text(
              'KubaGest',
              style: TextStyle(
                fontFamily: KubaType.family,
                fontSize: large ? 30 : 23,
                fontWeight: FontWeight.w700,
                letterSpacing: -0.8,
                color: inverse ? Colors.white : markColor,
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(left: 1, bottom: 1),
              child: Text(
                '.',
                style: TextStyle(
                  fontFamily: KubaType.family,
                  fontSize: large ? 32 : 26,
                  height: 1.25,
                  fontWeight: FontWeight.w800,
                  color: inverse ? KubaPalette.brandSoft : KubaPalette.cash,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

/// Intitulé de sur-titre en capitales espacées.
class StepEyebrow extends StatelessWidget {
  const StepEyebrow(this.text, {super.key, this.inverse = false});
  final String text;
  final bool inverse;

  @override
  Widget build(BuildContext context) => Text(
    text.toUpperCase(),
    style: KubaType.eyebrow.copyWith(
      color: inverse ? KubaPalette.brandSoft : KubaPalette.brand,
    ),
  );
}

/// Bouton d'action principal, pleine largeur, avec état de chargement.
class ActionButton extends StatelessWidget {
  const ActionButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.loading = false,
    this.icon = Icons.arrow_forward_rounded,
    this.tone = ActionButtonTone.primary,
  });

  final String label;
  final VoidCallback? onPressed;
  final bool loading;
  final IconData icon;
  final ActionButtonTone tone;

  @override
  Widget build(BuildContext context) {
    final content = Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (loading) ...[
          SizedBox.square(
            dimension: 16,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              color: KubaPalette.brand,
            ),
          ),
          const SizedBox(width: KubaSpace.sm),
        ],
        Flexible(child: Text(label, textAlign: TextAlign.center, maxLines: 2)),
        if (!loading) ...[
          const SizedBox(width: KubaSpace.sm),
          Icon(icon, size: 18),
        ],
      ],
    );

    final quiet =
        tone == ActionButtonTone.primary && (loading || onPressed == null);
    final quietStyle = const ButtonStyle(
      backgroundColor: WidgetStatePropertyAll(KubaPalette.brandMuted),
      foregroundColor: WidgetStatePropertyAll(KubaPalette.brand),
    );

    if (tone == ActionButtonTone.secondary) {
      return OutlinedButton(
        onPressed: loading ? null : onPressed,
        child: content,
      );
    }
    return FilledButton(
      onPressed: loading ? null : onPressed,
      style: quiet ? quietStyle : null,
      child: content,
    );
  }
}

enum ActionButtonTone { primary, secondary }
