import '../../core/api/rest_client.dart';
import '../credits/credit_api.dart' show decimalAmount, francs;

/// Ligne envoyée au serveur : le prix n'est jamais transmis, il vient du
/// catalogue.
class SaleLineInput {
  const SaleLineInput({
    required this.productId,
    required this.packagingId,
    required this.quantity,
  });

  final String productId;
  final String packagingId;
  final int quantity;
}

class SaleReceiptLine {
  const SaleReceiptLine({
    required this.name,
    required this.packaging,
    required this.quantity,
    required this.quantityBase,
    required this.unitPrice,
    required this.lineTotal,
  });

  final String name;
  final String packaging;
  final int quantity;
  final int quantityBase;
  final int unitPrice;
  final int lineTotal;

  factory SaleReceiptLine.fromJson(Map<String, dynamic> json) =>
      SaleReceiptLine(
        name: json['name'] as String? ?? 'Article',
        packaging: json['packaging'] as String? ?? '',
        quantity: (json['quantity'] as num?)?.toInt() ?? 0,
        quantityBase: (json['quantityBase'] as num?)?.toInt() ?? 0,
        unitPrice: francs(json['unitPrice']),
        lineTotal: francs(json['lineTotal']),
      );
}

/// Ticket tel que le serveur l'a écrit.
class SaleReceipt {
  const SaleReceipt({
    required this.id,
    required this.number,
    required this.channel,
    required this.total,
    required this.received,
    required this.change,
    required this.registerName,
    required this.customerName,
    required this.creditNumber,
    required this.creditDueDate,
    required this.postedAt,
    required this.items,
  });

  final String id;
  final String number;
  final String channel;
  final int total;
  final int? received;
  final int? change;
  final String? registerName;
  final String? customerName;
  final String? creditNumber;
  final DateTime? creditDueDate;
  final DateTime postedAt;
  final List<SaleReceiptLine> items;

  bool get isCredit => channel == 'credit';

  factory SaleReceipt.fromJson(Map<String, dynamic> json) {
    final credit = json['credit'];
    final creditMap = credit is Map
        ? Map<String, dynamic>.from(credit)
        : const <String, dynamic>{};
    return SaleReceipt(
      id: json['id'] as String? ?? '',
      number: json['number'] as String? ?? '',
      channel: json['channel'] as String? ?? 'cash',
      total: francs(json['total']),
      received: json['received'] == null ? null : francs(json['received']),
      change: json['change'] == null ? null : francs(json['change']),
      registerName: json['registerName'] as String?,
      customerName: json['customerName'] as String?,
      creditNumber: creditMap['number'] as String?,
      creditDueDate: DateTime.tryParse(
        creditMap['dueDate']?.toString() ?? '',
      ),
      postedAt:
          DateTime.tryParse(json['postedAt']?.toString() ?? '') ??
          DateTime.now(),
      items: [
        for (final item in (json['items'] as List? ?? const []))
          if (item is Map)
            SaleReceiptLine.fromJson(Map<String, dynamic>.from(item)),
      ],
    );
  }
}

/// Écriture des tickets, abstraite pour les tests.
abstract class SaleGateway {
  Future<SaleReceipt> createSale({
    required List<SaleLineInput> items,
    required String channel,
    int? received,
    String? customerId,
    DateTime? dueDate,
  });

  Future<List<SaleReceipt>> recent({int limit});
}

class SalesApi implements SaleGateway {
  SalesApi({required String token, RestClient? client})
    : _client = client ?? RestClient(token: token);

  final RestClient _client;

  @override
  Future<SaleReceipt> createSale({
    required List<SaleLineInput> items,
    required String channel,
    int? received,
    String? customerId,
    DateTime? dueDate,
  }) async {
    final payload = <String, Object?>{
      'channel': channel,
      'items': [
        for (final item in items)
          {
            'productId': item.productId,
            'packagingId': item.packagingId,
            'quantity': item.quantity,
          },
      ],
    };
    if (received != null) payload['received'] = decimalAmount(received);
    if (customerId != null) payload['customerId'] = customerId;
    if (dueDate != null) payload['dueDate'] = _date(dueDate);

    final data = await _client.request('POST', 'sales', body: payload);
    return SaleReceipt.fromJson(Map<String, dynamic>.from(data as Map));
  }

  @override
  Future<List<SaleReceipt>> recent({int limit = 20}) async {
    final data = await _client.request(
      'GET',
      'sales',
      query: {'limit': '$limit'},
    );
    return [
      for (final row in data as List)
        SaleReceipt.fromJson(Map<String, dynamic>.from(row as Map)),
    ];
  }

  String _date(DateTime date) =>
      '${date.year.toString().padLeft(4, '0')}-'
      '${date.month.toString().padLeft(2, '0')}-'
      '${date.day.toString().padLeft(2, '0')}';
}
