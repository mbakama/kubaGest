import 'package:flutter/material.dart';

import '../../core/api/api_exception.dart';
import '../../core/theme/kuba_tokens.dart';
import '../home/dashboard_snapshot.dart';
import 'credit_api.dart';

/// Carnet de crédit : encours, retards et règlements.
class CreditsScreen extends StatefulWidget {
  const CreditsScreen({super.key, required this.gateway, this.currency = 'FC'});

  final CreditGateway gateway;
  final String currency;

  @override
  State<CreditsScreen> createState() => _CreditsScreenState();
}

class _CreditsScreenState extends State<CreditsScreen> {
  String _filter = 'open';
  List<CreditEntry> _credits = const [];
  CreditSummary? _summary;
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final credits = await widget.gateway.credits(status: _filter);
      final summary = await widget.gateway.summary();
      if (!mounted) return;
      setState(() {
        _credits = credits;
        _summary = summary;
      });
    } on ApiException catch (exception) {
      if (mounted) setState(() => _error = exception.message);
    } catch (_) {
      if (mounted) setState(() => _error = 'Le carnet est indisponible.');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  String _money(int amount) => formatDashboardMoney('$amount', widget.currency);

  String _date(DateTime date) =>
      '${date.day.toString().padLeft(2, '0')}/'
      '${date.month.toString().padLeft(2, '0')}/${date.year}';

  Future<void> _open(CreditEntry credit) async {
    final changed = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xfff3fbf7),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (_) => _CreditDetailSheet(
        gateway: widget.gateway,
        credit: credit,
        currency: widget.currency,
      ),
    );
    if (changed == true) await _load();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: const Color(0xffe6f6f0),
    appBar: AppBar(
      backgroundColor: const Color(0xffe6f6f0),
      surfaceTintColor: Colors.transparent,
      title: const Text('Carnet de crédit'),
    ),
    body: SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 32),
        children: [
          if (_summary != null) _SummaryCard(summary: _summary!, money: _money),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            children: [
              _Filter(
                label: 'En cours',
                selected: _filter == 'open',
                onTap: () {
                  setState(() => _filter = 'open');
                  _load();
                },
              ),
              _Filter(
                label: 'En retard',
                selected: _filter == 'late',
                onTap: () {
                  setState(() => _filter = 'late');
                  _load();
                },
              ),
              _Filter(
                label: 'Soldés',
                selected: _filter == 'paid',
                onTap: () {
                  setState(() => _filter = 'paid');
                  _load();
                },
              ),
            ],
          ),
          const SizedBox(height: 12),
          if (_loading)
            const Padding(
              padding: EdgeInsets.all(24),
              child: Center(child: CircularProgressIndicator()),
            )
          else if (_error != null)
            Text(
              _error!,
              style: KubaType.bodyMd.copyWith(color: KubaPalette.dangerStrong),
            )
          else if (_credits.isEmpty)
            Text(
              _filter == 'late'
                  ? 'Aucun crédit en retard.'
                  : 'Aucun crédit dans le carnet.',
              style: KubaType.bodyMd,
            )
          else
            for (final credit in _credits)
              Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Material(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  child: ListTile(
                    onTap: () => _open(credit),
                    title: Text(credit.customerName),
                    subtitle: Text(
                      [
                        credit.number,
                        if (credit.dueDate != null)
                          'échéance ${_date(credit.dueDate!)}',
                        if (credit.isLate) '${credit.daysLate} j de retard',
                      ].join(' · '),
                      style: TextStyle(
                        fontFamily: KubaType.family,
                        fontSize: 12,
                        color: credit.isLate
                            ? const Color(0xff9a2b27)
                            : const Color(0xff5d615c),
                      ),
                    ),
                    trailing: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          _money(credit.remaining),
                          style: const TextStyle(
                            fontFamily: KubaType.family,
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        Text(
                          credit.isOpen ? 'Reste dû' : 'Soldé',
                          style: TextStyle(
                            fontFamily: KubaType.family,
                            fontSize: 11,
                            color: credit.isLate
                                ? const Color(0xffb26b16)
                                : KubaPalette.brand,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
        ],
      ),
    ),
  );
}

class _SummaryCard extends StatelessWidget {
  const _SummaryCard({required this.summary, required this.money});

  final CreditSummary summary;
  final String Function(int) money;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(
      color: const Color(0xff007a55),
      borderRadius: BorderRadius.circular(22),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Encours total',
          style: TextStyle(
            fontFamily: KubaType.family,
            fontSize: 12,
            color: Color(0xccffffff),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          money(summary.outstanding),
          style: const TextStyle(
            fontFamily: KubaType.family,
            fontSize: 24,
            fontWeight: FontWeight.w700,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          summary.lateCount == 0
              ? '${summary.openCount} crédit ouvert, aucun retard'
              : '${summary.openCount} crédits ouverts · '
                    '${summary.lateCount} en retard (${money(summary.lateAmount)})',
          style: const TextStyle(
            fontFamily: KubaType.family,
            fontSize: 13,
            color: Colors.white,
          ),
        ),
      ],
    ),
  );
}

