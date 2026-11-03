import 'dart:typed_data';

import 'package:image_picker/image_picker.dart';

/// Provenance de la photo de profil choisie par la personne.
enum AvatarSource { gallery, camera }

/// Contrat de sélection d'une photo, remplaçable en test.
abstract class AvatarPicker {
  /// Octets de l'image retenue, ou `null` si la sélection est annulée.
  Future<Uint8List?> pick(AvatarSource source);
}

/// Sélection native : galerie de l'appareil ou prise de vue.
///
/// L'image est réduite à 960 px de côté : l'avatar s'affiche dans un cercle,
/// inutile de conserver la définition d'origine ni de gonfler l'envoi réseau.
class DeviceAvatarPicker implements AvatarPicker {
  DeviceAvatarPicker({ImagePicker? picker}) : _picker = picker ?? ImagePicker();

  final ImagePicker _picker;

  @override
  Future<Uint8List?> pick(AvatarSource source) async {
    final file = await _picker.pickImage(
      source: source == AvatarSource.camera
          ? ImageSource.camera
          : ImageSource.gallery,
      maxWidth: 960,
      maxHeight: 960,
      imageQuality: 82,
      requestFullMetadata: false,
    );
    if (file == null) {
      return null;
    }
    return file.readAsBytes();
  }
}
