import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'auth_session.dart';

/// Contrat de persistance de session, pour permettre un remplacement en test.
abstract class SessionStorage {
  Future<AuthSession?> read();
  Future<void> save(AuthSession session);
  Future<void> clear();
}

abstract class IntroductionStorage {
  Future<bool> hasSeenIntroduction();
  Future<void> completeIntroduction();
}

/// Email proposé au prochain écran de connexion. Jamais le mot de passe.
abstract class RememberedEmailStorage {
  Future<String?> readRememberedEmail();
  Future<void> saveRememberedEmail(String email);
  Future<void> clearRememberedEmail();
}

/// Conservation de la session sur l'appareil.
///
/// Le jeton est écrit dans le magasin chiffré du système : Keystore côté
/// Android, Keychain côté iOS. Aucun mot de passe n'est conservé.
class TokenStore
    implements SessionStorage, IntroductionStorage, RememberedEmailStorage {
  TokenStore({FlutterSecureStorage? storage})
    : _storage =
          storage ??
          const FlutterSecureStorage(
            // Android : AES-GCM avec clé protégée par le Keystore.
            // iOS : Keychain accessible après le premier déverrouillage.
            iOptions: IOSOptions(
              accessibility: KeychainAccessibility.first_unlock,
            ),
          );

  static const _sessionKey = 'kubagest.session';
  static const _introductionKey = 'kubagest.introduction.v1';
  static const _rememberedEmailKey = 'kubagest.remembered-email';

  final FlutterSecureStorage _storage;

  @override
  Future<bool> hasSeenIntroduction() async =>
      await _storage.read(key: _introductionKey) == 'complete';

  @override
  Future<void> completeIntroduction() =>
      _storage.write(key: _introductionKey, value: 'complete');

  @override
  Future<AuthSession?> read() async {
    final raw = await _storage.read(key: _sessionKey);
    if (raw == null || raw.isEmpty) {
      return null;
    }
    try {
      final decoded = jsonDecode(raw);
      if (decoded is! Map<String, dynamic>) {
        return null;
      }
      return AuthSession.fromJson(decoded);
    } on FormatException {
      // Entrée illisible (format changé, écriture interrompue) : on repart
      // d'une session vide plutôt que de bloquer l'application.
      await clear();
      return null;
    }
  }

  @override
  Future<void> save(AuthSession session) =>
      _storage.write(key: _sessionKey, value: jsonEncode(session.toJson()));

  @override
  Future<void> clear() => _storage.delete(key: _sessionKey);

  @override
  Future<String?> readRememberedEmail() async {
    final email = await _storage.read(key: _rememberedEmailKey);
    if (email == null || email.trim().isEmpty) return null;
    return email.trim();
  }

  @override
  Future<void> saveRememberedEmail(String email) =>
      _storage.write(key: _rememberedEmailKey, value: email.trim());

  @override
  Future<void> clearRememberedEmail() =>
      _storage.delete(key: _rememberedEmailKey);
}
