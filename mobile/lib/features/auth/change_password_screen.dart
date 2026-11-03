import 'package:flutter/material.dart';

import '../../core/theme/kuba_tokens.dart';
import '../../core/validation.dart';
import '../../shared/brand.dart';
import 'auth_canvas.dart';

/// Changement du mot de passe d'une personne déjà connectée.
///
/// Le mot de passe actuel est exigé. L'enregistrement côté serveur n'est pas
/// encore disponible : le formulaire vérifie les champs, puis le dit.
class ChangePasswordScreen extends StatefulWidget {
  const ChangePasswordScreen({super.key});

  @override
  State<ChangePasswordScreen> createState() => _ChangePasswordScreenState();
}

class _ChangePasswordScreenState extends State<ChangePasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _current = TextEditingController();
  final _password = TextEditingController();
  final _confirmation = TextEditingController();
  bool _obscure = true;
  bool _checked = false;

  @override
  void dispose() {
    _current.dispose();
    _password.dispose();
    _confirmation.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    FocusScope.of(context).unfocus();
    setState(() => _checked = true);
  }

  @override
  Widget build(BuildContext context) {
    return KubaAuthCanvas(
      title: 'Mot de passe',
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
                  const StepEyebrow('Votre compte'),
                  const SizedBox(height: KubaSpace.sm),
                  Text(
                    'Changez votre mot de passe.',
                    style: KubaType.headlineXlMobile,
                  ),
                  const SizedBox(height: KubaSpace.sm),
                  const Text(
                    'Indiquez le mot de passe actuel, puis celui qui le remplace.',
                    style: KubaType.bodyLg,
                  ),
                  const SizedBox(height: KubaSpace.lg),
                  TextFormField(
                    controller: _current,
                    enabled: !_checked,
                    obscureText: _obscure,
                    decoration: InputDecoration(
                      labelText: 'Mot de passe actuel',
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
                    validator: validatePassword,
                  ),
                  const SizedBox(height: KubaSpace.md),
                  TextFormField(
                    controller: _password,
                    enabled: !_checked,
                    obscureText: _obscure,
                    decoration: const InputDecoration(
                      labelText: 'Nouveau mot de passe',
                      helperText: 'Entre 8 et 72 caractères',
                      prefixIcon: Icon(Icons.lock_outline_rounded),
                    ),
                    validator: (value) => validatePassword(value, creation: true),
                  ),
                  const SizedBox(height: KubaSpace.md),
                  TextFormField(
                    controller: _confirmation,
                    enabled: !_checked,
                    obscureText: _obscure,
                    decoration: const InputDecoration(
                      labelText: 'Confirmer le mot de passe',
                      prefixIcon: Icon(Icons.lock_outline_rounded),
                    ),
                    validator: (value) =>
                        validatePasswordConfirmation(value, _password.text),
                    onFieldSubmitted: (_) => _submit(),
                  ),
                  const SizedBox(height: KubaSpace.md),
                  ActionButton(
                    label: 'Enregistrer',
                    onPressed: _checked ? null : _submit,
                    icon: Icons.check_rounded,
                  ),
                  const SizedBox(height: KubaSpace.sm),
                  Text(
                    _checked
                        ? 'Les champs sont valides. L’enregistrement sur le compte n’est pas encore disponible.'
                        : 'L’ancien mot de passe ne sera plus accepté.',
                    textAlign: TextAlign.center,
                    style: KubaType.labelSm.copyWith(color: KubaPalette.textMuted),
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
