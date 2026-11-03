import 'dart:async';
import 'dart:convert';
import 'dart:io';

import '../../core/api/api_exception.dart';
import '../../core/config/api_config.dart';

/// Partie entière d'un montant décimal de l'API, en francs.
int francs(Object? value) {
  if (value == null) return 0;
  final raw = value.toString().trim();
  if (raw.isEmpty) return 0;
  final whole = raw.split('.').first.replaceAll(RegExp(r'[^0-9-]'), '');
  return int.tryParse(whole) ?? 0;
}

/// Chaîne décimale attendue par l'API (`1234.000000`).
String decimalAmount(int amount) => '$amount.000000';

class CreditCustomer {
  const CreditCustomer({
    required this.id,
    required this.name,
    required this.phone,
    required this.creditLimit,
    required this.outstanding,
    required this.available,
    required this.hasLateCredit,
  });

  final String id;
  final String name;
  final String? phone;
  final int creditLimit;
  final int outstanding;
  final int available;
  final bool hasLateCredit;

  factory CreditCustomer.fromJson(Map<String, dynamic> json) => CreditCustomer(
    id: json['id'] as String,
    name: json['name'] as String? ?? 'Client',
    phone: json['phone'] as String?,
    creditLimit: francs(json['creditLimit']),
    outstanding: francs(json['outstanding']),
    available: francs(json['available']),
    hasLateCredit: json['hasLateCredit'] == true,
  );
}

class CreditPayment {
  const CreditPayment({
    required this.id,
    required this.amount,
    required this.method,
    required this.paidAt,
  });

  final String id;
  final int amount;
  final String method;
  final DateTime paidAt;

  factory CreditPayment.fromJson(Map<String, dynamic> json) => CreditPayment(
    id: json['id'] as String,
    amount: francs(json['amount']),
    method: json['method'] as String? ?? 'cash',
    paidAt:
        DateTime.tryParse(json['paidAt']?.toString() ?? '') ?? DateTime.now(),
  );
}

class CreditEntry {
  const CreditEntry({
    required this.id,
    required this.number,
    required this.customerId,
    required this.customerName,
    required this.total,
    required this.paidTotal,
    required this.remaining,
    required this.dueDate,
    required this.daysLate,
    required this.status,
    required this.payments,
  });

  final String id;
  final String number;
  final String customerId;
  final String customerName;
  final int total;
  final int paidTotal;
  final int remaining;
  final DateTime? dueDate;
  final int? daysLate;
  final String status;
  final List<CreditPayment> payments;

  bool get isOpen => status == 'open';
  bool get isLate => daysLate != null;

  factory CreditEntry.fromJson(Map<String, dynamic> json) => CreditEntry(
    id: json['id'] as String,
    number: json['number'] as String? ?? '',
    customerId: json['customerId'] as String? ?? '',
    customerName: json['customerName'] as String? ?? 'Client',
    total: francs(json['total']),
    paidTotal: francs(json['paidTotal']),
    remaining: francs(json['remaining']),
    dueDate: DateTime.tryParse(json['dueDate']?.toString() ?? ''),
    daysLate: (json['daysLate'] as num?)?.toInt(),
    status: json['status'] as String? ?? 'open',
    payments: [
      for (final payment in (json['payments'] as List? ?? const []))
        if (payment is Map)
          CreditPayment.fromJson(Map<String, dynamic>.from(payment)),
    ],
  );
}

class CreditSummary {
  const CreditSummary({
    required this.outstanding,
    required this.openCount,
    required this.lateCount,
    required this.lateAmount,
  });

  final int outstanding;
  final int openCount;
  final int lateCount;
  final int lateAmount;

  factory CreditSummary.fromJson(Map<String, dynamic> json) => CreditSummary(
    outstanding: francs(json['outstanding']),
    openCount: (json['openCount'] as num?)?.toInt() ?? 0,
    lateCount: (json['lateCount'] as num?)?.toInt() ?? 0,
    lateAmount: francs(json['lateAmount']),
  );
}

