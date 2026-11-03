import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../core/api/api_exception.dart';
import '../../core/theme/kuba_tokens.dart';
import '../credits/credit_api.dart';
import '../credits/customer_picker_sheet.dart';
import '../credits/credits_screen.dart';
import '../home/dashboard_snapshot.dart';
import 'sales_api.dart';
import 'sales_counter.dart';

/// Comptoir : panier, montant remis par le client, monnaie calculée.
class SalesScreen extends StatefulWidget {
  const SalesScreen({
    super.key,
    this.currency = 'FC',
    this.articles,
    this.loadArticles,
    this.credit,
    this.saleGateway,
  });

  final String currency;

  /// Catalogue déjà connu, utilisé par les tests.
  final List<CounterArticle>? articles;

  /// Lecture du catalogue du commerce. Absente : le comptoir reste vide.
  final Future<List<CounterArticle>> Function()? loadArticles;

  /// Carnet de crédit. Absent : le crédit client n'est pas proposé.
  final CreditGateway? credit;

  /// Écriture des tickets. Absent : l'encaissement n'écrit rien.
  final SaleGateway? saleGateway;

  @override
  State<SalesScreen> createState() => _SalesScreenState();
}

class _SalesScreenState extends State<SalesScreen> {
  final _search = TextEditingController();
  final _tender = TextEditingController();
  final _quantities = <String, int>{};
  List<CounterArticle> _articles = const [];
  String _query = '';
  TenderMethod _method = TenderMethod.cash;
  bool _loading = false;
  bool _saving = false;
  String? _error;
  String? _creditError;
  String? _saleError;
  CreditCustomer? _customer;
  DateTime _dueDate = DateTime.now().add(const Duration(days: 30));

  @override
  void initState() {
    super.initState();
    if (widget.articles != null) {
      _articles = widget.articles!;
      return;
    }
    final load = widget.loadArticles;
    if (load == null) return;
    _loading = true;
    _readCatalog(load);
  }

  Future<void> _readCatalog(
    Future<List<CounterArticle>> Function() load,
  ) async {
    try {
      final articles = await load();
      if (!mounted) return;
      setState(() {
        _articles = articles;
        _error = null;
      });
    } on ApiException catch (exception) {
      if (!mounted) return;
      setState(() => _error = exception.message);
    } catch (_) {
      if (!mounted) return;
      setState(() => _error = 'Le catalogue est indisponible. Réessayez.');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  void dispose() {
    _search.dispose();
    _tender.dispose();
    super.dispose();
  }

  int get _total => _articles.fold(0, (sum, article) {
    return sum + article.unitPrice * (_quantities[article.id] ?? 0);
  });

  List<CounterArticle> get _cart => [
    for (final article in _articles)
      if ((_quantities[article.id] ?? 0) > 0) article,
  ];

  CashBalance get _balance =>
      CashBalance(total: _total, received: parseTender(_tender.text));

  bool get _canCollect => switch (_method) {
    TenderMethod.cash => _balance.ready,
    TenderMethod.credit =>
      _customer != null && _total > 0 && _total <= (_customer?.available ?? 0),
    TenderMethod.mobile => false,
  };

  void _add(CounterArticle article) {
    setState(() {
      _quantities[article.id] = (_quantities[article.id] ?? 0) + 1;
      _query = '';
      _search.clear();
    });
  }

  void _changeQty(CounterArticle article, int delta) {
    setState(() {
      final next = (_quantities[article.id] ?? 0) + delta;
      if (next <= 0) {
        _quantities.remove(article.id);
      } else {
        _quantities[article.id] = next;
      }
    });
  }

  String _money(int amount) => formatDashboardMoney('$amount', widget.currency);

  String _shortDate(DateTime date) =>
      '${date.day.toString().padLeft(2, '0')}/'
      '${date.month.toString().padLeft(2, '0')}/${date.year}';

  Future<void> _pickCustomer() async {
    final gateway = widget.credit;
    if (gateway == null) return;
    final chosen = await chooseCreditCustomer(
      context,
      gateway: gateway,
      currency: widget.currency,
    );
    if (chosen == null || !mounted) return;
    setState(() {
      _customer = chosen;
      _creditError = null;
    });
  }

  Future<void> _pickDueDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _dueDate,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
      helpText: 'Échéance du crédit',
    );
    if (picked == null || !mounted) return;
    setState(() => _dueDate = picked);
  }

