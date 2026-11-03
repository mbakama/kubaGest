import 'package:flutter/material.dart';

import '../../core/api/auth_api.dart';
import '../../core/auth/auth_session.dart';
import '../../core/auth/token_store.dart';
import '../../core/theme/kuba_tokens.dart';
import '../../core/validation.dart';
import '../../shared/brand.dart';
import 'auth_canvas.dart';
import 'forgot_password_screen.dart';
import '../../shared/ui/kuba_motion.dart';
import 'error_banner.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({
    super.key,
    required this.onAuthenticated,
    this.submit,
    this.onCreateAccount,
    this.rememberedEmails,
  });
  final AuthenticationCallback onAuthenticated;
  final VoidCallback? onCreateAccount;

  /// Magasin de l'email retenu. Absent : mémoire de l'application ouverte.
  final RememberedEmailStorage? rememberedEmails;
  final Future<Map<String, dynamic>> Function(String email, String password)?
  submit;
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _emailFocus = FocusNode();
  final _passwordFocus = FocusNode();

  @override
  void initState() {
    super.initState();
    final saved = rememberedEmail;
    if (widget.rememberedEmails == null && saved != null && saved.isNotEmpty) {
      _email.text = saved;
      _remember = true;
    } else {
      _restoreRememberedEmail();
    }
  }

  Future<void> _restoreRememberedEmail() async {
    final saved = await widget.rememberedEmails?.readRememberedEmail();
    if (!mounted || saved == null || saved.isEmpty) return;
    setState(() {
      _email.text = saved;
      _remember = true;
    });
  }

  bool _submitting = false;
  bool _obscure = true;
  bool _remember = false;
  String? _error;

  /// Email retenu sur cet appareil pour la session de l'application.
  /// Le mot de passe n'est jamais conservé.
  static String? rememberedEmail;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    _emailFocus.dispose();
    _passwordFocus.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_submitting) return;
    setState(() => _error = null);
    if (!_formKey.currentState!.validate()) {
      (validateEmail(_email.text) != null ? _emailFocus : _passwordFocus)
          .requestFocus();
      return;
    }
    FocusScope.of(context).unfocus();
    setState(() => _submitting = true);
    try {
      final submit =
          widget.submit ??
          (String email, String password) =>
              AuthApi().login(email: email, password: password);
      final body = await submit(_email.text, _password.text);
      if (!mounted) return;
      await _keepEmail();
      await widget.onAuthenticated(AuthSession.fromJson(body));
    } on FormatException {
      if (mounted) setState(() => _error = 'Réponse du serveur illisible.');
    } catch (error) {
      if (mounted) setState(() => _error = error.toString());
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  Future<void> _keepEmail() async {
    final email = _email.text.trim();
    final store = widget.rememberedEmails;
    if (store != null) {
      if (_remember) {
        await store.saveRememberedEmail(email);
      } else {
        await store.clearRememberedEmail();
      }
    }
    rememberedEmail = _remember ? email : null;
  }

  void _openHelp() => showModalBottomSheet<void>(
    context: context,
    builder: (_) => SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(
          KubaSpace.lg,
          0,
          KubaSpace.lg,
          KubaSpace.lg,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Retrouver votre accès',
              style: KubaType.headlineLg.copyWith(fontSize: 22),
            ),
            const SizedBox(height: KubaSpace.sm),
            const Text(
              'Indiquez l’adresse du compte : un code est envoyé seulement si ce compte existe. Un compte créé par le propriétaire du commerce se rétablit auprès de lui.',
              style: KubaType.bodyMd,
            ),
            const SizedBox(height: KubaSpace.lg),
            ActionButton(
              label: 'J’ai compris',
              icon: Icons.check_rounded,
              onPressed: () => Navigator.pop(context),
            ),
          ],
        ),
      ),
    ),
  );

  @override
  Widget build(BuildContext context) => PopScope(
    canPop: !_submitting,
    child: KubaAuthCanvas(
      title: 'Connexion',
      showBack: true,
      onBack: _submitting ? null : () => Navigator.maybePop(context),
      actions: [
        IconButton(
          tooltip: 'Aide',
          onPressed: _submitting ? null : _openHelp,
          icon: const Icon(Icons.help_outline_rounded),
        ),
      ],
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 480),
          child: AutofillGroup(
            child: SingleChildScrollView(
              keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
              padding: const EdgeInsets.fromLTRB(
                KubaSpace.lg,
                KubaSpace.lg,
                KubaSpace.lg,
                KubaSpace.xl,
              ),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const KubaAppear(child: _LoginHero()),
                    const SizedBox(height: KubaSpace.lg),
                    const _FieldLabel(
                      icon: Icons.key_rounded,
                      label: 'Vos identifiants',
                    ),
                    const SizedBox(height: KubaSpace.sm),
                    TextFormField(
                      key: const ValueKey('login-email'),
                      controller: _email,
                      focusNode: _emailFocus,
                      enabled: !_submitting,
                      maxLength: 255,
                      keyboardType: TextInputType.emailAddress,
                      textInputAction: TextInputAction.next,
                      autofillHints: const [AutofillHints.username],
                      autocorrect: false,
                      decoration: const InputDecoration(
                        labelText: 'Adresse email',
                        hintText: 'vous@exemple.com',
                        prefixIcon: Icon(Icons.alternate_email_rounded),
                        counterText: '',
                      ),
                      validator: validateEmail,
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      key: const ValueKey('login-password'),
                      controller: _password,
                      focusNode: _passwordFocus,
                      enabled: !_submitting,
                      obscureText: _obscure,
                      textInputAction: TextInputAction.done,
                      autofillHints: const [AutofillHints.password],
                      decoration: InputDecoration(
                        labelText: 'Mot de passe',
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
                      onFieldSubmitted: (_) => _submit(),
                    ),
                    const SizedBox(height: KubaSpace.sm),
                    DecoratedBox(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(18),
                      ),
                      child: Column(
                        children: [
                          CheckboxListTile(
                            value: _remember,
                            onChanged: _submitting
                                ? null
                                : (value) => setState(
                                    () => _remember = value ?? false,
                                  ),
                            controlAffinity: ListTileControlAffinity.leading,
                            contentPadding: const EdgeInsets.symmetric(
                              horizontal: 8,
                            ),
                            title: const Text('Mémoriser les identifiants'),
                          ),
                          const Divider(height: 1),
                          ListTile(
                            title: const Text('Mot de passe oublié'),
                            trailing: const Icon(Icons.chevron_right_rounded),
                            onTap: _submitting
                                ? null
                                : () => Navigator.of(context).push(
                                    KubaPageRoute<void>(
                                      page: const ForgotPasswordScreen(),
                                    ),
                                  ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: KubaSpace.md),
                    AnimatedSize(
                      duration: KubaMotion.of(context, KubaMotion.base),
                      curve: KubaMotion.emphasized,
                      alignment: Alignment.topCenter,
                      child: _error == null
                          ? const SizedBox(width: double.infinity)
                          : Padding(
                              padding: const EdgeInsets.only(
                                bottom: KubaSpace.md,
                              ),
                              child: ErrorBanner(message: _error!),
                            ),
                    ),
                    ActionButton(
                      label: _submitting ? 'Connexion…' : 'Se connecter',
                      loading: _submitting,
                      onPressed: _submit,
                      icon: Icons.login_rounded,
                    ),
                    const SizedBox(height: KubaSpace.lg),
                    const Row(
                      children: [
                        Expanded(child: Divider()),
                        Padding(
                          padding: EdgeInsets.symmetric(
                            horizontal: KubaSpace.md,
                          ),
                          child: Text(
                            'Nouveau chez KubaGest ?',
                            style: KubaType.labelSm,
                          ),
                        ),
                        Expanded(child: Divider()),
                      ],
                    ),
                    if (widget.onCreateAccount != null)
                      Padding(
                        padding: const EdgeInsets.only(top: KubaSpace.xs),
                        child: TextButton(
                          onPressed: _submitting
                              ? null
                              : widget.onCreateAccount,
                          child: const Text('Créer mon commerce'),
                        ),
                      ),
                    const SizedBox(height: KubaSpace.md),
                    const _SecurityNote(),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  );
}

/// Bandeau d'identité, carte claire de la maquette V6.
class _LoginHero extends StatelessWidget {
  const _LoginHero();

  @override
  Widget build(BuildContext context) => Container(
    clipBehavior: Clip.antiAlias,
    decoration: BoxDecoration(
      color: Colors.white.withValues(alpha: 0.92),
      borderRadius: BorderRadius.circular(24),
      border: Border.all(color: Colors.white),
    ),
    child: Stack(
      children: [
        Positioned(
          right: -18,
          bottom: -26,
          child: Icon(
            Icons.storefront_rounded,
            size: 138,
            color: Colors.white.withValues(alpha: 0.05),
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 42,
                    height: 42,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: KubaPalette.brandSoft,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: const Icon(
                      Icons.lock_open_rounded,
                      size: 20,
                      color: KubaPalette.brand,
                    ),
                  ),
                  const Spacer(),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: KubaPalette.textPrimary,
                      borderRadius: BorderRadius.circular(99),
                    ),
                    child: Text(
                      'Connexion sécurisée',
                      style: KubaType.labelSm.copyWith(color: Colors.white),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: KubaSpace.md),
              const StepEyebrow('Votre espace vous attend'),
              const SizedBox(height: KubaSpace.sm),
              Text(
                'Heureux de\nvous retrouver.',
                style: KubaType.headlineXlMobile.copyWith(fontSize: 28),
              ),
              const SizedBox(height: 6),
              Text(
                'Connectez-vous avec le compte de votre commerce.',
                style: KubaType.bodySm.copyWith(fontSize: 14),
              ),
            ],
          ),
        ),
      ],
    ),
  );
}

/// Intitulé discret au-dessus d'un groupe de champs.
class _FieldLabel extends StatelessWidget {
  const _FieldLabel({required this.icon, required this.label});

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) => Row(
    children: [
      Icon(icon, size: 15, color: KubaPalette.textMuted),
      const SizedBox(width: 6),
      Text(
        label.toUpperCase(),
        style: KubaType.eyebrow.copyWith(
          color: KubaPalette.textMuted,
          fontSize: 10,
          letterSpacing: 1.2,
        ),
      ),
    ],
  );
}

class _SecurityNote extends StatelessWidget {
  const _SecurityNote();

  @override
  Widget build(BuildContext context) => Row(
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
      const Icon(Icons.shield_outlined, size: 15, color: KubaPalette.textMuted),
      const SizedBox(width: 6),
      Flexible(
        child: Text(
          'Votre mot de passe reste confidentiel.',
          style: KubaType.labelSm.copyWith(color: KubaPalette.textMuted),
        ),
      ),
    ],
  );
}
