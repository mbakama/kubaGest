/// Statistiques d'accueil renvoyées par `GET /api/v1/dashboard`.
class DashboardSnapshot {
  const DashboardSnapshot({
    required this.currency,
    required this.salesAmount,
    required this.salesChange,
    required this.cashAmount,
    required this.cashBadge,
    required this.trendAmount,
    required this.trendChange,
    required this.days,
    required this.activity,
  });

  final String currency;
  final String salesAmount;
  final double? salesChange;
  final String cashAmount;
  final String? cashBadge;
  final String trendAmount;
  final double? trendChange;
  final List<DashboardDay> days;
  final List<DashboardActivity> activity;

  /// Chiffres de la maquette, utilisés seulement quand aucun appel n'est branché.
  factory DashboardSnapshot.preview(String currency) => DashboardSnapshot(
    currency: currency,
    salesAmount: '245000.000000',
    salesChange: 12,
    cashAmount: '180500.000000',
    cashBadge: 'À jour',
    trendAmount: '1240000.000000',
    trendChange: 8.4,
    days: const [
      DashboardDay('Lun', '34.000000'),
      DashboardDay('Mar', '49.000000'),
      DashboardDay('Mer', '54.000000'),
      DashboardDay('Jeu', '41.000000'),
      DashboardDay('Ven', '69.000000'),
      DashboardDay('Sam', '45.000000'),
      DashboardDay('Dim', '29.000000'),
    ],
    activity: const [
      DashboardActivity(
        title: 'Vente Nº 1048',
        subtitle: 'Il y a 5 min · Espèces',
        amount: '25000.000000',
        label: null,
        warning: false,
      ),
      DashboardActivity(
        title: 'Stock faible',
        subtitle: 'Huile végétale · 3 restants',
        amount: null,
        label: 'À vérifier',
        warning: true,
      ),
    ],
  );

  factory DashboardSnapshot.empty(String currency) => DashboardSnapshot(
    currency: currency,
    salesAmount: '0.000000',
    salesChange: null,
    cashAmount: '0.000000',
    cashBadge: null,
    trendAmount: '0.000000',
    trendChange: null,
    days: const [
      DashboardDay('Lun', '0.000000'),
      DashboardDay('Mar', '0.000000'),
      DashboardDay('Mer', '0.000000'),
      DashboardDay('Jeu', '0.000000'),
      DashboardDay('Ven', '0.000000'),
      DashboardDay('Sam', '0.000000'),
      DashboardDay('Dim', '0.000000'),
    ],
    activity: const [],
  );

  factory DashboardSnapshot.fromJson(Map<String, dynamic> json) {
    final trend = Map<String, dynamic>.from(json['salesTrend'] as Map);
    final sales = Map<String, dynamic>.from(json['salesToday'] as Map);
    final cash = Map<String, dynamic>.from(json['cashBalance'] as Map);
    final days = (trend['days'] as List)
        .map(
          (day) => DashboardDay(
            (day as Map)['label'] as String,
            day['amount'] as String,
          ),
        )
        .toList();
    final activity = (json['recentActivity'] as List).map((item) {
      final row = Map<String, dynamic>.from(item as Map);
      return DashboardActivity(
        title: row['title'] as String,
        subtitle: row['subtitle'] as String,
        amount: row['amount'] as String?,
        label: row['label'] as String?,
        warning: row['tone'] == 'warning',
      );
    }).toList();

    return DashboardSnapshot(
      currency: json['currency'] as String,
      salesAmount: sales['amount'] as String,
      salesChange: _percent(sales['changePercent']),
      cashAmount: cash['amount'] as String,
      cashBadge: cash['badge'] as String?,
      trendAmount: trend['amount'] as String,
      trendChange: _percent(trend['changePercent']),
      days: days,
      activity: activity,
    );
  }
}

class DashboardDay {
  const DashboardDay(this.label, this.amount);
  final String label;
  final String amount;

  double get value => double.parse(amount.split('.').first);
}

class DashboardActivity {
  const DashboardActivity({
    required this.title,
    required this.subtitle,
    required this.amount,
    required this.label,
    required this.warning,
  });

  final String title;
  final String subtitle;
  final String? amount;
  final String? label;
  final bool warning;
}

double? _percent(Object? value) {
  if (value == null) return null;
  if (value is num) return value.toDouble();
  return double.tryParse(value.toString());
}

String formatDashboardMoney(
  String amount,
  String currency, {
  bool signed = false,
}) {
  final negative = amount.trim().startsWith('-');
  final whole = amount.trim().replaceFirst('-', '').split('.').first;
  final digits = whole.replaceFirst(RegExp(r'^0+(?=\d)'), '');
  final normalized = digits.isEmpty ? '0' : digits;
  final grouped = normalized.replaceAllMapped(
    RegExp(r'\B(?=(\d{3})+(?!\d))'),
    (match) => ' ',
  );
  final sign = signed && !negative && normalized != '0'
      ? '+'
      : negative
      ? '-'
      : '';
  return '$sign$grouped $currency';
}

String? formatDashboardChange(double? percent) {
  if (percent == null) return null;
  final sign = percent > 0
      ? '+'
      : percent < 0
      ? '-'
      : '';
  final tenths = (percent.abs() * 10).round();
  final text = tenths % 10 == 0
      ? '${tenths ~/ 10}'
      : '${tenths ~/ 10},${tenths % 10}';
  return '$sign$text %';
}
