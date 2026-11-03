import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kubagest_mobile/core/api/api_exception.dart';
import 'package:kubagest_mobile/features/auth/forgot_password_screen.dart';
import 'package:kubagest_mobile/features/auth/reset_code_screen.dart';
import 'package:kubagest_mobile/features/auth/reset_password_screen.dart';

void main() {
  Future<void> pumpForgot(
    WidgetTester tester, {
    Future<void> Function(String email)? requestReset,
  }) => tester.pumpWidget(
    MaterialApp(home: ForgotPasswordScreen(requestReset: requestReset)),
  );

  testWidgets('un email vide reste sur le formulaire', (tester) async {
    await pumpForgot(tester);

    await tester.tap(find.text('Envoyer le code'));
    await tester.pumpAndSettle();

    expect(find.text('L’adresse email est obligatoire.'), findsOneWidget);
    expect(find.byType(CircularProgressIndicator), findsNothing);
  });

  testWidgets('une adresse inconnue affiche l’erreur et laisse réessayer', (
    tester,
  ) async {
    await pumpForgot(
      tester,
      requestReset: (email) async {
        throw const ApiException(
          404,
          'Aucun compte n’existe avec cette adresse email.',
        );
      },
    );

    await tester.enterText(find.byType(TextFormField), 'inconnu@kubagest.io');
    await tester.tap(find.text('Envoyer le code'));
    await tester.pumpAndSettle();

    expect(
      find.text('Aucun compte n’existe avec cette adresse email.'),
      findsOneWidget,
    );
    expect(find.text('Saisissez le code.'), findsNothing);
  });

  testWidgets('un compte existant ouvre la saisie du code', (tester) async {
    await pumpForgot(tester, requestReset: (email) async {});

    await tester.enterText(find.byType(TextFormField), 'he@gmail.com');
    await tester.tap(find.text('Envoyer le code'));
    await tester.pumpAndSettle();

    expect(find.text('Saisissez le code.'), findsOneWidget);
    expect(find.text('Nous l’avons envoyé à he@gmail.com.'), findsOneWidget);
  });

  testWidgets('un code reconnu ouvre le nouveau mot de passe', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: ResetCodeScreen(
          email: 'he@gmail.com',
          verify: (email, code) async => 'jeton-de-changement',
        ),
      ),
    );

    await tester.enterText(find.byType(TextFormField), '123456');
    await tester.tap(find.text('Continuer'));
    await tester.pumpAndSettle();

    expect(find.text('Choisissez un nouveau mot de passe.'), findsOneWidget);
    expect(find.text('Nouveau mot de passe'), findsOneWidget);
    expect(find.text('Mot de passe actuel'), findsNothing);
  });

  testWidgets('un code incomplet reste sur la saisie', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: ResetCodeScreen(email: 'he@gmail.com')),
    );

    await tester.enterText(find.byType(TextFormField), '123');
    await tester.tap(find.text('Continuer'));
    await tester.pumpAndSettle();

    expect(find.text('Le code comporte 6 chiffres.'), findsOneWidget);
    expect(find.text('Choisissez un nouveau mot de passe.'), findsNothing);
  });

  testWidgets('deux mots de passe identiques sont enregistrés', (tester) async {
    String? saved;
    await tester.pumpWidget(
      MaterialApp(
        home: ResetPasswordScreen(
          resetToken: 'jeton-de-changement-assez-long',
          confirm: (token, password) async {
            expect(token, 'jeton-de-changement-assez-long');
            saved = password;
          },
        ),
      ),
    );

    await tester.enterText(find.byType(TextFormField).at(0), 'court');
    await tester.tap(find.text('Enregistrer'));
    await tester.pumpAndSettle();
    expect(
      find.text('Le mot de passe doit contenir au moins 8 caractères.'),
      findsOneWidget,
    );

    await tester.enterText(find.byType(TextFormField).at(0), 'NouveauMot1');
    await tester.enterText(find.byType(TextFormField).at(1), 'autre');
    await tester.tap(find.text('Enregistrer'));
    await tester.pumpAndSettle();
    expect(
      find.text('Les deux mots de passe ne correspondent pas.'),
      findsOneWidget,
    );

    await tester.enterText(find.byType(TextFormField).at(1), 'NouveauMot1');
    await tester.tap(find.text('Enregistrer'));
    await tester.pumpAndSettle();

    expect(saved, 'NouveauMot1');
  });
}
