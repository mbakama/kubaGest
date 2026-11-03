import 'dart:async';

import '../config/api_config.dart';

typedef AuthenticationCallback = FutureOr<void> Function(AuthSession session);

/// Session authentifiée telle que renvoyée par `/auth/login` et
/// `/auth/register`. Le jeton est conservé côté client, jamais le mot de passe.
class AuthSession {
  const AuthSession({
    required this.accessToken,
    required this.user,
    this.context,
  });

  final String accessToken;
  final AuthUser user;

  /// `null` pour un administrateur plateforme sans établissement.
  final TenantContext? context;

  factory AuthSession.fromJson(Map<String, dynamic> json) {
    final token = json['accessToken'];
    final user = json['user'];
    if (token is! String || token.isEmpty || user is! Map<String, dynamic>) {
      throw const FormatException('Réponse d’authentification invalide.');
    }
    final context = json['context'];
    return AuthSession(
      accessToken: token,
      user: AuthUser.fromJson(user),
      context: context is Map<String, dynamic>
          ? TenantContext.fromJson(context)
          : null,
    );
  }

  Map<String, dynamic> toJson() => {
    'accessToken': accessToken,
    'user': user.toJson(),
    'context': context?.toJson(),
  };

  AuthSession copyWith({AuthUser? user}) => AuthSession(
    accessToken: accessToken,
    user: user ?? this.user,
    context: context,
  );
}

class AuthUser {
  const AuthUser({
    required this.id,
    required this.email,
    this.firstName,
    this.lastName,
    this.phone,
    this.avatar,
  });

  final String id;
  final String email;
  final String? firstName;
  final String? lastName;
  final String? phone;
  final String? avatar;

  factory AuthUser.fromJson(Map<String, dynamic> json) => AuthUser(
    id: json['id'] as String? ?? '',
    email: json['email'] as String? ?? '',
    firstName: json['firstName'] as String?,
    lastName: json['lastName'] as String?,
    phone: json['phone'] as String?,
    avatar: switch (json['avatar']) {
      final String value when value.trim().isNotEmpty =>
        ApiConfig.resolveReference(value.trim()),
      _ => null,
    },
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'email': email,
    if (firstName != null) 'firstName': firstName,
    if (lastName != null) 'lastName': lastName,
    if (phone != null) 'phone': phone,
    if (avatar != null) 'avatar': avatar,
  };

  AuthUser copyWith({String? avatar, bool removeAvatar = false}) => AuthUser(
    id: id,
    email: email,
    firstName: firstName,
    lastName: lastName,
    phone: phone,
    avatar: removeAvatar ? null : avatar ?? this.avatar,
  );
}

class TenantContext {
  const TenantContext({
    required this.tenantId,
    required this.tenantName,
    required this.currency,
    required this.activityType,
    required this.role,
    this.establishmentId,
  });

  final String tenantId;
  final String tenantName;
  final String currency;
  final String activityType;
  final String role;
  final String? establishmentId;

  factory TenantContext.fromJson(Map<String, dynamic> json) => TenantContext(
    tenantId: json['tenantId'] as String? ?? '',
    tenantName: json['tenantName'] as String? ?? '',
    currency: json['currency'] as String? ?? '',
    activityType: json['activityType'] as String? ?? '',
    role: json['role'] as String? ?? '',
    establishmentId: json['establishmentId'] as String?,
  );

  Map<String, dynamic> toJson() => {
    'tenantId': tenantId,
    'tenantName': tenantName,
    'currency': currency,
    'activityType': activityType,
    'role': role,
    'establishmentId': establishmentId,
  };
}
