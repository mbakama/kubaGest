import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kubagest_mobile/core/auth/auth_session.dart';
import 'package:kubagest_mobile/core/theme/kuba_theme.dart';
import 'package:kubagest_mobile/features/auth/activation_screen.dart';

void main() {
  const session = AuthSession(
    accessToken: 'test',
    user: AuthUser(id: 'test', email: 'proprietaire@example.com'),
    context: TenantContext(
      tenantId: 'test',
      tenantName: 'Commerce de démonstration',
      currency: 'CDF',
      activityType: 'alimentation',
      role: 'owner',
    ),
  );
  testWidgets('confirmation défilable sur petit écran avec grands caractères', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(320, 568);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    var continued = false;
    await tester.pumpWidget(
      MaterialApp(
        theme: buildKubaTheme(),
        builder: (context, child) => MediaQuery(
          data: MediaQuery.of(
            context,
          ).copyWith(textScaler: const TextScaler.linear(2)),
          child: child!,
        ),
        home: ActivationScreen(
          session: session,
          onContinue: () => continued = true,
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(tester.takeException(), isNull);
    await tester.ensureVisible(find.text('Accéder à mon commerce'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Accéder à mon commerce'));
    expect(continued, isTrue);
    expect(tester.takeException(), isNull);
  });
}
