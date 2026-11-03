import 'package:flutter/material.dart';

import 'kuba_tokens.dart';

export 'kuba_tokens.dart';

ThemeData buildKubaTheme() {
  const scheme = ColorScheme.light(
    primary: KubaPalette.brand,
    onPrimary: KubaPalette.onBrand,
    primaryContainer: KubaPalette.brandSoft,
    onPrimaryContainer: KubaPalette.brandDeep,
    secondary: KubaPalette.midnight,
    onSecondary: KubaPalette.onMidnight,
    secondaryContainer: KubaPalette.infoSoft,
    onSecondaryContainer: KubaPalette.midnightDeep,
    tertiary: KubaPalette.growth,
    onTertiary: KubaPalette.textOnDark,
    error: KubaPalette.alert,
    onError: KubaPalette.textOnDark,
    errorContainer: KubaPalette.alertSoft,
    onErrorContainer: KubaPalette.alert,
    surface: KubaPalette.surfaceRaised,
    onSurface: KubaPalette.textPrimary,
    surfaceContainerLowest: KubaPalette.surfaceRaised,
    surfaceContainerLow: KubaPalette.surface,
    surfaceContainer: KubaPalette.surfaceSunken,
    surfaceContainerHigh: KubaPalette.surfaceSunken,
    surfaceContainerHighest: KubaPalette.surfaceDim,
    onSurfaceVariant: KubaPalette.textMuted,
    outline: KubaPalette.outline,
    outlineVariant: KubaPalette.border,
    shadow: Color(0x140b2545),
    scrim: Color(0x66091e3a),
  );

  const textTheme = TextTheme(
    displayLarge: KubaType.headlineXl,
    displayMedium: KubaType.headlineXl,
    displaySmall: KubaType.headlineLg,
    headlineLarge: KubaType.headlineXl,
    headlineMedium: KubaType.headlineXlMobile,
    headlineSmall: KubaType.headlineLg,
    titleLarge: KubaType.headlineMd,
    titleMedium: KubaType.headlineSm,
    titleSmall: KubaType.labelLg,
    bodyLarge: KubaType.bodyLg,
    bodyMedium: KubaType.bodyMd,
    bodySmall: KubaType.bodySm,
    labelLarge: KubaType.labelLg,
    labelMedium: KubaType.labelMd,
    labelSmall: KubaType.labelSm,
  );

  final base = ThemeData(
    useMaterial3: true,
    colorScheme: scheme,
    fontFamily: KubaType.family,
    scaffoldBackgroundColor: KubaPalette.surface,
    canvasColor: KubaPalette.surface,
    textTheme: textTheme,
    splashFactory: InkRipple.splashFactory,
    visualDensity: VisualDensity.standard,
    materialTapTargetSize: MaterialTapTargetSize.padded,
    // L'en-tête de marque reste en place : le contenu glisse et se fond.
    pageTransitionsTheme: const PageTransitionsTheme(
      builders: {
        TargetPlatform.android: FadeForwardsPageTransitionsBuilder(),
        TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
        TargetPlatform.macOS: CupertinoPageTransitionsBuilder(),
        TargetPlatform.windows: FadeForwardsPageTransitionsBuilder(),
        TargetPlatform.linux: FadeForwardsPageTransitionsBuilder(),
      },
    ),
  );

  return base.copyWith(
    splashColor: KubaPalette.brand.withValues(alpha: 0.10),
    highlightColor: KubaPalette.brand.withValues(alpha: 0.05),
    hoverColor: KubaPalette.brand.withValues(alpha: 0.04),
    focusColor: KubaPalette.brand.withValues(alpha: 0.08),
    textSelectionTheme: const TextSelectionThemeData(
      cursorColor: KubaPalette.brand,
      selectionColor: Color(0x33007a55),
      selectionHandleColor: KubaPalette.brand,
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: KubaPalette.surface,
      surfaceTintColor: Colors.transparent,
      foregroundColor: KubaPalette.textPrimary,
      elevation: 0,
      scrolledUnderElevation: 0,
      centerTitle: false,
      titleTextStyle: KubaType.headlineSm,
      iconTheme: const IconThemeData(size: 22, color: KubaPalette.textPrimary),
      actionsIconTheme: const IconThemeData(
        size: 22,
        color: KubaPalette.textPrimary,
      ),
    ),
    cardTheme: CardThemeData(
      color: KubaPalette.surfaceRaised,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(
        borderRadius: KubaRadius.mdAll,
        side: const BorderSide(color: KubaPalette.border),
      ),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        backgroundColor: KubaPalette.brand,
        foregroundColor: KubaPalette.onBrand,
        disabledBackgroundColor: KubaPalette.surfaceDim,
        disabledForegroundColor: KubaPalette.textMuted,
        minimumSize: const Size.fromHeight(KubaSpace.touch),
        padding: const EdgeInsets.symmetric(horizontal: KubaSpace.lg),
        elevation: 0,
        textStyle: KubaType.labelLg.copyWith(color: KubaPalette.onBrand),
        shape: const RoundedRectangleBorder(borderRadius: KubaRadius.baseAll),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        backgroundColor: KubaPalette.surfaceRaised,
        foregroundColor: KubaPalette.midnight,
        minimumSize: const Size.fromHeight(KubaSpace.touch),
        padding: const EdgeInsets.symmetric(horizontal: KubaSpace.lg),
        side: const BorderSide(color: KubaPalette.borderStrong),
        textStyle: KubaType.labelLg,
        shape: const RoundedRectangleBorder(borderRadius: KubaRadius.baseAll),
      ),
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        foregroundColor: KubaPalette.brand,
        minimumSize: const Size(KubaSpace.touch, KubaSpace.touch),
        padding: const EdgeInsets.symmetric(horizontal: KubaSpace.md),
        textStyle: KubaType.labelLg.copyWith(
          color: KubaPalette.brand,
          fontSize: 14,
        ),
        shape: const RoundedRectangleBorder(borderRadius: KubaRadius.baseAll),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: KubaPalette.surfaceRaised,
      isDense: false,
      contentPadding: const EdgeInsets.symmetric(
        horizontal: KubaSpace.md,
        vertical: 14,
      ),
      hintStyle: KubaType.bodyMd.copyWith(color: KubaPalette.textMuted),
      labelStyle: KubaType.labelMd,
      floatingLabelStyle: KubaType.labelMd.copyWith(color: KubaPalette.brand),
      helperStyle: KubaType.bodySm,
      errorStyle: KubaType.bodySm.copyWith(color: KubaPalette.alert),
      prefixIconColor: KubaPalette.textMuted,
      suffixIconColor: KubaPalette.textMuted,
      border: const OutlineInputBorder(
        borderRadius: KubaRadius.baseAll,
        borderSide: BorderSide(color: KubaPalette.borderStrong),
      ),
      enabledBorder: const OutlineInputBorder(
        borderRadius: KubaRadius.baseAll,
        borderSide: BorderSide(color: KubaPalette.borderStrong),
      ),
      focusedBorder: const OutlineInputBorder(
        borderRadius: KubaRadius.baseAll,
        borderSide: BorderSide(color: KubaPalette.brand, width: 2),
      ),
      errorBorder: const OutlineInputBorder(
        borderRadius: KubaRadius.baseAll,
        borderSide: BorderSide(color: KubaPalette.alert),
      ),
      focusedErrorBorder: const OutlineInputBorder(
        borderRadius: KubaRadius.baseAll,
        borderSide: BorderSide(color: KubaPalette.alert, width: 2),
      ),
      disabledBorder: const OutlineInputBorder(
        borderRadius: KubaRadius.baseAll,
        borderSide: BorderSide(color: KubaPalette.border),
      ),
      errorMaxLines: 3,
    ),
    navigationBarTheme: NavigationBarThemeData(
      height: KubaSpace.navBar,
      backgroundColor: KubaPalette.surfaceRaised,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      indicatorColor: KubaPalette.brandSoft,
      indicatorShape: const RoundedRectangleBorder(
        borderRadius: KubaRadius.baseAll,
      ),
      labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
      labelTextStyle: WidgetStateProperty.resolveWith((states) {
        final selected = states.contains(WidgetState.selected);
        return KubaType.labelSm.copyWith(
          color: selected ? KubaPalette.brand : KubaPalette.textMuted,
          fontWeight: selected ? FontWeight.w700 : FontWeight.w600,
        );
      }),
      iconTheme: WidgetStateProperty.resolveWith((states) {
        final selected = states.contains(WidgetState.selected);
        return IconThemeData(
          size: 24,
          color: selected ? KubaPalette.brand : KubaPalette.textMuted,
        );
      }),
    ),
    bottomSheetTheme: const BottomSheetThemeData(
      backgroundColor: KubaPalette.surfaceRaised,
      surfaceTintColor: Colors.transparent,
      showDragHandle: true,
      dragHandleColor: KubaPalette.borderStrong,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(KubaRadius.lg),
        ),
      ),
    ),
    dialogTheme: const DialogThemeData(
      backgroundColor: KubaPalette.surfaceRaised,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: KubaRadius.lgAll),
      titleTextStyle: KubaType.headlineSm,
      contentTextStyle: KubaType.bodyMd,
    ),
    snackBarTheme: SnackBarThemeData(
      backgroundColor: KubaPalette.midnightDeep,
      contentTextStyle: KubaType.bodyMd.copyWith(color: KubaPalette.textOnDark),
      behavior: SnackBarBehavior.floating,
      insetPadding: const EdgeInsets.all(KubaSpace.md),
      shape: const RoundedRectangleBorder(borderRadius: KubaRadius.baseAll),
      elevation: 0,
    ),
    dividerTheme: const DividerThemeData(
      color: KubaPalette.border,
      thickness: 1,
      space: 1,
    ),
    progressIndicatorTheme: const ProgressIndicatorThemeData(
      color: KubaPalette.brand,
      linearTrackColor: KubaPalette.border,
      circularTrackColor: KubaPalette.border,
    ),
    listTileTheme: ListTileThemeData(
      iconColor: KubaPalette.brand,
      textColor: KubaPalette.textPrimary,
      titleTextStyle: KubaType.headlineSm,
      subtitleTextStyle: KubaType.bodySm,
      shape: const RoundedRectangleBorder(borderRadius: KubaRadius.mdAll),
      contentPadding: const EdgeInsets.symmetric(
        horizontal: KubaSpace.md,
        vertical: KubaSpace.sm,
      ),
    ),
    iconTheme: const IconThemeData(color: KubaPalette.brand, size: 24),
    tooltipTheme: TooltipThemeData(
      decoration: const BoxDecoration(
        color: KubaPalette.midnightDeep,
        borderRadius: KubaRadius.smAll,
      ),
      textStyle: KubaType.bodySm.copyWith(color: KubaPalette.textOnDark),
    ),
  );
}
