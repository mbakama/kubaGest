import 'dart:typed_data';

import 'package:flutter/material.dart';

import '../../core/auth/auth_session.dart';
import '../../core/auth/avatar_vault.dart';
import '../../core/api/auth_api.dart';
import '../../core/media/avatar_picker.dart';
import '../../core/theme/kuba_tokens.dart';
import '../../shared/ui/avatar_picker_sheet.dart';
import '../../shared/ui/kuba_avatar.dart';
import '../auth/change_password_screen.dart';
import 'subscription_screen.dart';

/// Page Paramètres, dans la composition de la maquette v6.
///
/// Les interrupteurs restent sur l’appareil : le serveur n’enregistre pas encore
/// les préférences de notification.
class SettingsScreen extends StatefulWidget {
  const SettingsScreen({
    super.key,
    required this.session,
    required this.onLogout,
    required this.onAbout,
    this.loggingOut = false,
    this.avatarPicker,
    this.onSessionChanged,
  });

  final AuthSession session;
  final VoidCallback onLogout;
  final VoidCallback onAbout;
  final bool loggingOut;

  /// Sélection de la photo de profil (injectable en test).
  final AvatarPicker? avatarPicker;
  final Future<void> Function(AuthSession session)? onSessionChanged;

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  final _notices = <String, bool>{
    'updates': true,
    'stock': true,
    'cash': true,
    'subscription': true,
    'credit': false,
  };

  late final AvatarPicker _avatarPicker =
      widget.avatarPicker ?? DeviceAvatarPicker();
  Uint8List? _avatar;

  @override
  void initState() {
    super.initState();
    _avatar = AvatarVault.instance.photo;
  }

  static const _roles = {
    'owner': 'Propriétaire',
    'stock_manager': 'Gestionnaire stock',
    'cashier': 'Caissier',
  };

  static const _activities = {
    'boutique': 'Boutique',
    'alimentation': 'Alimentation',
    'pharmacie': 'Pharmacie',
  };

  String get _displayName {
    final full = [widget.session.user.firstName, widget.session.user.lastName]
        .map((value) => value?.trim() ?? '')
        .where((value) => value.isNotEmpty)
        .join(' ');
    if (full.isNotEmpty) return full;
    final local = widget.session.user.email.split('@').first.trim();
    if (local.isEmpty) return 'Votre compte';
    final words = local.split(RegExp(r'[._\-\s]+')).where((part) => part.isNotEmpty);
    final name = words
        .map((part) {
          final letter = part.substring(0, 1).toUpperCase();
          return '$letter${part.substring(1)}';
        })
        .join(' ');
    return name.isEmpty ? 'Votre compte' : name;
  }

  String get _roleLabel {
    final role = widget.session.context?.role;
    if (role == null || role.isEmpty) return 'Compte plateforme';
    return _roles[role] ?? role;
  }

  String get _initials => kubaInitials(
    firstName: widget.session.user.firstName,
    lastName: widget.session.user.lastName,
    fallback: _displayName,
  );

