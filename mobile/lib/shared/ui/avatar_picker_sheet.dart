import 'dart:typed_data';

import 'package:flutter/material.dart';

import '../../core/media/avatar_picker.dart';
import '../../core/theme/kuba_tokens.dart';

enum AvatarAction { gallery, camera, remove }

/// Feuille de choix de la photo de profil.
///
/// Les trois actions sont explicites : prendre une photo, choisir une image
/// déjà présente sur l'appareil, ou revenir à un visuel sans photo.
Future<AvatarAction?> showAvatarPickerSheet(
  BuildContext context, {
  required bool hasPhoto,
}) => showModalBottomSheet<AvatarAction>(
  context: context,
  showDragHandle: true,
  backgroundColor: KubaPalette.surfaceRaised,
  builder: (sheetContext) => SafeArea(
    top: false,
    child: Padding(
      padding: const EdgeInsets.fromLTRB(
        KubaSpace.lg,
        0,
        KubaSpace.lg,
        KubaSpace.lg,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text('Photo de profil', style: KubaType.headlineMd),
          const SizedBox(height: KubaSpace.xs),
          Text(
            'Elle apparaît sur l’accueil et dans les paramètres.',
            style: KubaType.bodySm,
          ),
          const SizedBox(height: KubaSpace.md),
          _SheetAction(
            icon: Icons.photo_library_outlined,
            label: 'Choisir dans la galerie',
            onTap: () => Navigator.of(sheetContext).pop(AvatarAction.gallery),
          ),
          _SheetAction(
            icon: Icons.photo_camera_outlined,
            label: 'Prendre une photo',
            onTap: () => Navigator.of(sheetContext).pop(AvatarAction.camera),
          ),
          if (hasPhoto)
            _SheetAction(
              icon: Icons.delete_outline_rounded,
              label: 'Retirer la photo',
              tone: KubaPalette.alert,
              onTap: () => Navigator.of(sheetContext).pop(AvatarAction.remove),
            ),
        ],
      ),
    ),
  ),
);

/// Résultat d'une sélection engagée depuis la feuille de choix.
class AvatarSelection {
  const AvatarSelection.picked(Uint8List this.bytes) : remove = false;

  const AvatarSelection.removed() : bytes = null, remove = true;

  final Uint8List? bytes;
  final bool remove;
}

/// Ouvre la feuille puis la source native, et traduit les échecs en message.
///
/// Renvoie `null` quand rien ne change : feuille fermée, sélection annulée ou
/// source indisponible sur l'appareil.
Future<AvatarSelection?> chooseAvatarPhoto(
  BuildContext context, {
  required AvatarPicker picker,
  required bool hasPhoto,
}) async {
  final action = await showAvatarPickerSheet(context, hasPhoto: hasPhoto);
  if (action == null || !context.mounted) {
    return null;
  }
  if (action == AvatarAction.remove) {
    return const AvatarSelection.removed();
  }
  try {
    final bytes = await picker.pick(
      action == AvatarAction.camera ? AvatarSource.camera : AvatarSource.gallery,
    );
    if (bytes == null) {
      return null;
    }
    return AvatarSelection.picked(bytes);
  } catch (_) {
    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'La sélection de photo n’est pas disponible sur cet appareil.',
          ),
        ),
      );
    }
    return null;
  }
}

class _SheetAction extends StatelessWidget {
  const _SheetAction({
    required this.icon,
    required this.label,
    required this.onTap,
    this.tone = KubaPalette.textPrimary,
  });

  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final Color tone;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: KubaSpace.sm),
    child: Material(
      color: KubaPalette.surfaceSunken,
      borderRadius: KubaRadius.baseAll,
      child: InkWell(
        borderRadius: KubaRadius.baseAll,
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: KubaSpace.md,
            vertical: KubaSpace.md,
          ),
          child: Row(
            children: [
              Icon(icon, size: 21, color: tone),
              const SizedBox(width: KubaSpace.md),
              Expanded(
                child: Text(
                  label,
                  style: KubaType.labelLg.copyWith(color: tone),
                ),
              ),
              Icon(Icons.chevron_right_rounded, size: 20, color: tone),
            ],
          ),
        ),
      ),
    ),
  );
}
