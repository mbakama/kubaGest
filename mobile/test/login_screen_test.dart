import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kubagest_mobile/core/api/api_exception.dart';
import 'package:kubagest_mobile/core/auth/auth_session.dart';
import 'package:kubagest_mobile/core/auth/token_store.dart';
import 'package:kubagest_mobile/features/auth/login_screen.dart';
import 'support/memory_session_storage.dart';

void main() {
  Future<void> pumpLogin(
    WidgetTester tester, {
    required Future<Map<String, dynamic>> Function(String, String) submit,
    ValueChanged<AuthSession>? onAuthenticated,
    RememberedEmailStorage? rememberedEmails,
    Key? key,
  }) => tester.pumpWidget(
    MaterialApp(
      home: LoginScreen(
        key: key,
        submit: submit,
        onAuthenticated: onAuthenticated ?? (_) {},
        rememberedEmails: rememberedEmails,
      ),
    ),
  );

  Future<Map<String, dynamic>> acceptedLogin(
    String email,
    String password,
  ) async => {
    'accessToken': 'jeton',
    'user': {'id': 'u1', 'email': email},
    'context': null,
  };

  testWidgets('refuse un formulaire vide sans appeler le serveur', (
    tester,
  ) async {
    var calls = 0;
    await pumpLogin(
      tester,
      submit: (_, _) async {
        calls++;
        return {};
      },
    );

    await tester.ensureVisible(find.text('Se connecter'));
    await tester.tap(find.text('Se connecter'));
    await tester.pumpAndSettle();

    expect(find.text('L’adresse email est obligatoire.'), findsOneWidget);
    expect(find.text('Le mot de passe est obligatoire.'), findsOneWidget);
    expect(calls, 0);
  });

  testWidgets('refuse une adresse email invalide', (tester) async {
    await pumpLogin(tester, submit: (_, _) async => {});

    await tester.enterText(find.byType(TextFormField).first, 'admin');
    await tester.ensureVisible(find.text('Se connecter'));
    await tester.tap(find.text('Se connecter'));
    await tester.pumpAndSettle();

    expect(find.text('Adresse email invalide.'), findsOneWidget);
  });

  testWidgets('transmet les identifiants et ouvre la session', (tester) async {
    String? sentEmail;
    String? sentPassword;
    AuthSession? received;

    await pumpLogin(
      tester,
      submit: (email, password) async {
        sentEmail = email;
        sentPassword = password;
        return {
          'accessToken': 'jeton',
          'user': {'id': 'u1', 'email': email},
          'context': null,
        };
      },
      onAuthenticated: (session) => received = session,
    );

    await tester.enterText(
      find.byType(TextFormField).first,
      'admin@kubagest.io',
    );
    await tester.enterText(find.byType(TextFormField).last, 'Secret123!');
    await tester.ensureVisible(find.text('Se connecter'));
    await tester.tap(find.text('Se connecter'));
    await tester.pumpAndSettle();

    expect(sentEmail, 'admin@kubagest.io');
    expect(sentPassword, 'Secret123!');
    expect(received?.accessToken, 'jeton');
  });

  testWidgets('affiche le message d’erreur du serveur', (tester) async {
    await pumpLogin(
      tester,
      submit: (_, _) async =>
          throw const ApiException(401, 'Email ou mot de passe incorrect.'),
    );

    await tester.enterText(
      find.byType(TextFormField).first,
      'admin@kubagest.io',
    );
    await tester.enterText(find.byType(TextFormField).last, 'faux');
    await tester.ensureVisible(find.text('Se connecter'));
    await tester.tap(find.text('Se connecter'));
    await tester.pumpAndSettle();

    expect(find.text('Email ou mot de passe incorrect.'), findsOneWidget);
  });

  testWidgets('ne réinitialise pas la session sur une erreur réseau', (
    tester,
  ) async {
    var authenticated = false;
    await pumpLogin(
      tester,
      submit: (_, _) async => throw const ApiException.network(
        'Serveur injoignable. Vérifiez le réseau et l’adresse de l’API.',
      ),
      onAuthenticated: (_) => authenticated = true,
    );

    await tester.enterText(
      find.byType(TextFormField).first,
      'admin@kubagest.io',
    );
    await tester.enterText(find.byType(TextFormField).last, 'Secret123!');
    await tester.ensureVisible(find.text('Se connecter'));
    await tester.tap(find.text('Se connecter'));
    await tester.pumpAndSettle();

    expect(find.textContaining('Serveur injoignable'), findsOneWidget);
    expect(authenticated, isFalse);
  });

  testWidgets('retient l’email sur l’appareil et le propose ensuite', (
    tester,
  ) async {
    final store = MemorySessionStorage();
    await pumpLogin(tester, submit: acceptedLogin, rememberedEmails: store);

    await tester.enterText(
      find.byType(TextFormField).first,
      'admin@kubagest.io',
    );
    await tester.enterText(find.byType(TextFormField).last, 'Secret123!');
    await tester.tap(find.text('Mémoriser les identifiants'));
    await tester.ensureVisible(find.text('Se connecter'));
    await tester.tap(find.text('Se connecter'));
    await tester.pumpAndSettle();

    expect(store.rememberedEmail, 'admin@kubagest.io');

    await pumpLogin(
      tester,
      submit: acceptedLogin,
      rememberedEmails: store,
      key: const ValueKey('login-restored'),
    );
    await tester.pumpAndSettle();

    expect(
      tester
          .widget<TextFormField>(find.byType(TextFormField).first)
          .controller
          ?.text,
      'admin@kubagest.io',
    );
    expect(
      tester
          .widget<TextFormField>(find.byType(TextFormField).last)
          .controller
          ?.text,
      isEmpty,
    );
    expect(
      tester.widget<CheckboxListTile>(find.byType(CheckboxListTile)).value,
      isTrue,
    );
  });

  testWidgets('une connexion sans la case efface l’email retenu', (
    tester,
  ) async {
    final store = MemorySessionStorage()..rememberedEmail = 'admin@kubagest.io';
    await pumpLogin(tester, submit: acceptedLogin, rememberedEmails: store);
    await tester.pumpAndSettle();

    await tester.tap(find.text('Mémoriser les identifiants'));
    await tester.enterText(find.byType(TextFormField).last, 'Secret123!');
    await tester.ensureVisible(find.text('Se connecter'));
    await tester.tap(find.text('Se connecter'));
    await tester.pumpAndSettle();

    expect(store.rememberedEmail, isNull);
  });
}
