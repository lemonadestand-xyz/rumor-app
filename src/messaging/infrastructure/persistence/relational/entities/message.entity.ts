import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { MessageType, MessageStatus } from '../../../../domain/message';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { ConversationEntity } from './conversation.entity';
import { MessageReactionEntity } from './message-reaction.entity';

@Entity({
  name: 'message',
})
@Index(['conversation'])
@Index(['sender'])
@Index(['type'])
@Index(['status'])
@Index(['createdAt'])
@Index(['replyTo'])
export class MessageEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ConversationEntity, (conversation) => conversation.messages)
  @JoinColumn({ name: 'conversation_id' })
  conversation: ConversationEntity;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'sender_user_id' })
  sender: UserEntity;

  @ManyToOne(() => MessageEntity, { nullable: true })
  @JoinColumn({ name: 'reply_to_message_id' })
  replyTo: MessageEntity | null;

  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  type: MessageType;

  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.SENT,
  })
  status: MessageStatus;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  mediaUrl: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fileName: string | null;

  @Column({ type: 'bigint', nullable: true })
  fileSize: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  mimeType: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  thumbnailUrl: string | null;

  @Column({ type: 'int', nullable: true })
  duration: number | null;

  @Column({ type: 'jsonb', nullable: true })
  location: Record<string, any>;

  @Column({ type: 'boolean', default: false })
  isEdited: boolean;

  @Column({ type: 'timestamp with time zone', nullable: true })
  editedAt: Date | null;

  @Column({ type: 'boolean', default: false })
  isPinned: boolean;

  @Column({ type: 'timestamp with time zone', nullable: true })
  pinnedAt: Date | null;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'pinned_by_user_id' })
  pinnedBy: UserEntity | null;

  @Column({ type: 'int', default: 0 })
  reactionCount: number;

  @Column({ type: 'int', default: 0 })
  replyCount: number;

  @Column({ type: 'timestamp with time zone', nullable: true })
  expiresAt: Date | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @OneToMany(() => MessageReactionEntity, (reaction) => reaction.message)
  reactions: MessageReactionEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
