import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kubagest_mobile/core/api/api_exception.dart';
import 'package:kubagest_mobile/core/auth/auth_session.dart';
import 'package:kubagest_mobile/features/account/account_api.dart';
import 'package:kubagest_mobile/features/account/subscription_screen.dart';

class FakeAccount extends AccountApi {
  bool fail = false;
  String? token;
  Map<String, dynamic> data = {
    'subscription': {
      'plan': 'essential',
      'status': 'trial',
      'startAt': '2026-10-25T12:00:00Z',
      'endAt': '2026-11-24T12:00:00Z',
    },
  };
  @override
  Future<Map<String, dynamic>> load(String token) async {
    this.token = token;
    if (fail) throw const ApiException(401, 'Session expirée');
    return data;
  }
}

void main() {
  const session = AuthSession(
    accessToken: 'test-token',
    user: AuthUser(id: 'u', email: 'test@example.com'),
  );
  testWidgets('abonnement reçu du serveur et jeton de session', (tester) async {
    final api = FakeAccount();
    await tester.pumpWidget(
      MaterialApp(
        home: SubscriptionScreen(session: session, api: api),
      ),
    );
    await tester.pumpAndSettle();
    expect(api.token, 'test-token');
    expect(find.text('Formule : Essentiel'), findsOneWidget);
    expect(find.text('Statut : Période d’essai'), findsOneWidget);
    expect(find.text('Échéance : 24/11/2026'), findsOneWidget);
  });
  testWidgets('erreur puis absence d’abonnement', (tester) async {
    final api = FakeAccount()..fail = true;
    await tester.pumpWidget(
      MaterialApp(
        home: SubscriptionScreen(session: session, api: api),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('Session expirée'), findsOneWidget);
    api.fail = false;
    api.data = {'subscription': null};
    await tester.tap(find.text('Réessayer'));
    await tester.pumpAndSettle();
    expect(
      find.text('Aucun abonnement enregistré pour ce commerce.'),
      findsOneWidget,
    );
  });
}
