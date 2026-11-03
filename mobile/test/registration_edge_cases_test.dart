import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kubagest_mobile/app.dart';
import 'package:kubagest_mobile/core/api/api_exception.dart';
import 'package:kubagest_mobile/core/api/auth_api.dart';
import 'package:kubagest_mobile/core/auth/auth_session.dart';
import 'package:kubagest_mobile/core/theme/kuba_theme.dart';
import 'package:kubagest_mobile/features/auth/register_screen.dart';
import 'package:kubagest_mobile/shared/brand.dart';

import 'support/memory_session_storage.dart';

/// API d'authentification simulée pour le parcours complet.
class _FakeAuthApi extends AuthApi {
  int registerCalls = 0;
  int loginCalls = 0;

  @override
  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    loginCalls++;
    return {
      'accessToken': 'jeton-connexion',
      'user': {'id': 'u2', 'email': email},
      'context': null,
    };
  }

  @override
  Future<Map<String, dynamic>> register({
    required String tenantName,
    required String activityType,
    required String currency,
    required String firstName,
    required String lastName,
    required String email,
    required String password,
    String? address,
    String? phone,
    String? avatar,
  }) async {
    registerCalls++;
    return {
      'accessToken': 'jeton',
      'user': {'id': 'u1', 'email': email},
      'context': {
        'tenantId': 't1',
        'tenantName': tenantName,
        'currency': currency,
        'activityType': activityType,
        'role': 'owner',
        'establishmentId': 'e1',
      },
    };
  }
}

