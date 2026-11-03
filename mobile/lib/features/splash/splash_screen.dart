import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../core/theme/kuba_tokens.dart';

/// Ouverture de l'application : marque plein écran pendant la restauration de
/// la session.
///
/// Elle évite l'écran blanc du démarrage et donne immédiatement le ton.
/// L'animation est unique (pas de boucle) pour que les tests et les outils
/// d'accessibilité puissent s'y arrêter.
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 2500),
  );
  late final Animation<double> _lift = CurvedAnimation(
    parent: _controller,
    curve: const Interval(0, 0.55, curve: KubaMotion.overshoot),
  );
  late final Animation<double> _fade = CurvedAnimation(
    parent: _controller,
    curve: const Interval(0.1, 0.7, curve: Curves.easeOut),
  );
  late final Animation<double> _progress = CurvedAnimation(
    parent: _controller,
    curve: const Interval(0.15, 1, curve: KubaMotion.emphasized),
  );

  @override
  void initState() {
    super.initState();
    _controller.forward();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) _controller.value = 1;
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.light.copyWith(
        statusBarColor: Colors.transparent,
        systemNavigationBarColor: KubaPalette.brandDeep,
      ),
      child: Scaffold(
        backgroundColor: KubaPalette.brandDeep,
        body: Stack(
          children: [
            const Positioned.fill(child: _SplashBackdrop()),
            SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(KubaSpace.lg),
                child: Column(
                  children: [
                    const Spacer(flex: 3),
                    AnimatedBuilder(
                      animation: _controller,
                      builder: (context, _) => Opacity(
                        opacity: _fade.value,
                        child: Transform.translate(
                          offset: Offset(0, 16 * (1 - _lift.value)),
                          child: Transform.scale(
                            scale: 0.88 + 0.12 * _lift.value,
                            child: const _SplashMark(),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: KubaSpace.lg),
                    FadeTransition(
                      opacity: _fade,
                      child: SizedBox(
                        width: 104,
                        height: 3,
                        child: ClipRRect(
                          borderRadius: KubaRadius.pillAll,
                          child: Stack(
                            children: [
                              const Positioned.fill(
                                child: ColoredBox(color: Color(0x33ffffff)),
                              ),
                              AnimatedBuilder(
                                animation: _progress,
                                builder: (context, _) => FractionallySizedBox(
                                  widthFactor: _progress.value,
                                  child: const ColoredBox(
                                    color: KubaPalette.onBrandSoft,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const Spacer(flex: 4),
                    FadeTransition(
                      opacity: _fade,
                      child: Text(
                        'Gérer votre commerce, l’esprit tranquille.',
                        textAlign: TextAlign.center,
                        style: KubaType.bodySm.copyWith(
                          color: Colors.white.withValues(alpha: 0.66),
                          letterSpacing: 0.2,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SplashMark extends StatelessWidget {
  const _SplashMark();

  @override
  Widget build(BuildContext context) => Column(
    mainAxisSize: MainAxisSize.min,
    children: [
      ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 300),
        child: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(28),
            boxShadow: [
              BoxShadow(
                color: KubaPalette.midnightDeep.withValues(alpha: 0.28),
                blurRadius: 28,
                offset: const Offset(0, 14),
              ),
            ],
          ),
          child: AspectRatio(
            aspectRatio: 1.5,
            child: Image.asset(
              'assets/brand/kubagest-logo.png',
              fit: BoxFit.contain,
              semanticLabel: 'Logo KubaGest',
            ),
          ),
        ),
      ),
    ],
  );
}

/// Décor : dégradé de marque et halos très discrets.
class _SplashBackdrop extends StatelessWidget {
  const _SplashBackdrop();

  @override
  Widget build(BuildContext context) => DecoratedBox(
    decoration: const BoxDecoration(
      gradient: LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [KubaPalette.brandDeep, KubaPalette.brand],
      ),
    ),
    child: CustomPaint(painter: _SplashRings()),
  );
}

class _SplashRings extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..style = PaintingStyle.stroke;
    final center = Offset(size.width * 0.86, size.height * 0.16);

    final glow = Paint()
      ..shader = RadialGradient(
        colors: [
          Colors.white.withValues(alpha: 0.16),
          Colors.white.withValues(alpha: 0),
        ],
      ).createShader(Rect.fromCircle(center: center, radius: size.width * 0.6));
    canvas.drawCircle(center, size.width * 0.6, glow);

    for (var index = 1; index <= 3; index++) {
      paint
        ..color = Colors.white.withValues(alpha: 0.06)
        ..strokeWidth = 1;
      canvas.drawCircle(
        Offset(size.width * 0.05, size.height * 0.9),
        size.width * 0.22 * index,
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(_SplashRings oldDelegate) => false;
}
