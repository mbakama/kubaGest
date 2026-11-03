import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../core/api/auth_api.dart';
import '../../core/theme/kuba_tokens.dart';
import '../../core/validation.dart';
import '../../shared/brand.dart';
import '../../shared/ui/kuba_motion.dart';
import 'auth_canvas.dart';
import 'error_banner.dart';
import 'reset_password_screen.dart';

/// Saisie du code reçu par email, avant le choix du nouveau mot de passe.
class ResetCodeScreen extends StatefulWidget {
  const ResetCodeScreen({super.key, required this.email, this.verify});

  final String email;

  /// Remplace l'appel réseau dans les tests. Renvoie le jeton de changement.
  final Future<String> Function(String email, String code)? verify;

  @override
  State<ResetCodeScreen> createState() => _ResetCodeScreenState();
}

class _ResetCodeScreenState extends State<ResetCodeScreen> {
  final _formKey = GlobalKey<FormState>();
  final _code = TextEditingController();
  bool _submitting = false;
  String? _error;

  @override
  void dispose() {
    _code.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_submitting) return;
    setState(() => _error = null);
    if (!_formKey.currentState!.validate()) return;
    FocusScope.of(context).unfocus();
    setState(() => _submitting = true);
    try {
      final verify =
          widget.verify ??
          (String email, String code) =>
              AuthApi().verifyResetCode(email: email, code: code);
      final resetToken = await verify(widget.email, _code.text);
      if (!mounted) return;
      await Navigator.of(context).push(
        KubaPageRoute<void>(
          page: ResetPasswordScreen(resetToken: resetToken),
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
      title: 'Code reçu',
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
                  const StepEyebrow('Votre accès'),
                  const SizedBox(height: KubaSpace.sm),
                  const Text(
                    'Saisissez le code.',
                    style: KubaType.headlineXlMobile,
                  ),
                  const SizedBox(height: KubaSpace.sm),
                  Text(
                    'Nous l’avons envoyé à ${widget.email.trim()}.',
                    style: KubaType.bodyLg,
                  ),
                  const SizedBox(height: KubaSpace.lg),
                  TextFormField(
                    key: const ValueKey('reset-code'),
                    controller: _code,
                    enabled: !_submitting,
                    keyboardType: TextInputType.number,
                    textInputAction: TextInputAction.done,
                    autofillHints: const [AutofillHints.oneTimeCode],
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      LengthLimitingTextInputFormatter(6),
                    ],
                    decoration: const InputDecoration(
                      labelText: 'Code à 6 chiffres',
                      prefixIcon: Icon(Icons.pin_outlined),
                    ),
                    validator: validateResetCode,
                    onFieldSubmitted: (_) => _submit(),
                  ),
                  if (_error != null) ...[
                    const SizedBox(height: KubaSpace.md),
                    ErrorBanner(message: _error!),
                  ],
                  const SizedBox(height: KubaSpace.md),
                  ActionButton(
                    label: 'Continuer',
                    loading: _submitting,
                    onPressed: _submitting ? null : _submit,
                    icon: Icons.arrow_forward_rounded,
                  ),
                  const SizedBox(height: KubaSpace.sm),
                  Text(
                    'Le code est valable 15 minutes.',
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
