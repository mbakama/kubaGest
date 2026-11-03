import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kubagest_mobile/features/stock/stock_api.dart';
import 'package:kubagest_mobile/features/stock/stock_screen.dart';

void main() {
  testWidgets('le stock réel s’affiche et une réception met à jour la quantité', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(1200, 2600);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);

    final gateway = _FakeStockGateway();
    await tester.pumpWidget(
      MaterialApp(home: StockScreen(gateway: gateway)),
    );
    await tester.pumpAndSettle();

    expect(find.text('Paracétamol 500 mg'), findsOneWidget);
    expect(find.text('18'), findsOneWidget);
    expect(find.text('Sous le seuil'), findsNWidgets(2));

    await tester.tap(find.text('Réception'));
    await tester.pumpAndSettle();

    await tester.enterText(
      find.byKey(const ValueKey('receive-quantity')),
      '25',
    );
    await tester.tap(find.byKey(const ValueKey('receive-submit')));
    await tester.pumpAndSettle();

    expect(gateway.received, 25);
    expect(gateway.receivedProductId, 'p1');
    expect(find.text('43'), findsOneWidget);
  });

  testWidgets('une rupture est signalée', (tester) async {
    tester.view.physicalSize = const Size(1200, 2600);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);

    final gateway = _FakeStockGateway(quantity: 0);
    await tester.pumpWidget(
      MaterialApp(home: StockScreen(gateway: gateway)),
    );
    await tester.pumpAndSettle();

    expect(find.text('Rupture'), findsNWidgets(2));
    expect(find.text('0'), findsOneWidget);
  });
}

class _FakeStockGateway implements StockGateway {
  _FakeStockGateway({int quantity = 18}) : _quantity = quantity;

  int _quantity;
  int? received;
  String? receivedProductId;

  StockLine get _line => StockLine(
    productId: 'p1',
    sku: 'PARA',
    name: 'Paracétamol 500 mg',
    baseUnit: 'comprimé',
    reorderLevel: 20,
    quantity: _quantity,
    belowThreshold: _quantity <= 20,
  );

  @override
  Future<List<StockLine>> lines() async => [_line];

  @override
  Future<StockLine> receive({
    required String productId,
    required int quantity,
    String? reference,
  }) async {
    received = quantity;
    receivedProductId = productId;
    _quantity += quantity;
    return _line;
  }
}
