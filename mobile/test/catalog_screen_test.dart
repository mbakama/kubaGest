import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kubagest_mobile/core/api/api_exception.dart';
import 'package:kubagest_mobile/core/auth/auth_session.dart';
import 'package:kubagest_mobile/core/theme/kuba_theme.dart';
import 'package:kubagest_mobile/features/catalog/catalog_api.dart';
import 'package:kubagest_mobile/features/catalog/catalog_screen.dart';

class FakeCatalog extends CatalogApi {
  String? token;
  bool fail = false;
  @override
  Future<List<Map<String, dynamic>>> load(String token) async {
    this.token = token;
    if (fail) throw const ApiException.network('Serveur injoignable.');
    return [
      {
        'id': 'p1',
        'name': 'Savon',
        'sku': 'SAV',
        'baseUnit': 'pièce',
        'isActive': true,
        'packagings': [
          {
            'label': 'Pièce',
            'factorToBase': 1,
            'salePrice': '2.000000',
            'isActive': true,
          },
        ],
      },
    ];
  }
}

void main() {
  const session = AuthSession(
    accessToken: 'test-token',
    user: AuthUser(id: 'u1', email: 'test@example.com'),
  );
  testWidgets('catalogue : session, recherche et détail', (tester) async {
    final api = FakeCatalog();
    await tester.pumpWidget(
      MaterialApp(
        theme: buildKubaTheme(),
        home: CatalogScreen(session: session, api: api),
      ),
    );
    await tester.pumpAndSettle();
    expect(api.token, 'test-token');
    await tester.enterText(find.byType(TextField), 'absent');
    await tester.pump();
    expect(
      find.text('Aucun article ne correspond à votre recherche.'),
      findsOneWidget,
    );
    await tester.enterText(find.byType(TextField), 'sav');
    await tester.pump();
    await tester.tap(find.text('Savon'));
    await tester.pumpAndSettle();
    expect(find.text('Conditionnements'), findsOneWidget);
    expect(find.text('Référence : SAV'), findsOneWidget);
  });
  testWidgets('erreur réseau puis reprise', (tester) async {
    final api = FakeCatalog()..fail = true;
    await tester.pumpWidget(
      MaterialApp(
        theme: buildKubaTheme(),
        home: CatalogScreen(session: session, api: api),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('Serveur injoignable.'), findsOneWidget);
    api.fail = false;
    await tester.tap(find.text('Réessayer'));
    await tester.pumpAndSettle();
    expect(find.text('Savon'), findsOneWidget);
  });
}
