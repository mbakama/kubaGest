import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:kubagest_mobile/core/api/api_exception.dart';
import 'package:kubagest_mobile/core/api/auth_api.dart';

void main() {
  late HttpServer server;
  late AuthApi api;

  setUp(() async {
    server = await HttpServer.bind(InternetAddress.loopbackIPv4, 0);
    api = AuthApi(
      loginEndpoint: Uri.parse(
        'http://127.0.0.1:${server.port}/api/v1/auth/login',
      ),
      registerEndpoint: Uri.parse(
        'http://127.0.0.1:${server.port}/api/v1/auth/register',
      ),
    );
  });

  tearDown(() async => server.close(force: true));

  test('envoie les identifiants et renvoie le jeton', () async {
    server.listen((request) async {
      expect(request.method, 'POST');
      expect(request.uri.path, '/api/v1/auth/login');
      final body = jsonDecode(await utf8.decoder.bind(request).join());
      expect(body, {'email': 'admin@kubagest.io', 'password': 'Secret123!'});

      request.response.headers.contentType = ContentType.json;
      request.response.write(
        jsonEncode({
          'accessToken': 'jeton',
          'user': {'id': 'u1', 'email': 'admin@kubagest.io'},
          'context': {
            'tenantId': 't1',
            'tenantName': 'Boutique Kintambo',
            'currency': 'CDF',
            'activityType': 'boutique',
            'role': 'owner',
            'establishmentId': 'e1',
          },
        }),
      );
      await request.response.close();
    });

    final body = await api.login(
      email: '  admin@kubagest.io ',
      password: 'Secret123!',
    );

    expect(body['accessToken'], 'jeton');
    expect((body['context'] as Map)['currency'], 'CDF');
  });

  test('traduit un échec 401 en message lisible', () async {
    server.listen((request) async {
      request.response.statusCode = HttpStatus.unauthorized;
      request.response.write(
        jsonEncode({'message': 'Identifiants invalides', 'statusCode': 401}),
      );
      await request.response.close();
    });

    await expectLater(
      api.login(email: 'admin@kubagest.io', password: 'faux'),
      throwsA(
        isA<ApiException>()
            .having((e) => e.statusCode, 'statusCode', 401)
            .having(
              (e) => e.message,
              'message',
              'Email ou mot de passe incorrect.',
            ),
      ),
    );
  });

  test('conserve le message de suspension du serveur', () async {
    server.listen((request) async {
      request.response.statusCode = HttpStatus.forbidden;
      request.response.write(
        jsonEncode({
          'message': 'Cet établissement est suspendu : contactez le support',
          'statusCode': 403,
        }),
      );
      await request.response.close();
    });

    await expectLater(
      api.login(email: 'admin@kubagest.io', password: 'Secret123!'),
      throwsA(
        isA<ApiException>().having(
          (e) => e.message,
          'message',
          contains('suspendu'),
        ),
      ),
    );
  });

  test('remonte la première erreur de validation 400', () async {
    server.listen((request) async {
      request.response.statusCode = HttpStatus.badRequest;
      request.response.write(
        jsonEncode({
          'message': ['email must be an email', 'password too short'],
          'statusCode': 400,
        }),
      );
      await request.response.close();
    });

    await expectLater(
      api.login(email: 'x', password: 'y'),
      throwsA(
        isA<ApiException>().having(
          (e) => e.message,
          'message',
          'email must be an email',
        ),
      ),
    );
  });

  test('signale un serveur injoignable', () async {
    await server.close(force: true);
    server = await HttpServer.bind(InternetAddress.loopbackIPv4, 0);
    final port = server.port;
    await server.close(force: true);

    final unreachable = AuthApi(
      loginEndpoint: Uri.parse('http://127.0.0.1:$port/api/v1/auth/login'),
    );

    await expectLater(
      unreachable.login(email: 'a@b.cd', password: 'motdepasse'),
      throwsA(isA<ApiException>().having((e) => e.isNetwork, 'réseau', true)),
    );
  });

  test('crée un commerce avec ses paramètres d’activation', () async {
    server.listen((request) async {
      expect(request.uri.path, '/api/v1/auth/register');
      final body = jsonDecode(await utf8.decoder.bind(request).join());
      expect(body, {
        'firstName': 'Amina',
        'lastName': 'Ilunga',
        'tenantName': 'Pharmacie Gombe',
        'activityType': 'pharmacie',
        'currency': 'CDF',
        'email': 'pharma@kubagest.io',
        'password': 'Secret123!',
        'address': '12, avenue de la Libération',
      });

      request.response.statusCode = HttpStatus.created;
      request.response.headers.contentType = ContentType.json;
      request.response.write(
        jsonEncode({
          'accessToken': 'jeton',
          'user': {'id': 'u1', 'email': 'pharma@kubagest.io'},
          'context': null,
        }),
      );
      await request.response.close();
    });

    final body = await api.register(
      firstName: 'Amina',
      lastName: 'Ilunga',
      tenantName: 'Pharmacie Gombe',
      activityType: 'pharmacie',
      currency: 'CDF',
      email: 'pharma@kubagest.io',
      password: 'Secret123!',
      address: ' 12, avenue de la Libération ',
    );

    expect(body['accessToken'], 'jeton');
    expect(body['context'], isNull);
  });
}
