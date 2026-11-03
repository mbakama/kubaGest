import 'package:flutter/material.dart';

import '../../core/auth/auth_session.dart';
import '../../core/theme/kuba_tokens.dart';
import '../../shared/brand.dart';
import '../../shared/ui/kuba_motion.dart';
import 'auth_canvas.dart';

class ActivationScreen extends StatelessWidget {
  const ActivationScreen({
    super.key,
    required this.session,
    required this.onContinue,
  });
  final AuthSession session;
  final VoidCallback onContinue;

  static const _activities = {
    'boutique': 'Boutique',
    'alimentation': 'Alimentation',
    'pharmacie': 'Pharmacie',
  };

  @override
  Widget build(BuildContext context) {
    final tenant = session.context;
    final activity = tenant == null
        ? null
        : _activities[tenant.activityType] ?? tenant.activityType;

    return KubaAuthCanvas(
      showBrand: true,
      child: LayoutBuilder(
        builder: (context, constraints) => SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 16),
          child: ConstrainedBox(
            constraints: BoxConstraints(minHeight: constraints.maxHeight - 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const KubaAppear(
                  duration: Duration(milliseconds: 520),
                  offset: Offset.zero,
                  scaleFrom: 0.92,
                  child: _SuccessStage(),
                ),
                const SizedBox(height: 18),
                Text(
                  'C’est prêt',
                  style: KubaType.bodyMd.copyWith(
                    color: KubaPalette.brand,
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 8),
                Semantics(
                  header: true,
                  child: Text(
                    'Votre commerce est créé.',
                    style: KubaType.headlineXlMobile.copyWith(
                      fontSize: 32,
                      height: 1.04,
                      letterSpacing: -1.2,
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  'Retrouvez-le dans votre espace, sur ce téléphone et sur l’ordinateur.',
                  style: KubaType.bodyLg.copyWith(
                    color: const Color(0xff3d4240),
                    height: 1.45,
                  ),
                ),
                const SizedBox(height: 16),
                _CommerceRecap(
                  name: tenant?.tenantName ?? 'Votre espace',
                  detail: tenant == null
                      ? null
                      : '$activity · ${tenant.currency}',
                  email: session.user.email,
                ),
                const SizedBox(height: 22),
                ActionButton(
                  label: 'Accéder à mon commerce',
                  onPressed: onContinue,
                  icon: Icons.arrow_forward_rounded,
                ),
                const SizedBox(height: 8),
                const _KeptNote(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _SuccessStage extends StatelessWidget {
  const _SuccessStage();

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.fromLTRB(14, 22, 14, 14),
    decoration: BoxDecoration(
      borderRadius: BorderRadius.circular(28),
      border: Border.all(color: Colors.white),
      gradient: const RadialGradient(
        center: Alignment(0, -0.45),
        radius: 1.1,
        colors: [Color(0xfff8fcf9), Color(0xffe5f4ec)],
      ),
    ),
    child: const Column(
      children: [_SuccessSeal(), SizedBox(height: 14), _OpenedCard()],
    ),
  );
}

class _SuccessSeal extends StatelessWidget {
  const _SuccessSeal();

  @override
  Widget build(BuildContext context) => ExcludeSemantics(
    child: Container(
      width: 72,
      height: 72,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: KubaPalette.brand,
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: KubaPalette.brand.withValues(alpha: 0.22),
            blurRadius: 18,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: const Icon(Icons.check_rounded, size: 34, color: Colors.white),
    ),
  );
}

class _OpenedCard extends StatelessWidget {
  const _OpenedCard();

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(18),
      boxShadow: [
        BoxShadow(
          color: const Color(0xff2b4033).withValues(alpha: 0.08),
          blurRadius: 24,
          offset: const Offset(0, 10),
        ),
      ],
    ),
    child: Row(
      children: [
        Container(
          width: 28,
          height: 28,
          alignment: Alignment.center,
          decoration: const BoxDecoration(
            color: KubaPalette.brandSoft,
            shape: BoxShape.circle,
          ),
          child: const Icon(
            Icons.check_rounded,
            size: 16,
            color: KubaPalette.brand,
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Espace ouvert',
                style: KubaType.headlineSm.copyWith(fontSize: 14),
              ),
              Text(
                'Votre compte est actif',
                style: KubaType.bodySm.copyWith(color: const Color(0xff5c615d)),
              ),
            ],
          ),
        ),
      ],
    ),
  );
}

class _CommerceRecap extends StatelessWidget {
  const _CommerceRecap({required this.name, required this.email, this.detail});

  final String name;
  final String email;
  final String? detail;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
    decoration: BoxDecoration(
      color: const Color(0xffe6f6f0),
      borderRadius: BorderRadius.circular(18),
    ),
    child: Row(
      children: [
        Container(
          width: 36,
          height: 36,
          alignment: Alignment.center,
          decoration: const BoxDecoration(
            color: Colors.white,
            shape: BoxShape.circle,
          ),
          child: const Icon(
            Icons.storefront_outlined,
            size: 16,
            color: KubaPalette.brand,
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(name, style: KubaType.headlineSm.copyWith(fontSize: 15)),
              if (detail != null)
                Text(
                  detail!,
                  style: KubaType.bodySm.copyWith(
                    color: const Color(0xff5c615d),
                    fontSize: 12,
                  ),
                ),
              Text(
                email,
                style: KubaType.bodySm.copyWith(
                  color: const Color(0xff5c615d),
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(width: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(99),
          ),
          child: Text(
            'Ouvert',
            style: KubaType.labelSm.copyWith(
              color: KubaPalette.brand,
              fontWeight: FontWeight.w800,
            ),
          ),
        ),
      ],
    ),
  );
}

class _KeptNote extends StatelessWidget {
  const _KeptNote();

  @override
  Widget build(BuildContext context) => Row(
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
      const Icon(Icons.shield_outlined, size: 14, color: KubaPalette.brand),
      const SizedBox(width: 6),
      Flexible(
        child: Text(
          'Un espace à vous. Des données bien gardées.',
          textAlign: TextAlign.center,
          style: KubaType.bodySm.copyWith(
            color: const Color(0xff5c615d),
            fontSize: 12,
            height: 1.4,
          ),
        ),
      ),
    ],
  );
}
