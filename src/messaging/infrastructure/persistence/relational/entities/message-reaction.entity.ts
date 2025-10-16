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
import { ReactionType } from '../../../../domain/message-reaction';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { MessageEntity } from './message.entity';

@Entity({
  name: 'message_reaction',
})
@Unique('UQ_message_reaction', ['message', 'user', 'reaction'])
@Index(['message'])
@Index(['user'])
@Index(['reaction'])
export class MessageReactionEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MessageEntity, (message) => message.reactions)
  @JoinColumn({ name: 'message_id' })
  message: MessageEntity;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({
    type: 'enum',
    enum: ReactionType,
  })
  reaction: ReactionType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
