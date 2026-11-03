/// Erreur renvoyée par l'API, avec un message déjà lisible par l'utilisateur.
class ApiException implements Exception {
  const ApiException(this.statusCode, this.message);

  const ApiException.network(this.message) : statusCode = 0;

  /// Code HTTP, ou `0` si la requête n'a jamais abouti (réseau, délai).
  final int statusCode;
  final String message;

  bool get isNetwork => statusCode == 0;
  bool get isUnauthorized => statusCode == 401;

  @override
  String toString() => message;
}
