import 'package:flutter/material.dart';

class HomeDashboardSkeleton extends StatelessWidget {
  const HomeDashboardSkeleton({super.key});

  static const _background = Color(0xffe6f6f0);
  static const _surface = Color(0xfff8fbfa);
  static const _placeholder = Color(0xffe5ece9);
  static const _placeholderStrong = Color(0xffd4e2dd);

  @override
  Widget build(BuildContext context) => ColoredBox(
    key: const ValueKey('home-skeleton'),
    color: _background,
    child: SafeArea(
      bottom: false,
      child: Semantics(
        container: true,
        liveRegion: true,
        label: 'Chargement de l’accueil',
        child: ExcludeSemantics(
          child: ListView(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 28),
            children: [
              Row(
                children: [
                  const _Bone.circle(48),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _Bone(width: 154, height: 12),
                        SizedBox(height: 8),
                        _Bone(width: 108, height: 10),
                      ],
                    ),
                  ),
                  const _Bone.circle(44),
                ],
              ),
              const SizedBox(height: 24),
              const _Bone(width: 190, height: 28, radius: 10),
              const SizedBox(height: 18),
              const _Bone(height: 52, radius: 24),
              const SizedBox(height: 12),
              SizedBox(
                height: 168,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  physics: const NeverScrollableScrollPhysics(),
                  children: [
                    _metricCard(context, dark: true),
                    const SizedBox(width: 12),
                    _metricCard(context),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              const _SkeletonCard(
                height: 176,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _Bone(width: 118, height: 11),
                    SizedBox(height: 8),
                    _Bone(width: 92, height: 18),
                    Spacer(),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _Bone(width: 28, height: 38, radius: 14),
                        _Bone(width: 28, height: 56, radius: 14),
                        _Bone(width: 28, height: 48, radius: 14),
                        _Bone(width: 28, height: 70, radius: 14),
                        _Bone(width: 28, height: 44, radius: 14),
                        _Bone(width: 28, height: 34, radius: 14),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              const _SkeletonCard(
                height: 154,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _Bone(width: 112, height: 12),
                    SizedBox(height: 18),
                    _ActivityBone(),
                    SizedBox(height: 10),
                    _ActivityBone(),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    ),
  );

  Widget _metricCard(BuildContext context, {bool dark = false}) => Container(
    width: MediaQuery.sizeOf(context).width * .76,
    padding: const EdgeInsets.all(18),
    decoration: BoxDecoration(
      color: dark ? const Color(0xff202221) : _surface,
      borderRadius: BorderRadius.circular(24),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        dark ? const _Bone.circleDark(24) : const _Bone.circle(24),
        const Spacer(),
        _Bone(width: 94, height: 10, dark: dark),
        const SizedBox(height: 12),
        _Bone(width: 154, height: 25, dark: dark),
      ],
    ),
  );
}

class _SkeletonCard extends StatelessWidget {
  const _SkeletonCard({required this.height, required this.child});

  final double height;
  final Widget child;

  @override
  Widget build(BuildContext context) => Container(
    height: height,
    padding: const EdgeInsets.all(18),
    decoration: BoxDecoration(
      color: HomeDashboardSkeleton._surface,
      borderRadius: BorderRadius.circular(24),
    ),
    child: child,
  );
}

class _ActivityBone extends StatelessWidget {
  const _ActivityBone();

  @override
  Widget build(BuildContext context) => const Row(
    children: [
      _Bone.circle(34),
      SizedBox(width: 10),
      Expanded(child: _Bone(height: 12)),
    ],
  );
}

class _Bone extends StatelessWidget {
  const _Bone({
    this.width = double.infinity,
    required this.height,
    this.radius = 7,
    this.dark = false,
  });

  const _Bone.circle(double size)
    : width = size,
      height = size,
      radius = size / 2,
      dark = false;

  const _Bone.circleDark(double size)
    : width = size,
      height = size,
      radius = size / 2,
      dark = true;

  final double width;
  final double height;
  final double radius;
  final bool dark;

  @override
  Widget build(BuildContext context) => Container(
    width: width,
    height: height,
    decoration: BoxDecoration(
      color: dark
          ? Colors.white.withValues(alpha: .14)
          : HomeDashboardSkeleton._placeholder,
      borderRadius: BorderRadius.circular(radius),
      border: dark
          ? null
          : Border.all(
              color: HomeDashboardSkeleton._placeholderStrong.withValues(
                alpha: .35,
              ),
            ),
    ),
  );
}
