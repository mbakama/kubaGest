import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthClientType } from './auth-token.enums.js';

/**
 * Session révocable d'un client (§28.5) : seul le hachage du refresh token est
 * stocké, jamais le jeton brut. Table globale, pas une source d'autorisation
 * tenant : les opérations revérifient session, utilisateur, rattachement et
 * statut du tenant.
 */
@Entity({ name: 'auth_sessions' })
@Index('idx_auth_sessions_user', ['userId'])
@Index('idx_auth_sessions_expiry', ['expiresAt'])
export class AuthSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'refresh_token_hash', type: 'text', unique: true })
  refreshTokenHash: string;

  @Column({ name: 'client_type', type: 'varchar', length: 20 })
  clientType: AuthClientType;

  @Column({ name: 'expires_at', type: Date })
  expiresAt: Date;

  @Column({ name: 'last_seen_at', type: Date, nullable: true })
  lastSeenAt: Date | null;

  @Column({ name: 'revoked_at', type: Date, nullable: true })
  revokedAt: Date | null;

  /** Rotation : session ayant remplacé celle-ci. */
  @Column({ name: 'replaced_by_id', type: 'uuid', nullable: true })
  replacedById: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
