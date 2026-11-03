import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kubagest_mobile/features/credits/credit_api.dart';
import 'package:kubagest_mobile/features/credits/credits_screen.dart';

void main() {
  testWidgets('le carnet affiche un retard et encaisse un règlement', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(1200, 2600);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);

    final gateway = _FakeLedger();
    await tester.pumpWidget(
      MaterialApp(
        home: CreditsScreen(gateway: gateway, currency: 'FC'),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Carnet de crédit'), findsOneWidget);
    expect(find.text('8 000 FC'), findsWidgets);
    expect(find.textContaining('30 j de retard'), findsOneWidget);

    await tester.tap(find.text('Marie Kabongo'));
    await tester.pumpAndSettle();

    await tester.enterText(
      find.byKey(const ValueKey('credit-payment-amount')),
      '3000',
    );
    await tester.tap(find.byKey(const ValueKey('credit-payment-save')));
    await tester.pumpAndSettle();

    expect(gateway.paidAmount, 3000);
    expect(find.textContaining('reste dû 5 000 FC'), findsOneWidget);

    await tester.tap(find.byTooltip('Fermer'));
    await tester.pumpAndSettle();
    expect(find.text('Carnet de crédit'), findsOneWidget);
  });

  testWidgets('le filtre en retard interroge le carnet', (tester) async {
    tester.view.physicalSize = const Size(1200, 2600);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);

    final gateway = _FakeLedger();
    await tester.pumpWidget(
      MaterialApp(
        home: CreditsScreen(gateway: gateway, currency: 'FC'),
      ),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.text('En retard'));
    await tester.pumpAndSettle();

    expect(gateway.lastStatus, 'late');
  });
}

class _FakeLedger implements CreditGateway {
  int? paidAmount;
  String? lastStatus;

  CreditEntry _entry(int remaining) => CreditEntry(
    id: 'k1',
    number: 'CR-000001',
    customerId: 'c1',
    customerName: 'Marie Kabongo',
    total: 8000,
    paidTotal: 8000 - remaining,
    remaining: remaining,
    dueDate: DateTime.now().subtract(const Duration(days: 30)),
    daysLate: 30,
    status: remaining == 0 ? 'paid' : 'open',
    payments: const [],
  );

  @override
  Future<List<CreditEntry>> credits({String status = 'open'}) async {
    lastStatus = status;
    return [_entry(8000)];
  }

  @override
  Future<CreditEntry> recordPayment(
    String creditId, {
    required int amount,
    String method = 'cash',
  }) async {
    paidAmount = amount;
    return _entry(8000 - amount);
  }

  @override
  Future<CreditSummary> summary() async => const CreditSummary(
    outstanding: 8000,
    openCount: 1,
    lateCount: 1,
    lateAmount: 8000,
  );

  @override
  Future<List<CreditCustomer>> customers({String query = ''}) async => const [];

  @override
  Future<CreditCustomer> createCustomer({
    required String name,
    String? phone,
    required int creditLimit,
  }) async => throw UnimplementedError();

  @override
  Future<CreditEntry> createCredit({
    required String customerId,
    required int total,
    DateTime? dueDate,
  }) async => throw UnimplementedError();
}
