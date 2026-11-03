import 'package:flutter/material.dart';

import '../../core/theme/kuba_tokens.dart';
import '../../shared/brand.dart';
import '../../shared/ui/app_header.dart';
import '../../shared/ui/kuba_badge.dart';
import '../../shared/ui/kuba_card.dart';
import '../../shared/ui/kuba_motion.dart';
import '../../shared/ui/section_header.dart';
import 'pos_module.dart';

/// Écran d'un module POS pas encore branché.
///
/// Il présente la mise en page et les fonctions prévues, sans jamais afficher
/// de montant, de compteur ou de vente fictive.
class PosModuleScreen extends StatelessWidget {
  const PosModuleScreen({super.key, required this.module});

  final PosModule module;

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: KubaAppHeader(
      title: module.label,
      subtitle: 'Module du point de vente',
      showBack: true,
      onBack: () => Navigator.of(context).maybePop(),
    ),
    body: SafeArea(
      top: false,
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 600),
          child: ListView(
            padding: const EdgeInsets.fromLTRB(
              KubaSpace.margin,
              KubaSpace.lg,
              KubaSpace.margin,
              KubaSpace.xl,
            ),
            children: [
              KubaAppear(child: _Hero(module: module)),
              const SizedBox(height: KubaSpace.lg),
              KubaAppear(
                delay: const Duration(milliseconds: 80),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const SectionHeader(
                      title: 'Aperçu de l’écran',
                      subtitle: 'La mise en page prévue pour ce module.',
                    ),
                    _Preview(module: module),
                    const SizedBox(height: KubaSpace.sm),
                    Text(module.previewNote, style: KubaType.bodySm),
                  ],
                ),
              ),
              const SizedBox(height: KubaSpace.lg),
              KubaAppear(
                delay: const Duration(milliseconds: 140),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const SectionHeader(
                      title: 'Fonctions prévues',
                      subtitle: 'Ce que le module prendra en charge.',
                    ),
                    _Features(module: module),
                  ],
                ),
              ),
              const SizedBox(height: KubaSpace.lg),
              KubaAppear(
                delay: const Duration(milliseconds: 200),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const SectionHeader(
                      title: 'À préparer',
                      subtitle:
                          'Les informations utiles le jour de l’ouverture.',
                    ),
                    _Checklist(module: module),
                  ],
                ),
              ),
              const SizedBox(height: KubaSpace.md),
              KubaAppear(
                delay: const Duration(milliseconds: 250),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const KubaCard(
                      padding: EdgeInsets.all(12),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Icon(
                            Icons.schedule_rounded,
                            size: 18,
                            color: KubaPalette.textMuted,
                          ),
                          SizedBox(width: KubaSpace.sm),
                          Expanded(
                            child: Text(
                              'Ce module arrivera avec les prochains lots. Aucune donnée n’est simulée ici.',
                              style: KubaType.bodySm,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: KubaSpace.lg),
                    ActionButton(
                      label: 'Retour à l’accueil',
                      icon: Icons.arrow_back_rounded,
                      onPressed: () => Navigator.of(context).maybePop(),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    ),
  );
}

class _Hero extends StatelessWidget {
  const _Hero({required this.module});

  final PosModule module;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(KubaSpace.md),
    decoration: BoxDecoration(
      color: module.accent.withValues(alpha: 0.06),
      borderRadius: KubaRadius.lgAll,
      border: Border.all(color: module.accent.withValues(alpha: 0.2)),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 52,
              height: 52,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: module.accent.withValues(alpha: 0.14),
                shape: BoxShape.circle,
              ),
              child: Icon(module.icon, size: 26, color: module.accent),
            ),
            const SizedBox(width: KubaSpace.md),
            const Expanded(
              child: Align(
                alignment: Alignment.centerRight,
                child: KubaBadge(
                  label: 'Bientôt disponible',
                  tone: KubaTone.warning,
                  icon: Icons.schedule_rounded,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: KubaSpace.md),
        Text(module.tagline, style: KubaType.headlineLg.copyWith(fontSize: 22)),
        const SizedBox(height: KubaSpace.sm),
        Text(module.description, style: KubaType.bodyMd),
      ],
    ),
  );
}