/// Accès au carnet de crédit, abstrait pour les tests.
abstract class CreditGateway {
  Future<List<CreditCustomer>> customers({String query});

  Future<CreditCustomer> createCustomer({
    required String name,
    String? phone,
    required int creditLimit,
  });

  Future<List<CreditEntry>> credits({String status});

  Future<CreditEntry> createCredit({
    required String customerId,
    required int total,
    DateTime? dueDate,
  });

  Future<CreditEntry> recordPayment(
    String creditId, {
    required int amount,
    String method = 'cash',
  });

  Future<CreditSummary> summary();
}

class CreditApi implements CreditGateway {
  CreditApi({required this.token});

  final String token;

  @override
  Future<List<CreditCustomer>> customers({String query = ''}) async {
    final data = await _request(
      'GET',
      'customers',
      query: query.trim().isEmpty ? null : {'query': query.trim()},
    );
    return [
      for (final row in data as List)
        CreditCustomer.fromJson(Map<String, dynamic>.from(row as Map)),
    ];
  }

  @override
  Future<CreditCustomer> createCustomer({
    required String name,
    String? phone,
    required int creditLimit,
  }) async {
    final data = await _request(
      'POST',
      'customers',
      body: {
        'name': name,
        if (phone != null && phone.trim().isNotEmpty) 'phone': phone.trim(),
        'creditLimit': decimalAmount(creditLimit),
      },
    );
    return CreditCustomer.fromJson(Map<String, dynamic>.from(data as Map));
  }

  @override
  Future<List<CreditEntry>> credits({String status = 'open'}) async {
    final data = await _request('GET', 'credits', query: {'status': status});
    return [
      for (final row in data as List)
        CreditEntry.fromJson(Map<String, dynamic>.from(row as Map)),
    ];
  }

  @override
  Future<CreditEntry> createCredit({
    required String customerId,
    required int total,
    DateTime? dueDate,
  }) async {
    final data = await _request(
      'POST',
      'credits',
      body: {
        'customerId': customerId,
        'total': decimalAmount(total),
        if (dueDate != null) 'dueDate': _date(dueDate),
      },
    );
    return CreditEntry.fromJson(Map<String, dynamic>.from(data as Map));
  }

  @override
  Future<CreditEntry> recordPayment(
    String creditId, {
    required int amount,
    String method = 'cash',
  }) async {
    final data = await _request(
      'POST',
      'credits/$creditId/payments',
      body: {'amount': decimalAmount(amount), 'method': method},
    );
    return CreditEntry.fromJson(Map<String, dynamic>.from(data as Map));
  }

  @override
  Future<CreditSummary> summary() async {
    final data = await _request('GET', 'credits/summary');
    return CreditSummary.fromJson(Map<String, dynamic>.from(data as Map));
  }

  String _date(DateTime date) =>
      '${date.year.toString().padLeft(4, '0')}-'
      '${date.month.toString().padLeft(2, '0')}-'
      '${date.day.toString().padLeft(2, '0')}';

  Future<Object?> _request(
    String method,
    String resource, {
    Map<String, String>? query,
    Map<String, Object?>? body,
  }) async {
    var uri = ApiConfig.endpoint(resource);
    if (query != null) uri = uri.replace(queryParameters: query);
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
          final message = payload is Map
              ? payload['message']?.toString()
              : null;
          throw ApiException(
            response.statusCode,
            message ??
                switch (response.statusCode) {
                  401 => 'Votre session a expiré. Reconnectez-vous.',
                  403 => 'Vous ne pouvez pas faire cette opération.',
                  _ => 'L’opération n’a pas abouti. Réessayez.',
                },
          );
        }
        return payload;
      })().timeout(const Duration(seconds: 15));
    } on SocketException {
      throw const ApiException.network(
        'Serveur injoignable. Vérifiez votre connexion.',
      );
    } on TimeoutException {
      throw const ApiException.network(
        'Le serveur met trop de temps à répondre.',
      );
    } on FormatException {
      throw const ApiException.network(
        'La réponse du serveur est illisible. Réessayez.',
      );
    } finally {
      client.close(force: true);
    }
  }
}
