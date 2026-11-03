import 'dart:async';
import 'dart:convert';
import 'dart:io';
import '../../core/api/api_exception.dart';
import '../../core/config/api_config.dart';

class AccountApi {
  AccountApi({Uri? endpoint})
    : endpoint = endpoint ?? ApiConfig.endpoint('tenants/current');
  final Uri endpoint;

  Future<Map<String, dynamic>> load(String token) async {
    final client = HttpClient();
    try {
      return await (() async {
        final request = await client.getUrl(endpoint);
        request.headers.set(HttpHeaders.authorizationHeader, 'Bearer $token');
        request.headers.set(HttpHeaders.acceptHeader, 'application/json');
        final response = await request.close();
        final body = await utf8.decoder.bind(response).join();
        if (response.statusCode != 200) {
          throw ApiException(response.statusCode, switch (response.statusCode) {
            401 =>
              'Votre session a expiré. Reconnectez-vous depuis votre compte.',
            403 =>
              'Vous ne pouvez pas consulter les informations de ce commerce.',
            _ => 'Le profil du commerce est indisponible. Réessayez plus tard.',
          });
        }
        final data = jsonDecode(body);
        if (data is! Map<String, dynamic>) throw const FormatException();
        return data;
      })().timeout(const Duration(seconds: 15));
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
        'Le profil du commerce reçu est illisible. Réessayez.',
      );
    } finally {
      client.close(force: true);
    }
  }
}
