import 'package:flutter/material.dart';

import '../../core/theme/kuba_tokens.dart';

/// Entrée douce d'un bloc : fondu, léger déplacement et mise à l'échelle.
///
/// Sert à donner un rythme à l'ouverture d'un écran sans jamais retarder
/// l'accès à l'information : le contenu est déjà là, il se pose simplement.
/// Les animations sont désactivées si le système le demande.
class KubaAppear extends StatefulWidget {
  const KubaAppear({
    super.key,
    required this.child,
    this.delay = Duration.zero,
    this.duration = KubaMotion.entrance,
    this.offset = const Offset(0, 14),
    this.scaleFrom = 0.99,
  });

  final Widget child;

  /// Retard d'apparition, cumulable entre les blocs d'une même page.
  final Duration delay;
  final Duration duration;
  final Offset offset;
  final double scaleFrom;

  @override
  State<KubaAppear> createState() => _KubaAppearState();
}

class _KubaAppearState extends State<KubaAppear>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: widget.delay + widget.duration,
  );
  late final Animation<double> _curve = CurvedAnimation(
    parent: _controller,
    curve: Interval(
      _controller.duration!.inMicroseconds == 0
          ? 0
          : widget.delay.inMicroseconds / _controller.duration!.inMicroseconds,
      1,
      curve: KubaMotion.emphasized,
    ),
  );

  @override
  void initState() {
    super.initState();
    _controller.forward();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      _controller.value = 1;
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
    animation: _curve,
    builder: (context, child) {
      final value = _curve.value;
      return Opacity(
        opacity: value.clamp(0.0, 1.0),
        child: Transform.translate(
          offset: Offset.lerp(widget.offset, Offset.zero, value) ?? Offset.zero,
          child: Transform.scale(
            scale: widget.scaleFrom + (1 - widget.scaleFrom) * value,
            child: child,
          ),
        ),
      );
    },
    child: widget.child,
  );
}

/// Enfoncement visuel d'un élément cliquable, sans capter le geste.
///
/// Le tap reste géré par le `InkWell` ou le bouton enfant : ce widget se
/// contente d'écouter le pointeur pour animer l'échelle.
class KubaPressable extends StatefulWidget {
  const KubaPressable({
    super.key,
    required this.child,
    this.scale = 0.975,
    this.enabled = true,
  });

  final Widget child;
  final double scale;
  final bool enabled;

  @override
  State<KubaPressable> createState() => _KubaPressableState();
}

class _KubaPressableState extends State<KubaPressable> {
  bool _pressed = false;

  void _set(bool value) {
    if (!widget.enabled || _pressed == value) return;
    setState(() => _pressed = value);
  }

  @override
  Widget build(BuildContext context) => Listener(
    onPointerDown: (_) => _set(true),
    onPointerUp: (_) => _set(false),
    onPointerCancel: (_) => _set(false),
    child: AnimatedScale(
      scale: _pressed ? widget.scale : 1,
      duration: KubaMotion.of(context, KubaMotion.micro),
      curve: KubaMotion.standard,
      child: widget.child,
    ),
  );
}

/// Transition d'écran commune : fondu, glissement court et très léger zoom.
///
/// Elle remplace la transition par défaut pour que l'en-tête de marque reste
/// stable et que l'œil suive le contenu, pas la page entière.
class KubaPageRoute<T> extends PageRouteBuilder<T> {
  KubaPageRoute({required this.page, super.settings})
    : super(
        transitionDuration: KubaMotion.base,
        reverseTransitionDuration: KubaMotion.fast,
        pageBuilder: (context, animation, secondaryAnimation) => page,
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          final curved = CurvedAnimation(
            parent: animation,
            curve: KubaMotion.emphasized,
            reverseCurve: Curves.easeInCubic,
          );
          return FadeTransition(
            opacity: curved,
            child: SlideTransition(
              position: Tween<Offset>(
                begin: const Offset(0, 0.035),
                end: Offset.zero,
              ).animate(curved),
              child: ScaleTransition(
                scale: Tween<double>(begin: 0.995, end: 1).animate(curved),
                child: child,
              ),
            ),
          );
        },
      );

  final Widget page;
}

/// Alterne entre deux contenus d'une même zone (étape, onglet, message).
class KubaSwitcher extends StatelessWidget {
  const KubaSwitcher({
    super.key,
    required this.child,
    this.duration = KubaMotion.base,
    this.slide = const Offset(0.03, 0),
  });

  final Widget child;
  final Duration duration;
  final Offset slide;

  @override
  Widget build(BuildContext context) => AnimatedSwitcher(
    duration: KubaMotion.of(context, duration),
    switchInCurve: KubaMotion.emphasized,
    switchOutCurve: Curves.easeInCubic,
    layoutBuilder: (currentChild, previousChildren) => Stack(
      alignment: Alignment.topCenter,
      children: [...previousChildren, ?currentChild],
    ),
    transitionBuilder: (child, animation) => FadeTransition(
      opacity: animation,
      child: SlideTransition(
        position: Tween<Offset>(
          begin: slide,
          end: Offset.zero,
        ).animate(animation),
        child: child,
      ),
    ),
    child: child,
  );
}
