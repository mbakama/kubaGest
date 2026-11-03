import '../catalog/catalog_api.dart';

/// Moyen choisi au comptoir.
enum TenderMethod { cash, mobile, credit }

/// Article vendable : un conditionnement et son prix.
class CounterArticle {
  const CounterArticle({
    required this.id,
    required this.name,
    required this.packaging,
    required this.unitPrice,
    this.barcode = '',
    this.sku = '',
    this.productId = '',
    this.packagingId = '',
    this.factorToBase = 1,
  });

  final String id;
  final String name;
  final String packaging;
  final int unitPrice;
  final String barcode;
  final String sku;

  /// Identifiants serveur, nécessaires pour écrire la vente.
  final String productId;
  final String packagingId;

  /// Nombre d'unités de base dans un conditionnement.
  final int factorToBase;

  bool get sellable => productId.isNotEmpty && packagingId.isNotEmpty;

  bool matches(String query) {
    final needle = query.trim().toLowerCase();
    if (needle.isEmpty) return false;
    return name.toLowerCase().contains(needle) ||
        packaging.toLowerCase().contains(needle) ||
        barcode.toLowerCase().contains(needle) ||
        sku.toLowerCase().contains(needle);
  }

  /// Un article par conditionnement actif, avec son prix entier.
  static List<CounterArticle> fromCatalog(Map<String, dynamic> product) {
    if (product['isActive'] == false) return const [];
    final name = product['name'];
    if (name is! String || name.trim().isEmpty) return const [];
    final packagings = product['packagings'];
    if (packagings is! List) return const [];
    final barcodes = product['barcodes'];
    final sku = product['sku'] is String ? product['sku'] as String : '';
    final productId = product['id']?.toString() ?? name;
    final articles = <CounterArticle>[];
    for (final raw in packagings) {
      if (raw is! Map) continue;
      final packaging = Map<String, dynamic>.from(raw);
      if (packaging['isActive'] == false) continue;
      final price = wholeFrancs(packaging['salePrice']);
      if (price == null) continue;
      final packagingId =
          packaging['id']?.toString() ?? packaging['label']?.toString() ?? '';
      final factor = (packaging['factorToBase'] as num?)?.toInt() ?? 1;
      var barcode = '';
      if (barcodes is List) {
        for (final code in barcodes) {
          if (code is Map && code['packagingId']?.toString() == packagingId) {
            barcode = code['code']?.toString() ?? '';
            break;
          }
        }
      }
      articles.add(
        CounterArticle(
          id: '$productId:$packagingId',
          name: name.trim(),
          packaging: packaging['label']?.toString() ?? '',
          unitPrice: price,
          barcode: barcode,
          sku: sku,
          productId: product['id']?.toString() ?? '',
          packagingId: packaging['id']?.toString() ?? '',
          factorToBase: factor > 0 ? factor : 1,
        ),
      );
    }
    return articles;
  }
}

/// Partie entière d'un prix catalogue, en francs.
int? wholeFrancs(Object? value) {
  if (value == null) return null;
  final raw = value.toString().trim();
  if (raw.isEmpty || raw.startsWith('-')) return null;
  final whole = raw.split('.').first.replaceAll(RegExp(r'[^0-9]'), '');
  if (whole.isEmpty) return null;
  return int.tryParse(whole);
}

/// Montant tapé par le caissier. Vide si rien n'a été saisi.
int? parseTender(String raw) {
  final digits = raw.replaceAll(RegExp(r'[^0-9]'), '');
  if (digits.isEmpty) return null;
  return int.tryParse(digits);
}

/// Différence entre ce que le client remet et le total du panier.
class CashBalance {
  const CashBalance({required this.total, required this.received});

  final int total;
  final int? received;

  /// Positif : monnaie à rendre. Négatif : il manque. Null : rien de saisi.
  int? get difference => received == null ? null : received! - total;

  bool get short => difference != null && difference! < 0;

  bool get ready => total > 0 && difference != null && difference! >= 0;
}

Future<List<CounterArticle>> loadCounterArticles(String token) async {
  final rows = await CatalogApi().load(token);
  return [for (final row in rows) ...CounterArticle.fromCatalog(row)];
}
