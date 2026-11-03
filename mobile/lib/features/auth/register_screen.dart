import 'dart:typed_data';

import 'package:flutter/material.dart';

import '../../core/api/auth_api.dart';
import '../../core/auth/auth_session.dart';
import '../../core/auth/avatar_vault.dart';
import '../../core/media/avatar_picker.dart';
import '../../core/theme/kuba_tokens.dart';
import '../../core/validation.dart';
import '../../shared/brand.dart';
import '../../shared/ui/avatar_picker_sheet.dart';
import '../../shared/ui/kuba_avatar.dart';
import '../../shared/ui/kuba_badge.dart';
import '../../shared/ui/kuba_card.dart';
import '../../shared/ui/kuba_motion.dart';
import 'auth_canvas.dart';
import 'error_banner.dart';

typedef RegistrationSubmit =
    Future<Map<String, dynamic>> Function({
      required String tenantName,
      required String activityType,
      required String currency,
      required String firstName,
      required String lastName,
      required String email,
      required String password,
      String? address,
      String? phone,
    });

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({
    super.key,
    required this.onAuthenticated,
    this.submit,
    this.onLogin,
    this.avatarPicker,
    this.api,
  });
  final AuthenticationCallback onAuthenticated;
  final RegistrationSubmit? submit;
  final VoidCallback? onLogin;

  /// Sélection de la photo de profil (injectable en test).
  final AvatarPicker? avatarPicker;
  final AuthApi? api;
  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _tenantName = TextEditingController();
  final _address = TextEditingController();
  final _firstName = TextEditingController();
  final _lastName = TextEditingController();
  final _phone = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _confirmation = TextEditingController();
  final _nameFocus = FocusNode();
  final _emailFocus = FocusNode();
  final _passwordFocus = FocusNode();
  final _confirmationFocus = FocusNode();
  final _scroll = ScrollController();
  late final AvatarPicker _avatarPicker =
      widget.avatarPicker ?? DeviceAvatarPicker();
  Uint8List? _avatar;
  int _step = 0;
  bool _forward = true;
  String? _activity;
  String _currency = 'CDF';
  bool _submitting = false;
  bool _obscure = true;
  String? _error;
  AuthSession? _createdSession;

  static const _activities = [
    (
      'boutique',
      'Boutique',
      'Vos articles, vos ventes et votre caisse.',
      Icons.storefront_outlined,
      KubaPalette.brand,
    ),
    (
      'alimentation',
      'Alimentation',
      'Le quotidien et les produits périssables.',
      Icons.local_grocery_store_outlined,
      KubaPalette.stock,
    ),
    (
      'pharmacie',
      'Pharmacie',
      'Les médicaments, les lots et les péremptions.',
      Icons.local_pharmacy_outlined,
      KubaPalette.credit,
    ),
  ];

  static const _stepTitles = [
    'À chaque commerce,\nson espace.',
    'Donnons-lui\nun nom.',
    'Et vous,\nfaisons connaissance.',
  ];

  static const _stepDescriptions = [
    'Choisissez votre activité. KubaGest s’adaptera aux besoins de votre établissement.',
    'Quelques informations pour préparer votre espace de travail.',
    'Votre prénom s’affichera à chaque ouverture. Ces identifiants servent sur mobile et sur ordinateur.',
  ];

  @override
  void dispose() {
    for (final controller in [
      _tenantName,
      _address,
      _firstName,
      _lastName,
      _phone,
      _email,
      _password,
      _confirmation,
    ]) {
      controller.dispose();
    }
    for (final focus in [
      _nameFocus,
      _emailFocus,
      _passwordFocus,
      _confirmationFocus,
    ]) {
      focus.dispose();
    }
    _scroll.dispose();
    super.dispose();
  }

  /// Ouvre le choix de la photo, puis applique la sélection à l'aperçu.
  ///
  /// La photo est facultative : l'annulation laisse l'étape inchangée.
  Future<void> _pickAvatar() async {
    if (_submitting || _createdSession != null) return;
    FocusScope.of(context).unfocus();
    final selection = await chooseAvatarPhoto(
      context,
      picker: _avatarPicker,
      hasPhoto: _avatar != null,
    );
    if (selection == null || !mounted) return;
    final bytes = selection.remove ? null : selection.bytes;
    setState(() => _avatar = bytes);
    AvatarVault.instance.setPhoto(bytes);
  }

  /// Affiche le message au-dessus des choix, puis ramène la page en haut.
  void _revealError(String message) {
    setState(() => _error = message);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted || !_scroll.hasClients) return;
      _scroll.animateTo(
        0,
        duration: KubaMotion.of(context, KubaMotion.base),
        curve: KubaMotion.standard,
      );
    });
  }

  void _back() {
    if (_submitting || _createdSession != null) return;
    FocusScope.of(context).unfocus();
    if (_step == 0) {
      Navigator.of(context).maybePop();
    } else {
      setState(() {
        _forward = false;
        _step--;
        _error = null;
      });
    }
  }

  Future<void> _continue() async {
    if (_submitting) return;
    setState(() => _error = null);
    if (_step == 0) {
      if (_activity == null) {
        _revealError(
          'Choisissez le type de votre commerce pour continuer.',
        );
        return;
      }
    } else if (!_formKey.currentState!.validate()) {
      if (_step == 1) {
        _nameFocus.requestFocus();
      } else if (validateEmail(_email.text) != null) {
        _emailFocus.requestFocus();
      } else if (validatePassword(_password.text, creation: true) != null) {
        _passwordFocus.requestFocus();
      } else {
        _confirmationFocus.requestFocus();
      }
      return;
    }
    FocusScope.of(context).unfocus();
    if (_step < 2) {
      setState(() {
        _forward = true;
        _step++;
      });
      return;
    }
    await _submit();
  }

  Future<void> _submit() async {
    if (_submitting) return;
    setState(() => _submitting = true);
    try {
      if (_createdSession == null) {
        final body = widget.submit != null
            ? await widget.submit!(
                tenantName: _tenantName.text,
                activityType: _activity!,
                currency: _currency,
                firstName: _firstName.text,
                lastName: _lastName.text,
                phone: _phone.text,
                email: _email.text,
                password: _password.text,
                address: _address.text,
              )
            : await AuthApi().register(
                firstName: _firstName.text,
                lastName: _lastName.text,
                phone: _phone.text,
                tenantName: _tenantName.text,
                activityType: _activity!,
                currency: _currency,
                email: _email.text,
                password: _password.text,
                address: _address.text,
              );
        _createdSession = AuthSession.fromJson(body);
      }
      if (_avatar != null && (widget.submit == null || widget.api != null)) {
        final uploaded = await (widget.api ?? AuthApi()).uploadAvatar(
          accessToken: _createdSession!.accessToken,
          bytes: _avatar!,
        );
        _createdSession = _createdSession!.copyWith(
          user: AuthUser.fromJson(uploaded),
        );
        _avatar = null;
        AvatarVault.instance.clear();
      }
      if (!mounted) return;
      await widget.onAuthenticated(_createdSession!);
    } on FormatException {
      if (mounted) {
        _revealError(
          'Réponse du serveur illisible. Vérifiez votre compte avant de renouveler la création.',
        );
      }
    } catch (error) {
      if (mounted) {
        _revealError(
          _createdSession == null
              ? error.toString()
              : 'Votre commerce est créé, mais votre session n’a pas pu être enregistrée. Réessayez pour ouvrir votre espace.',
        );
      }
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) => PopScope(
    canPop: _step == 0 && !_submitting && _createdSession == null,
    onPopInvokedWithResult: (didPop, _) {
      if (!didPop) _back();
    },
    child: KubaAuthCanvas(
      title: 'Nouveau commerce',
      showBack: true,
      onBack: _submitting || _createdSession != null ? null : _back,
      child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 500),
            child: Column(
              children: [
                _progressBar(context),
                Expanded(
                  child: SingleChildScrollView(
                    controller: _scroll,
                    keyboardDismissBehavior:
                        ScrollViewKeyboardDismissBehavior.onDrag,
                    padding: const EdgeInsets.fromLTRB(
                      KubaSpace.lg,
                      KubaSpace.lg,
                      KubaSpace.lg,
                      KubaSpace.lg,
                    ),
                    child: AutofillGroup(
                      child: Form(
                        key: _formKey,
                        child: AnimatedSwitcher(
                          duration: KubaMotion.of(context, KubaMotion.base),
                          switchInCurve: KubaMotion.emphasized,
                          switchOutCurve: Curves.easeInCubic,
                          layoutBuilder: (current, previous) => Stack(
                            alignment: Alignment.topLeft,
                            children: [...previous, ?current],
                          ),
                          transitionBuilder: (child, animation) {
                            final entering = child.key == ValueKey(_step);
                            final begin = Offset(_forward ? 0.055 : -0.055, 0);
                            return FadeTransition(
                              opacity: animation,
                              child: SlideTransition(
                                position: Tween<Offset>(
                                  begin: entering ? begin : -begin,
                                  end: Offset.zero,
                                ).animate(animation),
                                child: child,
                              ),
                            );
                          },
                          child: KeyedSubtree(
                            key: ValueKey(_step),
                            child: _stepBody(),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                _footer(context),
              ],
            ),
          ),
        ),
      ),
  );

  Widget _stepBody() => Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: [
      StepEyebrow(
        [
          'Votre activité',
          'Votre commerce',
          'Vous',
        ][_step],
      ),
      const SizedBox(height: KubaSpace.sm),
      Semantics(
        header: true,
        child: Text(_stepTitles[_step], style: KubaType.headlineXlMobile),
      ),
      const SizedBox(height: KubaSpace.sm),
      Text(_stepDescriptions[_step], style: KubaType.bodyLg),
      if (_error != null) ...[
        const SizedBox(height: KubaSpace.md),
        ErrorBanner(message: _error!),
      ],
      const SizedBox(height: KubaSpace.lg),
      if (_step == 0) ..._activityChoices(),
      if (_step == 1) ..._businessFields(),
      if (_step == 2) ..._accountFields(),
    ],
  );

  Widget _progressBar(BuildContext context) => Padding(
    padding: const EdgeInsets.fromLTRB(
      KubaSpace.lg,
      KubaSpace.md,
      KubaSpace.lg,
      0,
    ),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'CRÉATION DU COMMERCE',
              style: KubaType.eyebrow.copyWith(
                color: const Color(0xff5c615d),
                fontSize: 11,
                letterSpacing: 0.7,
              ),
            ),
            const SizedBox(height: 8),
            SizedBox(
              width: 118,
              child: Row(
                children: List.generate(
                  3,
                  (index) => Expanded(
                    child: AnimatedContainer(
                      duration: MediaQuery.disableAnimationsOf(context)
                          ? Duration.zero
                          : const Duration(milliseconds: 180),
                      height: 4,
                      margin: EdgeInsets.only(right: index == 2 ? 0 : 6),
                      decoration: BoxDecoration(
                        color: index <= _step
                            ? KubaPalette.brand
                            : const Color(0xffd7ddd8),
                        borderRadius: KubaRadius.pillAll,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
        const Spacer(),
        Semantics(
          liveRegion: true,
          child: Text(
            'Étape ${_step + 1} sur 3',
            style: KubaType.labelSm.copyWith(
              color: const Color(0xff5c615d),
              fontSize: 12,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
      ],
    ),
  );

  Widget _footer(BuildContext context) => Container(
    padding: const EdgeInsets.fromLTRB(
      KubaSpace.lg,
      KubaSpace.md,
      KubaSpace.lg,
      KubaSpace.md,
    ),
    decoration: const BoxDecoration(),
    child: Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        ActionButton(
          label: _createdSession != null
              ? 'Ouvrir mon espace'
              : _submitting
              ? 'Création du commerce…'
              : _step == 2
              ? 'Créer mon commerce'
              : 'Continuer',
          loading: _submitting,
          onPressed: _createdSession != null ? _submit : _continue,
        ),
        if (_step == 0 && widget.onLogin != null)
          TextButton(
            onPressed: widget.onLogin,
            child: const Text('J’ai déjà un compte'),
          ),
        if (_step == 2)
          Padding(
            padding: const EdgeInsets.only(top: KubaSpace.xs),
            child: Text(
              'Votre compte sera créé à la validation.',
              textAlign: TextAlign.center,
              style: KubaType.labelSm.copyWith(color: KubaPalette.textMuted),
            ),
          ),
      ],
    ),
  );

  List<Widget> _activityChoices() => [
    for (final activity in _activities) ...[
      _ActivityOption(
        label: activity.$2,
        description: activity.$3,
        icon: activity.$4,
        accent: activity.$5,
        selected: _activity == activity.$1,
        onTap: () => setState(() {
          _activity = activity.$1;
          _error = null;
        }),
      ),
      const SizedBox(height: KubaSpace.sm),
    ],
    const SizedBox(height: KubaSpace.sm),
    const KubaCard(
      tone: KubaCardTone.notice,
      padding: EdgeInsets.all(KubaSpace.md),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.info_outline_rounded, size: 18, color: KubaPalette.cash),
          SizedBox(width: KubaSpace.sm),
          Expanded(
            child: Text(
              'Le type d’activité est fixé à l’activation. Prenez un instant pour choisir celui qui vous correspond.',
              style: KubaType.bodySm,
            ),
          ),
        ],
      ),
    ),
  ];

  List<Widget> _businessFields() => [
    TextFormField(
      key: const ValueKey('register-name'),
      controller: _tenantName,
      focusNode: _nameFocus,
      maxLength: 150,
      textCapitalization: TextCapitalization.words,
      textInputAction: TextInputAction.next,
      decoration: const InputDecoration(
        labelText: 'Nom du commerce *',
        hintText: 'Le nom affiché à vos équipes',
        prefixIcon: Icon(Icons.storefront_outlined),
        counterText: '',
      ),
      validator: (value) => validateName(value, label: 'Le nom du commerce'),
    ),
    const SizedBox(height: KubaSpace.lg),
    const Text('Devise de référence', style: KubaType.headlineSm),
    const SizedBox(height: KubaSpace.sm),
    SegmentedButton<String>(
      segments: const [
        ButtonSegment(
          value: 'CDF',
          label: Text('Franc congolais · CDF'),
          icon: Icon(Icons.payments_outlined, size: 17),
        ),
        ButtonSegment(
          value: 'USD',
          label: Text('Dollar · USD'),
          icon: Icon(Icons.attach_money_rounded, size: 17),
        ),
      ],
      selected: {_currency},
      onSelectionChanged: (selection) =>
          setState(() => _currency = selection.first),
      style: SegmentedButton.styleFrom(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 6),
        textStyle: KubaType.labelSm.copyWith(fontSize: 11),
        backgroundColor: KubaPalette.surfaceRaised,
        selectedBackgroundColor: KubaPalette.brandSoft,
        selectedForegroundColor: KubaPalette.brandDeep,
        foregroundColor: KubaPalette.textMuted,
        side: const BorderSide(color: KubaPalette.borderStrong),
        shape: const RoundedRectangleBorder(borderRadius: KubaRadius.baseAll),
      ),
    ),
    const SizedBox(height: KubaSpace.sm),
    const Text(
      'La devise de référence est fixée à l’activation. Elle ne limite pas les moyens de paiement prévus pour vos ventes.',
      style: KubaType.bodySm,
    ),
    const SizedBox(height: KubaSpace.lg),
    TextFormField(
      key: const ValueKey('register-address'),
      controller: _address,
      maxLength: 255,
      textCapitalization: TextCapitalization.sentences,
      decoration: const InputDecoration(
        labelText: 'Adresse (facultatif)',
        prefixIcon: Icon(Icons.location_on_outlined),
        counterText: '',
      ),
    ),
  ];

  List<Widget> _accountFields() => [
    KubaCard(
      tone: KubaCardTone.brand,
      child: Row(
        children: [
          const KubaIconPastille(
            icon: Icons.storefront_outlined,
            diameter: 32,
            iconSize: 18,
            background: Colors.white,
          ),
          const SizedBox(width: KubaSpace.sm),
          Expanded(
            child: Text(_tenantName.text.trim(), style: KubaType.headlineSm),
          ),
          const SizedBox(width: KubaSpace.sm),
          KubaBadge(label: _currency, tone: KubaTone.brand),
        ],
      ),
    ),
    const SizedBox(height: KubaSpace.lg),
    Row(
      children: [
        KubaAvatarPicker(
          key: const ValueKey('register-avatar'),
          photo: _avatar,
          initials: kubaInitials(
            firstName: _firstName.text,
            lastName: _lastName.text,
          ),
          enabled: !_submitting && _createdSession == null,
          onPressed: _pickAvatar,
        ),
        const SizedBox(width: KubaSpace.md),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                _avatar == null ? 'Votre photo' : 'Photo prête',
                style: KubaType.headlineSm.copyWith(fontSize: 15),
              ),
              const SizedBox(height: 2),
              Text(
                _avatar == null
                    ? 'Facultatif. Touchez pour en choisir une.'
                    : 'Touchez pour la changer ou la retirer.',
                style: KubaType.bodySm,
              ),
            ],
          ),
        ),
      ],
    ),
    const SizedBox(height: KubaSpace.md),
    TextFormField(
      key: const ValueKey('register-first-name'),
      controller: _firstName,
      textCapitalization: TextCapitalization.words,
      textInputAction: TextInputAction.next,
      onChanged: (_) => setState(() {}),
      decoration: const InputDecoration(
        labelText: 'Prénom *',
        prefixIcon: Icon(Icons.person_outline_rounded),
      ),
      validator: (value) => validateName(value, label: 'Le prénom'),
    ),
    const SizedBox(height: KubaSpace.md),
    TextFormField(
      key: const ValueKey('register-last-name'),
      controller: _lastName,
      textCapitalization: TextCapitalization.words,
      textInputAction: TextInputAction.next,
      onChanged: (_) => setState(() {}),
      decoration: const InputDecoration(
        labelText: 'Nom *',
        prefixIcon: Icon(Icons.badge_outlined),
      ),
      validator: (value) => validateName(value, label: 'Le nom'),
    ),
    const SizedBox(height: KubaSpace.md),
    TextFormField(
      key: const ValueKey('register-phone'),
      controller: _phone,
      keyboardType: TextInputType.phone,
      textInputAction: TextInputAction.next,
      decoration: const InputDecoration(
        labelText: 'Téléphone (facultatif)',
        prefixIcon: Icon(Icons.phone_outlined),
      ),
    ),
    const SizedBox(height: KubaSpace.md),
    TextFormField(
      key: const ValueKey('register-email'),
      controller: _email,
      focusNode: _emailFocus,
      enabled: !_submitting && _createdSession == null,
      maxLength: 255,
      keyboardType: TextInputType.emailAddress,
      textInputAction: TextInputAction.next,
      autofillHints: const [AutofillHints.newUsername],
      autocorrect: false,
      decoration: const InputDecoration(
        labelText: 'Adresse email *',
        hintText: 'vous@exemple.com',
        prefixIcon: Icon(Icons.alternate_email_rounded),
        counterText: '',
      ),
      validator: validateEmail,
    ),
    const SizedBox(height: KubaSpace.md),
    TextFormField(
      key: const ValueKey('register-password'),
      controller: _password,
      focusNode: _passwordFocus,
      enabled: !_submitting && _createdSession == null,
      maxLength: 72,
      obscureText: _obscure,
      textInputAction: TextInputAction.next,
      autofillHints: const [AutofillHints.newPassword],
      decoration: InputDecoration(
        labelText: 'Mot de passe *',
        helperText: 'Entre 8 et 72 caractères',
        counterText: '',
        prefixIcon: const Icon(Icons.lock_outline_rounded),
        suffixIcon: IconButton(
          tooltip: _obscure
              ? 'Afficher le mot de passe'
              : 'Masquer le mot de passe',
          icon: Icon(
            _obscure
                ? Icons.visibility_outlined
                : Icons.visibility_off_outlined,
          ),
          onPressed: () => setState(() => _obscure = !_obscure),
        ),
      ),
      validator: (value) => validatePassword(value, creation: true),
    ),
    const SizedBox(height: KubaSpace.md),
    TextFormField(
      key: const ValueKey('register-confirmation'),
      controller: _confirmation,
      focusNode: _confirmationFocus,
      enabled: !_submitting && _createdSession == null,
      obscureText: _obscure,
      textInputAction: TextInputAction.done,
      decoration: const InputDecoration(
        labelText: 'Confirmer le mot de passe',
        prefixIcon: Icon(Icons.lock_outline_rounded),
      ),
      validator: (value) => validatePasswordConfirmation(value, _password.text),
      onFieldSubmitted: (_) => _continue(),
    ),
  ];
}

