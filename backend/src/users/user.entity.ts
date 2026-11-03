import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'first_name', type: 'varchar', length: 80, nullable: true })
  firstName: string | null;

  @Column({ name: 'last_name', type: 'varchar', length: 80, nullable: true })
  lastName: string | null;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone: string | null;

  @Column({ name: 'avatar_key', type: 'text', nullable: true })
  avatarKey: string | null;

  /**
   * Activation du compte. Une désactivation conserve l'identité et
   * l'historique ; elle n'est pas une suppression.
   */
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  /** Horodatage du dernier changement de mot de passe (jetons à invalider). */
  @Column({ name: 'password_changed_at', type: Date, nullable: true })
  passwordChangedAt: Date | null;

  /**
   * Super administrateur plateforme : gère les abonnements et les tenants,
   * sans accès implicite aux données métier (cahier des charges §3).
   */
  @Column({ name: 'is_platform_admin', type: 'boolean', default: false })
  isPlatformAdmin: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
