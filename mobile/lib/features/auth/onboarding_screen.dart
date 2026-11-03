import 'dart:async';

import 'package:flutter/material.dart';

import '../../core/api/auth_api.dart';
import '../../core/api/health_api.dart';
import '../../core/auth/auth_session.dart';
import '../../core/auth/token_store.dart';
import '../../core/theme/kuba_tokens.dart';
import '../../shared/brand.dart';
import '../../shared/ui/kuba_badge.dart';
import 'auth_canvas.dart';
import '../../shared/ui/kuba_motion.dart';
import 'commerce_illustration.dart';
import 'login_screen.dart';
import 'register_screen.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({
    super.key,
    required this.onAuthenticated,
    this.onRegistered,
    this.onIntroCompleted,
    this.showIntroduction = true,
    this.checkConnection,
    this.authApi,
    this.rememberedEmails,
  });

  final AuthenticationCallback onAuthenticated;
  final AuthenticationCallback? onRegistered;
  final Future<void> Function()? onIntroCompleted;
  final bool showIntroduction;
  final Future<void> Function()? checkConnection;

  /// API d'authentification injectable ; par défaut, `LoginScreen` et
  /// `RegisterScreen` utilisent leur propre client.
  final AuthApi? authApi;
  final RememberedEmailStorage? rememberedEmails;

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  late bool _chooser = !widget.showIntroduction;
  int _page = 0;
  late final PageController _controller = PageController();
  Timer? _autoTimer;
  bool _userHolding = false;

  /// Délai entre deux pages lorsque personne ne touche le carrousel.
  static const _autoDelay = Duration(seconds: 5);

  static const _titles = [
    'Gérer votre commerce,\nl’esprit tranquille.',
    'Chaque article,\nà sa place.',
    'Gardez le lien avec\nvotre commerce.',
  ];
  static const _descriptions = [
    'Boutique, alimentation ou pharmacie : une façon plus simple de prendre soin de votre activité.',
    'Produits, conditionnements, lots et péremptions : donnez de la clarté à votre gestion.',
    'Retrouvez votre espace sur mobile et ordinateur, avec les mêmes comptes et les mêmes données.',
  ];
  static const _eyebrows = [
    'Bienvenue chez KubaGest',
    'Une gestion plus claire',
    'Votre espace vous suit',
  ];

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final visible = ModalRoute.of(context)?.isCurrent ?? true;
    if (!visible || _chooser) {
      _autoTimer?.cancel();
      _autoTimer = null;
      return;
    }
    if (_autoTimer == null && !_userHolding) _armAuto();
  }

  @override
  void dispose() {
    _autoTimer?.cancel();
    _controller.dispose();
    super.dispose();
  }

  /// Vrai lorsqu'une seule vue de défilement utilise le contrôleur.
  ///
  /// Pendant un rechargement, l'ancienne et la nouvelle vue coexistent un
  /// instant. Lire `position` dans cet état interrompt l'écran.
  bool get _hasSinglePage =>
      _controller.hasClients && _controller.positions.length == 1;

  /// Relance le défilement automatique. Un geste ou un bouton remet le délai à zéro.
  void _armAuto() {
    _autoTimer?.cancel();
    if (!mounted || _chooser || _userHolding) return;
    if (MediaQuery.disableAnimationsOf(context)) return;
    _autoTimer = Timer(_autoDelay, _autoAdvance);
  }

  void _autoAdvance() {
    _autoTimer = null;
    if (!mounted || _chooser || _userHolding || !_hasSinglePage) return;
    _controller.animateToPage(
      (_page + 1) % _titles.length,
      duration: KubaMotion.of(context, KubaMotion.slow),
      curve: KubaMotion.emphasized,
    );
  }

  Future<void> _completeIntro() async {
    try {
      await widget.onIntroCompleted?.call();
    } catch (_) {
      /* La présentation ne bloque pas la connexion. */
    }
  }

  void _next() {
    if (_chooser) return;
    if (_page < 2) {
      if (!_hasSinglePage) return;
      _controller.nextPage(
        duration: KubaMotion.of(context, KubaMotion.slow),
        curve: KubaMotion.emphasized,
      );
      return;
    }
    _openChooser();
  }

  void _openChooser() {
    _autoTimer?.cancel();
    _autoTimer = null;
    setState(() => _chooser = true);
    _completeIntro();
  }

  void _backToIntro() {
    setState(() => _chooser = false);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted || !_hasSinglePage) return;
      _controller.jumpToPage(2);
      _armAuto();
    });
  }

  void _skip() => _openChooser();

  void _openLogin({bool replace = false}) {
    _completeIntro();
    final api = widget.authApi;
    final route = KubaPageRoute<void>(
      settings: const RouteSettings(name: 'login'),
      page: LoginScreen(
        onAuthenticated: widget.onAuthenticated,
        submit: api == null
            ? null
            : (email, password) => api.login(email: email, password: password),
        onCreateAccount: () => _openRegister(replace: true),
        rememberedEmails: widget.rememberedEmails,
      ),
    );
    if (replace) {
      Navigator.of(context).pushReplacement(route);
    } else {
      Navigator.of(context).push(route);
    }
  }

  /// Relaie la création vers l'API réelle en conservant la signature du
  /// formulaire, sans exposer `AuthApi` aux écrans.
  Future<Map<String, dynamic>> _registerWithApi({
    required String tenantName,
    required String activityType,
    required String currency,
    required String firstName,
    required String lastName,
    required String email,
    required String password,
    String? address,
    String? phone,
  }) => widget.authApi!.register(
    firstName: firstName,
    lastName: lastName,
    phone: phone,
    tenantName: tenantName,
    activityType: activityType,
    currency: currency,
    email: email,
    password: password,
    address: address,
  );

  void _openRegister({bool replace = false}) {
    _completeIntro();
    final route = KubaPageRoute<void>(
      page: RegisterScreen(
        onAuthenticated: widget.onRegistered ?? widget.onAuthenticated,
        submit: widget.authApi == null ? null : _registerWithApi,
        api: widget.authApi,
        onLogin: () => _openLogin(replace: true),
      ),
    );
    if (replace) {
      Navigator.of(context).pushReplacement(route);
    } else {
      Navigator.of(context).push(route);
    }
  }

  void _openHelp() => showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    builder: (_) => _ConnectionHelp(
      checkConnection: widget.checkConnection,
      onReplay: () {
        Navigator.of(context).pop();
        setState(() {
          _chooser = false;
          _page = 0;
        });
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (_hasSinglePage) _controller.jumpToPage(0);
          _armAuto();
        });
      },
    ),
  );

  @override
  Widget build(BuildContext context) {
    return KubaAuthCanvas(
      showBrand: true,
      actions: [
        if (!_chooser)
          TextButton(
            onPressed: _skip,
            child: Text(
              'Passer',
              style: KubaType.labelLg.copyWith(fontSize: 14),
            ),
          ),
        IconButton(
          tooltip: 'Aide et connexion',
          onPressed: _openHelp,
          icon: const Icon(Icons.help_outline_rounded),
        ),
      ],
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 520),
          child: KubaSwitcher(
            duration: KubaMotion.base,
            slide: const Offset(0.04, 0),
            child: _chooser ? _chooserBody(context) : _introBody(context),
          ),
        ),
      ),
    );
  }

  Widget _introBody(BuildContext context) => Column(
    key: const ValueKey('intro'),
    children: [
      Expanded(
        child: NotificationListener<ScrollNotification>(
          onNotification: (notification) {
            if (notification.depth != 0) return false;
            if (notification is ScrollStartNotification &&
                notification.dragDetails != null) {
              _userHolding = true;
              _autoTimer?.cancel();
              _autoTimer = null;
            } else if (notification is ScrollEndNotification && _userHolding) {
              _userHolding = false;
              _armAuto();
            }
            return false;
          },
          child: PageView.builder(
            controller: _controller,
            itemCount: 3,
            onPageChanged: (index) {
              setState(() => _page = index);
              _armAuto();
            },
            itemBuilder: (context, index) => _CarouselPage(
              controller: _controller,
              index: index,
              eyebrow: _eyebrows[index],
              title: _titles[index],
              description: _descriptions[index],
            ),
          ),
        ),
      ),
      _introFooter(context),
    ],
  );

  Widget _chooserBody(BuildContext context) => GestureDetector(
    key: const ValueKey('chooser'),
    behavior: HitTestBehavior.opaque,
    onHorizontalDragEnd: (details) {
      if ((details.primaryVelocity ?? 0) > 260) _backToIntro();
    },
    child: Column(
      children: [
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: KubaSpace.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: KubaSpace.md),
                KubaAppear(
                  child: _IllustrationStage(
                    height: 210,
                    child: const CommerceIllustration(),
                  ),
                ),
                const SizedBox(height: KubaSpace.lg),
                KubaAppear(
                  delay: const Duration(milliseconds: 60),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const StepEyebrow('À vous de jouer'),
                      const SizedBox(height: KubaSpace.sm),
                      Semantics(
                        header: true,
                        child: Text(
                          'Un nouvel espace.\nVotre prochain chapitre.',
                          style: KubaType.headlineXlMobile,
                        ),
                      ),
                      const SizedBox(height: KubaSpace.sm),
                      const Text(
                        'Créez votre commerce ou connectez-vous à un espace existant.',
                        style: KubaType.bodyLg,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: KubaSpace.lg),
                const KubaAppear(
                  delay: Duration(milliseconds: 140),
                  child: _TrustPoints(),
                ),
                const SizedBox(height: KubaSpace.lg),
              ],
            ),
          ),
        ),
        _chooserFooter(context),
      ],
    ),
  );

  Widget _introFooter(BuildContext context) => _Footer(
    children: [
      _Dots(page: _page),
      const SizedBox(height: KubaSpace.md),
      ActionButton(
        label: _page == 0 ? 'Commencer' : 'Continuer',
        onPressed: _next,
      ),
      const SizedBox(height: KubaSpace.xs),
      TextButton(onPressed: _openLogin, child: const Text('Se connecter')),
    ],
  );

  Widget _chooserFooter(BuildContext context) => _Footer(
    children: [
      ActionButton(
        label: 'Créer mon commerce',
        onPressed: _openRegister,
        icon: Icons.arrow_forward_rounded,
      ),
      const SizedBox(height: KubaSpace.xs),
      TextButton(onPressed: _openLogin, child: const Text('Se connecter')),
      Padding(
        padding: const EdgeInsets.only(top: KubaSpace.xs),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.shield_outlined,
              size: 16,
              color: KubaPalette.brand,
            ),
            const SizedBox(width: 6),
            Flexible(
              child: Text(
                'Un espace à vous. Des données bien gardées.',
                textAlign: TextAlign.center,
                style: KubaType.labelSm.copyWith(color: KubaPalette.textMuted),
              ),
            ),
          ],
        ),
      ),
    ],
  );
}

