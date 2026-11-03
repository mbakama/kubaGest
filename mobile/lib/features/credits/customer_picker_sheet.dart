import 'package:flutter/material.dart';

import '../../core/api/api_exception.dart';
import '../../core/theme/kuba_tokens.dart';
import '../home/dashboard_snapshot.dart';
import 'credit_api.dart';

/// Choix du client au comptoir, avec création immédiate si le carnet est vide.
///
/// Retourne `null` si le caissier ferme la feuille.
Future<CreditCustomer?> chooseCreditCustomer(
  BuildContext context, {
  required CreditGateway gateway,
  required String currency,
}) => showModalBottomSheet<CreditCustomer>(
  context: context,
  isScrollControlled: true,
  backgroundColor: const Color(0xfff3fbf7),
  shape: const RoundedRectangleBorder(
    borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
  ),
  builder: (_) => _CustomerSheet(gateway: gateway, currency: currency),
);

class _CustomerSheet extends StatefulWidget {
  const _CustomerSheet({required this.gateway, required this.currency});

  final CreditGateway gateway;
  final String currency;

  @override
  State<_CustomerSheet> createState() => _CustomerSheetState();
}

class _CustomerSheetState extends State<_CustomerSheet> {
  final _search = TextEditingController();
  final _name = TextEditingController();
  final _phone = TextEditingController();
  final _limit = TextEditingController();
  List<CreditCustomer> _customers = const [];
  bool _loading = true;
  bool _showForm = false;
  bool _saving = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _search.dispose();
    _name.dispose();
    _phone.dispose();
    _limit.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final customers = await widget.gateway.customers(query: _search.text);
      if (!mounted) return;
      setState(() => _customers = customers);
    } on ApiException catch (exception) {
      if (mounted) setState(() => _error = exception.message);
    } catch (_) {
      if (mounted) setState(() => _error = 'Le carnet est indisponible.');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _create() async {
    final name = _name.text.trim();
    if (name.length < 2) {
      setState(() => _error = 'Indiquez le nom du client.');
      return;
    }
    final limit = int.tryParse(_limit.text.replaceAll(RegExp(r'\D'), '')) ?? 0;
    if (limit <= 0) {
      setState(() => _error = 'Un plafond supérieur à zéro ouvre le crédit.');
      return;
    }
    setState(() {
      _saving = true;
      _error = null;
    });
    try {
      final customer = await widget.gateway.createCustomer(
        name: name,
        phone: _phone.text,
        creditLimit: limit,
      );
      if (!mounted) return;
      Navigator.of(context).pop(customer);
    } on ApiException catch (exception) {
      if (mounted) setState(() => _error = exception.message);
    } catch (_) {
      if (mounted) setState(() => _error = 'Le client n’a pas été enregistré.');
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  String _money(int amount) => formatDashboardMoney('$amount', widget.currency);

  @override
  Widget build(BuildContext context) => Padding(
    padding: EdgeInsets.only(
      left: 16,
      right: 16,
      top: 16,
      bottom: MediaQuery.viewInsetsOf(context).bottom + 16,
    ),
    child: SizedBox(
      height: MediaQuery.sizeOf(context).height * .78,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  _showForm ? 'Nouveau client' : 'Client à crédit',
                  style: KubaType.headlineMd,
                ),
              ),
              IconButton(
                tooltip: 'Fermer',
                onPressed: () => Navigator.of(context).pop(),
                icon: const Icon(Icons.close),
              ),
            ],
          ),
          if (!_showForm) ...[
            TextField(
              key: const ValueKey('customer-search'),
              controller: _search,
              onChanged: (_) => _load(),
              decoration: InputDecoration(
                hintText: 'Nom ou téléphone',
                prefixIcon: const Icon(Icons.search_rounded),
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(18),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 10),
            Expanded(
              child: _loading
                  ? const Center(child: CircularProgressIndicator())
                  : _customers.isEmpty
                  ? Center(
                      child: Text(
                        'Aucun client dans le carnet.\nEnregistrez la personne qui achète à crédit.',
                        textAlign: TextAlign.center,
                        style: KubaType.bodyMd,
                      ),
                    )
                  : ListView.separated(
                      itemCount: _customers.length,
                      separatorBuilder: (_, _) => const SizedBox(height: 8),
                      itemBuilder: (context, index) {
                        final customer = _customers[index];
                        return Material(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(18),
                          child: ListTile(
                            title: Text(customer.name),
                            subtitle: Text(
                              customer.creditLimit == 0
                                  ? 'Crédit fermé'
                                  : 'Déjà dû ${_money(customer.outstanding)} · '
                                        'disponible ${_money(customer.available)}',
                            ),
                            trailing: customer.hasLateCredit
                                ? const _LateBadge()
                                : const Icon(Icons.chevron_right),
                            onTap: customer.creditLimit == 0
                                ? null
                                : () => Navigator.of(context).pop(customer),
                          ),
                        );
                      },
                    ),
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
            const SizedBox(height: 8),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () => setState(() {
                  _showForm = true;
                  _error = null;
                }),
                icon: const Icon(Icons.person_add_alt_1),
                label: const Text('Enregistrer un nouveau client'),
              ),
            ),
          ] else ...[
            Expanded(
              child: ListView(
                children: [
                  TextField(
                    key: const ValueKey('customer-name'),
                    controller: _name,
                    textCapitalization: TextCapitalization.words,
                    decoration: const InputDecoration(
                      labelText: 'Nom du client',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    key: const ValueKey('customer-phone'),
                    controller: _phone,
                    keyboardType: TextInputType.phone,
                    decoration: const InputDecoration(
                      labelText: 'Téléphone (facultatif)',
                      hintText: '+243…',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    key: const ValueKey('customer-limit'),
                    controller: _limit,
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      labelText: 'Plafond de crédit',
                      suffixText: widget.currency,
                      helperText:
                          'Montant maximum que ce client peut devoir en même temps.',
                      border: const OutlineInputBorder(),
                    ),
                  ),
                  if (_error != null) ...[
                    const SizedBox(height: 10),
                    Text(
                      _error!,
                      style: KubaType.bodyMd.copyWith(
                        color: KubaPalette.dangerStrong,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            Row(
              children: [
                TextButton(
                  onPressed: () => setState(() => _showForm = false),
                  child: const Text('Retour'),
                ),
                const Spacer(),
                FilledButton(
                  key: const ValueKey('customer-save'),
                  onPressed: _saving ? null : _create,
                  child: Text(_saving ? 'Enregistrement…' : 'Enregistrer'),
                ),
              ],
            ),
          ],
        ],
      ),
    ),
  );
}

class _LateBadge extends StatelessWidget {
  const _LateBadge();

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
    decoration: BoxDecoration(
      color: KubaPalette.alertSoft,
      borderRadius: BorderRadius.circular(99),
    ),
    child: Text(
      'En retard',
      style: KubaType.labelSm.copyWith(color: KubaPalette.dangerStrong),
    ),
  );
}