class _ActivityOption extends StatelessWidget {
  const _ActivityOption({
    required this.label,
    required this.description,
    required this.icon,
    required this.accent,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final String description;
  final IconData icon;
  final Color accent;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => Semantics(
    selected: selected,
    button: true,
    child: KubaPressable(
      enabled: !selected,
      child: AnimatedContainer(
        duration: KubaMotion.of(context, KubaMotion.base),
        curve: KubaMotion.standard,
        decoration: BoxDecoration(
          color: selected ? KubaPalette.brandSoft : KubaPalette.surfaceRaised,
          borderRadius: KubaRadius.mdAll,
          border: Border.all(
            color: selected ? KubaPalette.brand : KubaPalette.border,
            width: selected ? 1.5 : 1,
          ),
          boxShadow: selected ? KubaShadow.level1 : null,
        ),
        clipBehavior: Clip.antiAlias,
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: onTap,
            child: Padding(
              padding: const EdgeInsets.all(KubaSpace.md),
              child: Row(
                children: [
                  AnimatedScale(
                    scale: selected ? 1.05 : 1,
                    duration: KubaMotion.of(context, KubaMotion.fast),
                    curve: KubaMotion.overshoot,
                    child: KubaIconPastille(
                      icon: icon,
                      color: accent,
                      diameter: 40,
                    ),
                  ),
                  const SizedBox(width: KubaSpace.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          label,
                          style: KubaType.headlineSm.copyWith(
                            color: selected
                                ? KubaPalette.brandDeep
                                : KubaPalette.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(description, style: KubaType.bodySm),
                      ],
                    ),
                  ),
                  const SizedBox(width: KubaSpace.sm),
                  AnimatedSwitcher(
                    duration: KubaMotion.of(context, KubaMotion.fast),
                    transitionBuilder: (child, animation) => ScaleTransition(
                      scale: animation,
                      child: FadeTransition(opacity: animation, child: child),
                    ),
                    child: Icon(
                      selected
                          ? Icons.check_circle_rounded
                          : Icons.circle_outlined,
                      key: ValueKey(selected),
                      size: 22,
                      color: selected
                          ? KubaPalette.brand
                          : KubaPalette.borderStrong,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    ),
  );
}