/// Silhouette de la future mise en page : aucune donnée réelle n'y figure.
class _Preview extends StatelessWidget {
  const _Preview({required this.module});

  final PosModule module;

  @override
  Widget build(BuildContext context) => Semantics(
    label: 'Aperçu de la mise en page, sans données',
    excludeSemantics: true,
    child: KubaCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  color: module.accent.withValues(alpha: 0.14),
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: KubaSpace.sm),
              const Expanded(child: _Bar(width: 96)),
              const SizedBox(width: KubaSpace.sm),
              const _Pill(width: 54),
            ],
          ),
          const SizedBox(height: KubaSpace.md),
          const Divider(height: 1),
          for (var index = 0; index < 3; index++) ...[
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 12),
              child: Row(
                children: [
                  _Bar(width: 34, height: 34, radius: 8),
                  SizedBox(width: KubaSpace.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _Bar(width: 132),
                        SizedBox(height: 7),
                        _Bar(width: 84, height: 8),
                      ],
                    ),
                  ),
                  SizedBox(width: KubaSpace.md),
                  _Bar(width: 44),
                ],
              ),
            ),
            const Divider(height: 1),
          ],
          const SizedBox(height: KubaSpace.md),
          Row(
            children: [
              const Expanded(child: _Bar(width: 72)),
              Container(
                width: 96,
                height: 32,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: module.accent.withValues(alpha: 0.16),
                  borderRadius: KubaRadius.baseAll,
                ),
              ),
            ],
          ),
        ],
      ),
    ),
  );
}

class _Bar extends StatelessWidget {
  const _Bar({required this.width, this.height = 10, this.radius = 5});

  final double width;
  final double height;
  final double radius;

  @override
  Widget build(BuildContext context) => Container(
    width: width,
    height: height,
    decoration: BoxDecoration(
      color: KubaPalette.border,
      borderRadius: BorderRadius.circular(radius),
    ),
  );
}

class _Pill extends StatelessWidget {
  const _Pill({required this.width});

  final double width;

  @override
  Widget build(BuildContext context) => Container(
    width: width,
    height: 18,
    decoration: BoxDecoration(
      color: KubaPalette.border,
      borderRadius: KubaRadius.pillAll,
    ),
  );
}

class _Features extends StatelessWidget {
  const _Features({required this.module});

  final PosModule module;

  @override
  Widget build(BuildContext context) => KubaCard(
    padding: const EdgeInsets.symmetric(
      horizontal: KubaSpace.md,
      vertical: KubaSpace.xs,
    ),
    child: Column(
      children: [
        for (var index = 0; index < module.features.length; index++) ...[
          if (index > 0) const Divider(height: 1),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                KubaIconPastille(
                  icon: module.features[index].icon,
                  color: module.accent,
                ),
                const SizedBox(width: KubaSpace.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        module.features[index].title,
                        style: KubaType.headlineSm.copyWith(fontSize: 15),
                      ),
                      const SizedBox(height: 2),
                      Text(module.features[index].text, style: KubaType.bodySm),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ],
    ),
  );
}

class _Checklist extends StatelessWidget {
  const _Checklist({required this.module});

  final PosModule module;

  @override
  Widget build(BuildContext context) => KubaCard(
    padding: const EdgeInsets.symmetric(horizontal: KubaSpace.md, vertical: 6),
    child: Column(
      children: [
        for (final item in module.checklist)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 10),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.only(top: 1),
                  child: Icon(
                    Icons.check_circle_outline_rounded,
                    size: 18,
                    color: module.accent,
                  ),
                ),
                const SizedBox(width: KubaSpace.sm),
                Expanded(
                  child: Text(
                    item,
                    style: KubaType.bodyMd.copyWith(
                      color: KubaPalette.textPrimary,
                    ),
                  ),
                ),
              ],
            ),
          ),
      ],
    ),
  );
}
