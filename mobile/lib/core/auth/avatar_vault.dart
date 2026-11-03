import 'package:flutter/foundation.dart';

/// Photo de profil choisie sur l'appareil.
///
/// La photo reste ici uniquement pendant sa sélection et son téléversement.
/// Une fois enregistrée, la session utilise la référence persistante renvoyée
/// par l'API.
class AvatarVault extends ChangeNotifier {
  AvatarVault();

  /// Instance partagée par l'application.
  static final AvatarVault instance = AvatarVault();

  Uint8List? _photo;

  /// Photo retenue, ou `null` si la personne n'en a pas choisi.
  Uint8List? get photo => _photo;

  bool get hasPhoto => _photo != null;

  void setPhoto(Uint8List? bytes) {
    if (identical(_photo, bytes)) {
      return;
    }
    _photo = bytes;
    notifyListeners();
  }

  void clear() => setPhoto(null);
}
