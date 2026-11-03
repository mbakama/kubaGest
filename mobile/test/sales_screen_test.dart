import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kubagest_mobile/core/api/api_exception.dart';
import 'package:kubagest_mobile/features/credits/credit_api.dart';
import 'package:kubagest_mobile/features/sales/sales_api.dart';
import 'package:kubagest_mobile/features/sales/sales_counter.dart';
import 'package:kubagest_mobile/features/sales/sales_screen.dart';

void main() {
  const paracetamol = CounterArticle(
    id: 'pa',
    name: 'Paracétamol 500 mg',
    packaging: 'Boîte',
    unitPrice: 4000,
    barcode: '3400930000001',
    productId: 'p1',
    packagingId: 'box',
  );

  test('le catalogue devient un article par conditionnement', () {
    final articles = CounterArticle.fromCatalog({
      'id': 'p1',
      'name': 'Paracétamol 500 mg',
      'sku': 'PARA',
      'isActive': true,
      'packagings': [
        {
          'id': 'box',
          'label': 'Boîte',
          'salePrice': '4000.000000',
          'isActive': true,
        },
      ],
      'barcodes': [
        {'packagingId': 'box', 'code': '3400930000001'},
      ],
    });

    expect(articles, hasLength(1));
    expect(articles.single.unitPrice, 4000);
    expect(articles.single.matches('3400930000001'), isTrue);
  });

  testWidgets('la monnaie se calcule dès le montant remis', (tester) async {
    tester.view.physicalSize = const Size(1200, 2600);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    await tester.pumpWidget(
      const MaterialApp(home: SalesScreen(articles: [paracetamol])),
    );

    await tester.enterText(find.byKey(const ValueKey('sale-search')), 'para');
    await tester.pump();
    await tester.tap(find.text('Paracétamol 500 mg'));
    await tester.pump();
    await tester.tap(find.byTooltip('Augmenter Paracétamol 500 mg'));
    await tester.pump();

    await tester.enterText(
      find.byKey(const ValueKey('tender-amount')),
      '10000',
    );
    await tester.pump();

    expect(
      tester
          .widget<TextField>(find.byKey(const ValueKey('tender-amount')))
          .controller!
          .text,
      '10 000',
    );
    expect(find.text('À rendre'), findsOneWidget);
    expect(find.text('2 000 FC'), findsOneWidget);
    expect(
      tester
          .widget<FilledButton>(find.byKey(const ValueKey('collect-sale')))
          .onPressed,
      isNotNull,
    );

    await tester.enterText(find.byKey(const ValueKey('tender-amount')), '5000');
    await tester.pump();

    expect(find.text('Il manque'), findsOneWidget);
    expect(find.text('3 000 FC'), findsOneWidget);
    expect(
      tester
          .widget<FilledButton>(find.byKey(const ValueKey('collect-sale')))
          .onPressed,
      isNull,
    );
  });

  testWidgets('le mobile money n’est pas encore encaissable', (tester) async {
    tester.view.physicalSize = const Size(1200, 2600);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    await tester.pumpWidget(
      const MaterialApp(home: SalesScreen(articles: [paracetamol])),
    );

    await tester.tap(find.text('Mobile Money'));
    await tester.pump();

    expect(find.text('Montant remis par le client'), findsNothing);
    expect(
      find.textContaining('Le mobile money sera activé'),
      findsOneWidget,
    );
    expect(
      tester
          .widget<FilledButton>(find.byKey(const ValueKey('collect-sale')))
          .onPressed,
      isNull,
    );
  });

  testWidgets('l’encaissement en espèces écrit le ticket', (tester) async {
    tester.view.physicalSize = const Size(1200, 3000);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    final sales = _FakeSaleGateway();
    await tester.pumpWidget(
      MaterialApp(
        home: SalesScreen(articles: [paracetamol], saleGateway: sales),
      ),
    );

    await tester.enterText(find.byKey(const ValueKey('sale-search')), 'para');
    await tester.pump();
    await tester.tap(find.text('Paracétamol 500 mg'));
    await tester.pump();
    await tester.enterText(
      find.byKey(const ValueKey('tender-amount')),
      '10000',
    );
    await tester.pump();
    await tester.tap(find.byKey(const ValueKey('collect-sale')));
    await tester.pumpAndSettle();

    expect(sales.created, 1);
    expect(sales.channel, 'cash');
    expect(sales.received, 10000);
    expect(sales.items.single.quantity, 1);
    expect(find.text('Ticket T-000001'), findsOneWidget);
    expect(find.textContaining('à rendre 6 000 FC'), findsOneWidget);

    await tester.tap(find.text('Fermer'));
    await tester.pumpAndSettle();
    expect(find.text('Ajoutez le médicament demandé par le client.'), findsOneWidget);
  });

  testWidgets('une vente refusée affiche le motif du serveur', (tester) async {
    tester.view.physicalSize = const Size(1200, 3000);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    final sales = _FakeSaleGateway(failure: 'Stock insuffisant pour Paracétamol.');
    await tester.pumpWidget(
      MaterialApp(
        home: SalesScreen(articles: [paracetamol], saleGateway: sales),
      ),
    );

    await tester.enterText(find.byKey(const ValueKey('sale-search')), 'para');
    await tester.pump();
    await tester.tap(find.text('Paracétamol 500 mg'));
    await tester.pump();
    await tester.enterText(
      find.byKey(const ValueKey('tender-amount')),
      '4000',
    );
    await tester.pump();
    await tester.tap(find.byKey(const ValueKey('collect-sale')));
    await tester.pumpAndSettle();

    expect(
      find.byKey(const ValueKey('sale-error')),
      findsOneWidget,
    );
    expect(
      find.textContaining('Stock insuffisant'),
      findsOneWidget,
    );
  });

  testWidgets('le crédit exige un client et respecte le plafond', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(1200, 3200);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    final gateway = _FakeCreditGateway(available: 5000);
    final sales = _FakeSaleGateway();
    await tester.pumpWidget(
      MaterialApp(
        home: SalesScreen(
          articles: [paracetamol],
          credit: gateway,
          saleGateway: sales,
        ),
      ),
    );

    await tester.enterText(find.byKey(const ValueKey('sale-search')), 'para');
    await tester.pump();
    await tester.tap(find.text('Paracétamol 500 mg'));
    await tester.pump();
    await tester.tap(find.text('Crédit client'));
    await tester.pumpAndSettle();

    expect(
      find.text('Un crédit doit être rattaché à une personne.'),
      findsOneWidget,
    );
    expect(
      tester
          .widget<FilledButton>(find.byKey(const ValueKey('collect-sale')))
          .onPressed,
      isNull,
    );

    await tester.tap(find.byKey(const ValueKey('pick-credit-customer')));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Marie Kabongo'));
    await tester.pumpAndSettle();

    expect(find.textContaining('Après cette vente'), findsOneWidget);
    await tester.tap(find.byKey(const ValueKey('collect-sale')));
    await tester.pumpAndSettle();

    expect(sales.created, 1);
    expect(sales.channel, 'credit');
    expect(sales.customerId, 'c1');
    expect(find.text('Ticket T-000001'), findsOneWidget);
    expect(find.textContaining('Crédit CR-000001'), findsOneWidget);
  });

  testWidgets('un panier au-delà du plafond reste bloqué', (tester) async {
    tester.view.physicalSize = const Size(1200, 3200);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    final gateway = _FakeCreditGateway(available: 3000);
    await tester.pumpWidget(
      MaterialApp(
        home: SalesScreen(
          articles: [paracetamol],
          credit: gateway,
          saleGateway: _FakeSaleGateway(),
        ),
      ),
    );

    await tester.enterText(find.byKey(const ValueKey('sale-search')), 'para');
    await tester.pump();
    await tester.tap(find.text('Paracétamol 500 mg'));
    await tester.pump();
    await tester.tap(find.text('Crédit client'));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('pick-credit-customer')));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Marie Kabongo'));
    await tester.pumpAndSettle();

    expect(
      find.textContaining('Le plafond ne couvre pas cette vente'),
      findsOneWidget,
    );
    expect(
      tester
          .widget<FilledButton>(find.byKey(const ValueKey('collect-sale')))
          .onPressed,
      isNull,
    );
  });
}