/// Pied d'écran commun : surface pleine, filet supérieur et zone sûre.
class _Footer extends StatelessWidget {
  const _Footer({required this.children});

  final List<Widget> children;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.fromLTRB(
      KubaSpace.lg,
      KubaSpace.sm,
      KubaSpace.lg,
      KubaSpace.md,
    ),
    child: Column(mainAxisSize: MainAxisSize.min, children: children),
  );
}

/// Pagination de la présentation, avec une cible tactile confortable.
class _Dots extends StatelessWidget {
  const _Dots({required this.page});

  final int page;

  @override
  Widget build(BuildContext context) => Semantics(
    label: 'Présentation ${page + 1} sur 3',
    container: true,
    child: Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(
        3,
        (index) => AnimatedContainer(
          duration: KubaMotion.of(context, KubaMotion.fast),
          curve: KubaMotion.standard,
          width: index == page ? 26 : 7,
          height: 7,
          margin: const EdgeInsets.symmetric(horizontal: 3),
          decoration: BoxDecoration(
            color: index == page ? KubaPalette.brand : KubaPalette.borderStrong,
            borderRadius: KubaRadius.pillAll,
          ),
        ),
      ),
    ),
  );
}

/// Page de présentation : l'illustration se décale et s'estompe pendant le
/// glissement, la page voisine prend sa place sans à-coup.
class _CarouselPage extends StatelessWidget {
  const _CarouselPage({
    required this.controller,
    required this.index,
    required this.eyebrow,
    required this.title,
    required this.description,
  });

