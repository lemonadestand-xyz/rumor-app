import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';
import { Message } from './message';

export enum ReactionType {
  LIKE = '👍',
  LOVE = '❤️',
  LAUGH = '😂',
  WOW = '😮',
  SAD = '😢',
  ANGRY = '😠',
  CELEBRATE = '🎉',
  FIRE = '🔥',
}

export class MessageReaction {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: () => Message,
  })
  message: Message;

  @ApiProperty({
    type: () => User,
  })
  user: User;

  @ApiProperty({
    enum: ReactionType,
    example: ReactionType.LIKE,
    description: 'Emoji reaction type',
  })
  reaction: ReactionType;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
