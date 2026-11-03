import 'package:kubagest_mobile/core/auth/auth_session.dart';
import 'package:kubagest_mobile/core/auth/token_store.dart';

/// Magasin de session en mémoire, pour les tests de widgets.
class MemorySessionStorage
    implements SessionStorage, IntroductionStorage, RememberedEmailStorage {
  MemorySessionStorage([this.session]);

  AuthSession? session;
  int saveCount = 0;
  int clearCount = 0;
  bool introductionSeen = false;
  String? rememberedEmail;

  @override
  Future<bool> hasSeenIntroduction() async => introductionSeen;

  @override
  Future<void> completeIntroduction() async {
    introductionSeen = true;
  }

  @override
  Future<AuthSession?> read() async => session;

  @override
  Future<void> save(AuthSession value) async {
    session = value;
    saveCount++;
  }

  @override
  Future<void> clear() async {
    session = null;
    clearCount++;
  }

  @override
  Future<String?> readRememberedEmail() async => rememberedEmail;

  @override
  Future<void> saveRememberedEmail(String email) async {
    rememberedEmail = email.trim();
  }

  @override
  Future<void> clearRememberedEmail() async {
    rememberedEmail = null;
  }
}

AuthSession buildSession({
  String tenantName = 'Boutique Kintambo',
  String role = 'owner',
}) => AuthSession(
  accessToken: 'jeton-de-test',
  user: const AuthUser(id: 'user-1', email: 'admin@kubagest.io'),
  context: TenantContext(
    tenantId: 'tenant-1',
    tenantName: tenantName,
    currency: 'CDF',
    activityType: 'boutique',
    role: role,
    establishmentId: 'shop-1',
  ),
);
