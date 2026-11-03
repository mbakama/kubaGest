import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

import 'core/api/auth_api.dart';
import 'core/auth/auth_session.dart';
import 'core/auth/avatar_vault.dart';
import 'core/auth/token_store.dart';
import 'core/theme/kuba_theme.dart';
import 'features/auth/activation_screen.dart';
import 'features/auth/onboarding_screen.dart';
import 'features/home/dashboard_snapshot.dart';
import 'features/home/home_screen.dart';
import 'features/sales/sales_counter.dart';
import 'features/splash/splash_screen.dart';
import 'shared/ui/kuba_motion.dart';

class KubaGestApp extends StatefulWidget {
  const KubaGestApp({
    super.key,
    this.storage,
    this.healthCheck,
    this.authApi,
    this.loadDashboard,
    this.loadArticles,
  });
  final SessionStorage? storage;
  final Future<void> Function()? healthCheck;

  /// Point d'injection des appels d'authentification (tests et préversions).
  final AuthApi? authApi;

  /// Lecture des statistiques d'accueil. Absente dans les tests de maquette.
  final Future<DashboardSnapshot> Function(String accessToken)? loadDashboard;

  /// Lecture du catalogue pour le comptoir.
  final Future<List<CounterArticle>> Function(String accessToken)? loadArticles;
  @override
  State<KubaGestApp> createState() => _KubaGestAppState();
}

class _KubaGestAppState extends State<KubaGestApp> {
  final _navigatorKey = GlobalKey<NavigatorState>();
  late final SessionStorage _storage;
  AuthSession? _session;
  bool _restoring = true;
  bool _showIntroduction = true;
  bool _justRegistered = false;

  @override
  void initState() {
    super.initState();
    _storage = widget.storage ?? TokenStore();
    _restore();
  }

  Future<void> _restore() async {
    // La marque reste visible au moins 2,5 secondes : cela évite un clignotement
    // entre le lancement natif et l'interface, sans retarder un démarrage lent.
    final hold = Future<void>.delayed(const Duration(milliseconds: 2500));
    AuthSession? session;
    var showIntroduction = true;
    try {
      session = await _storage.read();
    } catch (_) {
      session = null;
    }
    final introduction = _storage;
    if (introduction is IntroductionStorage) {
      try {
        showIntroduction = !await (introduction as IntroductionStorage)
            .hasSeenIntroduction();
      } catch (_) {
        /* Présentation rejouable. */
      }
    }
    await hold;
    if (!mounted) return;
    setState(() {
      _session = session;
      _showIntroduction = showIntroduction;
      _restoring = false;
    });
  }

  Future<void> _completeIntroduction() async {
    _showIntroduction = false;
    final introduction = _storage;
    if (introduction is IntroductionStorage) {
      await (introduction as IntroductionStorage).completeIntroduction();
    }
  }

  Future<void> _onAuthenticated(
    AuthSession session, {
    bool registered = false,
  }) async {
    await _storage.save(session);
    if (!mounted) return;
    _navigatorKey.currentState?.popUntil((route) => route.isFirst);
    setState(() {
      _session = session;
      _justRegistered = registered;
      _showIntroduction = false;
    });
  }

  Future<void> _logout() async {
    await _storage.clear();
    AvatarVault.instance.clear();
    if (!mounted) return;
    setState(() {
      _session = null;
      _justRegistered = false;
    });
  }

  Future<void> _updateSession(AuthSession session) async {
    await _storage.save(session);
    if (mounted) setState(() => _session = session);
  }

  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'KubaGest',
    navigatorKey: _navigatorKey,
    debugShowCheckedModeBanner: false,
    theme: buildKubaTheme(),
    locale: const Locale('fr'),
    supportedLocales: const [Locale('fr')],
    localizationsDelegates: const [
      GlobalMaterialLocalizations.delegate,
      GlobalWidgetsLocalizations.delegate,
      GlobalCupertinoLocalizations.delegate,
    ],
    home: Builder(
      builder: (context) => KubaSwitcher(
        slide: Offset.zero,
        duration: KubaMotion.slow,
        child: _buildHome(),
      ),
    ),
  );

  Widget _buildHome() {
    if (_restoring) {
      return const SplashScreen(key: ValueKey('splash'));
    }
    final session = _session;
    if (session == null) {
      return OnboardingScreen(
        key: const ValueKey('onboarding'),
        onAuthenticated: _onAuthenticated,
        onRegistered: (session) => _onAuthenticated(session, registered: true),
        showIntroduction: _showIntroduction,
        onIntroCompleted: _completeIntroduction,
        checkConnection: widget.healthCheck,
        authApi: widget.authApi,
        rememberedEmails: _storage is RememberedEmailStorage
            ? _storage as RememberedEmailStorage
            : null,
      );
    }
    if (_justRegistered) {
      return ActivationScreen(
        key: const ValueKey('activation'),
        session: session,
        onContinue: () => setState(() => _justRegistered = false),
      );
    }
    return HomeScreen(
      key: const ValueKey('home'),
      session: session,
      onLogout: _logout,
      onSessionChanged: _updateSession,
      loadDashboard: widget.loadDashboard,
      loadArticles: widget.loadArticles,
    );
  }
}