class _Filter extends StatelessWidget {
  const _Filter({
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
    backgroundColor: Colors.white,
    showCheckmark: false,
    labelStyle: TextStyle(
      fontFamily: KubaType.family,
      fontSize: 13,
      fontWeight: FontWeight.w700,
      color: selected ? Colors.white : const Color(0xff3d4240),
    ),
  );
}

class _CreditDetailSheet extends StatefulWidget {
  const _CreditDetailSheet({
    required this.gateway,
    required this.credit,
    required this.currency,
  });

  final CreditGateway gateway;
  final CreditEntry credit;
  final String currency;

  @override
  State<_CreditDetailSheet> createState() => _CreditDetailSheetState();
}

class _CreditDetailSheetState extends State<_CreditDetailSheet> {
  late CreditEntry _credit = widget.credit;
  final _amount = TextEditingController();
  String _method = 'cash';
  bool _saving = false;
  bool _changed = false;
  String? _error;

  @override
  void dispose() {
    _amount.dispose();
    super.dispose();
  }

  String _money(int amount) => formatDashboardMoney('$amount', widget.currency);

  Future<void> _pay() async {
    final amount = int.tryParse(_amount.text.replaceAll(RegExp(r'\D'), ''));
    if (amount == null || amount <= 0) {
      setState(() => _error = 'Saisissez le montant remis.');
      return;
    }
    setState(() {
      _saving = true;
      _error = null;
    });
    try {
      final updated = await widget.gateway.recordPayment(
        _credit.id,
        amount: amount,
        method: _method,
      );
      if (!mounted) return;
      setState(() {
        _credit = updated;
        _changed = true;
        _amount.clear();
      });
    } on ApiException catch (exception) {
      if (mounted) setState(() => _error = exception.message);
    } catch (_) {
      if (mounted) setState(() => _error = 'Le règlement n’a pas abouti.');
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) => Padding(
    padding: EdgeInsets.only(
      left: 16,
      right: 16,
      top: 16,
      bottom: MediaQuery.viewInsetsOf(context).bottom + 16,
    ),
    child: SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(_credit.customerName, style: KubaType.headlineMd),
              ),
              IconButton(
                tooltip: 'Fermer',
                onPressed: () => Navigator.of(context).pop(_changed),
                icon: const Icon(Icons.close),
              ),
            ],
          ),
          Text(
            '${_credit.number} · reste dû ${_money(_credit.remaining)}',
            style: KubaType.bodyMd,
          ),
          const SizedBox(height: 12),
          if (_credit.payments.isNotEmpty) ...[
            Text('Règlements', style: KubaType.headlineSm),
            const SizedBox(height: 6),
            for (final payment in _credit.payments)
              Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        '${payment.paidAt.day.toString().padLeft(2, '0')}/'
                        '${payment.paidAt.month.toString().padLeft(2, '0')}/'
                        '${payment.paidAt.year} · '
                        '${payment.method == 'cash' ? 'Espèces' : 'Mobile money'}',
                        style: KubaType.bodyMd,
                      ),
                    ),
                    Text(
                      _money(payment.amount),
                      style: KubaType.bodyMd.copyWith(
                        color: const Color(0xff151616),
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
            const SizedBox(height: 12),
          ],
          if (_credit.isOpen) ...[
            Text('Encaisser un règlement', style: KubaType.headlineSm),
            const SizedBox(height: 8),
            TextField(
              key: const ValueKey('credit-payment-amount'),
              controller: _amount,
              keyboardType: TextInputType.number,
              style: const TextStyle(
                fontFamily: KubaType.family,
                fontSize: 20,
                fontWeight: FontWeight.w700,
              ),
              decoration: InputDecoration(
                hintText: 'Montant remis',
                suffixText: widget.currency,
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: [
                ChoiceChip(
                  label: const Text('Espèces'),
                  selected: _method == 'cash',
                  onSelected: (_) => setState(() => _method = 'cash'),
                  showCheckmark: false,
                ),
                ChoiceChip(
                  label: const Text('Mobile money'),
                  selected: _method == 'mobile',
                  onSelected: (_) => setState(() => _method = 'mobile'),
                  showCheckmark: false,
                ),
              ],
            ),
            if (_error != null) ...[
              const SizedBox(height: 8),
              Text(
                _error!,
                style: KubaType.bodyMd.copyWith(
                  color: KubaPalette.dangerStrong,
                ),
              ),
            ],
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                key: const ValueKey('credit-payment-save'),
                onPressed: _saving ? null : _pay,
                style: FilledButton.styleFrom(
                  backgroundColor: const Color(0xff007a55),
                  minimumSize: const Size(44, 48),
                ),
                child: Text(_saving ? 'Enregistrement…' : 'Enregistrer'),
              ),
            ),
          ] else
            Text(
              _credit.status == 'paid'
                  ? 'Ce crédit est soldé.'
                  : 'Ce crédit a été annulé.',
              style: KubaType.bodyMd,
            ),
        ],
      ),
    ),
  );
}
