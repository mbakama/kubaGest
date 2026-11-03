import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../core/theme/kuba_tokens.dart';

/// Illustration native et décorative : aucune valeur commerciale simulée.
class CommerceIllustration extends StatelessWidget {
  const CommerceIllustration({super.key, this.variant = 0});
  final int variant;

  @override
  Widget build(BuildContext context) => ExcludeSemantics(
    child: LayoutBuilder(
      builder: (context, constraints) {
        final width = constraints.maxWidth;
        final height =
            constraints.maxHeight.isFinite && constraints.maxHeight > 0
            ? constraints.maxHeight
            : width / 1.22;
        return SizedBox(
          width: width,
          height: height,
          child: Column(
            children: [
              Expanded(
                child: Stack(
                  children: [
                    Positioned.fill(
                      child: FittedBox(
                        fit: BoxFit.contain,
                        alignment: Alignment.bottomCenter,
                        child: CustomPaint(
                          size: const Size(360, 295),
                          painter: _CommercePainter(variant),
                        ),
                      ),
                    ),
                    Positioned(
                      right: 0,
                      top: 0,
                      child: Container(
                        padding: const EdgeInsets.all(13),
                        decoration: BoxDecoration(
                          color: KubaPalette.cash,
                          borderRadius: BorderRadius.circular(18),
                          boxShadow: KubaShadow.level2,
                        ),
                        child: Icon(
                          variant == 1
                              ? Icons.qr_code_2_rounded
                              : variant == 2
                              ? Icons.devices_rounded
                              : Icons.trending_up_rounded,
                          color: KubaPalette.midnightDeep,
                          size: 25,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              Flexible(
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  alignment: Alignment.bottomCenter,
                  child: SizedBox(
                    width: width,
                    child: _IllustrationNote(
                      icon: variant == 1
                          ? Icons.inventory_2_outlined
                          : Icons.check_rounded,
                      title: variant == 1
                          ? 'Chaque article compte'
                          : variant == 2
                          ? 'Un même espace'
                          : 'Le commerce avance',
                      subtitle: variant == 1
                          ? 'Des stocks bien organisés'
                          : variant == 2
                          ? 'Sur mobile et ordinateur'
                          : 'Vous gardez le contrôle',
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    ),
  );
}

class _IllustrationNote extends StatelessWidget {
  const _IllustrationNote({
    required this.icon,
    required this.title,
    required this.subtitle,
  });
  final IconData icon;
  final String title;
  final String subtitle;
  @override
  Widget build(BuildContext context) => Container(
    width: double.infinity,
    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
    decoration: BoxDecoration(
      color: KubaPalette.surfaceRaised,
      borderRadius: BorderRadius.circular(KubaRadius.md),
      border: Border.all(color: KubaPalette.border),
      boxShadow: KubaShadow.level1,
    ),
    child: Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: const BoxDecoration(
            color: KubaPalette.brandSoft,
            shape: BoxShape.circle,
          ),
          child: Icon(icon, size: 20, color: KubaPalette.brand),
        ),
        const SizedBox(width: 10),
        Flexible(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                title,
                style: KubaType.labelSm.copyWith(
                  color: KubaPalette.textPrimary,
                  fontSize: 12,
                  letterSpacing: 0,
                ),
              ),
              const SizedBox(height: 3),
              Text(
                subtitle,
                style: KubaType.bodySm.copyWith(
                  fontSize: 10,
                  color: KubaPalette.textMuted,
                ),
              ),
            ],
          ),
        ),
      ],
    ),
  );
}

class _CommercePainter extends CustomPainter {
  const _CommercePainter(this.variant);
  final int variant;

  static const _ground = Color(0xffd7e5df);
  static const _facade = Color(0xfff2f6f4);
  static const _trim = Color(0xffcfe0d8);
  static const _glass = Color(0xff6fa08c);
  static const _glassLight = Color(0xff9cc4b2);
  static const _crateDark = Color(0xffc99356);
  static const _crate = Color(0xffe2b071);
  static const _crateLight = Color(0xffedc98f);
  static const _plantDark = Color(0xff4f8a74);

  @override
  void paint(Canvas canvas, Size size) {
    canvas.save();
    canvas.scale(size.width / 360, size.height / 295);
    final paint = Paint();
    void rect(
      double x,
      double y,
      double w,
      double h,
      Color color, [
      double radius = 0,
    ]) {
      paint.color = color;
      canvas.drawRRect(
        RRect.fromRectAndRadius(
          Rect.fromLTWH(x, y, w, h),
          Radius.circular(radius),
        ),
        paint,
      );
    }

    paint.color = KubaPalette.brandSoft;
    canvas.drawCircle(const Offset(181, 138), 119, paint);
    paint.color = _ground;
    canvas.drawOval(const Rect.fromLTWH(56, 239, 260, 15), paint);
    rect(87, 90, 202, 151, _facade, 6);
    rect(95, 94, 186, 10, _trim, 3);
    rect(103, 139, 92, 80, KubaPalette.midnightDeep, 3);
    rect(111, 147, 76, 64, _glass, 1);
    rect(148, 147, 3, 64, KubaPalette.midnightDeep);
    rect(111, 177, 76, 3, KubaPalette.midnightDeep);
    rect(208, 139, 59, 102, KubaPalette.midnightDeep, 3);
    rect(215, 146, 45, 85, _glass, 2);
    rect(217, 149, 18, 78, _glassLight);
    rect(252, 190, 3, 12, KubaPalette.cash, 2);
    rect(79, 77, 218, 14, KubaPalette.midnightDeep, 3);
    final roof = Path()
      ..moveTo(88, 90)
      ..lineTo(288, 90)
      ..lineTo(305, 123)
      ..lineTo(71, 123)
      ..close();
    paint.color = KubaPalette.brand;
    canvas.drawPath(roof, paint);
    for (var i = 0; i < 7; i++) {
      final x = 71.0 + i * 33.4;
      paint.color = i.isEven ? Colors.white : KubaPalette.brand;
      canvas.drawPath(
        Path()
          ..moveTo(88 + i * 28.6, 90)
          ..lineTo(88 + (i + 1) * 28.6, 90)
          ..lineTo(x + 33.4, 123)
          ..lineTo(x, 123)
          ..close(),
        paint,
      );
      canvas.drawRRect(
        RRect.fromRectAndCorners(
          Rect.fromLTWH(x, 121, 33.4, 16),
          bottomLeft: const Radius.circular(9),
          bottomRight: const Radius.circular(9),
        ),
        paint,
      );
    }
    rect(144, 51, 88, 25, KubaPalette.midnightDeep, 5);
    for (var i = 0; i < 5; i++) {
      rect(158 + i * 12, 59, 7, 9, Colors.white, 1);
    }
    rect(292, 208, 30, 33, _crate, 4);
    rect(305, 212, 4, 24, _crateDark);
    rect(285, 190, 27, 18, _crateLight, 3);
    rect(51, 214, 21, 28, _crateDark, 3);
    for (var i = 0; i < 4; i++) {
      paint.color = i.isEven ? KubaPalette.brand : _plantDark;
      canvas.drawOval(
        Rect.fromCenter(
          center: Offset(60 + math.sin(i * 2) * 12, 196 + i * 4),
          width: 13,
          height: 28,
        ),
        paint,
      );
    }
    if (variant == 1) {
      rect(237, 166, 55, 65, Colors.white, 6);
      for (var i = 0; i < 3; i++) {
        rect(246, 179 + i * 15, 10, 8, KubaPalette.cash, 2);
        rect(261, 181 + i * 15, 21, 3, KubaPalette.brand, 1);
      }
    }
    if (variant == 2) {
      rect(246, 135, 50, 94, KubaPalette.midnightDeep, 8);
      rect(251, 145, 40, 71, Colors.white, 3);
      rect(258, 158, 26, 22, KubaPalette.brandSoft, 3);
      rect(258, 187, 26, 4, KubaPalette.brand, 1);
      rect(258, 197, 19, 3, _trim, 1);
    }
    canvas.restore();
  }

  @override
  bool shouldRepaint(_CommercePainter oldDelegate) =>
      oldDelegate.variant != variant;
}
