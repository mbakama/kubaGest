import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kubagest_mobile/core/auth/avatar_vault.dart';
import 'package:kubagest_mobile/core/media/avatar_picker.dart';
import 'package:kubagest_mobile/core/theme/kuba_theme.dart';
import 'package:kubagest_mobile/features/auth/register_screen.dart';

/// PNG 1 × 1 valide : suffisant pour vérifier l'aperçu sans dépendre d'un
/// fichier de l'appareil.
final _photo = base64Decode(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGA'
  'hKmMIQAAAABJRU5ErkJggg==',
);

class _FakeAvatarPicker implements AvatarPicker {
  _FakeAvatarPicker([this.bytes]);

  final Uint8List? bytes;
  int calls = 0;
  AvatarSource? lastSource;

  @override
  Future<Uint8List?> pick(AvatarSource source) async {
    calls++;
    lastSource = source;
    return bytes;
  }
}

RegistrationSubmit _submit() =>
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
    }) async => {
      'accessToken': 'jeton',
      'user': {'id': 'u1', 'email': email},
      'context': {
        'tenantId': 't1',
        'tenantName': tenantName,
        'currency': currency,
        'activityType': activityType,
        'role': 'owner',
      },
    };

void main() {
  tearDown(AvatarVault.instance.clear);

  Future<void> pumpStep3(
    WidgetTester tester, {
    required AvatarPicker picker,
  }) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: buildKubaTheme(),
        home: RegisterScreen(
          onAuthenticated: (_) {},
          submit: _submit(),
          avatarPicker: picker,
        ),
      ),
    );
    await tester.pumpAndSettle();
    await tester.tap(find.text('Boutique'));
    await tester.tap(find.text('Continuer'));
    await tester.pumpAndSettle();
    await tester.enterText(
      find.byKey(const ValueKey('register-name')),
      'Boutique Hector',
    );
    await tester.tap(find.text('Continuer'));
    await tester.pumpAndSettle();
  }

  testWidgets('la photo se choisit dans la galerie et s’affiche en aperçu', (
    tester,
  ) async {
    final picker = _FakeAvatarPicker(_photo);
    await pumpStep3(tester, picker: picker);

    expect(find.text('Votre photo'), findsOneWidget);
    await tester.tap(find.byKey(const ValueKey('register-avatar')));
    await tester.pumpAndSettle();

    expect(find.text('Photo de profil'), findsOneWidget);
    expect(find.text('Prendre une photo'), findsOneWidget);
    expect(find.text('Retirer la photo'), findsNothing);

    await tester.tap(find.text('Choisir dans la galerie'));
    await tester.pumpAndSettle();

    expect(picker.calls, 1);
    expect(picker.lastSource, AvatarSource.gallery);
    expect(find.text('Photo prête'), findsOneWidget);
    expect(AvatarVault.instance.hasPhoto, isTrue);
    expect(
      find.descendant(
        of: find.byKey(const ValueKey('register-avatar')),
        matching: find.byType(Image),
      ),
      findsOneWidget,
    );
  });

  testWidgets('la photo peut être retirée', (tester) async {
    final picker = _FakeAvatarPicker(_photo);
    await pumpStep3(tester, picker: picker);

    await tester.tap(find.byKey(const ValueKey('register-avatar')));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Choisir dans la galerie'));
    await tester.pumpAndSettle();
    expect(find.text('Photo prête'), findsOneWidget);

    await tester.tap(find.byKey(const ValueKey('register-avatar')));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Retirer la photo'));
    await tester.pumpAndSettle();

    expect(find.text('Votre photo'), findsOneWidget);
    expect(AvatarVault.instance.hasPhoto, isFalse);
  });

  testWidgets('une sélection annulée ne change rien', (tester) async {
    final picker = _FakeAvatarPicker();
    await pumpStep3(tester, picker: picker);

    await tester.tap(find.byKey(const ValueKey('register-avatar')));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Prendre une photo'));
    await tester.pumpAndSettle();

    expect(picker.lastSource, AvatarSource.camera);
    expect(find.text('Votre photo'), findsOneWidget);
    expect(AvatarVault.instance.hasPhoto, isFalse);
  });
}
