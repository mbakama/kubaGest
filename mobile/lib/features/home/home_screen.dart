import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../core/api/api_exception.dart';
import '../../core/auth/auth_session.dart';
import '../../shared/ui/kuba_v6_bottom_nav.dart';
import 'dashboard_snapshot.dart';
import '../account/settings_screen.dart';
import '../credits/credit_api.dart';
import '../sales/sales_api.dart';
import '../sales/sales_counter.dart';
import '../sales/sales_screen.dart';
import '../stock/stock_api.dart';
import '../stock/stock_screen.dart';
import 'home_dashboard_v6.dart';
import 'home_dashboard_skeleton.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({
    super.key,
    required this.session,
    required this.onLogout,
    this.onSessionChanged,
    this.loadDashboard,
    this.loadArticles,
    this.creditGateway,
    this.saleGateway,
    this.stockGateway,
  });
  final AuthSession session;
  final Future<void> Function() onLogout;
  final Future<void> Function(AuthSession session)? onSessionChanged;

  /// Charge `GET /api/v1/dashboard`. Absent : la maquette d'exemple reste affichée.
  final Future<DashboardSnapshot> Function(String accessToken)? loadDashboard;

  /// Charge le catalogue du comptoir. Absent : le panier démarre vide.
  final Future<List<CounterArticle>> Function(String accessToken)? loadArticles;

  /// Carnet de crédit injectable (tests). Par défaut : l'API du commerce.
  final CreditGateway? creditGateway;

  /// Écriture des tickets injectable (tests). Par défaut : l'API du commerce.
  final SaleGateway? saleGateway;

  /// Stock injectable (tests). Par défaut : l'API du commerce.
  final StockGateway? stockGateway;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _tab = 0;
  int _stockEpoch = 0;
  bool _loggingOut = false;
  bool _loadingHome = true;
  Timer? _homeLoadingTimer;
  DashboardSnapshot? _dashboard;
  String? _dashboardError;

  @override
  void initState() {
    super.initState();
    if (widget.loadDashboard == null) {
      _homeLoadingTimer = Timer(const Duration(milliseconds: 850), () {
        if (mounted) setState(() => _loadingHome = false);
      });
      return;
    }
    _loadDashboard();
  }

  Future<void> _loadDashboard() async {
    final started = DateTime.now();
    DashboardSnapshot? snapshot;
    String? error;
    try {
      snapshot = await widget.loadDashboard!(widget.session.accessToken);
    } on ApiException catch (exception) {
      error = exception.message;
    } catch (_) {
      error = 'Les statistiques sont indisponibles.';
    }
    final elapsed = DateTime.now().difference(started);
    final remaining = const Duration(milliseconds: 850) - elapsed;
    if (remaining > Duration.zero) {
      await Future<void>.delayed(remaining);
    }
    if (!mounted) return;
    final currency = widget.session.context?.currency ?? 'CDF';
    setState(() {
      _dashboard = snapshot ?? DashboardSnapshot.empty(currency);
      _dashboardError = error;
      _loadingHome = false;
    });
  }

  @override
  void dispose() {
    _homeLoadingTimer?.cancel();
    super.dispose();
  }

  Future<void> _logout() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Se déconnecter ?'),
        content: const Text(
          'Vous pourrez retrouver votre commerce en vous reconnectant.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Rester connecté'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Se déconnecter'),
          ),
        ],
      ),
    );
    if (confirmed != true || !mounted) return;
    setState(() => _loggingOut = true);
    try {
      await widget.onLogout();
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('La déconnexion n’a pas abouti. Réessayez.'),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _loggingOut = false);
    }
  }

  Future<void> _showAbout() async {
    String? version;
    try {
      final manifest = await rootBundle.loadString('pubspec.yaml');
      version = RegExp(
        r'^version:\s*(\S+)',
        multiLine: true,
      ).firstMatch(manifest)?.group(1);
    } catch (_) {
      // Une ressource absente ne doit pas empêcher l'ouverture de la boîte.
    }
    if (!mounted) return;

    final applicationVersion = version ?? 'Version indisponible';
    await showDialog<void>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('KubaGest'),
        content: Text(applicationVersion),
        actions: [
          TextButton(
            key: const ValueKey('about-licenses'),
            onPressed: () {
              Navigator.of(dialogContext).pop();
              showLicensePage(
                context: context,
                applicationName: 'KubaGest',
                applicationVersion: applicationVersion,
              );
            },
            child: const Text('Licences'),
          ),
          TextButton(
            key: const ValueKey('about-close'),
            onPressed: () => Navigator.of(dialogContext).pop(),
            child: const Text('Fermer'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xffe6f6f0),
      appBar: null,
      bottomNavigationBar: KubaV6BottomNav(
        selectedIndex: _tab,
        backgroundColor: const Color(0xffe6f6f0),
        onSelected: (index) {
          HapticFeedback.selectionClick();
          switch (index) {
            case 0:
              setState(() => _tab = 0);
              break;
            case 1:
              setState(() => _tab = 1);
              break;
            case 2:
              setState(() {
                _tab = 2;
                // Chaque passage sur l'onglet relit le stock : une vente vient
                // peut-être de le diminuer.
                _stockEpoch += 1;
              });
              break;
            case 3:
              setState(() => _tab = 3);
              break;
          }
        },
        items: const [
          KubaNavItem(
            icon: Icons.home_outlined,
            selectedIcon: Icons.home_rounded,
            label: 'Accueil',
          ),
          KubaNavItem(
            icon: Icons.point_of_sale_outlined,
            selectedIcon: Icons.point_of_sale_rounded,
            label: 'Ventes',
          ),
          KubaNavItem(
            icon: Icons.inventory_2_outlined,
            selectedIcon: Icons.inventory_2_rounded,
            label: 'Stock',
          ),
          KubaNavItem(
            icon: Icons.settings_outlined,
            selectedIcon: Icons.settings_rounded,
            label: 'Paramètres',
          ),
        ],
      ),
      body: switch (_tab) {
        1 => SalesScreen(
          currency: widget.session.context?.currency.isNotEmpty == true
              ? widget.session.context!.currency
              : 'FC',
          loadArticles: widget.loadArticles == null
              ? null
              : () => widget.loadArticles!(widget.session.accessToken),
          credit:
              widget.creditGateway ??
              CreditApi(token: widget.session.accessToken),
          saleGateway:
              widget.saleGateway ??
              SalesApi(token: widget.session.accessToken),
        ),
        2 => StockScreen(
          key: ValueKey('stock-$_stockEpoch'),
          gateway:
              widget.stockGateway ??
              StockApi(token: widget.session.accessToken),
        ),
        3 => SettingsScreen(
          session: widget.session,
          loggingOut: _loggingOut,
          onLogout: _logout,
          onAbout: _showAbout,
          onSessionChanged: widget.onSessionChanged,
        ),
        _ => _homeBody(context),
      },
    );
  }

  /// Accueil : bloc de marque, puis feuille blanche qui remonte dessus.
  Widget _homeBody(BuildContext context) {
    if (_loadingHome) return const HomeDashboardSkeleton();
    return HomeDashboardV6(
      session: widget.session,
      onSettings: () => setState(() => _tab = 3),
      snapshot: _dashboard,
      error: _dashboardError,
    );
  }
}
