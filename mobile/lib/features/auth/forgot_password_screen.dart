import 'package:flutter/material.dart';

import '../../core/api/auth_api.dart';
import '../../core/theme/kuba_tokens.dart';
import '../../core/validation.dart';
import '../../shared/brand.dart';
import '../../shared/ui/kuba_motion.dart';
import 'auth_canvas.dart';
import 'error_banner.dart';
import 'reset_code_screen.dart';

/// Demande l'adresse email, puis ouvre la saisie du code reçu.
///
/// Le code part seulement si l'API confirme un compte actif. Une adresse
/// inconnue ou un compte désactivé affiche l'erreur renvoyée par le serveur.
class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key, this.requestReset});

  /// Remplace l'appel réseau dans les tests.
  final Future<void> Function(String email)? requestReset;

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _email = TextEditingController();
  bool _submitting = false;
  String? _error;

  @override
  void dispose() {
    _email.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_submitting) return;
    setState(() => _error = null);
    if (!_formKey.currentState!.validate()) return;
    FocusScope.of(context).unfocus();
    setState(() => _submitting = true);
    try {
      final request =
          widget.requestReset ??
          (String email) => AuthApi().requestPasswordReset(email: email);
      await request(_email.text);
      if (!mounted) return;
      await Navigator.of(context).push(
        KubaPageRoute<void>(
          page: ResetCodeScreen(email: _email.text.trim()),
        ),
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
      title: 'Mot de passe oublié',
      showBack: true,
      onBack: () => Navigator.maybePop(context),
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
                  const StepEyebrow('Votre accès'),
                  const SizedBox(height: KubaSpace.sm),
                  const Text(
                    'Indiquez votre email.',
                    style: KubaType.headlineXlMobile,
                  ),
                  const SizedBox(height: KubaSpace.sm),
                  const Text(
                    'Nous vous enverrons un code pour choisir un nouveau mot de passe.',
                    style: KubaType.bodyLg,
                  ),
                  const SizedBox(height: KubaSpace.lg),
                  TextFormField(
                    key: const ValueKey('forgot-email'),
                    controller: _email,
                    keyboardType: TextInputType.emailAddress,
                    autofillHints: const [AutofillHints.email],
                    textInputAction: TextInputAction.done,
                    decoration: const InputDecoration(
                      labelText: 'Adresse email',
                      prefixIcon: Icon(Icons.mail_outline_rounded),
                    ),
                    validator: validateEmail,
                    onFieldSubmitted: (_) => _submit(),
                  ),
                  if (_error != null) ...[
                    const SizedBox(height: KubaSpace.md),
                    ErrorBanner(message: _error!),
                  ],
                  const SizedBox(height: KubaSpace.md),
                  ActionButton(
                    label: 'Envoyer le code',
                    loading: _submitting,
                    onPressed: _submitting ? null : _submit,
                    icon: Icons.arrow_forward_rounded,
                  ),
                  const SizedBox(height: KubaSpace.sm),
                  Text(
                    'Saisissez le code reçu, puis choisissez le mot de passe qui remplace l’ancien.',
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
