import 'package:flutter/material.dart';

import '../../core/auth/auth_session.dart';
import '../../core/auth/avatar_vault.dart';
import '../../core/theme/kuba_tokens.dart';
import '../../shared/ui/kuba_avatar.dart';
import '../auth/error_banner.dart';
import 'dashboard_snapshot.dart';

class HomeDashboardV6 extends StatelessWidget {
  const HomeDashboardV6({
    super.key,
    required this.session,
    required this.onSettings,
    this.snapshot,
    this.error,
  });

  final AuthSession session;
  final VoidCallback onSettings;
  final DashboardSnapshot? snapshot;
  final String? error;

  @override
  Widget build(BuildContext context) {
    final tenant = session.context;
    final currency = tenant?.currency.isNotEmpty == true
        ? tenant!.currency
        : 'FC';
    final data = snapshot ?? DashboardSnapshot.preview(currency);
    return ColoredBox(
      color: const Color(0xffe6f6f0),
      child: SafeArea(
        bottom: false,
        child: CustomScrollView(
          key: const ValueKey('v6-home-scroll'),
          slivers: [
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 28),
              sliver: SliverList.list(
                children: [
                  _ProfileHeader(
                    onSettings: onSettings,
                    title: session.user.firstName?.trim().isNotEmpty == true
                        ? session.user.firstName!.trim()
                        : tenant?.tenantName ?? 'Votre compte plateforme',
                    avatar: session.user.avatar,
                    initials: kubaInitials(
                      firstName: session.user.firstName,
                      lastName: session.user.lastName,
                    ),
                  ),
                  const SizedBox(height: 20),
                  const Text(
                    'Aperçu du jour',
                    style: TextStyle(
                      fontFamily: KubaType.family,
                      fontSize: 29,
                      height: 1.05,
                      fontWeight: FontWeight.w700,
                      letterSpacing: -1.1,
                      color: Color(0xff151616),
                    ),
                  ),
                  const SizedBox(height: 16),
                  if (error != null) ...[
                    ErrorBanner(message: error!),
                    const SizedBox(height: 12),
                  ],
                  const _SearchField(),
                  const SizedBox(height: 12),
                  SizedBox(
                    height: 168,
                    child: ListView(
                      scrollDirection: Axis.horizontal,
                      physics: const BouncingScrollPhysics(),
                      children: [
                        _MetricCard(
                          width: MediaQuery.sizeOf(context).width * .76,
                          dark: true,
                          icon: Icons.point_of_sale_outlined,
                          label: 'Ventes du jour',
                          badge: formatDashboardChange(data.salesChange),
                          value: formatDashboardMoney(
                            data.salesAmount,
                            data.currency,
                          ),
                        ),
                        const SizedBox(width: 12),
                        _MetricCard(
                          width: MediaQuery.sizeOf(context).width * .76,
                          icon: Icons.account_balance_wallet_outlined,
                          label: 'Solde en caisse',
                          badge: data.cashBadge,
                          value: formatDashboardMoney(
                            data.cashAmount,
                            data.currency,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  _SalesChart(data: data),
                  const SizedBox(height: 12),
                  _RecentActivity(data: data),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ProfileHeader extends StatelessWidget {
  const _ProfileHeader({
    required this.onSettings,
    required this.title,
    this.avatar,
    this.initials = '',
  });
  final VoidCallback onSettings;
  final String title;
  final String? avatar;
  final String initials;

  @override
  Widget build(BuildContext context) => Row(
    children: [
      Material(
        color: Colors.white.withValues(alpha: .82),
        borderRadius: BorderRadius.circular(99),
        child: InkWell(
          key: const ValueKey('home-profile-avatar'),
          borderRadius: BorderRadius.circular(99),
          onTap: onSettings,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(5, 5, 14, 5),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                ListenableBuilder(
                  listenable: AvatarVault.instance,
                  builder: (context, _) => KubaAvatar(
                    photo: AvatarVault.instance.photo,
                    imageUrl: avatar,
                    initials: initials,
                    fallbackAsset: 'assets/brand/avatar-hector.png',
                    diameter: 40,
                  ),
                ),
                const SizedBox(width: 9),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Bonjour, bon retour !',
                      style: TextStyle(fontSize: 10, color: Color(0xff858782)),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
      const Spacer(),
      Material(
        color: Colors.white.withValues(alpha: .9),
        shape: const CircleBorder(),
        child: IconButton(
          tooltip: 'Notifications',
          onPressed: () => ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Aucune nouvelle notification.')),
          ),
          icon: const Badge(
            smallSize: 8,
            child: Icon(
              Icons.notifications_none_rounded,
              color: Color(0xff151616),
            ),
          ),
        ),
      ),
    ],
  );
}

class _SearchField extends StatelessWidget {
  const _SearchField();
  @override
  Widget build(BuildContext context) => TextField(
    decoration: InputDecoration(
      hintText: 'Rechercher un produit, client...',
      prefixIcon: const Icon(Icons.search_rounded, color: Color(0xff151616)),
      filled: true,
      fillColor: Colors.white.withValues(alpha: .76),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(23),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(23),
        borderSide: BorderSide.none,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(23),
        borderSide: const BorderSide(color: KubaPalette.brand, width: 2),
      ),
    ),
  );
}

class _MetricCard extends StatelessWidget {
  const _MetricCard({
    required this.width,
    required this.icon,
    required this.label,
    required this.badge,
    required this.value,
    this.dark = false,
  });
  final double width;
  final IconData icon;
  final String label;
  final String? badge;
  final String value;
  final bool dark;

  @override
  Widget build(BuildContext context) {
    final foreground = dark ? Colors.white : const Color(0xff151616);
    return Container(
      width: width.clamp(270, 320),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: dark
            ? const Color(0xff1d1e1e)
            : Colors.white.withValues(alpha: .9),
        borderRadius: BorderRadius.circular(25),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0d304236),
            blurRadius: 17,
            offset: Offset(0, 7),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(icon, size: 22, color: foreground),
              const Spacer(),
              if (badge != null) _Badge(label: badge!),
            ],
          ),
          const SizedBox(height: 9),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: dark ? Colors.white70 : const Color(0xff858782),
            ),
          ),
          const Spacer(),
          Text(
            value,
            style: TextStyle(
              fontSize: 25,
              fontWeight: FontWeight.w700,
              letterSpacing: -.8,
              color: foreground,
              fontFeatures: KubaType.tabular,
            ),
          ),
        ],
      ),
    );
  }
}

class _SalesChart extends StatelessWidget {
  const _SalesChart({required this.data});
  final DashboardSnapshot data;

  @override
  Widget build(BuildContext context) {
    final maxValue = data.days.fold<double>(
      0,
      (max, day) => day.value > max ? day.value : max,
    );
    final change = formatDashboardChange(data.trendChange);
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: _cardDecoration(),
      child: Column(
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Évolution des ventes',
                    style: TextStyle(fontSize: 11, color: Color(0xff858782)),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    formatDashboardMoney(data.trendAmount, data.currency),
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      fontFeatures: KubaType.tabular,
                    ),
                  ),
                ],
              ),
              const Spacer(),
              if (change != null) _Badge(label: change),
            ],
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 92,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                for (final day in data.days)
                  Expanded(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Container(
                          width: 27,
                          height: maxValue == 0
                              ? 8
                              : (day.value / maxValue * 69).clamp(4, 69),
                          decoration: BoxDecoration(
                            color: maxValue > 0 && day.value == maxValue
                                ? KubaPalette.brand
                                : const Color(0xffedf3ef),
                            borderRadius: BorderRadius.circular(14),
                          ),
                        ),
                        const SizedBox(height: 7),
                        Text(
                          day.label,
                          style: const TextStyle(
                            fontSize: 9,
                            color: Color(0xff737670),
                          ),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _RecentActivity extends StatelessWidget {
  const _RecentActivity({required this.data});
  final DashboardSnapshot data;

  @override
  Widget build(BuildContext context) {
    final rows = data.activity.isEmpty
        ? const [
            _ActivityRow(
              icon: Icons.inbox_outlined,
              title: 'Aucune activité',
              subtitle: 'Les ventes et les alertes de stock apparaîtront ici.',
              value: '',
            ),
          ]
        : [
            for (final item in data.activity)
              _ActivityRow(
                icon: item.warning
                    ? Icons.inventory_2_outlined
                    : Icons.arrow_forward_rounded,
                title: item.title,
                subtitle: item.subtitle,
                value: item.amount == null
                    ? item.label ?? ''
                    : formatDashboardMoney(
                        item.amount!,
                        data.currency,
                        signed: true,
                      ),
                warning: item.warning,
              ),
          ];

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: _cardDecoration(),
      child: Column(
        children: [
          Row(
            children: [
              const Text(
                'Activité récente',
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
              ),
              const Spacer(),
              IconButton(
                onPressed: () {},
                icon: const Icon(Icons.arrow_forward_rounded),
                visualDensity: VisualDensity.compact,
              ),
            ],
          ),
          for (var i = 0; i < rows.length; i++) ...[
            if (i > 0) const SizedBox(height: 6),
            rows[i],
          ],
        ],
      ),
    );
  }
}

class _ActivityRow extends StatelessWidget {
  const _ActivityRow({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.value,
    this.warning = false,
  });
  final IconData icon;
  final String title;
  final String subtitle;
  final String value;
  final bool warning;
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(9),
    decoration: BoxDecoration(
      color: warning ? const Color(0xfff7f8f5) : const Color(0xffe6f6f0),
      borderRadius: BorderRadius.circular(13),
    ),
    child: Row(
      children: [
        Container(
          width: 28,
          height: 28,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(9),
          ),
          child: Icon(
            icon,
            size: 15,
            color: warning ? const Color(0xffb26b16) : KubaPalette.brand,
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                ),
              ),
              Text(
                subtitle,
                style: const TextStyle(fontSize: 9, color: Color(0xff777b77)),
              ),
            ],
          ),
        ),
        if (value.isNotEmpty)
          Text(
            value,
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w700,
              color: warning ? const Color(0xffb26b16) : KubaPalette.brand,
            ),
          ),
      ],
    ),
  );
}

class _Badge extends StatelessWidget {
  const _Badge({required this.label});
  final String label;
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
    decoration: BoxDecoration(
      color: const Color(0xfff7fce8),
      borderRadius: BorderRadius.circular(99),
      border: Border.all(color: const Color(0xffdfedbc)),
    ),
    child: Text(
      label,
      style: const TextStyle(
        fontSize: 10,
        fontWeight: FontWeight.w700,
        color: Color(0xff63900e),
      ),
    ),
  );
}

BoxDecoration _cardDecoration() => BoxDecoration(
  color: Colors.white.withValues(alpha: .9),
  borderRadius: BorderRadius.circular(25),
  boxShadow: const [
    BoxShadow(color: Color(0x0d304236), blurRadius: 17, offset: Offset(0, 7)),
  ],
);
