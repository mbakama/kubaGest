import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kubagest_mobile/core/auth/auth_session.dart';
import 'package:kubagest_mobile/core/theme/kuba_theme.dart';
import 'package:kubagest_mobile/features/home/home_screen.dart';
import 'package:kubagest_mobile/features/sales/sales_counter.dart';

void main() {
  testWidgets('capture ventes V6 390x844', (tester) async {
    tester.view.physicalSize = const Size(390, 844);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);

    const session = AuthSession(
      accessToken: 'preview',
      user: AuthUser(id: 'u1', email: 'hector@kubagest.cd'),
      context: TenantContext(
        tenantId: 't1',
        tenantName: 'Pharmacie Centrale',
        currency: 'FC',
        activityType: 'pharmacie',
        role: 'owner',
      ),
    );

    await tester.pumpWidget(
      MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: buildKubaTheme(),
        home: HomeScreen(
          session: session,
          onLogout: _asyncNoop,
          loadArticles: (_) async => const [
            CounterArticle(
              id: 'pa:box',
              name: 'Paracétamol 500 mg',
              packaging: 'Boîte · 4 000 FC',
              unitPrice: 4000,
            ),
            CounterArticle(
              id: 'sp:flask',
              name: 'Sérum physiologique',
              packaging: 'Flacon · 3 500 FC',
              unitPrice: 3500,
            ),
            CounterArticle(
              id: 'hv:bottle',
              name: 'Huile végétale',
              packaging: 'Flacon 1 L · 6 500 FC',
              unitPrice: 6500,
            ),
          ],
        ),
      ),
    );
    await tester.pumpAndSettle();
    await tester.pump(const Duration(milliseconds: 900));
    await tester.pumpAndSettle();

    await tester.tap(find.bySemanticsLabel('Ventes'));
    await tester.pumpAndSettle();

    await tester.enterText(find.byKey(const ValueKey('sale-search')), 'para');
    await tester.pump();
    await tester.tap(find.text('Paracétamol 500 mg'));
    await tester.pumpAndSettle();
    await tester.tap(find.byTooltip('Augmenter Paracétamol 500 mg'));
    await tester.pumpAndSettle();
    await tester.enterText(find.byKey(const ValueKey('sale-search')), 'sérum');
    await tester.pump();
    await tester.tap(find.text('Sérum physiologique'));
    await tester.pumpAndSettle();
    await tester.enterText(find.byKey(const ValueKey('tender-amount')), '15000');
    await tester.pumpAndSettle();

    await expectLater(
      find.byType(HomeScreen),
      matchesGoldenFile('goldens/sales_v6.png'),
    );
  });
}

Future<void> _asyncNoop() async {}
