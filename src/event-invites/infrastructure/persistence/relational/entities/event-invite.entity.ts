import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { InviteStatus, InviteType } from '../../../../domain/event-invite';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { EventEntity } from '../../../../../events/infrastructure/persistence/relational/entities/event.entity';

@Entity({
  name: 'event_invite',
})
@Index(['inviteCode'], { unique: true })
@Index(['event', 'inviteeEmail'])
@Index(['event', 'status'])
export class EventInviteEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => EventEntity, { eager: true })
  @JoinColumn({ name: 'event_id' })
  event: EventEntity;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'invited_by_user_id' })
  invitedBy: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'invited_user_id' })
  invitedUser: UserEntity | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  inviteeEmail: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  inviteePhone: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  inviteeName: string | null;

  @Column({
    type: 'enum',
    enum: InviteStatus,
    default: InviteStatus.PENDING,
  })
  status: InviteStatus;

  @Column({
    type: 'enum',
    enum: InviteType,
    default: InviteType.EMAIL,
  })
  inviteType: InviteType;

  @Column({ type: 'varchar', length: 50, unique: true })
  inviteCode: string;

  @Column({ type: 'varchar', length: 500 })
  inviteUrl: string;

  @Column({ type: 'text', nullable: true })
  personalMessage: string | null;

  @Column({ type: 'boolean', default: false })
  allowPlusOne: boolean;

  @Column({ type: 'timestamp with time zone', nullable: true })
  sentAt: Date | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  viewedAt: Date | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  respondedAt: Date | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  expiresAt: Date | null;

  @Column({ type: 'int', default: 0 })
  remindersSent: number;

  @Column({ type: 'timestamp with time zone', nullable: true })
  lastReminderAt: Date | null;

  @Column({ type: 'boolean', default: false })
  isVIP: boolean;

  @Column({ type: 'jsonb', nullable: true })
  trackingData: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
