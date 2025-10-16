import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import {
  ParticipantRole,
  ParticipantStatus,
} from '../../../../domain/conversation-participant';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { ConversationEntity } from './conversation.entity';

@Entity({
  name: 'conversation_participant',
})
@Unique('UQ_conversation_participant', ['conversation', 'user'])
@Index(['conversation'])
@Index(['user'])
@Index(['status'])
@Index(['role'])
export class ConversationParticipantEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => ConversationEntity,
    (conversation) => conversation.participants,
  )
  @JoinColumn({ name: 'conversation_id' })
  conversation: ConversationEntity;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({
    type: 'enum',
    enum: ParticipantRole,
    default: ParticipantRole.MEMBER,
  })
  role: ParticipantRole;

  @Column({
    type: 'enum',
    enum: ParticipantStatus,
    default: ParticipantStatus.ACTIVE,
  })
  status: ParticipantStatus;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nickname: string | null;

  @Column({ type: 'boolean', default: false })
  isMuted: boolean;

  @Column({ type: 'boolean', default: false })
  isPinned: boolean;

  @Column({ type: 'timestamp with time zone' })
  joinedAt: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  leftAt: Date | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  lastReadAt: Date | null;

  @Column({ type: 'int', default: 0 })
  unreadCount: number;

  @Column({ type: 'timestamp with time zone', nullable: true })
  lastSeenAt: Date | null;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'added_by_user_id' })
  addedBy: UserEntity | null;

  @Column({ type: 'jsonb', nullable: true })
  settings: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
