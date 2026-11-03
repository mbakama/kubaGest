import 'package:flutter/material.dart';
import '../../core/api/api_exception.dart';
import '../../core/auth/auth_session.dart';
import '../../core/theme/kuba_tokens.dart';
import '../../shared/ui/app_header.dart';
import '../../shared/ui/kuba_card.dart';
import 'account_api.dart';

class SubscriptionScreen extends StatefulWidget {
  const SubscriptionScreen({super.key, required this.session, this.api});
  final AuthSession session;
  final AccountApi? api;
  @override
  State<SubscriptionScreen> createState() => _SubscriptionScreenState();
}

class _SubscriptionScreenState extends State<SubscriptionScreen> {
  late Future<Map<String, dynamic>> _request;
  @override
  void initState() {
    super.initState();
    _reload();
  }

  void _reload() {
    _request = (widget.api ?? AccountApi()).load(widget.session.accessToken);
  }

  String _date(dynamic value) {
    final date = DateTime.tryParse(value?.toString() ?? '')?.toLocal();
    return date == null
        ? 'Non renseignée'
        : '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: KubaAppHeader(
      title: 'Mon abonnement',
      onBack: () => Navigator.pop(context),
    ),
    body: FutureBuilder<Map<String, dynamic>>(
      future: _request,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(
            child: CircularProgressIndicator(
              semanticsLabel: 'Chargement de l’abonnement',
            ),
          );
        }
        if (snapshot.hasError) {
          return Center(
            child: Padding(
              padding: const EdgeInsets.all(KubaSpace.lg),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    snapshot.error is ApiException
                        ? (snapshot.error as ApiException).message
                        : 'Impossible de charger votre abonnement.',
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: KubaSpace.md),
                  FilledButton(
                    onPressed: () => setState(_reload),
                    child: const Text('Réessayer'),
                  ),
                ],
              ),
            ),
          );
        }
        final subscription =
            snapshot.data?['subscription'] as Map<String, dynamic>?;
        return RefreshIndicator(
          onRefresh: () async {
            setState(_reload);
            await _request.then<void>((_) {}, onError: (Object error) {});
          },
          child: ListView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(KubaSpace.lg),
            children: [
              Text(
                widget.session.context?.tenantName ?? 'Votre commerce',
                style: KubaType.headlineLg,
              ),
              const SizedBox(height: KubaSpace.lg),
              if (subscription == null)
                const KubaCard(
                  child: Text('Aucun abonnement enregistré pour ce commerce.'),
                )
              else
                KubaCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Text(
                        'Formule : ${switch (subscription['plan']) {
                          'essential' => 'Essentiel',
                          'control' => 'Contrôle',
                          final value => value ?? 'Non renseignée',
                        }}',
                        style: KubaType.headlineSm,
                      ),
                      const SizedBox(height: KubaSpace.md),
                      Text(
                        'Statut : ${switch (subscription['status']) {
                          'trial' => 'Période d’essai',
                          'active' => 'Actif',
                          'suspended' => 'Suspendu',
                          final value => value ?? 'Non renseigné',
                        }}',
                        style: KubaType.bodyMd,
                      ),
                      const Divider(),
                      Text(
                        'Début : ${_date(subscription['startAt'])}',
                        style: KubaType.bodyMd,
                      ),
                      const SizedBox(height: KubaSpace.sm),
                      Text(
                        'Échéance : ${_date(subscription['endAt'])}',
                        style: KubaType.bodyMd,
                      ),
                    ],
                  ),
                ),
            ],
          ),
        );
      },
    ),
  );
}