  final PageController controller;
  final int index;
  final String eyebrow;
  final String title;
  final String description;

  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (context, constraints) => SingleChildScrollView(
      physics: const ClampingScrollPhysics(),
      padding: const EdgeInsets.symmetric(horizontal: KubaSpace.lg),
      child: AnimatedBuilder(
        animation: controller,
        builder: (context, _) {
          var delta = 0.0;
          if (controller.positions.length == 1 &&
              controller.position.haveDimensions &&
              controller.page != null) {
            delta = (controller.page! - index).clamp(-1.0, 1.0);
          }
          final distance = delta.abs();
          return Opacity(
            opacity: 1 - distance * 0.5,
            child: Transform.translate(
              offset: Offset(-delta * 26, 0),
              child: Transform.scale(
                scale: 1 - distance * 0.04,
                child: _IntroContent(
                  height: (constraints.maxHeight * .46).clamp(150.0, 280.0),
                  index: index,
                  eyebrow: eyebrow,
                  title: title,
                  description: description,
                ),
              ),
            ),
          );
        },
      ),
    ),
  );
}

class _IntroContent extends StatelessWidget {
  const _IntroContent({
    required this.height,
    required this.index,
    required this.eyebrow,
    required this.title,
    required this.description,
  });

  final double height;
  final int index;
  final String eyebrow;
  final String title;
  final String description;

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      const SizedBox(height: KubaSpace.md),
      _IllustrationStage(
        height: height,
        child: CommerceIllustration(variant: index),
      ),
      const SizedBox(height: KubaSpace.lg),
      StepEyebrow(eyebrow),
      const SizedBox(height: KubaSpace.sm),
      Semantics(
        header: true,
        child: Text(title, style: KubaType.headlineXlMobile),
      ),
      const SizedBox(height: KubaSpace.sm),
      Text(description, style: KubaType.bodyLg),
      const SizedBox(height: KubaSpace.lg),
    ],
  );
}

