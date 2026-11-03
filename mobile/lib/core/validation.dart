/// Validation des formulaires, avec les messages affichés à l'utilisateur.
library;

final _emailPattern = RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$');

String? validateRequired(String? value, {String label = 'Ce champ'}) {
  if (value == null || value.trim().isEmpty) {
    return '$label est obligatoire.';
  }
  return null;
}

String? validateName(String? value, {String label = 'Le nom'}) {
  final required = validateRequired(value, label: label);
  if (required != null) {
    return required;
  }
  if (value!.trim().length < 2) {
    return '$label doit contenir au moins 2 caractères.';
  }
  return null;
}

String? validateEmail(String? value) {
  final required = validateRequired(value, label: 'L’adresse email');
  if (required != null) {
    return required;
  }
  if (!_emailPattern.hasMatch(value!.trim())) {
    return 'Adresse email invalide.';
  }
  return null;
}

String? validatePassword(String? value, {bool creation = false}) {
  final required = validateRequired(value, label: 'Le mot de passe');
  if (required != null) {
    return required;
  }
  if (creation && value!.length < 8) {
    return 'Le mot de passe doit contenir au moins 8 caractères.';
  }
  return null;
}

String? validateResetCode(String? value) {
  final code = value?.trim() ?? '';
  if (code.isEmpty) {
    return 'Le code est obligatoire.';
  }
  if (!RegExp(r'^\d{6}$').hasMatch(code)) {
    return 'Le code comporte 6 chiffres.';
  }
  return null;
}

String? validatePasswordConfirmation(String? value, String password) {
  if (value != password) {
    return 'Les deux mots de passe ne correspondent pas.';
  }
  return null;
}
