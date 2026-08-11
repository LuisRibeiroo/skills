extension StringExt on String? {
  bool get isNullOrEmpty => this == null || this!.isEmpty;

  bool get isNotNullOrEmpty => !isNullOrEmpty;

  String? get digitsOnly =>
      isNullOrEmpty ? this : this!.replaceAll(RegExp(r'[^\d]'), '');

  String? get lettersOnly =>
      isNullOrEmpty ? this : this!.replaceAll(RegExp(r'[^a-zA-ZÀ-ÿ]'), '');

  String? get capitalized {
    if (isNullOrEmpty) return this;
    final s = this!;
    return '${s[0].toUpperCase()}${s.substring(1)}';
  }
}
