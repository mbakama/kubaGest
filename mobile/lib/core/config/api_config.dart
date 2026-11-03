class ApiConfig {
  static const baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:3000/api/v1',
  );

  static Uri endpoint(String resource) {
    final base = Uri.parse(baseUrl);
    if (!base.hasAuthority ||
        !{'http', 'https'}.contains(base.scheme) ||
        base.userInfo.isNotEmpty ||
        base.hasQuery ||
        base.hasFragment) {
      throw const FormatException('Adresse du serveur invalide.');
    }
    return base.replace(
      path: '${base.path.replaceFirst(RegExp(r'/+$'), '')}/$resource',
    );
  }

  static String resolveReference(String reference) {
    final uri = Uri.parse(reference);
    if (uri.hasScheme) return uri.toString();
    final base = Uri.parse(baseUrl);
    return base.replace(path: uri.path, query: uri.query).toString();
  }
}
