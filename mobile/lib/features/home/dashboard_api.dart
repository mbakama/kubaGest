import 'dart:async';
import 'dart:convert';
import 'dart:io';

import '../../core/api/api_exception.dart';
import '../../core/config/api_config.dart';
import 'dashboard_snapshot.dart';

class DashboardApi {
  DashboardApi({Uri? endpoint})
    : endpoint = endpoint ?? ApiConfig.endpoint('dashboard');

  final Uri endpoint;

  Future<DashboardSnapshot> load(String token) async {
    final client = HttpClient()
      ..connectionTimeout = const Duration(seconds: 10);
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
              'Vous ne pouvez pas consulter les statistiques de ce commerce.',
            _ => 'Les statistiques sont indisponibles. Réessayez plus tard.',
          });
        }
        final decoded = jsonDecode(body);
        if (decoded is! Map) throw const FormatException();
        return DashboardSnapshot.fromJson(Map<String, dynamic>.from(decoded));
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
        'Les statistiques reçues sont illisibles. Réessayez.',
      );
    } finally {
      client.close(force: true);
    }
  }
}