/// Cas limites du parcours de création : validation, retour, réseau et
/// enregistrement de la session.
void main() {
  Future<void> pumpRegister(
    WidgetTester tester, {
    required RegistrationSubmit submit,
    required AuthenticationCallback onAuthenticated,
  }) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: buildKubaTheme(),
        home: RegisterScreen(onAuthenticated: onAuthenticated, submit: submit),
      ),
    );
    await tester.pumpAndSettle();
  }

  /// Monte le formulaire au-dessus d'une page hôte pour observer les retours.
  Future<GlobalKey<NavigatorState>> pumpRegisterPushed(
    WidgetTester tester, {
    required RegistrationSubmit submit,
  }) async {
    final navigatorKey = GlobalKey<NavigatorState>();
    await tester.pumpWidget(
      MaterialApp(
        navigatorKey: navigatorKey,
        theme: buildKubaTheme(),
        home: Scaffold(
          body: Center(
            child: Builder(
              builder: (context) => ElevatedButton(
                onPressed: () => Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (_) =>
                        RegisterScreen(onAuthenticated: (_) {}, submit: submit),
                  ),
                ),
                child: const Text('Ouvrir le formulaire'),
              ),
            ),
          ),
        ),
      ),
    );
    await tester.tap(find.text('Ouvrir le formulaire'));
    await tester.pumpAndSettle();
    return navigatorKey;
  }

  Finder inRegister(Finder target) =>
      find.descendant(of: find.byType(RegisterScreen), matching: target);

  Future<void> tapAction(WidgetTester tester, String label) async {
    final target = inRegister(find.widgetWithText(ActionButton, label)).last;
    await tester.ensureVisible(target);
    await tester.tap(target);
    await tester.pumpAndSettle();
  }

  Future<void> tapText(WidgetTester tester, String text) async {
    final target = inRegister(find.text(text)).last;
    await tester.ensureVisible(target);
    await tester.tap(target);
    await tester.pumpAndSettle();
  }

  /// Clic hors du formulaire : accueil, confirmation et navigation.
  Future<void> tapApp(WidgetTester tester, String text) async {
    final target = find.text(text).last;
    await tester.ensureVisible(target);
    await tester.tap(target);
    await tester.pumpAndSettle();
  }

  Future<void> fillBusiness(WidgetTester tester, String name) async {
    await tester.enterText(find.byKey(const ValueKey('register-name')), name);
  }

  Future<void> goToAccount(WidgetTester tester) async {
    await tapText(tester, 'Pharmacie');
    await tapAction(tester, 'Continuer');
    await fillBusiness(tester, 'Pharmacie Gombe');
    await tapAction(tester, 'Continuer');
  }

  Future<void> fillAccount(
    WidgetTester tester, {
    String email = 'pharma@kubagest.io',
    String password = 'Secret123!',
    String? confirmation,
  }) async {
    await tester.enterText(
      find.byKey(const ValueKey('register-first-name')),
      'Amina',
    );
    await tester.enterText(
      find.byKey(const ValueKey('register-last-name')),
      'Kabasele',
    );
    await tester.enterText(find.byKey(const ValueKey('register-email')), email);
    await tester.enterText(
      find.byKey(const ValueKey('register-password')),
      password,
    );
    await tester.enterText(
      find.byKey(const ValueKey('register-confirmation')),
      confirmation ?? password,
    );
  }

  RegistrationSubmit responseSubmit({void Function()? onCall}) =>
      ({
        required tenantName,
        required activityType,
        required currency,
        required firstName,
        required lastName,
        required email,
        required password,
        address,
        phone,
      }) async {
        onCall?.call();
        return {
          'accessToken': 'jeton',
          'user': {'id': 'u1', 'email': email},
          'context': {
            'tenantId': 't1',
            'tenantName': tenantName,
            'currency': currency,
            'activityType': activityType,
            'role': 'owner',
            'establishmentId': 'e1',
          },
        };
      };

  group('formulaires invalides', () {
    testWidgets('refuse une adresse email invalide sans appeler le serveur', (
      tester,
    ) async {
      var calls = 0;
      await pumpRegister(
        tester,
        submit: responseSubmit(onCall: () => calls++),
        onAuthenticated: (_) {},
      );
      await goToAccount(tester);
      await fillAccount(tester, email: 'pharma.kubagest.io');

      await tapAction(tester, 'Créer mon commerce');

      expect(find.text('Adresse email invalide.'), findsOneWidget);
      expect(calls, 0);
      expect(find.text('Étape 3 sur 3'), findsOneWidget);
    });

    testWidgets('refuse un mot de passe de moins de 8 caractères', (
      tester,
    ) async {
      var calls = 0;
      await pumpRegister(
        tester,
        submit: responseSubmit(onCall: () => calls++),
        onAuthenticated: (_) {},
      );
      await goToAccount(tester);
      await fillAccount(tester, password: 'court');

      await tapAction(tester, 'Créer mon commerce');

      expect(
        find.text('Le mot de passe doit contenir au moins 8 caractères.'),
        findsOneWidget,
      );
      expect(calls, 0);
    });

    testWidgets('refuse un nom de commerce composé uniquement d’espaces', (
      tester,
    ) async {
      await pumpRegister(
        tester,
        submit: responseSubmit(),
        onAuthenticated: (_) {},
      );
      await tapText(tester, 'Boutique');
      await tapAction(tester, 'Continuer');
      await fillBusiness(tester, '   ');

      await tapAction(tester, 'Continuer');

      expect(find.text('Le nom du commerce est obligatoire.'), findsOneWidget);
      expect(find.text('Étape 2 sur 3'), findsOneWidget);
    });

    testWidgets('une correction permet ensuite de créer le commerce', (
      tester,
    ) async {
      var calls = 0;
      await pumpRegister(
        tester,
        submit: responseSubmit(onCall: () => calls++),
        onAuthenticated: (_) {},
      );
      await goToAccount(tester);
      await fillAccount(tester, email: 'invalide');

      await tapAction(tester, 'Créer mon commerce');
      expect(find.text('Adresse email invalide.'), findsOneWidget);

      await tester.enterText(
        find.byKey(const ValueKey('register-email')),
        'pharma@kubagest.io',
      );
      await tapAction(tester, 'Créer mon commerce');

      expect(calls, 1);
    });
  });

  group('retour à l’étape précédente', () {
    testWidgets('le retour depuis le compte conserve les champs saisis', (
      tester,
    ) async {
      await pumpRegister(
        tester,
        submit: responseSubmit(),
        onAuthenticated: (_) {},
      );
      await goToAccount(tester);
      await fillAccount(tester, email: 'brouillon@kubagest.io');

      await tester.tap(find.byTooltip('Retour'));
      await tester.pumpAndSettle();
      expect(find.text('Étape 2 sur 3'), findsOneWidget);

      await tapAction(tester, 'Continuer');

      expect(
        tester
            .widget<TextFormField>(find.byKey(const ValueKey('register-email')))
            .controller!
            .text,
        'brouillon@kubagest.io',
      );
      expect(find.text('Étape 3 sur 3'), findsOneWidget);
    });

    testWidgets('le retour système revient à l’étape précédente', (
      tester,
    ) async {
      final navigatorKey = await pumpRegisterPushed(
        tester,
        submit: responseSubmit(),
      );
      await goToAccount(tester);

      await navigatorKey.currentState!.maybePop();
      await tester.pumpAndSettle();

      // Le formulaire reste ouvert, mais recule d'une étape.
      expect(find.byType(RegisterScreen), findsOneWidget);
      expect(find.text('Étape 2 sur 3'), findsOneWidget);
    });

    testWidgets('le retour depuis la première étape quitte le formulaire', (
      tester,
    ) async {
      await pumpRegisterPushed(tester, submit: responseSubmit());

      await tester.tap(find.byTooltip('Retour'));
      await tester.pumpAndSettle();

      expect(find.byType(RegisterScreen), findsNothing);
      expect(find.text('Ouvrir le formulaire'), findsOneWidget);
    });

    testWidgets('aucun retour possible pendant l’envoi', (tester) async {
      var released = false;
      await pumpRegister(
        tester,
        submit:
            ({
              required tenantName,
              required activityType,
              required currency,
              required firstName,
              required lastName,
              required email,
              required password,
              address,
              phone,
            }) async {
              while (!released) {
                await Future<void>.delayed(const Duration(milliseconds: 10));
              }
              return responseSubmit()(
                tenantName: tenantName,
                activityType: activityType,
                currency: currency,
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                address: address,
                phone: phone,
              );
            },
        onAuthenticated: (_) {},
      );
      await goToAccount(tester);
      await fillAccount(tester);

      await tester.tap(find.widgetWithText(ActionButton, 'Créer mon commerce'));
      await tester.pump();

      final backButton = tester.widget<IconButton>(
        find.widgetWithIcon(IconButton, Icons.arrow_back_rounded),
      );
      expect(backButton.onPressed, isNull);

      released = true;
      await tester.pumpAndSettle();
    });
  });

  group('échec réseau', () {
    testWidgets('aucune session n’est enregistrée et le formulaire reste', (
      tester,
    ) async {
      final storage = MemorySessionStorage();
      await pumpRegister(
        tester,
        submit:
            ({
              required tenantName,
              required activityType,
              required currency,
              required firstName,
              required lastName,
              required email,
              required password,
              address,
              phone,
            }) async => throw const ApiException.network(
              'Serveur injoignable. Vérifiez le réseau et l’adresse de l’API.',
            ),
        onAuthenticated: storage.save,
      );
      await goToAccount(tester);
      await fillAccount(tester);

      await tapAction(tester, 'Créer mon commerce');

      expect(find.textContaining('Serveur injoignable'), findsOneWidget);
      expect(storage.saveCount, 0);
      expect(storage.session, isNull);
      expect(find.text('Étape 3 sur 3'), findsOneWidget);
      expect(find.text('Créer mon commerce'), findsOneWidget);
    });

    testWidgets(
      'le nouvel essai rappelle le serveur et enregistre la session',
      (tester) async {
        var calls = 0;
        final storage = MemorySessionStorage();
        await pumpRegister(
          tester,
          submit:
              ({
                required tenantName,
                required activityType,
                required currency,
                required firstName,
                required lastName,
                required email,
                required password,
                address,
                phone,
              }) async {
                calls++;
                if (calls == 1) {
                  throw const ApiException.network('Serveur injoignable.');
                }
                return {
                  'accessToken': 'jeton',
                  'user': {'id': 'u1', 'email': email},
                  'context': {
                    'tenantId': 't1',
                    'tenantName': tenantName,
                    'currency': currency,
                    'activityType': activityType,
                    'role': 'owner',
                    'establishmentId': 'e1',
                  },
                };
              },
          onAuthenticated: storage.save,
        );
        await goToAccount(tester);
        await fillAccount(tester);

        await tapAction(tester, 'Créer mon commerce');
        expect(find.textContaining('Serveur injoignable'), findsOneWidget);

        await tapAction(tester, 'Créer mon commerce');

        expect(calls, 2);
        expect(storage.saveCount, 1);
        expect(storage.session?.accessToken, 'jeton');
        expect(find.textContaining('Serveur injoignable'), findsNothing);
      },
    );

    testWidgets(
      'après création réussie, un échec d’enregistrement ne recrée pas le commerce',
      (tester) async {
        var calls = 0;
        var saves = 0;
        await pumpRegister(
          tester,
          submit: responseSubmit(onCall: () => calls++),
          onAuthenticated: (_) async {
            if (saves++ == 0) {
              throw const ApiException.network('Stockage indisponible');
            }
          },
        );
        await goToAccount(tester);
        await fillAccount(tester);

        await tapAction(tester, 'Créer mon commerce');

        expect(find.textContaining('Votre commerce est créé'), findsOneWidget);
        expect(find.text('Ouvrir mon espace'), findsOneWidget);

        await tapAction(tester, 'Ouvrir mon espace');

        expect(calls, 1);
        expect(saves, 2);
      },
    );
  });

  group('enregistrement de la session', () {
    Future<MemorySessionStorage> completeRegistration(
      WidgetTester tester, {
      _FakeAuthApi? api,
    }) async {
      final storage = MemorySessionStorage()..introductionSeen = true;
      await tester.pumpWidget(
        KubaGestApp(
          storage: storage,
          healthCheck: () async {},
          authApi: api ?? _FakeAuthApi(),
        ),
      );
      await tester.pumpAndSettle();

      // Accueil → formulaire de création.
      await tapApp(tester, 'Créer mon commerce');

      await tapText(tester, 'Pharmacie');
      await tapAction(tester, 'Continuer');
      await fillBusiness(tester, 'Pharmacie Gombe');
      await tapAction(tester, 'Continuer');
      await fillAccount(tester);
      await tapAction(tester, 'Créer mon commerce');

      return storage;
    }

    testWidgets(
      'la confirmation précède l’espace et n’enregistre qu’une fois',
      (tester) async {
        final storage = await completeRegistration(tester);

        expect(find.text('Votre commerce est créé.'), findsOneWidget);
        expect(find.text('Pharmacie Gombe'), findsOneWidget);
        expect(storage.saveCount, 1);
        expect(storage.session?.context?.tenantName, 'Pharmacie Gombe');

        await tapApp(tester, 'Accéder à mon commerce');

        expect(find.text('Accueil'), findsOneWidget);
        expect(find.bySemanticsLabel('Paramètres'), findsOneWidget);
        expect(storage.saveCount, 1);
      },
    );

    testWidgets('les rubriques affichent les données de la session', (
      tester,
    ) async {
      await completeRegistration(tester);
      await tapApp(tester, 'Accéder à mon commerce');
      await tester.pump(const Duration(milliseconds: 900));

      expect(find.text('Pharmacie Gombe'), findsOneWidget);

      await tester.tap(find.bySemanticsLabel('Paramètres'));
      await tester.pumpAndSettle();
      expect(find.text('Nom du commerce'), findsOneWidget);
      expect(find.text('CDF'), findsOneWidget);
      expect(find.text('Pharmacie'), findsWidgets);
      expect(find.text('pharma@kubagest.io'), findsOneWidget);
      expect(find.text('Propriétaire'), findsOneWidget);
    });

    testWidgets('une connexion existante enregistre aussi sa session', (
      tester,
    ) async {
      final api = _FakeAuthApi();
      final storage = MemorySessionStorage()..introductionSeen = true;
      await tester.pumpWidget(
        KubaGestApp(storage: storage, healthCheck: () async {}, authApi: api),
      );
      await tester.pumpAndSettle();

      await tapApp(tester, 'Se connecter');
      await tester.enterText(
        find.byKey(const ValueKey('login-email')),
        'gerant@kubagest.io',
      );
      await tester.enterText(
        find.byKey(const ValueKey('login-password')),
        'Secret123!',
      );
      final submitButton = find
          .widgetWithText(FilledButton, 'Se connecter')
          .last;
      await tester.ensureVisible(submitButton);
      await tester.tap(submitButton);
      await tester.pumpAndSettle();
      await tester.pump(const Duration(milliseconds: 900));

      expect(api.loginCalls, 1);
      expect(storage.saveCount, 1);
      expect(storage.session?.user.email, 'gerant@kubagest.io');
      expect(find.text('Votre compte plateforme'), findsOneWidget);
      expect(find.bySemanticsLabel('Paramètres'), findsOneWidget);
    });

    testWidgets('une relance de l’application rouvre l’espace enregistré', (
      tester,
    ) async {
      final storage = await completeRegistration(tester);
      await tapApp(tester, 'Accéder à mon commerce');

      // Nouvelle instance d'application avec le même stockage.
      await tester.pumpWidget(
        KubaGestApp(
          key: UniqueKey(),
          storage: storage,
          healthCheck: () async {},
        ),
      );
      await tester.pumpAndSettle();
      await tester.pump(const Duration(milliseconds: 900));

      expect(find.text('Pharmacie Gombe'), findsOneWidget);
      expect(find.bySemanticsLabel('Paramètres'), findsOneWidget);
      expect(storage.saveCount, 1);
      expect(find.text('Votre commerce est créé.'), findsNothing);
    });
  });
}
