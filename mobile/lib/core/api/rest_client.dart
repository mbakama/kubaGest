import 'dart:async';
import 'dart:convert';
import 'dart:io';

import '../config/api_config.dart';
import 'api_exception.dart';

/// Appels HTTP authentifiés de l'espace commerce.
///
/// Le jeton n'est jamais passé en paramètre d'URL. Toute erreur du serveur est
/// traduite en message lisible pour le comptoir.
class RestClient {
  RestClient({required this.token});

  final String token;

  Future<Object?> request(
    String method,
    String resource, {
    Map<String, String>? query,
    Map<String, Object?>? body,
  }) async {
    var uri = ApiConfig.endpoint(resource);
    if (query != null && query.isNotEmpty) {
      uri = uri.replace(queryParameters: query);
    }
    final client = HttpClient();
    try {
      return await (() async {
        final request = await client.openUrl(method, uri);
        request.headers.set(HttpHeaders.authorizationHeader, 'Bearer $token');
        request.headers.set(HttpHeaders.acceptHeader, 'application/json');
        if (body != null) {
          request.headers.contentType = ContentType.json;
          request.write(jsonEncode(body));
        }
        final response = await request.close();
        final raw = await utf8.decoder.bind(response).join();
        final payload = raw.isEmpty ? null : jsonDecode(raw);
        if (response.statusCode < 200 || response.statusCode >= 300) {
          final message = payload is Map ? payload['message']?.toString() : null;
          throw ApiException(
            response.statusCode,
            message ??
                switch (response.statusCode) {
                  401 => 'Votre session a expiré. Reconnectez-vous.',
                  403 => 'Vous ne pouvez pas faire cette opération.',
                  409 => 'L’opération est impossible dans l’état actuel.',
                  _ => 'L’opération n’a pas abouti. Réessayez.',
                },
          );
        }
        return payload;
      })().timeout(const Duration(seconds: 20));
    } on SocketException {
      throw const ApiException.network(
        'Serveur injoignable. Vérifiez votre connexion.',
      );
    } on TimeoutException {
      throw const ApiException.network(
        'Le serveur met trop de temps à répondre.',
      );
    } on HandshakeException {
      throw const ApiException.network('Connexion sécurisée impossible.');
    } on FormatException {
      throw const ApiException.network(
        'La réponse du serveur est illisible. Réessayez.',
      );
    } finally {
      client.close(force: true);
    }
  }
}
