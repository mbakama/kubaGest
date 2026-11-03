import 'package:flutter/material.dart';

import '../../core/api/api_exception.dart';
import '../../core/theme/kuba_tokens.dart';
import 'stock_api.dart';

/// Page Stock réelle : quantités disponibles par article et réceptions.
///
/// Le stock est tenu en unité de base. Une vente au comptoir le diminue ; le
/// bouton « Réception » enregistre une entrée.
class StockScreen extends StatefulWidget {
  const StockScreen({super.key, this.gateway});

  /// Source du stock. Absente : la page indique que le stock est injoignable.
  final StockGateway? gateway;

  @override
  State<StockScreen> createState() => _StockScreenState();
}

enum _StockFilter { threshold, empty }

class _StockScreenState extends State<StockScreen> {
  List<StockLine> _lines = const [];
  bool _loading = false;
  String? _error;
  _StockFilter? _filter;
  String _query = '';

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final gateway = widget.gateway;
    if (gateway == null) {
      setState(
        () => _error = 'Le stock n’est pas joignable. Vérifiez la connexion.',
      );
      return;
    }
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final lines = await gateway.lines();
      if (!mounted) return;
      setState(() => _lines = lines);
    } on ApiException catch (exception) {
      if (mounted) setState(() => _error = exception.message);
    } catch (_) {
      if (mounted) {
        setState(() => _error = 'Le stock est indisponible. Réessayez.');
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  List<StockLine> get _visible {
    final query = _query.trim().toLowerCase();
    return [
      for (final line in _lines)
        if (_filter == null ||
            (_filter == _StockFilter.threshold && line.belowThreshold) ||
            (_filter == _StockFilter.empty && line.outOfStock))
          if (query.isEmpty ||
              line.name.toLowerCase().contains(query) ||
              line.sku.toLowerCase().contains(query))
            line,
    ];
  }

  int get _trackedQuantity =>
      _lines.fold(0, (sum, line) => sum + line.quantity);

  Future<void> _receive() async {
    final gateway = widget.gateway;
    if (gateway == null || _lines.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Aucun article à réceptionner : ajoutez d’abord un article au catalogue.',
          ),
        ),
      );
      return;
    }

    final recorded = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      backgroundColor: const Color(0xffe6f6f0),
      builder: (context) => _ReceiveSheet(lines: _lines, gateway: gateway),
    );

    if (recorded == true && mounted) {
      await _load();
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Réception enregistrée dans le stock.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final visible = _visible;
    final alerts = _lines.where((line) => line.belowThreshold).toList();
    final alertHint = alerts.isEmpty
        ? 'Aucun article'
        : '${alerts.first.name} · ${alerts.first.quantity} '
              '${alerts.first.baseUnit} restants';

    return Scaffold(
      backgroundColor: const Color(0xffe6f6f0),
      body: SafeArea(
        bottom: false,
        child: ListView(
          key: const ValueKey('stock-scroll'),
          padding: const EdgeInsets.fromLTRB(16, 24, 16, 128),
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Avant la rupture',
                        style: TextStyle(
                          fontFamily: KubaType.family,
                          fontSize: 12,
                          color: Color(0xff858782),
                        ),
                      ),
                      SizedBox(height: 3),
                      Text(
                        'Stock',
                        style: TextStyle(
                          fontFamily: KubaType.family,
                          fontSize: 28,
                          fontWeight: FontWeight.w700,
                          letterSpacing: -1,
                          color: Color(0xff151616),
                        ),
                      ),
                    ],
                  ),
                ),
                FilledButton.icon(
                  onPressed: _receive,
                  style: FilledButton.styleFrom(
                    backgroundColor: const Color(0xff111111),
                    foregroundColor: Colors.white,
                    minimumSize: const Size(44, 44),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  icon: const Icon(Icons.add, size: 18),
                  label: const Text('Réception'),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  flex: 3,
                  child: _SummaryCard(
                    dark: true,
                    label: 'Sous le seuil',
                    value:
                        '${alerts.length} article${alerts.length > 1 ? 's' : ''}',
                    hint: alertHint,
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  flex: 2,
                  child: _SummaryCard(
                    label: 'Articles suivis',
                    value: '${_lines.length}',
                    hint: '$_trackedQuantity en unité de base',
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            TextField(
              onChanged: (value) => setState(() => _query = value),
              decoration: InputDecoration(
                hintText: 'Rechercher un article...',
                prefixIcon: const Icon(
                  Icons.search_rounded,
                  color: Color(0xff151616),
                ),
                filled: true,
                fillColor: Colors.white.withValues(alpha: .76),
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
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              children: [
                _FilterChip(
                  label: 'Tous',
                  selected: _filter == null,
                  onTap: () => setState(() => _filter = null),
                ),
                _FilterChip(
                  label: 'Seuil',
                  selected: _filter == _StockFilter.threshold,
                  onTap: () => setState(() => _filter = _StockFilter.threshold),
                ),
                _FilterChip(
                  label: 'Rupture',
                  selected: _filter == _StockFilter.empty,
                  onTap: () => setState(() => _filter = _StockFilter.empty),
                ),
              ],
            ),
            if (_loading) ...[
              const SizedBox(height: 20),
              const Center(child: CircularProgressIndicator()),
            ],
            if (_error != null) ...[
              const SizedBox(height: 14),
              Text(
                _error!,
                style: const TextStyle(fontSize: 14, color: Color(0xff9a2b27)),
              ),
            ],
            const SizedBox(height: 14),
            Row(
              children: [
                const Text(
                  'Articles',
                  style: TextStyle(
                    fontFamily: KubaType.family,
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: Color(0xff151616),
                  ),
                ),
                const Spacer(),
                Text(
                  '${visible.length} suivi${visible.length > 1 ? 's' : ''}',
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xff858782),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            if (!_loading && visible.isEmpty)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 28),
                child: Text(
                  'Aucun article pour ce filtre.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 14, color: Color(0xff5c615d)),
                ),
              )
            else
              for (final line in visible) ...[
                _ArticleRow(line: line),
                const SizedBox(height: 8),
              ],
          ],
        ),
      ),
    );
  }
}

