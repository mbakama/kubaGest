import 'dart:typed_data';

import 'package:flutter/material.dart';

import '../../core/theme/kuba_tokens.dart';

/// Initiales affichées quand aucune photo n'est disponible.
///
/// Deux lettres au maximum : au-delà, le texte devient illisible dans le
/// cercle de 39 px de l'en-tête d'accueil.
String kubaInitials({
  String? firstName,
  String? lastName,
  String? fallback,
}) {
  final parts = [firstName, lastName]
      .map((value) => value?.trim() ?? '')
      .where((value) => value.isNotEmpty)
      .toList();
  if (parts.isEmpty) {
    final single = fallback?.trim() ?? '';
    if (single.isEmpty) {
      return '';
    }
    parts.add(single);
  }
  return parts
      .map((part) => part.substring(0, 1).toUpperCase())
      .take(2)
      .join();
}

/// Photo de profil ronde.
///
/// Priorité : photo choisie sur l'appareil, puis photo du serveur, puis les
/// initiales, puis l'illustration fournie par l'appelant.
class KubaAvatar extends StatelessWidget {
  const KubaAvatar({
    super.key,
    this.photo,
    this.imageUrl,
    this.initials = '',
    this.fallbackAsset,
    this.diameter = 64,
    this.background = Colors.white,
  });

  final Uint8List? photo;
  final String? imageUrl;
  final String initials;
  final String? fallbackAsset;
  final double diameter;
  final Color background;

  @override
  Widget build(BuildContext context) {
    final url = imageUrl?.trim() ?? '';
    final showsInitials =
        photo == null && url.isEmpty && initials.trim().isNotEmpty;
    return Container(
      width: diameter,
      height: diameter,
      clipBehavior: Clip.antiAlias,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: showsInitials ? KubaPalette.brandSoft : background,
        shape: BoxShape.circle,
      ),
      child: _content(),
    );
  }

  Widget _content() {
    final bytes = photo;
    if (bytes != null) {
      return Image.memory(
        bytes,
        width: diameter,
        height: diameter,
        fit: BoxFit.cover,
        gaplessPlayback: true,
        filterQuality: FilterQuality.medium,
      );
    }
    final url = imageUrl?.trim() ?? '';
    if (url.isNotEmpty) {
      return Image.network(
        url,
        width: diameter,
        height: diameter,
        fit: BoxFit.cover,
        errorBuilder: (_, _, _) => _neutral(),
      );
    }
    return _neutral();
  }

  Widget _neutral() {
    final initials = this.initials.trim();
    if (initials.isNotEmpty) {
      return Text(
        initials,
        style: KubaType.headlineSm.copyWith(
          fontSize: diameter * .38,
          fontWeight: FontWeight.w700,
          color: KubaPalette.brandDeep,
        ),
      );
    }
    final asset = fallbackAsset;
    if (asset != null) {
      return Image.asset(
        asset,
        width: diameter,
        height: diameter,
        fit: BoxFit.cover,
      );
    }
    return Icon(
      Icons.person_outline_rounded,
      size: diameter * .46,
      color: KubaPalette.brand,
    );
  }
}

/// Photo de profil actionnable : un appui ouvre le choix de la photo.
class KubaAvatarPicker extends StatelessWidget {
  const KubaAvatarPicker({
    super.key,
    required this.onPressed,
    this.photo,
    this.imageUrl,
    this.initials = '',
    this.diameter = 64,
    this.enabled = true,
  });

  final VoidCallback onPressed;
  final Uint8List? photo;
  final String? imageUrl;
  final String initials;
  final double diameter;
  final bool enabled;

  @override
  Widget build(BuildContext context) {
    final badge = diameter * .34;
    final hasPhoto = photo != null || (imageUrl?.trim().isNotEmpty ?? false);
    return Semantics(
      button: true,
      enabled: enabled,
      label: hasPhoto
          ? 'Changer la photo de profil'
          : 'Ajouter une photo de profil',
      child: SizedBox(
        width: diameter,
        height: diameter,
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            Material(
              color: Colors.transparent,
              shape: const CircleBorder(),
              clipBehavior: Clip.antiAlias,
              child: InkWell(
                onTap: enabled ? onPressed : null,
                child: KubaAvatar(
                  photo: photo,
                  imageUrl: imageUrl,
                  initials: initials,
                  diameter: diameter,
                ),
              ),
            ),
            Positioned(
              right: -2,
              bottom: -2,
              child: IgnorePointer(
                child: Container(
                  width: badge,
                  height: badge,
                  decoration: BoxDecoration(
                    color: enabled
                        ? KubaPalette.brand
                        : KubaPalette.borderStrong,
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 2),
                  ),
                  child: Icon(
                    hasPhoto ? Icons.edit_outlined : Icons.add_rounded,
                    size: badge * .58,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
