import 'package:flutter/material.dart';

// Add l10n import after running `flutter gen-l10n`:
// import '<package>/gen_l10n/app_localizations.dart';

extension ContextExt on BuildContext {
  ColorScheme get colorScheme => Theme.of(this).colorScheme;

  TextTheme get textTheme => Theme.of(this).textTheme;

  // Uncomment after l10n setup:
  // AppLocalizations get l10n => AppLocalizations.of(this)!;
}