class _ReceiveSheet extends StatefulWidget {
  const _ReceiveSheet({required this.lines, required this.gateway});

  final List<StockLine> lines;
  final StockGateway gateway;

  @override
  State<_ReceiveSheet> createState() => _ReceiveSheetState();
}

class _ReceiveSheetState extends State<_ReceiveSheet> {
  final _quantity = TextEditingController();
  final _reference = TextEditingController();
  late String _productId = widget.lines.first.productId;
  bool _saving = false;
  String? _error;

  @override
  void dispose() {
    _quantity.dispose();
    _reference.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final amount = int.tryParse(
      _quantity.text.replaceAll(RegExp(r'[^0-9]'), ''),
    );
    if (amount == null || amount <= 0) {
      setState(() => _error = 'Saisissez une quantité positive.');
      return;
    }
    setState(() {
      _saving = true;
      _error = null;
    });
    try {
      await widget.gateway.receive(
        productId: _productId,
        quantity: amount,
        reference: _reference.text,
      );
      if (!mounted) return;
      Navigator.pop(context, true);
    } on ApiException catch (exception) {
      if (!mounted) return;
      setState(() {
        _saving = false;
        _error = exception.message;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _saving = false;
        _error = 'La réception n’a pas été enregistrée.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.fromLTRB(
        16,
        0,
        16,
        MediaQuery.of(context).viewInsets.bottom + 20,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Réception de marchandises',
            style: TextStyle(
              fontFamily: KubaType.family,
              fontSize: 18,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            'Quantité en unité de base de l’article.',
            style: TextStyle(fontSize: 13, color: Color(0xff5d615c)),
          ),
          const SizedBox(height: 12),
          DropdownButtonFormField<String>(
            key: const ValueKey('receive-product'),
            initialValue: _productId,
            isExpanded: true,
            decoration: const InputDecoration(
              labelText: 'Article',
              filled: true,
              fillColor: Colors.white,
              border: OutlineInputBorder(),
            ),
            items: [
              for (final line in widget.lines)
                DropdownMenuItem(
                  value: line.productId,
                  child: Text(
                    '${line.name} · ${line.quantity} ${line.baseUnit}',
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
            ],
            onChanged: _saving
                ? null
                : (value) {
                    if (value != null) {
                      setState(() => _productId = value);
                    }
                  },
          ),
          const SizedBox(height: 10),
          TextField(
            key: const ValueKey('receive-quantity'),
            controller: _quantity,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(
              labelText: 'Quantité reçue',
              filled: true,
              fillColor: Colors.white,
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 10),
          TextField(
            key: const ValueKey('receive-reference'),
            controller: _reference,
            decoration: const InputDecoration(
              labelText: 'Référence (facultatif)',
              filled: true,
              fillColor: Colors.white,
              border: OutlineInputBorder(),
            ),
          ),
          if (_error != null) ...[
            const SizedBox(height: 8),
            Text(
              _error!,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: Color(0xff9a2b27),
              ),
            ),
          ],
          const SizedBox(height: 14),
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              key: const ValueKey('receive-submit'),
              onPressed: _saving ? null : _submit,
              style: FilledButton.styleFrom(
                backgroundColor: const Color(0xff111111),
                minimumSize: const Size(44, 48),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
              child: Text(_saving ? 'Enregistrement…' : 'Enregistrer'),
            ),
          ),
        ],
      ),
    );
  }
}

class _SummaryCard extends StatelessWidget {
  const _SummaryCard({
    required this.label,
    required this.value,
    required this.hint,
    this.dark = false,
  });

