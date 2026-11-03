import '../../core/api/rest_client.dart';

class StockLine {
  const StockLine({
    required this.productId,
    required this.sku,
    required this.name,
    required this.baseUnit,
    required this.reorderLevel,
    required this.quantity,
    required this.belowThreshold,
  });

  final String productId;
  final String sku;
  final String name;
  final String baseUnit;
  final int reorderLevel;
  final int quantity;
  final bool belowThreshold;

  bool get outOfStock => quantity <= 0;

  factory StockLine.fromJson(Map<String, dynamic> json) => StockLine(
    productId: json['productId'] as String? ?? '',
    sku: json['sku'] as String? ?? '',
    name: json['name'] as String? ?? 'Article',
    baseUnit: json['baseUnit'] as String? ?? '',
    reorderLevel: (json['reorderLevel'] as num?)?.toInt() ?? 0,
    quantity: (json['quantityBase'] as num?)?.toInt() ?? 0,
    belowThreshold: json['belowThreshold'] == true,
  );
}

/// Stock disponible et réceptions, abstraits pour les tests.
abstract class StockGateway {
  Future<List<StockLine>> lines();

  Future<StockLine> receive({
    required String productId,
    required int quantity,
    String? reference,
  });
}

class StockApi implements StockGateway {
  StockApi({required String token, RestClient? client})
    : _client = client ?? RestClient(token: token);

  final RestClient _client;

  @override
  Future<List<StockLine>> lines() async {
    final data = await _client.request('GET', 'stock');
    return [
      for (final row in data as List)
        StockLine.fromJson(Map<String, dynamic>.from(row as Map)),
    ];
  }

  @override
  Future<StockLine> receive({
    required String productId,
    required int quantity,
    String? reference,
  }) async {
    final data = await _client.request(
      'POST',
      'stock/entries',
      body: {
        'productId': productId,
        'quantity': quantity,
        if (reference != null && reference.trim().isNotEmpty)
          'reference': reference.trim(),
      },
    );
    return StockLine.fromJson(Map<String, dynamic>.from(data as Map));
  }
}
