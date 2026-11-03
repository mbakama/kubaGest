import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kubagest_mobile/app.dart';
import 'package:kubagest_mobile/features/pos/pos_module.dart';
import 'package:kubagest_mobile/features/pos/pos_module_screen.dart';
import 'package:kubagest_mobile/features/sales/sales_screen.dart';
import 'support/memory_session_storage.dart';

void main() {
  Future<void> pumpHome(WidgetTester tester) async {
    // Fenêtre haute : toute la liste d'accueil est construite, donc chaque
    // raccourci est trouvable sans défilement.
    tester.view.physicalSize = const Size(1200, 2600);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    await tester.pumpWidget(
      KubaGestApp(
        storage: MemorySessionStorage(buildSession())..introductionSeen = true,
        healthCheck: () async {},
      ),
    );
    await tester.pumpAndSettle();
    await tester.pump(const Duration(milliseconds: 900));
  }

  testWidgets('le raccourci Ventes ouvre le comptoir', (tester) async {
    await pumpHome(tester);

    await tester.tap(find.bySemanticsLabel('Ventes'));
    await tester.pumpAndSettle();

    expect(find.byType(SalesScreen), findsOneWidget);
    expect(find.byType(PosModuleScreen), findsNothing);
    expect(find.text('Montant remis par le client'), findsOneWidget);
    expect(find.text('Journal'), findsOneWidget);

    await tester.tap(find.bySemanticsLabel('Accueil'));
    await tester.pumpAndSettle();
    expect(find.text('Aperçu du jour'), findsOneWidget);
  });

  testWidgets('le raccourci Stock affiche les niveaux réels', (tester) async {
    await pumpHome(tester);

    await tester.tap(find.bySemanticsLabel('Stock'));
    await tester.pumpAndSettle();

    expect(find.byType(PosModuleScreen), findsNothing);
    expect(find.text('Avant la rupture'), findsOneWidget);
    expect(find.text('Réception'), findsOneWidget);
    expect(find.text('Articles suivis'), findsOneWidget);
    expect(find.text('Aucun article pour ce filtre.'), findsOneWidget);

    await tester.tap(find.bySemanticsLabel('Accueil'));
    await tester.pumpAndSettle();
    expect(find.text('Aperçu du jour'), findsOneWidget);
  });

  testWidgets('un module ne présente aucun montant simulé', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: PosModuleScreen(module: PosModules.caisse)),
    );
    await tester.pumpAndSettle();

    final texts = tester
        .widgetList<Text>(find.byType(Text))
        .map((widget) => widget.data ?? '')
        .where((value) => value.isNotEmpty)
        .toList();

    expect(texts, isNotEmpty);
    for (final value in texts) {
      expect(RegExp(r'\d{2,}').hasMatch(value), isFalse, reason: value);
    }
  });

  test('le catalogue associe chaque libellé à un module unique', () {
    expect(PosModules.all.map((module) => module.label).toSet(), hasLength(4));
    expect(PosModules.byLabel('Ventes'), same(PosModules.ventes));
    expect(PosModules.byLabel('Caisse'), same(PosModules.caisse));
    expect(PosModules.byLabel('Inconnu'), isNull);
  });
}
