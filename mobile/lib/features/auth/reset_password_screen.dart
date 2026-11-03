import 'package:flutter/material.dart';

import '../../core/api/auth_api.dart';
import '../../core/theme/kuba_tokens.dart';
import '../../core/validation.dart';
import '../../shared/brand.dart';
import 'auth_canvas.dart';
import 'error_banner.dart';

/// Choix du mot de passe qui remplace l’ancien, après vérification du code.
class ResetPasswordScreen extends StatefulWidget {
  const ResetPasswordScreen({
    super.key,
    required this.resetToken,
    this.confirm,
  });

  final String resetToken;

  /// Remplace l'appel réseau dans les tests.
  final Future<void> Function(String resetToken, String password)? confirm;

  @override
  State<ResetPasswordScreen> createState() => _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends State<ResetPasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _password = TextEditingController();
  final _confirmation = TextEditingController();
  bool _obscure = true;
  bool _submitting = false;
  String? _error;

  @override
  void dispose() {
    _password.dispose();
    _confirmation.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_submitting) return;
    setState(() => _error = null);
    if (!_formKey.currentState!.validate()) return;
    FocusScope.of(context).unfocus();
    setState(() => _submitting = true);
    try {
      final confirm =
          widget.confirm ??
          (String resetToken, String password) => AuthApi()
              .confirmResetPassword(resetToken: resetToken, password: password);
      await confirm(widget.resetToken, _password.text);
      if (!mounted) return;
      Navigator.of(context).popUntil(
        (route) => route.settings.name == 'login' || route.isFirst,
      );
    } catch (error) {
      if (!mounted) return;
      setState(() => _error = error.toString());
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return KubaAuthCanvas(
      title: 'Mot de passe',
      showBack: true,
      onBack: _submitting ? null : () => Navigator.maybePop(context),
      child: Align(
        alignment: Alignment.topCenter,
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 480),
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const StepEyebrow('Votre compte'),
                  const SizedBox(height: KubaSpace.sm),
                  const Text(
                    'Choisissez un nouveau mot de passe.',
                    style: KubaType.headlineXlMobile,
                  ),
                  const SizedBox(height: KubaSpace.sm),
                  const Text(
                    'Il remplace l’ancien pour ce compte.',
                    style: KubaType.bodyLg,
                  ),
                  const SizedBox(height: KubaSpace.lg),
                  TextFormField(
                    key: const ValueKey('reset-password'),
                    controller: _password,
                    enabled: !_submitting,
                    obscureText: _obscure,
                    textInputAction: TextInputAction.next,
                    autofillHints: const [AutofillHints.newPassword],
                    decoration: InputDecoration(
                      labelText: 'Nouveau mot de passe',
                      prefixIcon: const Icon(Icons.lock_outline_rounded),
                      suffixIcon: IconButton(
                        tooltip: _obscure
                            ? 'Afficher le mot de passe'
                            : 'Masquer le mot de passe',
                        onPressed: () => setState(() => _obscure = !_obscure),
                        icon: Icon(
                          _obscure
                              ? Icons.visibility_outlined
                              : Icons.visibility_off_outlined,
                        ),
                      ),
                    ),
                    validator: (value) => validatePassword(value, creation: true),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    key: const ValueKey('reset-password-confirmation'),
                    controller: _confirmation,
                    enabled: !_submitting,
                    obscureText: _obscure,
                    textInputAction: TextInputAction.done,
                    decoration: const InputDecoration(
                      labelText: 'Confirmer le mot de passe',
                      prefixIcon: Icon(Icons.lock_outline_rounded),
                    ),
                    validator: (value) =>
                        validatePasswordConfirmation(value, _password.text),
                    onFieldSubmitted: (_) => _submit(),
                  ),
                  const SizedBox(height: KubaSpace.sm),
                  Text(
                    'Entre 8 et 72 caractères.',
                    style: KubaType.labelSm.copyWith(
                      color: KubaPalette.textMuted,
                    ),
                  ),
                  if (_error != null) ...[
                    const SizedBox(height: KubaSpace.md),
                    ErrorBanner(message: _error!),
                  ],
                  const SizedBox(height: KubaSpace.md),
                  ActionButton(
                    label: 'Enregistrer',
                    loading: _submitting,
                    onPressed: _submitting ? null : _submit,
                    icon: Icons.check_rounded,
                  ),
                  const SizedBox(height: KubaSpace.sm),
                  Text(
                    'L’ancien mot de passe ne sera plus accepté.',
                    textAlign: TextAlign.center,
                    style: KubaType.labelSm.copyWith(
                      color: KubaPalette.textMuted,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
