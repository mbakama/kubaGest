import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kubagest_mobile/app.dart';
import 'package:kubagest_mobile/features/auth/register_screen.dart';
import 'package:kubagest_mobile/core/theme/kuba_theme.dart';
import 'support/memory_session_storage.dart';

void main() {
  Future<void> pumpApp(
    WidgetTester tester,
    MemorySessionStorage storage,
  ) async {
    await tester.pumpWidget(
      KubaGestApp(storage: storage, healthCheck: () async {}),
    );
    await tester.pumpAndSettle();
    await tester.pump(const Duration(milliseconds: 900));
    await tester.pumpAndSettle();
  }

  Future<void> tapText(WidgetTester tester, String text) async {
    final target = find.text(text);
    await tester.ensureVisible(target.last);
    await tester.tap(target.last);
    await tester.pumpAndSettle();
  }

  testWidgets(
    'présentation complète puis choix de création, sans création implicite',
    (tester) async {
      final storage = MemorySessionStorage();
      await pumpApp(tester, storage);
      expect(
        find.text('Gérer votre commerce,\nl’esprit tranquille.'),
        findsOneWidget,
      );
      await tapText(tester, 'Commencer');
      expect(find.text('Chaque article,\nà sa place.'), findsOneWidget);
      await tapText(tester, 'Continuer');
      expect(find.text('Gardez le lien avec\nvotre commerce.'), findsOneWidget);
      await tapText(tester, 'Continuer');
      expect(find.text('Créer mon commerce'), findsOneWidget);
      expect(storage.introductionSeen, isTrue);
      expect(storage.session, isNull);
      expect(storage.saveCount, 0);
    },
  );

  testWidgets('présentation déjà vue : accès direct au choix', (tester) async {
    final storage = MemorySessionStorage()..introductionSeen = true;
    await pumpApp(tester, storage);
    expect(find.text('Créer mon commerce'), findsOneWidget);
    expect(find.text('Commencer'), findsNothing);
  });

  testWidgets('passer reste possible, la connexion ouvre le formulaire', (
    tester,
  ) async {
    final storage = MemorySessionStorage();
    await pumpApp(tester, storage);
    await tapText(tester, 'Passer');
    await tapText(tester, 'Se connecter');
    expect(find.byKey(const ValueKey('login-email')), findsOneWidget);
  });

  testWidgets('session restaurée : accueil V6 puis paramètres', (
    tester,
  ) async {
    await pumpApp(tester, MemorySessionStorage(buildSession()));
    expect(find.text('Aperçu du jour'), findsOneWidget);
    expect(find.text('Ventes du jour'), findsOneWidget);
    expect(find.text('Solde en caisse'), findsOneWidget);
    await tester.scrollUntilVisible(
      find.text('Activité récente'),
      300,
      scrollable: find.byType(Scrollable).first,
    );
    expect(find.text('Activité récente'), findsOneWidget);
    expect(find.bySemanticsLabel('Ventes'), findsOneWidget);
    expect(find.bySemanticsLabel('Stock'), findsOneWidget);
    await tester.tap(find.bySemanticsLabel('Paramètres'));
    await tester.pumpAndSettle();
    expect(find.text('Adresse email'), findsOneWidget);
  });

  testWidgets('à propos affiche la version et des actions en français', (
    tester,
  ) async {
    await pumpApp(tester, MemorySessionStorage(buildSession()));
    await tester.tap(find.bySemanticsLabel('Paramètres'));
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(
      find.text('À propos de KubaGest'),
      300,
      scrollable: find.byType(Scrollable).last,
    );
    await tapText(tester, 'À propos de KubaGest');
    expect(find.text('0.1.0+1'), findsOneWidget);
    expect(find.text('Licences'), findsOneWidget);
    expect(find.text('Fermer'), findsOneWidget);
    expect(find.text('View licenses'), findsNothing);
    expect(find.text('Close'), findsNothing);
    await tapText(tester, 'Fermer');
    expect(find.text('À propos de KubaGest'), findsOneWidget);
  });

  testWidgets(
    'la déconnexion demande confirmation et préserve le parcours déjà vu',
    (tester) async {
      final storage = MemorySessionStorage(buildSession())
        ..introductionSeen = true;
      await pumpApp(tester, storage);
      await tester.tap(find.byKey(const ValueKey('home-profile-avatar')));
      await tester.pumpAndSettle();
      await tester.scrollUntilVisible(
        find.text('Se déconnecter'),
        300,
        scrollable: find.byType(Scrollable).last,
      );
      await tapText(tester, 'Se déconnecter');
      await tester.pumpAndSettle();
      await tapText(tester, 'Rester connecté');
      expect(storage.session, isNotNull);
      await tapText(tester, 'Se déconnecter');
      await tester.pumpAndSettle();
      await tapText(tester, 'Se déconnecter');
      expect(storage.session, isNull);
      expect(storage.clearCount, 1);
      expect(find.text('Créer mon commerce'), findsOneWidget);
    },
  );

  testWidgets('aide : contrôle réel injectable de la connexion', (
    tester,
  ) async {
    await pumpApp(tester, MemorySessionStorage());
    await tester.tap(find.byTooltip('Aide et connexion'));
    await tester.pumpAndSettle();
    await tapText(tester, 'Vérifier la connexion');
    expect(find.text('Le serveur est accessible.'), findsOneWidget);
  });

  testWidgets(
    'la présentation peut être revue sans effacer son état mémorisé',
    (tester) async {
      final storage = MemorySessionStorage()..introductionSeen = true;
      await pumpApp(tester, storage);
      await tester.tap(find.byTooltip('Aide et connexion'));
      await tester.pumpAndSettle();
      await tapText(tester, 'Revoir la présentation');
      expect(
        find.text('Gérer votre commerce,\nl’esprit tranquille.'),
        findsOneWidget,
      );
      expect(storage.introductionSeen, isTrue);
      expect(storage.session, isNull);
    },
  );

  Future<void> pumpRegister(
    WidgetTester tester, {
    required RegistrationSubmit submit,
    required FutureOr<void> Function(dynamic) authenticated,
  }) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: buildKubaTheme(),
        home: RegisterScreen(onAuthenticated: authenticated, submit: submit),
      ),
    );
    await tester.pumpAndSettle();
  }

  Future<void> businessSteps(WidgetTester tester) async {
    await tapText(tester, 'Pharmacie');
    await tapText(tester, 'Continuer');
    await tester.enterText(
      find.byKey(const ValueKey('register-name')),
      'Pharmacie Gombe',
    );
    await tapText(tester, 'Continuer');
  }

  Future<void> fillAccount(
    WidgetTester tester, {
    String confirmation = 'Secret123!',
  }) async {
    await tester.enterText(
      find.byKey(const ValueKey('register-first-name')),
      'Amina',
    );
    await tester.enterText(
      find.byKey(const ValueKey('register-last-name')),
      'Kabasele',
    );
    await tester.enterText(
      find.byKey(const ValueKey('register-email')),
      'pharma@kubagest.io',
    );
    await tester.enterText(
      find.byKey(const ValueKey('register-password')),
      'Secret123!',
    );
    await tester.enterText(
      find.byKey(const ValueKey('register-confirmation')),
      confirmation,
    );
  }

  Map<String, dynamic> response(
    String tenantName,
    String activity,
    String currency,
    String email,
  ) => {
    'accessToken': 'jeton',
    'user': {'id': 'u1', 'email': email},
    'context': {
      'tenantId': 't1',
      'tenantName': tenantName,
      'currency': currency,
      'activityType': activity,
      'role': 'owner',
      'establishmentId': 'e1',
    },
  };

  testWidgets(
    'inscription par étapes conserve activité et devise et appelle le serveur une seule fois',
    (tester) async {
      var calls = 0;
      final storage = MemorySessionStorage();
      await pumpRegister(
        tester,
        authenticated: (session) => storage.save(session),
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
              expect(activityType, 'pharmacie');
              expect(currency, 'CDF');
              return response(tenantName, activityType, currency, email);
            },
      );
      await businessSteps(tester);
      expect(calls, 0);
      await fillAccount(tester);
      await tapText(tester, 'Créer mon commerce');
      expect(calls, 1);
      expect(storage.session?.context?.tenantName, 'Pharmacie Gombe');
    },
  );

  testWidgets('le retour conserve les informations du commerce', (
    tester,
  ) async {
    await pumpRegister(
      tester,
      authenticated: (_) {},
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
          }) async => {},
    );
    await businessSteps(tester);
    await tester.tap(find.byTooltip('Retour'));
    await tester.pumpAndSettle();
    expect(
      tester
          .widget<TextFormField>(find.byKey(const ValueKey('register-name')))
          .controller!
          .text,
      'Pharmacie Gombe',
    );
  });

  testWidgets(
    'une activité doit être choisie et un nom valide est obligatoire',
    (tester) async {
      await pumpRegister(
        tester,
        authenticated: (_) {},
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
            }) async => {},
      );
      await tapText(tester, 'Continuer');
      expect(
        find.text('Choisissez le type de votre commerce pour continuer.'),
        findsOneWidget,
      );
      await tapText(tester, 'Boutique');
      await tapText(tester, 'Continuer');
      await tapText(tester, 'Continuer');
      expect(find.text('Le nom du commerce est obligatoire.'), findsOneWidget);
    },
  );

  testWidgets('deux mots de passe différents bloquent la création', (
    tester,
  ) async {
    var submitted = false;
    await pumpRegister(
      tester,
      authenticated: (_) {},
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
            submitted = true;
            return {};
          },
    );
    await businessSteps(tester);
    await fillAccount(tester, confirmation: 'Autre123!');
    await tapText(tester, 'Créer mon commerce');
    expect(
      find.text('Les deux mots de passe ne correspondent pas.'),
      findsOneWidget,
    );
    expect(submitted, isFalse);
  });

  testWidgets(
    'un échec de stockage après création ne recrée pas le commerce au nouvel essai',
    (tester) async {
      var calls = 0;
      var saves = 0;
      await pumpRegister(
        tester,
        authenticated: (_) async {
          if (saves++ == 0) throw Exception('Stockage indisponible');
        },
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
              return response(tenantName, activityType, currency, email);
            },
      );
      await businessSteps(tester);
      await fillAccount(tester);
      await tapText(tester, 'Créer mon commerce');
      expect(find.text('Ouvrir mon espace'), findsOneWidget);
      await tapText(tester, 'Ouvrir mon espace');
      expect(calls, 1);
      expect(saves, 2);
    },
  );

  testWidgets(
    'petit écran et grands caractères : présentation défilable sans débordement',
    (tester) async {
      tester.view.physicalSize = const Size(320, 640);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.reset);
      final dispatcher = tester.platformDispatcher;
      dispatcher.textScaleFactorTestValue = 1.6;
      addTearDown(dispatcher.clearTextScaleFactorTestValue);
      await pumpApp(tester, MemorySessionStorage());
      expect(tester.takeException(), isNull);
      await tapText(tester, 'Passer');
      expect(tester.takeException(), isNull);
    },
  );
}