  Future<void> _collect() async {
    if (_cart.isEmpty) return;
    final gateway = widget.saleGateway;
    if (gateway == null) {
      setState(
        () => _saleError =
            'L’enregistrement des ventes n’est pas disponible. Reconnectez-vous.',
      );
      return;
    }

    final items = [
      for (final article in _cart)
        if (article.sellable)
          SaleLineInput(
            productId: article.productId,
            packagingId: article.packagingId,
            quantity: _quantities[article.id] ?? 0,
          ),
    ];
    if (items.isEmpty) {
      setState(
        () => _saleError =
            'Les articles du panier ne sont pas reconnus par le serveur. '
                'Rechargez le catalogue.',
      );
      return;
    }

    final creditCustomer = _customer;
    setState(() {
      _saving = true;
      _saleError = null;
      _creditError = null;
    });

    try {
      final receipt = await gateway.createSale(
        items: items,
        channel: _method == TenderMethod.credit ? 'credit' : 'cash',
        received: _method == TenderMethod.cash ? _balance.received : null,
        customerId: _method == TenderMethod.credit ? creditCustomer?.id : null,
        dueDate: _method == TenderMethod.credit ? _dueDate : null,
      );
      if (!mounted) return;
      await _showReceipt(receipt);
      if (!mounted) return;
      setState(() {
        _quantities.clear();
        _tender.clear();
        _method = TenderMethod.cash;
        _customer = null;
        _saleError = null;
        _creditError = null;
      });
    } on ApiException catch (exception) {
      if (mounted) setState(() => _saleError = exception.message);
    } catch (_) {
      if (mounted) {
        setState(() => _saleError = 'La vente n’a pas été enregistrée.');
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  Future<void> _showReceipt(SaleReceipt receipt) async {
    final content = receipt.isCredit
        ? '${receipt.customerName ?? 'Le client'} doit '
              '${_money(receipt.total)}.\n'
              'Crédit ${receipt.creditNumber ?? ''} · échéance '
              '${receipt.creditDueDate == null ? 'non fixée' : _shortDate(receipt.creditDueDate!)}.\n\n'
              'Le règlement se saisit dans le carnet de crédit.'
        : 'Total ${_money(receipt.total)}.\n'
              'Remis ${_money(receipt.received ?? receipt.total)} · '
              'à rendre ${_money(receipt.change ?? 0)}.\n'
              'Caisse : ${receipt.registerName ?? 'ouverture automatique'}.';
    await showDialog<void>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Ticket ${receipt.number}'),
        content: Text(content),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Fermer'),
          ),
        ],
      ),
    );
  }

  Future<void> _showJournal() async {
    final gateway = widget.saleGateway;
    if (gateway == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Le journal n’est pas disponible.')),
      );
      return;
    }
    late final List<SaleReceipt> receipts;
    try {
      receipts = await gateway.recent();
    } on ApiException catch (exception) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(exception.message)),
      );
      return;
    }
    if (!mounted) return;

    await showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      backgroundColor: const Color(0xffe6f6f0),
      builder: (context) => SafeArea(
        child: SizedBox(
          height: 420,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Padding(
                padding: EdgeInsets.fromLTRB(16, 0, 16, 8),
                child: Text(
                  'Journal des tickets',
                  style: TextStyle(
                    fontFamily: KubaType.family,
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              Expanded(
                child: receipts.isEmpty
                    ? const Center(
                        child: Text(
                          'Aucun ticket enregistré pour le moment.',
                          style: TextStyle(fontFamily: KubaType.family),
                        ),
                      )
                    : ListView.separated(
                        padding: const EdgeInsets.fromLTRB(12, 0, 12, 16),
                        itemCount: receipts.length,
                        separatorBuilder: (_, _) => const SizedBox(height: 6),
                        itemBuilder: (context, index) {
                          final receipt = receipts[index];
                          final method = switch (receipt.channel) {
                            'credit' => 'Crédit',
                            'mobile' => 'Mobile money',
                            _ => 'Espèces',
                          };
                          return ListTile(
                            tileColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14),
                            ),
                            title: Text(receipt.number),
                            subtitle: Text(
                              '$method · ${_shortDate(receipt.postedAt)} '
                              '${receipt.postedAt.hour.toString().padLeft(2, '0')}:'
                              '${receipt.postedAt.minute.toString().padLeft(2, '0')}',
                            ),
                            trailing: Text(
                              _money(receipt.total),
                              style: const TextStyle(
                                fontFamily: KubaType.family,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          );
                        },
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final matches = [
      for (final article in _articles)
        if (article.matches(_query)) article,
    ];
    final difference = _balance.difference;
    return Material(
      color: const Color(0xffe6f6f0),
      child: SafeArea(
        bottom: false,
        child: ListView(
          key: const ValueKey('sales-scroll'),
          padding: const EdgeInsets.fromLTRB(16, 24, 16, 128),
          children: [
            Row(
              children: [
                const Expanded(
                  child: Text(
                    'Ventes',
                    style: TextStyle(
                      fontFamily: KubaType.family,
                      fontSize: 28,
                      fontWeight: FontWeight.w700,
                      letterSpacing: -1,
                      color: Color(0xff151616),
                    ),
                  ),
                ),
                Material(
                  color: Colors.white.withValues(alpha: .88),
                  borderRadius: BorderRadius.circular(16),
                  child: InkWell(
                    onTap: _showJournal,
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      constraints: const BoxConstraints(
                        minWidth: 44,
                        minHeight: 44,
                      ),
                      alignment: Alignment.center,
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      child: const Text(
                        'Journal',
                        style: TextStyle(
                          fontFamily: KubaType.family,
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: Color(0xff111111),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            const Text(
              'Le panier, le paiement et la monnaie restent dans le même geste.',
              style: TextStyle(
                fontFamily: KubaType.family,
                fontSize: 14,
                height: 1.4,
                color: Color(0xff3d4240),
              ),
            ),
            const SizedBox(height: 14),
            TextField(
              key: const ValueKey('sale-search'),
              controller: _search,
              onChanged: (value) => setState(() => _query = value),
              decoration: InputDecoration(
                hintText: 'Nom, code-barres ou conditionnement',
                prefixIcon: const Icon(
                  Icons.search_rounded,
                  color: Color(0xff151616),
                ),
                filled: true,
                fillColor: Colors.white.withValues(alpha: .9),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(23),
                  borderSide: BorderSide.none,
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(23),
                  borderSide: BorderSide.none,
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(23),
                  borderSide: const BorderSide(
                    color: KubaPalette.brand,
                    width: 2,
                  ),
                ),
              ),
            ),
            if (_loading) ...[
              const SizedBox(height: 24),
              const Center(child: CircularProgressIndicator()),
            ],
            if (_error != null) ...[
              const SizedBox(height: 12),
              Text(_error!, style: KubaType.bodyMd),
            ],
            if (_query.trim().isNotEmpty) ...[
              const SizedBox(height: 10),
              if (matches.isEmpty)
                const Text(
                  'Aucun article ne correspond.',
                  style: TextStyle(fontFamily: KubaType.family, fontSize: 14),
                )
              else
                for (final article in matches.take(6))
                  Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Material(
                      color: Colors.white.withValues(alpha: .9),
                      borderRadius: BorderRadius.circular(18),
                      child: ListTile(
                        title: Text(article.name),
                        subtitle: Text(
                          '${article.packaging} · ${_money(article.unitPrice)}',
                        ),
                        trailing: const Icon(Icons.add),
                        onTap: () => _add(article),
                      ),
                    ),
                  ),
            ],
            const SizedBox(height: 16),
            Text(
              'Panier',
              style: KubaType.headlineSm.copyWith(
                color: const Color(0xff151616),
              ),
            ),
            const SizedBox(height: 8),
            if (_cart.isEmpty)
              const Text(
                'Ajoutez le médicament demandé par le client.',
                style: TextStyle(
                  fontFamily: KubaType.family,
                  fontSize: 14,
                  color: Color(0xff3d4240),
                ),
              )
            else
              for (final article in _cart)
                Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: _CartRow(
                    article: article,
                    quantity: _quantities[article.id] ?? 0,
                    price: _money(
                      article.unitPrice * (_quantities[article.id] ?? 0),
                    ),
                    onLess: () => _changeQty(article, -1),
                    onMore: () => _changeQty(article, 1),
                  ),
                ),
            const SizedBox(height: 8),
            Text(
              'Encaissement',
              style: KubaType.headlineSm.copyWith(
                color: const Color(0xff151616),
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                _PayChip(
                  label: 'Espèces',
                  selected: _method == TenderMethod.cash,
                  onTap: () => setState(() => _method = TenderMethod.cash),
                ),
                _PayChip(
                  label: 'Mobile Money',
                  selected: _method == TenderMethod.mobile,
                  onTap: () => setState(() => _method = TenderMethod.mobile),
                ),
                _PayChip(
                  label: 'Crédit client',
                  selected: _method == TenderMethod.credit,
                  onTap: () => setState(() => _method = TenderMethod.credit),
                ),
              ],
            ),
            const SizedBox(height: 10),
            if (_method == TenderMethod.cash) ...[
              Text(
                'Montant remis par le client',
                style: KubaType.bodyMd.copyWith(
                  color: const Color(0xff151616),
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 6),
              TextField(
                key: const ValueKey('tender-amount'),
                controller: _tender,
                keyboardType: TextInputType.number,
                inputFormatters: const [_CashAmountFormatter()],
                onChanged: (_) => setState(() {}),
                style: const TextStyle(
                  fontFamily: KubaType.family,
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                ),
                decoration: InputDecoration(
                  hintText: 'Ce que le client vous remet',
                  filled: true,
                  fillColor: Colors.white,
                  suffixText: widget.currency,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: Color(0x1f111214)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: Color(0x1f111214)),
                  ),
                ),
              ),
              const SizedBox(height: 8),
              _DifferenceRow(
                label: difference == null
                    ? 'À rendre'
                    : difference < 0
                    ? 'Il manque'
                    : 'À rendre',
                value: difference == null ? '—' : _money(difference.abs()),
                short: difference != null && difference < 0,
              ),
            ] else if (_method == TenderMethod.mobile)
              const Text(
                'Le mobile money sera activé avec son module dédié. '
                'Encaissez en espèces pour le moment.',
                style: TextStyle(
                  fontFamily: KubaType.family,
                  fontSize: 14,
                  height: 1.4,
                  color: Color(0xff3d4240),
                ),
              )
            else
              _CreditPanel(
                currency: widget.currency,
                customer: _customer,
                total: _total,
                dueDate: _dueDate,
                dueLabel: _shortDate(_dueDate),
                error: _creditError,
                enabled: widget.credit != null,
                onPickCustomer: _pickCustomer,
                onPickDate: _pickDueDate,
                onOpenLedger: () {
                  final gateway = widget.credit;
                  if (gateway == null) return;
                  Navigator.of(context).push(
                    MaterialPageRoute<void>(
                      builder: (_) => CreditsScreen(
                        gateway: gateway,
                        currency: widget.currency,
                      ),
                    ),
                  );
                },
              ),
            const SizedBox(height: 12),
            if (_saleError != null) ...[
              Text(
                _saleError!,
                key: const ValueKey('sale-error'),
                style: const TextStyle(
                  fontFamily: KubaType.family,
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: Color(0xff9a2b27),
                ),
              ),
              const SizedBox(height: 8),
            ],
            Container(
              padding: const EdgeInsets.fromLTRB(14, 12, 12, 12),
              decoration: BoxDecoration(
                color: const Color(0xff111111),
                borderRadius: BorderRadius.circular(22),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Total du panier',
                          style: TextStyle(
                            fontFamily: KubaType.family,
                            fontSize: 12,
                            color: Color(0xffc8c8c8),
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          _money(_total),
                          style: const TextStyle(
                            fontFamily: KubaType.family,
                            fontSize: 20,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                  FilledButton(
                    key: const ValueKey('collect-sale'),
                    onPressed: _canCollect && !_saving ? _collect : null,
                    style: FilledButton.styleFrom(
                      backgroundColor: const Color(0xff8fbd2b),
                      disabledBackgroundColor: const Color(0xff5c5c5c),
                      foregroundColor: const Color(0xff111111),
                      disabledForegroundColor: const Color(0xffd0d0d0),
                      minimumSize: const Size(44, 44),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    child: Text(_saving ? 'Enregistrement…' : 'Encaisser'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Montant en francs : seuls les chiffres sont gardés, groupés par milliers.
class _CashAmountFormatter extends TextInputFormatter {
  const _CashAmountFormatter();

  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    final digits = newValue.text.replaceAll(RegExp(r'[^0-9]'), '');
    if (digits.isEmpty) return const TextEditingValue();
    final trimmed = digits.replaceFirst(RegExp(r'^0+(?=\d)'), '');
    final grouped = trimmed.replaceAllMapped(
      RegExp(r'\B(?=(\d{3})+(?!\d))'),
      (match) => ' ',
    );
    return TextEditingValue(
      text: grouped,
      selection: TextSelection.collapsed(offset: grouped.length),
    );
  }
}

class _CartRow extends StatelessWidget {
  const _CartRow({
    required this.article,
    required this.quantity,
    required this.price,
    required this.onLess,
    required this.onMore,
  });

  final CounterArticle article;
  final int quantity;
  final String price;
  final VoidCallback onLess;
  final VoidCallback onMore;

  @override
  Widget build(BuildContext context) => Material(
    color: Colors.white.withValues(alpha: .9),
    borderRadius: BorderRadius.circular(18),
    child: Padding(
      padding: const EdgeInsets.all(12),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  article.name,
                  style: const TextStyle(
                    fontFamily: KubaType.family,
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  article.packaging,
                  style: const TextStyle(
                    fontFamily: KubaType.family,
                    fontSize: 12,
                    color: Color(0xff5d615c),
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    _QtyButton(
                      label: 'Diminuer ${article.name}',
                      icon: Icons.remove,
                      onTap: onLess,
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 10),
                      child: Text(
                        '$quantity',
                        style: const TextStyle(
                          fontFamily: KubaType.family,
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                    _QtyButton(
                      label: 'Augmenter ${article.name}',
                      icon: Icons.add,
                      onTap: onMore,
                    ),
                  ],
                ),
              ],
            ),
          ),
          Text(
            price,
            style: const TextStyle(
              fontFamily: KubaType.family,
              fontSize: 14,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    ),
  );
}

class _QtyButton extends StatelessWidget {
  const _QtyButton({
    required this.label,
    required this.icon,
    required this.onTap,
  });

  final String label;
  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => IconButton(
    tooltip: label,
    onPressed: onTap,
    style: IconButton.styleFrom(
      backgroundColor: const Color(0xffe6f6f0),
      foregroundColor: KubaPalette.brand,
      minimumSize: const Size(36, 36),
    ),
    icon: Icon(icon, size: 18),
  );
}

class _PayChip extends StatelessWidget {
  const _PayChip({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => ChoiceChip(
    label: Text(label),
    selected: selected,
    onSelected: (_) => onTap(),
    selectedColor: const Color(0xff111111),
    labelStyle: TextStyle(
      fontFamily: KubaType.family,
      fontSize: 13,
      fontWeight: FontWeight.w700,
      color: selected ? Colors.white : const Color(0xff3d4240),
    ),
    backgroundColor: Colors.white,
    side: const BorderSide(color: Color(0x14111214)),
    showCheckmark: false,
  );
}

class _CreditPanel extends StatelessWidget {
  const _CreditPanel({
    required this.currency,
    required this.customer,
    required this.total,
    required this.dueDate,
    required this.dueLabel,
    required this.error,
    required this.enabled,
    required this.onPickCustomer,
    required this.onPickDate,
    required this.onOpenLedger,
  });

  final String currency;
  final CreditCustomer? customer;
  final int total;
  final DateTime dueDate;
  final String dueLabel;
  final String? error;
  final bool enabled;
  final VoidCallback onPickCustomer;
  final VoidCallback onPickDate;
  final VoidCallback onOpenLedger;

  String _money(int amount) => formatDashboardMoney('$amount', currency);

  @override
  Widget build(BuildContext context) {
    final selected = customer;
    final exceeds = selected != null && total > selected.available;
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  'Vente à crédit',
                  style: KubaType.headlineSm.copyWith(
                    color: const Color(0xff151616),
                  ),
                ),
              ),
              if (!enabled)
                const Text(
                  'Indisponible',
                  style: TextStyle(
                    fontFamily: KubaType.family,
                    fontSize: 12,
                    color: Color(0xff5d615c),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 8),
          if (!enabled)
            const Text(
              'Le carnet de crédit n’est pas joignable. Vérifiez la connexion.',
              style: TextStyle(
                fontFamily: KubaType.family,
                fontSize: 14,
                color: Color(0xff3d4240),
              ),
            )
          else if (selected == null)
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Un crédit doit être rattaché à une personne.',
                  style: TextStyle(
                    fontFamily: KubaType.family,
                    fontSize: 14,
                    height: 1.4,
                    color: Color(0xff3d4240),
                  ),
                ),
                const SizedBox(height: 10),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton.icon(
                    key: const ValueKey('pick-credit-customer'),
                    onPressed: onPickCustomer,
                    style: FilledButton.styleFrom(
                      backgroundColor: const Color(0xff111111),
                      minimumSize: const Size(44, 48),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    icon: const Icon(Icons.person_search_rounded),
                    label: const Text('Choisir le client'),
                  ),
                ),
              ],
            )
          else ...[
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        selected.name,
                        style: const TextStyle(
                          fontFamily: KubaType.family,
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      if (selected.phone != null)
                        Text(
                          selected.phone!,
                          style: const TextStyle(
                            fontFamily: KubaType.family,
                            fontSize: 12,
                            color: Color(0xff5d615c),
                          ),
                        ),
                    ],
                  ),
                ),
                TextButton(
                  key: const ValueKey('change-credit-customer'),
                  onPressed: onPickCustomer,
                  child: const Text('Changer'),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Text(
              'Déjà dû ${_money(selected.outstanding)} · '
              'disponible ${_money(selected.available)}',
              style: const TextStyle(
                fontFamily: KubaType.family,
                fontSize: 13,
                color: Color(0xff3d4240),
              ),
            ),
            const SizedBox(height: 10),
            Material(
              color: const Color(0xffe6f6f0),
              borderRadius: BorderRadius.circular(14),
              child: InkWell(
                onTap: onPickDate,
                borderRadius: BorderRadius.circular(14),
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 10,
                  ),
                  child: Row(
                    children: [
                      const Icon(
                        Icons.event_rounded,
                        size: 18,
                        color: KubaPalette.brand,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Échéance : $dueLabel',
                          style: const TextStyle(
                            fontFamily: KubaType.family,
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      const Text(
                        'Modifier',
                        style: TextStyle(
                          fontFamily: KubaType.family,
                          fontSize: 12,
                          color: KubaPalette.brand,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 8),
            if (exceeds)
              Text(
                'Le plafond ne couvre pas cette vente. Il manque '
                '${_money(total - selected.available)}.',
                style: const TextStyle(
                  fontFamily: KubaType.family,
                  fontSize: 13,
                  color: Color(0xffb26b16),
                  fontWeight: FontWeight.w700,
                ),
              )
            else
              Text(
                'Après cette vente, ${selected.name} devra '
                '${_money(selected.outstanding + total)}.',
                style: const TextStyle(
                  fontFamily: KubaType.family,
                  fontSize: 13,
                  color: Color(0xff3d4240),
                ),
              ),
          ],
          if (error != null) ...[
            const SizedBox(height: 8),
            Text(
              error!,
              style: const TextStyle(
                fontFamily: KubaType.family,
                fontSize: 13,
                color: Color(0xff9a2b27),
              ),
            ),
          ],
          const SizedBox(height: 4),
          Align(
            alignment: Alignment.centerLeft,
            child: TextButton.icon(
              key: const ValueKey('open-credit-ledger'),
              onPressed: enabled ? onOpenLedger : null,
              icon: const Icon(Icons.menu_book_rounded, size: 18),
              label: const Text('Carnet de crédit'),
            ),
          ),
        ],
      ),
    );
  }
}

class _DifferenceRow extends StatelessWidget {
  const _DifferenceRow({
    required this.label,
    required this.value,
    required this.short,
  });

  final String label;
  final String value;
  final bool short;

  @override
  Widget build(BuildContext context) => Container(
    constraints: const BoxConstraints(minHeight: 48),
    padding: const EdgeInsets.symmetric(horizontal: 14),
    decoration: BoxDecoration(
      color: Colors.white.withValues(alpha: .9),
      borderRadius: BorderRadius.circular(16),
    ),
    child: Row(
      children: [
        Text(
          label,
          style: const TextStyle(fontFamily: KubaType.family, fontSize: 14),
        ),
        const Spacer(),
        Text(
          value,
          style: TextStyle(
            fontFamily: KubaType.family,
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: short ? const Color(0xffb26b16) : KubaPalette.brand,
          ),
        ),
      ],
    ),
  );
}