class _FakeCreditGateway implements CreditGateway {
  _FakeCreditGateway({required this.available});

  final int available;
  int created = 0;
  int? lastTotal;

  CreditCustomer get _customer => CreditCustomer(
    id: 'c1',
    name: 'Marie Kabongo',
    phone: '+243810000001',
    creditLimit: available + 10000,
    outstanding: 10000,
    available: available,
    hasLateCredit: false,
  );

  @override
  Future<List<CreditCustomer>> customers({String query = ''}) async => [
    _customer,
  ];

  @override
  Future<CreditCustomer> createCustomer({
    required String name,
    String? phone,
    required int creditLimit,
  }) async => _customer;

  @override
  Future<List<CreditEntry>> credits({String status = 'open'}) async => const [];

  @override
  Future<CreditEntry> createCredit({
    required String customerId,
    required int total,
    DateTime? dueDate,
  }) async {
    created += 1;
    lastTotal = total;
    return CreditEntry(
      id: 'k1',
      number: 'CR-000001',
      customerId: customerId,
      customerName: 'Marie Kabongo',
      total: total,
      paidTotal: 0,
      remaining: total,
      dueDate: dueDate,
      daysLate: null,
      status: 'open',
      payments: const [],
    );
  }

  @override
  Future<CreditEntry> recordPayment(
    String creditId, {
    required int amount,
    String method = 'cash',
  }) async => throw UnimplementedError();

  @override
  Future<CreditSummary> summary() async => const CreditSummary(
    outstanding: 0,
    openCount: 0,
    lateCount: 0,
    lateAmount: 0,
  );
}

class _FakeSaleGateway implements SaleGateway {
  _FakeSaleGateway({this.failure});

  final String? failure;
  int created = 0;
  String? channel;
  int? received;
  String? customerId;
  DateTime? dueDate;
  List<SaleLineInput> items = const [];

  @override
  Future<SaleReceipt> createSale({
    required List<SaleLineInput> items,
    required String channel,
    int? received,
    String? customerId,
    DateTime? dueDate,
  }) async {
    final message = failure;
    if (message != null) throw ApiException(409, message);
    created += 1;
    this.channel = channel;
    this.received = received;
    this.customerId = customerId;
    this.dueDate = dueDate;
    this.items = items;
    final total = items.fold<int>(
      0,
      (sum, item) => sum + 4000 * item.quantity,
    );
    return SaleReceipt(
      id: 's1',
      number: 'T-000001',
      channel: channel,
      total: total,
      received: received,
      change: received == null ? null : received - total,
      registerName: 'Caisse principale',
      customerName: customerId == null ? null : 'Marie Kabongo',
      creditNumber: customerId == null ? null : 'CR-000001',
      creditDueDate: dueDate,
      postedAt: DateTime(2026, 10, 27, 10, 30),
      items: const [],
    );
  }

  @override
  Future<List<SaleReceipt>> recent({int limit = 20}) async => const [];
}
