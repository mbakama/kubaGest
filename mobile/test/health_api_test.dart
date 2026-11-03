import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:kubagest_mobile/core/api/health_api.dart';

void main() {
  late HttpServer server;
  late HealthApi api;

  setUp(() async {
    server = await HttpServer.bind(InternetAddress.loopbackIPv4, 0);
    api = HealthApi(
      healthEndpoint: Uri.parse(
        'http://127.0.0.1:${server.port}/api/v1/health',
      ),
    );
  });

  tearDown(() async => server.close(force: true));

  test('accepte une API et une base disponibles', () async {
    server.listen((request) async {
      expect(request.uri.path, '/api/v1/health');
      request.response.headers.contentType = ContentType.json;
      request.response.write('{"status":"ok","database":"ok"}');
      await request.response.close();
    });
    await api.check();
  });

  test('refuse une base indisponible même avec HTTP 200', () async {
    server.listen((request) async {
      request.response.write('{"status":"ok","database":"unavailable"}');
      await request.response.close();
    });
    await expectLater(api.check(), throwsFormatException);
  });

  test('refuse une réponse HTTP 503', () async {
    server.listen((request) async {
      request.response.statusCode = HttpStatus.serviceUnavailable;
      await request.response.close();
    });
    await expectLater(api.check(), throwsA(isA<HttpException>()));
  });
}