  final String label;
  final String value;
  final String hint;
  final bool dark;

  @override
  Widget build(BuildContext context) {
    final foreground = dark ? Colors.white : const Color(0xff151616);
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: dark
            ? const Color(0xff8a4b00)
            : Colors.white.withValues(alpha: .9),
        borderRadius: BorderRadius.circular(22),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: dark ? Colors.white70 : const Color(0xff858782),
            ),
          ),
          const SizedBox(height: 9),
          Text(
            value,
            style: TextStyle(
              fontFamily: KubaType.family,
              fontSize: 22,
              fontWeight: FontWeight.w700,
              letterSpacing: -.6,
              color: foreground,
            ),
          ),
          const SizedBox(height: 5),
          Text(
            hint,
            style: TextStyle(
              fontSize: 12,
              color: dark ? Colors.white70 : const Color(0xff858782),
            ),
          ),
        ],
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  const _FilterChip({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => Material(
    color: selected
        ? const Color(0xff111111)
        : Colors.white.withValues(alpha: .9),
    borderRadius: BorderRadius.circular(16),
    child: InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: ConstrainedBox(
        constraints: const BoxConstraints(minHeight: 44, minWidth: 44),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14),
          child: Center(
            widthFactor: 1,
            heightFactor: 1,
            child: Text(
              label,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: selected ? Colors.white : const Color(0xff3d4240),
              ),
            ),
          ),
        ),
      ),
    ),
  );
}

class _ArticleRow extends StatelessWidget {
  const _ArticleRow({required this.line});

  final StockLine line;

  @override
  Widget build(BuildContext context) {
    final status = line.outOfStock
        ? ('Rupture', const Color(0xff9a2b27))
        : line.belowThreshold
        ? ('Sous le seuil', const Color(0xffb26b16))
        : ('En stock', KubaPalette.brand);
    final code = (line.sku.isNotEmpty ? line.sku : line.name)
        .substring(0, 2)
        .toUpperCase();
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: .9),
        borderRadius: BorderRadius.circular(18),
      ),
      child: Row(
        children: [
          Container(
            width: 38,
            height: 38,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: const Color(0xffe6f6f0),
              borderRadius: BorderRadius.circular(13),
            ),
            child: Text(
              code,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w800,
                color: KubaPalette.brand,
              ),
            ),
          ),
          const SizedBox(width: 11),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  line.name,
                  style: const TextStyle(
                    fontFamily: KubaType.family,
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: Color(0xff151616),
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  'Seuil ${line.reorderLevel} · ${line.baseUnit}',
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xff858782),
                  ),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '${line.quantity}',
                style: const TextStyle(
                  fontFamily: KubaType.family,
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: Color(0xff151616),
                ),
              ),
              const SizedBox(height: 3),
              Text(
                status.$1,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: status.$2,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
