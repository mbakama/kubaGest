import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccessTokenPurpose } from './auth-token.enums.js';

/**
 * Invitations et réinitialisations de mot de passe (dictionnaire §3). Jeton à
 * usage unique, stocké haché ; la consommation est conditionnelle et atomique.
 */
@Entity({ name: 'access_tokens' })
@Index('idx_access_tokens_user', ['userId'])
@Index('idx_access_tokens_expiry', ['expiresAt'])
export class AccessToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  tenantId: string | null;

  @Column({ type: 'varchar', length: 20 })
  purpose: AccessTokenPurpose;

  @Column({ name: 'token_hash', type: 'text', unique: true })
  tokenHash: string;

  @Column({ name: 'expires_at', type: Date })
  expiresAt: Date;

  @Column({ name: 'consumed_at', type: Date, nullable: true })
  consumedAt: Date | null;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
