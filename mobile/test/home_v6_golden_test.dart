import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kubagest_mobile/core/auth/auth_session.dart';
import 'package:kubagest_mobile/core/theme/kuba_theme.dart';
import 'package:kubagest_mobile/features/home/home_screen.dart';

void main() {
  testWidgets('capture accueil V6 390x844', (tester) async {
    tester.view.physicalSize = const Size(390, 844);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);

    const session = AuthSession(
      accessToken: 'preview',
      user: AuthUser(id: 'u1', email: 'hector@kubagest.cd'),
      context: TenantContext(
        tenantId: 't1',
        tenantName: 'Boutique Hector',
        currency: 'FC',
        activityType: 'boutique',
        role: 'owner',
      ),
    );

    await tester.pumpWidget(
      MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: buildKubaTheme(),
        home: const HomeScreen(session: session, onLogout: _asyncNoop),
      ),
    );
    await tester.pumpAndSettle();
    await tester.pump(const Duration(milliseconds: 900));
    await tester.pumpAndSettle();
    // Les images se décodent hors des frames : sans cette attente explicite,
    // la capture montrerait un cercle vide à la place de la photo.
    await tester.runAsync(
      () => precacheImage(
        const AssetImage('assets/brand/avatar-hector.png'),
        tester.element(find.byType(HomeScreen)),
      ),
    );
    await tester.pumpAndSettle();
    await expectLater(
      find.byType(HomeScreen),
      matchesGoldenFile('goldens/home_v6.png'),
    );
  });
}

Future<void> _asyncNoop() async {}
