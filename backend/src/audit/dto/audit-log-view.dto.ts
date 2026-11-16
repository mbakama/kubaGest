import { ApiProperty } from '@nestjs/swagger';

export class AuditLogViewDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({
    example: 'membership.role.updated',
    description: 'Code technique (ne pas afficher tel quel à l’utilisateur)',
  })
  action: string;

  @ApiProperty({ example: 'Rôle du collaborateur modifié' })
  actionLabel: string;

  @ApiProperty({ example: 'membership' })
  entityType: string;

  @ApiProperty({ example: 'Utilisateur et droits' })
  entityLabel: string;

  @ApiProperty({ nullable: true })
  entityId: string | null;

  @ApiProperty({ nullable: true, format: 'uuid' })
  actorUserId: string | null;

  @ApiProperty({ nullable: true, format: 'uuid' })
  actorMembershipId: string | null;

  @ApiProperty({ nullable: true })
  reason: string | null;

  @ApiProperty({ type: Object, nullable: true })
  oldValues: Record<string, unknown> | null;

  @ApiProperty({ type: Object, nullable: true })
  newValues: Record<string, unknown> | null;

  @ApiProperty({ type: String, format: 'date-time' })
  occurredAt: Date;
}