/// Cadre de l'illustration : dégradé doux, filet de marque et arrondi large.
class _IllustrationStage extends StatelessWidget {
  const _IllustrationStage({required this.height, required this.child});

  final double height;
  final Widget child;

  @override
  Widget build(BuildContext context) => Container(
    height: height,
    width: double.infinity,
    padding: const EdgeInsets.all(KubaSpace.md),
    decoration: BoxDecoration(
      gradient: const LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [Color(0xffeaf7f2), Color(0xffffffff)],
      ),
      borderRadius: KubaRadius.xlAll,
      border: Border.all(color: KubaPalette.brandBorder),
    ),
    child: Center(child: child),
  );
}

/// Points de réassurance affichés sur l'écran de choix.
class _TrustPoints extends StatelessWidget {
  const _TrustPoints();

  static const _points = [
    (Icons.lock_outline_rounded, 'Compte personnel'),
    (Icons.devices_outlined, 'Mobile et ordinateur synchronisés'),
    (Icons.support_agent_rounded, 'Un accompagnement en français'),
  ];

  @override
  Widget build(BuildContext context) => Container(
    decoration: BoxDecoration(
      color: KubaPalette.surfaceRaised,
      borderRadius: KubaRadius.lgAll,
      border: Border.all(color: KubaPalette.border),
      boxShadow: KubaShadow.level1,
    ),
    child: Column(
      children: [
        for (var index = 0; index < _points.length; index++) ...[
          if (index > 0)
            const Divider(height: 1, indent: 56, endIndent: KubaSpace.md),
          Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: KubaSpace.md,
              vertical: 13,
            ),
            child: Row(
              children: [
                KubaIconPastille(
                  icon: _points[index].$1,
                  diameter: 28,
                  iconSize: 15,
                ),
                const SizedBox(width: KubaSpace.md),
                Expanded(
                  child: Text(
                    _points[index].$2,
                    style: KubaType.bodySm.copyWith(
                      color: KubaPalette.textPrimary,
                    ),
                  ),
                ),
                const Icon(
                  Icons.check_rounded,
                  size: 16,
                  color: KubaPalette.brand,
                ),
              ],
            ),
          ),
        ],
      ],
    ),
  );
}

class _ConnectionHelp extends StatefulWidget {
  const _ConnectionHelp({this.checkConnection, this.onReplay});
  final Future<void> Function()? checkConnection;
  final VoidCallback? onReplay;
  @override
  State<_ConnectionHelp> createState() => _ConnectionHelpState();
}

class _ConnectionHelpState extends State<_ConnectionHelp> {
  bool _loading = false;
  String? _message;

  Future<void> _check() async {
    setState(() {
      _loading = true;
      _message = null;
    });
    String message;
    try {
      await (widget.checkConnection ?? HealthApi().check)();
      message = 'Le serveur est accessible.';
    } catch (_) {
      message = 'Connexion impossible. Vérifiez votre réseau et réessayez.';
    }
    if (mounted) {
      setState(() {
        _loading = false;
        _message = message;
      });
    }
  }

  @override
  Widget build(BuildContext context) => SafeArea(
    child: SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(
        KubaSpace.lg,
        0,
        KubaSpace.lg,
        KubaSpace.lg,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: [
          const KubaIconPastille(
            icon: Icons.support_agent_rounded,
            diameter: 48,
            iconSize: 24,
          ),
          const SizedBox(height: KubaSpace.md),
          Text(
            'Besoin d’un coup de main ?',
            style: KubaType.headlineLg.copyWith(fontSize: 22),
          ),
          const SizedBox(height: KubaSpace.sm),
          const Text(
            'KubaGest a besoin d’une connexion Internet pour retrouver votre commerce. Vérifiez d’abord que le service est accessible.',
            style: KubaType.bodyMd,
          ),
          if (_message != null)
            Padding(
              padding: const EdgeInsets.only(top: KubaSpace.md),
              child: Semantics(
                liveRegion: true,
                child: Text(_message!, style: KubaType.bodyMd),
              ),
            ),
          const SizedBox(height: KubaSpace.lg),
          ActionButton(
            label: _loading ? 'Vérification…' : 'Vérifier la connexion',
            onPressed: _check,
            loading: _loading,
            icon: Icons.wifi_rounded,
          ),
          if (widget.onReplay != null)
            Padding(
              padding: const EdgeInsets.only(top: KubaSpace.sm),
              child: TextButton(
                onPressed: widget.onReplay,
                child: const Text('Revoir la présentation'),
              ),
            ),
        ],
      ),
    ),
  );
}
