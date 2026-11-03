import 'package:flutter/material.dart';
import '../../core/api/api_exception.dart';
import '../../core/auth/auth_session.dart';
import '../../core/theme/kuba_tokens.dart';
import '../../shared/ui/app_header.dart';
import '../../shared/ui/kuba_card.dart';
import 'catalog_api.dart';

class CatalogScreen extends StatefulWidget {
  const CatalogScreen({super.key, required this.session, this.api});
  final AuthSession session;
  final CatalogApi? api;
  @override
  State<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends State<CatalogScreen> {
  List<Map<String, dynamic>> _products = [];
  bool _loading = true;
  String? _error;
  String _query = '';

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
      final products = await (widget.api ?? CatalogApi()).load(
        widget.session.accessToken,
      );
      if (mounted) setState(() => _products = products);
    } catch (error) {
      if (mounted) {
        setState(
          () => _error = error is ApiException
              ? error.message
              : 'Impossible de charger le catalogue. Réessayez.',
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _details(Map<String, dynamic> product) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => Scaffold(
          appBar: KubaAppHeader(
            title: 'Fiche article',
            onBack: () => Navigator.pop(context),
          ),
          body: ListView(
            padding: const EdgeInsets.all(KubaSpace.md),
            children: [
              Text(product['name'] as String, style: KubaType.headlineLg),
              const SizedBox(height: KubaSpace.md),
              KubaCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Référence : ${product['sku']}',
                      style: KubaType.bodyMd,
                    ),
                    Text(
                      'Unité de base : ${product['baseUnit']}',
                      style: KubaType.bodyMd,
                    ),
                    Text(
                      product['isActive'] == true ? 'Actif' : 'Désactivé',
                      style: KubaType.bodyMd,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: KubaSpace.lg),
              const Text('Conditionnements', style: KubaType.headlineSm),
              for (final pack in product['packagings'] as List? ?? [])
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: Text('${pack['label']}'),
                  subtitle: Text(
                    '${pack['factorToBase']} ${product['baseUnit']} · ${pack['isActive'] == true ? 'Actif' : 'Désactivé'}',
                  ),
                  trailing: Text(
                    '${pack['salePrice']} ${widget.session.context?.currency ?? ''}',
                  ),
                ),
              if (product['drugDetails'] case final Map drug) ...[
                const SizedBox(height: KubaSpace.lg),
                const Text('Fiche médicament', style: KubaType.headlineSm),
                Text(
                  '${drug['activeIngredient']} · ${drug['strength']} · ${drug['dosageForm']}',
                  style: KubaType.bodyMd,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final query = _query.trim().toLowerCase();
    final visible = _products
        .where((p) => '${p['name']} ${p['sku']}'.toLowerCase().contains(query))
        .toList();
    return Scaffold(
      appBar: KubaAppHeader(
        title: 'Catalogue',
        subtitle: widget.session.context?.tenantName,
        onBack: () => Navigator.pop(context),
        actions: [
          IconButton(
            tooltip: 'Actualiser',
            onPressed: _loading ? null : _load,
            icon: const Icon(Icons.refresh_rounded, color: Colors.white),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(KubaSpace.md),
              child: TextField(
                decoration: const InputDecoration(
                  labelText: 'Rechercher un article',
                  hintText: 'Nom ou référence',
                  prefixIcon: Icon(Icons.search_rounded),
                ),
                onChanged: (value) => setState(() => _query = value),
              ),
            ),
            Expanded(
              child: _loading
                  ? const Center(
                      child: CircularProgressIndicator(
                        semanticsLabel: 'Chargement du catalogue',
                      ),
                    )
                  : _error != null
                  ? Center(
                      child: Padding(
                        padding: const EdgeInsets.all(KubaSpace.md),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              _error!,
                              textAlign: TextAlign.center,
                              style: KubaType.bodyMd,
                            ),
                            const SizedBox(height: KubaSpace.md),
                            FilledButton(
                              onPressed: _load,
                              child: const Text('Réessayer'),
                            ),
                          ],
                        ),
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: _load,
                      child: ListView(
                        physics: const AlwaysScrollableScrollPhysics(),
                        padding: const EdgeInsets.all(KubaSpace.md),
                        children: visible.isEmpty
                            ? [
                                Padding(
                                  padding: const EdgeInsets.symmetric(
                                    vertical: KubaSpace.lg,
                                  ),
                                  child: Text(
                                    _products.isEmpty
                                        ? 'Aucun article dans ce commerce.'
                                        : 'Aucun article ne correspond à votre recherche.',
                                    textAlign: TextAlign.center,
                                    style: KubaType.bodyMd,
                                  ),
                                ),
                              ]
                            : [
                                for (final product in visible)
                                  Padding(
                                    padding: const EdgeInsets.only(
                                      bottom: KubaSpace.sm,
                                    ),
                                    child: KubaCard(
                                      child: ListTile(
                                        contentPadding: EdgeInsets.zero,
                                        title: Text(product['name'] as String),
                                        subtitle: Text(
                                          '${product['sku']} · ${product['isActive'] == true ? 'Actif' : 'Désactivé'}',
                                        ),
                                        trailing: const Icon(
                                          Icons.chevron_right_rounded,
                                        ),
                                        onTap: () => _details(product),
                                      ),
                                    ),
                                  ),
                              ],
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
