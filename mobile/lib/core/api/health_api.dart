import 'dart:async';
import 'dart:convert';
import 'dart:io';
import '../config/api_config.dart';

class HealthApi {
  HealthApi({this.healthEndpoint});

  final Uri? healthEndpoint;

  Future<void> check() async {
    final client = HttpClient()
      ..connectionTimeout = const Duration(seconds: 10);
    try {
      await (() async {
        final request = await client.getUrl(
          healthEndpoint ?? ApiConfig.endpoint('health'),
        );
        request.headers.set(HttpHeaders.acceptHeader, 'application/json');
        final response = await request.close();
        if (response.statusCode != HttpStatus.ok) {
          throw const HttpException('Le service est indisponible.');
        }
        final body = jsonDecode(await utf8.decoder.bind(response).join());
        if (body is! Map<String, dynamic> ||
            body['status'] != 'ok' ||
            body['database'] != 'ok') {
          throw const FormatException('Le service n’est pas prêt.');
        }
      })().timeout(const Duration(seconds: 12));
    } finally {
      client.close(force: true);
    }
  }
}
