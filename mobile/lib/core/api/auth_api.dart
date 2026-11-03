import 'dart:async';
import 'dart:convert';
import 'dart:io';

import '../config/api_config.dart';
import 'api_exception.dart';

/// Appels d'authentification de l'API `/api/v1`.
///
/// Le mot de passe ne quitte jamais la mémoire ; seul le jeton renvoyé est
/// conservé, par `TokenStore`.
class AuthApi {
  AuthApi({
    Uri? loginEndpoint,
    Uri? registerEndpoint,
    Uri? forgotPasswordEndpoint,
    this.timeout = const Duration(seconds: 15),
  }) : _loginEndpoint = loginEndpoint,
       _registerEndpoint = registerEndpoint,
       _forgotPasswordEndpoint = forgotPasswordEndpoint;

  final Uri? _loginEndpoint;
  final Uri? _registerEndpoint;
  final Uri? _forgotPasswordEndpoint;
  final Duration timeout;

  Uri get loginEndpoint => _loginEndpoint ?? ApiConfig.endpoint('auth/login');
  Uri get registerEndpoint =>
      _registerEndpoint ?? ApiConfig.endpoint('auth/register');
  Uri get forgotPasswordEndpoint =>
      _forgotPasswordEndpoint ?? ApiConfig.endpoint('auth/forgot-password');

  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) => _post(loginEndpoint, {'email': email.trim(), 'password': password});

  Future<Map<String, dynamic>> register({
    required String firstName,
    required String lastName,
    required String tenantName,
    required String activityType,
    required String currency,
    required String email,
    required String password,
    String? address,
    String? phone,
  }) => _post(registerEndpoint, {
    'firstName': firstName.trim(),
    'lastName': lastName.trim(),
    'tenantName': tenantName.trim(),
    'activityType': activityType,
    'currency': currency,
    'email': email.trim(),
    'password': password,
    if (address != null && address.trim().isNotEmpty) 'address': address.trim(),
    if (phone != null && phone.trim().isNotEmpty) 'phone': phone.trim(),
  });

  /// Demande un code de nouveau mot de passe. L'API refuse une adresse
  /// inconnue : le message d'erreur est alors affiché tel quel.
  Future<void> requestPasswordReset({required String email}) async {
    await _post(forgotPasswordEndpoint, {'email': email.trim()});
  }

  /// Reconnaît le code reçu par email et renvoie un jeton de changement,
  /// conservé seulement le temps de saisir le nouveau mot de passe.
  Future<String> verifyResetCode({
    required String email,
    required String code,
  }) async {
    final body = await _post(
      ApiConfig.endpoint('auth/forgot-password/verify'),
      {'email': email.trim(), 'code': code.trim()},
    );
    final token = body['resetToken'];
    if (token is! String || token.isEmpty) {
      throw const FormatException('Réponse du serveur illisible.');
    }
    return token;
  }

  Future<void> confirmResetPassword({
    required String resetToken,
    required String password,
  }) async {
    await _post(ApiConfig.endpoint('auth/forgot-password/confirm'), {
      'resetToken': resetToken,
      'password': password,
    });
  }

  Future<Map<String, dynamic>> uploadAvatar({
    required String accessToken,
    required List<int> bytes,
  }) async {
    final media = _avatarMedia(bytes);
    final boundary = 'kubagest-${DateTime.now().microsecondsSinceEpoch}';
    final header = utf8.encode(
      '--$boundary\r\n'
      'Content-Disposition: form-data; name="file"; filename="avatar.${media.extension}"\r\n'
      'Content-Type: ${media.mimeType}\r\n\r\n',
    );
    final footer = utf8.encode('\r\n--$boundary--\r\n');
    final client = HttpClient();
    try {
      final request = await client.postUrl(
        ApiConfig.endpoint('users/me/avatar'),
      );
      request.headers.set(HttpHeaders.acceptHeader, 'application/json');
      request.headers.set(
        HttpHeaders.authorizationHeader,
        'Bearer $accessToken',
      );
      request.headers.set(
        HttpHeaders.contentTypeHeader,
        'multipart/form-data; boundary=$boundary',
      );
      request.contentLength = header.length + bytes.length + footer.length;
      request.add(header);
      request.add(bytes);
      request.add(footer);
      final response = await request.close();
      final body = await utf8.decoder.bind(response).join();
      if (response.statusCode < 200 || response.statusCode >= 300) {
        throw ApiException(
          response.statusCode,
          _messageFor(response.statusCode, body),
        );
      }
      final decoded = jsonDecode(body);
      if (decoded is! Map<String, dynamic>) {
        throw const FormatException('Réponse du serveur illisible.');
      }
      return decoded;
    } finally {
      client.close(force: true);
    }
  }

  ({String mimeType, String extension}) _avatarMedia(List<int> bytes) {
    if (bytes.length >= 8 &&
        bytes[0] == 0x89 &&
        bytes[1] == 0x50 &&
        bytes[2] == 0x4e &&
        bytes[3] == 0x47) {
      return (mimeType: 'image/png', extension: 'png');
    }
    if (bytes.length >= 12 &&
        String.fromCharCodes(bytes.sublist(0, 4)) == 'RIFF' &&
        String.fromCharCodes(bytes.sublist(8, 12)) == 'WEBP') {
      return (mimeType: 'image/webp', extension: 'webp');
    }
    return (mimeType: 'image/jpeg', extension: 'jpg');
  }

  Future<Map<String, dynamic>> deleteAvatar({
    required String accessToken,
  }) async {
    final client = HttpClient();
    try {
      final request = await client.deleteUrl(
        ApiConfig.endpoint('users/me/avatar'),
      );
      request.headers.set(HttpHeaders.acceptHeader, 'application/json');
      request.headers.set(
        HttpHeaders.authorizationHeader,
        'Bearer $accessToken',
      );
      final response = await request.close();
      final body = await utf8.decoder.bind(response).join();
      if (response.statusCode < 200 || response.statusCode >= 300) {
        throw ApiException(
          response.statusCode,
          _messageFor(response.statusCode, body),
        );
      }
      final decoded = jsonDecode(body);
      if (decoded is! Map<String, dynamic>) {
        throw const FormatException('Réponse du serveur illisible.');
      }
      return decoded;
    } finally {
      client.close(force: true);
    }
  }

  Future<Map<String, dynamic>> _post(
    Uri endpoint,
    Map<String, Object?> payload,
  ) async {
    final client = HttpClient()
      ..connectionTimeout = const Duration(seconds: 10);
    try {
      return await (() async {
        final request = await client.postUrl(endpoint);
        request.headers.set(HttpHeaders.acceptHeader, 'application/json');
        request.headers.contentType = ContentType.json;
        request.write(jsonEncode(payload));

        final response = await request.close();
        final body = await utf8.decoder.bind(response).join();

        if (response.statusCode >= 200 && response.statusCode < 300) {
          final decoded = body.isEmpty ? null : jsonDecode(body);
          if (decoded is! Map<String, dynamic>) {
            throw const FormatException('Réponse du serveur illisible.');
          }
          return decoded;
        }

        throw ApiException(
          response.statusCode,
          _messageFor(response.statusCode, body),
        );
      })().timeout(timeout);
    } on SocketException {
      throw const ApiException.network(
        'Serveur injoignable. Vérifiez le réseau et l’adresse de l’API.',
      );
    } on TimeoutException {
      throw const ApiException.network(
        'Le serveur met trop de temps à répondre.',
      );
    } on HandshakeException {
      throw const ApiException.network(
        'Connexion sécurisée impossible avec ce serveur.',
      );
    } finally {
      client.close(force: true);
    }
  }

  /// Traduit une erreur de l'API en message affichable (cahier des charges :
  /// messages en français, sans détail technique).
  String _messageFor(int statusCode, String body) {
    final details = _extractMessage(body);

    switch (statusCode) {
      case 400:
        return details ?? 'Les informations saisies sont invalides.';
      case 401:
        return 'Email ou mot de passe incorrect.';
      case 403:
        return details ??
            'Cet établissement est suspendu ou inaccessible. Contactez le support.';
      case 409:
        return details ?? 'Cette adresse email est déjà utilisée.';
      case 404:
        return details ?? 'Aucun compte n’existe avec cette adresse email.';
      case 429:
        return 'Trop de tentatives. Patientez une minute avant de réessayer.';
      default:
        if (statusCode == 503 && details != null) {
          return details;
        }
        if (statusCode >= 500) {
          return 'Le serveur a rencontré une erreur. Réessayez plus tard.';
        }
        return details ?? 'La demande a échoué ($statusCode).';
    }
  }

  String? _extractMessage(String body) {
    if (body.isEmpty) {
      return null;
    }
    try {
      final decoded = jsonDecode(body);
      if (decoded is! Map<String, dynamic>) {
        return null;
      }
      final message = decoded['message'];
      if (message is String && message.trim().isNotEmpty) {
        return message;
      }
      if (message is List && message.isNotEmpty) {
        // Erreurs de validation : on garde la première, la plus utile.
        final first = message.first;
        if (first is String) {
          return first;
        }
      }
      return null;
    } on FormatException {
      return null;
    }
  }
}