  /// Change la photo de profil : aperçu immédiat, partagé avec l'accueil.
  Future<void> _pickAvatar() async {
    FocusScope.of(context).unfocus();
    final selection = await chooseAvatarPhoto(
      context,
      picker: _avatarPicker,
      hasPhoto: _avatar != null,
    );
    if (selection == null || !mounted) return;
    final bytes = selection.remove ? null : selection.bytes;
    final previous = _avatar;
    setState(() => _avatar = bytes);
    AvatarVault.instance.setPhoto(bytes);
    if (widget.onSessionChanged == null) return;
    try {
      final response = bytes == null
          ? await AuthApi().deleteAvatar(
              accessToken: widget.session.accessToken,
            )
          : await AuthApi().uploadAvatar(
              accessToken: widget.session.accessToken,
              bytes: bytes,
            );
      final session = widget.session.copyWith(user: AuthUser.fromJson(response));
      await widget.onSessionChanged!(session);
      AvatarVault.instance.clear();
      if (mounted) setState(() => _avatar = null);
    } catch (_) {
      AvatarVault.instance.setPhoto(previous);
      if (mounted) {
        setState(() => _avatar = previous);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("La photo n'a pas pu être enregistrée.")),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final tenant = widget.session.context;
    final email = widget.session.user.email;
    return ColoredBox(
      color: const Color(0xffe6f6f0),
      child: SafeArea(
        bottom: false,
        child: ListView(
          key: const ValueKey('settings-scroll'),
          padding: const EdgeInsets.fromLTRB(16, 24, 16, 128),
          children: [
            const Text(
              'Compte et commerce',
              style: TextStyle(
                fontFamily: KubaType.family,
                fontSize: 12,
                color: Color(0xff858782),
              ),
            ),
            const SizedBox(height: 3),
            const Text(
              'Paramètres',
              style: TextStyle(
                fontFamily: KubaType.family,
                fontSize: 28,
                fontWeight: FontWeight.w700,
                letterSpacing: -0.8,
                color: Color(0xff151616),
              ),
            ),
            const SizedBox(height: 18),
            _ProfileCard(
              name: _displayName,
              email: email,
              role: _roleLabel,
              photo: _avatar,
              initials: _initials,
              onAvatarPressed: _pickAvatar,
            ),
            const SizedBox(height: 18),
            const _GroupTitle('Commerce'),
            _Card(
              children: [
                if (tenant == null)
                  const _InfoRow(
                    icon: Icons.storefront_outlined,
                    title: 'Votre compte plateforme',
                    subtitle: 'Aucun commerce rattaché',
                  )
                else ...[
                  _InfoRow(
                    icon: Icons.storefront_outlined,
                    title: tenant.tenantName,
                    subtitle: 'Nom du commerce',
                    trailing: const Icon(Icons.chevron_right_rounded, color: Color(0xff9aa09b)),
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text(
                            'La modification du commerce arrivera dans une prochaine étape.',
                          ),
                        ),
                      );
                    },
                  ),
                  _InfoRow(
                    icon: Icons.category_outlined,
                    title: _activities[tenant.activityType] ?? tenant.activityType,
                    subtitle: 'Type d’activité',
                  ),
                  _InfoRow(
                    icon: Icons.payments_outlined,
                    title: 'Devise',
                    subtitle: 'Référence des montants',
                    trailing: Text(
                      tenant.currency,
                      style: const TextStyle(
                        fontFamily: KubaType.family,
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ],
            ),
            const SizedBox(height: 14),
            const _GroupTitle('Notifications'),
            _Card(
              children: [
                _ToggleRow(
                  icon: Icons.system_update_alt_rounded,
                  title: 'Mises à jour',
                  subtitle: 'Nouvelle version et maintenance',
                  value: _notices['updates']!,
                  onChanged: (value) => setState(() => _notices['updates'] = value),
                ),
                _ToggleRow(
                  icon: Icons.inventory_2_outlined,
                  title: 'Stock',
                  subtitle: 'Seuil et péremption',
                  value: _notices['stock']!,
                  onChanged: (value) => setState(() => _notices['stock'] = value),
                ),
                _ToggleRow(
                  icon: Icons.account_balance_wallet_outlined,
                  title: 'Caisse',
                  subtitle: 'Session ouverte et écart',
                  value: _notices['cash']!,
                  onChanged: (value) => setState(() => _notices['cash'] = value),
                ),
                _ToggleRow(
                  icon: Icons.card_membership_outlined,
                  title: 'Abonnement',
                  subtitle: 'Échéance et suspension',
                  value: _notices['subscription']!,
                  onChanged: (value) => setState(() => _notices['subscription'] = value),
                ),
                _ToggleRow(
                  icon: Icons.person_outline_rounded,
                  title: 'Crédits',
                  subtitle: 'Échéance client dépassée',
                  value: _notices['credit']!,
                  onChanged: (value) => setState(() => _notices['credit'] = value),
                ),
              ],
            ),
            const SizedBox(height: 14),
            const _GroupTitle('Compte'),
            _Card(
              children: [
                _InfoRow(
                  icon: Icons.lock_outline_rounded,
                  title: 'Modifier le mot de passe',
                  subtitle: 'Mot de passe actuel, puis le nouveau',
                  trailing: const Icon(Icons.chevron_right_rounded, color: Color(0xff9aa09b)),
                  onTap: () => Navigator.of(context).push(
                    MaterialPageRoute<void>(
                      builder: (_) => const ChangePasswordScreen(),
                    ),
                  ),
                ),
                if (tenant != null)
                  _InfoRow(
                    icon: Icons.card_membership_outlined,
                    title: 'Mon abonnement',
                    subtitle: 'Formule et échéance',
                    trailing: const Icon(Icons.chevron_right_rounded, color: Color(0xff9aa09b)),
                    onTap: () => Navigator.of(context).push(
                      MaterialPageRoute<void>(
                        builder: (_) => SubscriptionScreen(session: widget.session),
                      ),
                    ),
                  ),
                _InfoRow(
                  icon: Icons.info_outline_rounded,
                  title: 'À propos de KubaGest',
                  subtitle: 'Version de l’application',
                  trailing: const Icon(Icons.chevron_right_rounded, color: Color(0xff9aa09b)),
                  onTap: widget.onAbout,
                ),
              ],
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 52,
              child: FilledButton(
                style: FilledButton.styleFrom(
                  backgroundColor: const Color(0xff151616),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                ),
                onPressed: widget.loggingOut ? null : widget.onLogout,
                child: Text(widget.loggingOut ? 'Déconnexion…' : 'Se déconnecter'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ProfileCard extends StatelessWidget {
  const _ProfileCard({
    required this.name,
    required this.email,
    required this.role,
    required this.photo,
    required this.initials,
    required this.onAvatarPressed,
  });

  final String name;
  final String email;
  final String role;
  final Uint8List? photo;
  final String initials;
  final VoidCallback onAvatarPressed;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(14),
    decoration: BoxDecoration(
      color: Colors.white.withValues(alpha: .9),
      borderRadius: BorderRadius.circular(24),
    ),
    child: Row(
      children: [
        KubaAvatarPicker(
          key: const ValueKey('settings-avatar'),
          photo: photo,
          initials: initials,
          diameter: 64,
          onPressed: onAvatarPressed,
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                name,
                style: const TextStyle(
                  fontFamily: KubaType.family,
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  letterSpacing: -0.3,
                ),
              ),
              const SizedBox(height: 2),
              const Text(
                'Adresse email',
                style: TextStyle(fontFamily: KubaType.family, fontSize: 11, color: Color(0xff858782)),
              ),
              Text(
                email,
                style: const TextStyle(fontFamily: KubaType.family, fontSize: 13, color: Color(0xff3d4240)),
              ),
              const SizedBox(height: 2),
              Text(
                role,
                style: const TextStyle(fontFamily: KubaType.family, fontSize: 12, color: Color(0xff858782)),
              ),
            ],
          ),
        ),
      ],
    ),
  );
}

class _GroupTitle extends StatelessWidget {
  const _GroupTitle(this.label);
  final String label;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.fromLTRB(4, 0, 0, 8),
    child: Text(
      label.toUpperCase(),
      style: const TextStyle(
        fontFamily: KubaType.family,
        fontSize: 12,
        fontWeight: FontWeight.w700,
        letterSpacing: 0.6,
        color: Color(0xff5d615c),
      ),
    ),
  );
}

class _Card extends StatelessWidget {
  const _Card({required this.children});
  final List<Widget> children;

  @override
  Widget build(BuildContext context) => DecoratedBox(
    decoration: BoxDecoration(
      color: Colors.white.withValues(alpha: .9),
      borderRadius: BorderRadius.circular(22),
    ),
    child: Column(children: children),
  );
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({
    required this.icon,
    required this.title,
    required this.subtitle,
    this.trailing,
    this.onTap,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final Widget? trailing;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final row = Padding(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      child: Row(
        children: [
          _IconBadge(icon),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontFamily: KubaType.family, fontSize: 14, fontWeight: FontWeight.w600)),
                const SizedBox(height: 2),
                Text(subtitle, style: const TextStyle(fontFamily: KubaType.family, fontSize: 12, color: Color(0xff858782))),
              ],
            ),
          ),
          ?trailing,
        ],
      ),
    );
    if (onTap == null) return row;
    return InkWell(onTap: onTap, child: row);
  }
}

class _ToggleRow extends StatelessWidget {
  const _ToggleRow({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.value,
    required this.onChanged,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final bool value;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.fromLTRB(14, 6, 8, 6),
    child: Row(
      children: [
        _IconBadge(icon),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontFamily: KubaType.family, fontSize: 14, fontWeight: FontWeight.w600)),
              Text(subtitle, style: const TextStyle(fontFamily: KubaType.family, fontSize: 12, color: Color(0xff858782))),
            ],
          ),
        ),
        Switch(
          value: value,
          onChanged: onChanged,
          activeTrackColor: KubaPalette.brand,
          activeThumbColor: Colors.white,
        ),
      ],
    ),
  );
}

class _IconBadge extends StatelessWidget {
  const _IconBadge(this.icon);
  final IconData icon;

  @override
  Widget build(BuildContext context) => Container(
    width: 36,
    height: 36,
    alignment: Alignment.center,
    decoration: BoxDecoration(
      color: const Color(0xffe6f6f0),
      borderRadius: BorderRadius.circular(12),
    ),
    child: Icon(icon, size: 18, color: KubaPalette.brand),
  );
}
