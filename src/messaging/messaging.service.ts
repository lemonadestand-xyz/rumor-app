import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import {
  Conversation,
  ConversationType,
  ConversationStatus,
} from './domain/conversation';
import { Message, MessageType, MessageStatus } from './domain/message';
import {
  ConversationParticipant,
  ParticipantRole,
  ParticipantStatus,
} from './domain/conversation-participant';
import { MessageReaction, ReactionType } from './domain/message-reaction';

@Injectable()
export class MessagingService {
  // Mock data storage - in real implementation, these would be database repositories
  private conversations: Map<string, Conversation> = new Map();
  private messages: Map<string, Message> = new Map();
  private participants: Map<string, ConversationParticipant[]> = new Map();
  private reactions: Map<string, MessageReaction[]> = new Map();

  constructor() {
    // Initialize with some mock data for demonstration
    this.initializeMockData();
  }

  async createConversation(
    createConversationDto: CreateConversationDto,
    createdByUserId: number,
  ): Promise<Conversation> {
    const conversationId = this.generateId();

    // Validate conversation type requirements
    if (
      createConversationDto.type === ConversationType.GROUP &&
      !createConversationDto.title
    ) {
      throw new BadRequestException('Group conversations require a title');
    }

    if (
      createConversationDto.type === ConversationType.EVENT_CHAT &&
      !createConversationDto.eventId
    ) {
      throw new BadRequestException('Event conversations require an event ID');
    }

    // Create conversation
    const conversation: Conversation = {
      id: conversationId,
      type: createConversationDto.type,
      status: ConversationStatus.ACTIVE,
      title: createConversationDto.title || null,
      description: createConversationDto.description || null,
      createdBy: { id: createdByUserId } as any,
      event: createConversationDto.eventId
        ? ({ id: createConversationDto.eventId } as any)
        : null,
      avatarUrl: createConversationDto.avatarUrl || null,
      isPinned: createConversationDto.isPinned || false,
      isMuted: false,
      participantCount: createConversationDto.participantIds.length + 1, // +1 for creator
      messageCount: 0,
      lastActivityAt: new Date(),
      lastMessagePreview: null,
      settings: createConversationDto.settings || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.conversations.set(conversationId, conversation);

    // Add participants
    const participants: ConversationParticipant[] = [];

    // Add creator as owner
    participants.push({
      id: this.generateId(),
      conversation,
      user: { id: createdByUserId } as any,
      role: ParticipantRole.OWNER,
      status: ParticipantStatus.ACTIVE,
      nickname: null,
      isMuted: false,
      isPinned: false,
      joinedAt: new Date(),
      leftAt: null,
      lastReadAt: new Date(),
      unreadCount: 0,
      lastSeenAt: new Date(),
      addedBy: null,
      settings: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Add other participants as members
    for (const participantId of createConversationDto.participantIds) {
      if (participantId !== createdByUserId) {
        participants.push({
          id: this.generateId(),
          conversation,
          user: { id: participantId } as any,
          role: ParticipantRole.MEMBER,
          status: ParticipantStatus.ACTIVE,
          nickname: null,
          isMuted: false,
          isPinned: false,
          joinedAt: new Date(),
          leftAt: null,
          lastReadAt: null,
          unreadCount: 0,
          lastSeenAt: null,
          addedBy: { id: createdByUserId } as any,
          settings: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    this.participants.set(conversationId, participants);

    // Send initial message if provided
    if (createConversationDto.initialMessage) {
      await this.sendMessage(
        {
          conversationId,
          type: MessageType.TEXT,
          content: createConversationDto.initialMessage,
        } as SendMessageDto,
        createdByUserId,
      );
    }

    return conversation;
  }

  async getConversations(userId: number): Promise<Conversation[]> {
    const userConversations: Conversation[] = [];

    for (const [conversationId, conversation] of this.conversations) {
      const conversationParticipants =
        this.participants.get(conversationId) || [];
      const isParticipant = conversationParticipants.some(
        (p) => p.user.id === userId && p.status === ParticipantStatus.ACTIVE,
      );

      if (isParticipant) {
        userConversations.push(conversation);
      }
    }

    // Sort by last activity
    return userConversations.sort(
      (a, b) =>
        (b.lastActivityAt?.getTime() || 0) - (a.lastActivityAt?.getTime() || 0),
    );
  }

  async getConversation(
    conversationId: string,
    userId: number,
  ): Promise<Conversation> {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Check if user is a participant
    const conversationParticipants =
      this.participants.get(conversationId) || [];
    const isParticipant = conversationParticipants.some(
      (p) => p.user.id === userId && p.status === ParticipantStatus.ACTIVE,
    );

    if (!isParticipant) {
      throw new ForbiddenException('Access denied');
    }

    return conversation;
  }

  async sendMessage(
    sendMessageDto: SendMessageDto,
    senderId: number,
  ): Promise<Message> {
    // Verify conversation exists and user is participant
    await this.getConversation(sendMessageDto.conversationId, senderId);

    const messageId = this.generateId();
    const conversation = this.conversations.get(sendMessageDto.conversationId)!;

    const message: Message = {
      id: messageId,
      conversation,
      sender: { id: senderId } as any,
      replyTo: sendMessageDto.replyToId
        ? ({ id: sendMessageDto.replyToId } as any)
        : null,
      type: sendMessageDto.type,
      status: MessageStatus.SENT,
      content: sendMessageDto.content || null,
      mediaUrl: sendMessageDto.mediaUrl || null,
      fileName: sendMessageDto.fileName || null,
      fileSize: sendMessageDto.fileSize || null,
      mimeType: sendMessageDto.mimeType || null,
      thumbnailUrl: sendMessageDto.thumbnailUrl || null,
      duration: sendMessageDto.duration || null,
      location: sendMessageDto.location || null,
      isEdited: false,
      editedAt: null,
      isPinned: false,
      pinnedAt: null,
      pinnedBy: null,
      reactionCount: 0,
      replyCount: 0,
      expiresAt: null,
      metadata: sendMessageDto.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.messages.set(messageId, message);

    // Update conversation
    conversation.messageCount++;
    conversation.lastActivityAt = new Date();
    conversation.lastMessagePreview = this.getMessagePreview(message);
    conversation.updatedAt = new Date();

    // Update unread counts for other participants
    const conversationParticipants =
      this.participants.get(sendMessageDto.conversationId) || [];
    for (const participant of conversationParticipants) {
      if (participant.user.id !== senderId) {
        participant.unreadCount++;
      }
    }

    return message;
  }

  async getMessages(
    conversationId: string,
    userId: number,
    limit: number = 50,
    before?: string,
  ): Promise<Message[]> {
    // Verify access
    await this.getConversation(conversationId, userId);

    // Get all messages for conversation
    const conversationMessages: Message[] = [];
    for (const [messageId, message] of this.messages) {
      if (message.conversation.id === conversationId) {
        conversationMessages.push(message);
      }
    }

    // Sort by creation time (newest first)
    conversationMessages.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );

    // Apply pagination
    if (before) {
      const beforeIndex = conversationMessages.findIndex(
        (m) => m.id === before,
      );
      if (beforeIndex > -1) {
        return conversationMessages.slice(
          beforeIndex + 1,
          beforeIndex + 1 + limit,
        );
      }
    }

    return conversationMessages.slice(0, limit);
  }

  async addReaction(
    messageId: string,
    reaction: ReactionType,
    userId: number,
  ): Promise<MessageReaction> {
    const message = this.messages.get(messageId);
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Check if user is participant in conversation
    await this.getConversation(message.conversation.id, userId);

    const reactionId = this.generateId();
    const messageReaction: MessageReaction = {
      id: reactionId,
      message,
      user: { id: userId } as any,
      reaction,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Get or create reactions array for message
    const messageReactions = this.reactions.get(messageId) || [];

    // Remove existing reaction from same user with same type
    const existingIndex = messageReactions.findIndex(
      (r) => r.user.id === userId && r.reaction === reaction,
    );
    if (existingIndex > -1) {
      messageReactions.splice(existingIndex, 1);
      message.reactionCount = Math.max(0, message.reactionCount - 1);
    } else {
      messageReactions.push(messageReaction);
      message.reactionCount++;
    }

    this.reactions.set(messageId, messageReactions);

    return messageReaction;
  }

  async markAsRead(conversationId: string, userId: number): Promise<void> {
    // Verify access
    await this.getConversation(conversationId, userId);

    // Update participant's last read time and reset unread count
    const conversationParticipants =
      this.participants.get(conversationId) || [];
    const participant = conversationParticipants.find(
      (p) => p.user.id === userId,
    );

    if (participant) {
      participant.lastReadAt = new Date();
      participant.unreadCount = 0;
      participant.lastSeenAt = new Date();
    }
  }

  async addParticipant(
    conversationId: string,
    participantId: number,
    addedByUserId: number,
  ): Promise<ConversationParticipant> {
    const conversation = await this.getConversation(
      conversationId,
      addedByUserId,
    );

    // Check if adder has permission (owner or admin)
    const conversationParticipants =
      this.participants.get(conversationId) || [];
    const adder = conversationParticipants.find(
      (p) => p.user.id === addedByUserId,
    );

    if (
      !adder ||
      ![ParticipantRole.OWNER, ParticipantRole.ADMIN].includes(adder.role)
    ) {
      throw new ForbiddenException(
        'Insufficient permissions to add participants',
      );
    }

    // Check if user is already a participant
    const existingParticipant = conversationParticipants.find(
      (p) => p.user.id === participantId,
    );
    if (
      existingParticipant &&
      existingParticipant.status === ParticipantStatus.ACTIVE
    ) {
      throw new BadRequestException('User is already a participant');
    }

    const newParticipant: ConversationParticipant = {
      id: this.generateId(),
      conversation,
      user: { id: participantId } as any,
      role: ParticipantRole.MEMBER,
      status: ParticipantStatus.ACTIVE,
      nickname: null,
      isMuted: false,
      isPinned: false,
      joinedAt: new Date(),
      leftAt: null,
      lastReadAt: null,
      unreadCount: 0,
      lastSeenAt: null,
      addedBy: { id: addedByUserId } as any,
      settings: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    conversationParticipants.push(newParticipant);
    this.participants.set(conversationId, conversationParticipants);

    // Update conversation participant count
    conversation.participantCount++;

    return newParticipant;
  }

  private getMessagePreview(message: Message): string {
    switch (message.type) {
      case MessageType.TEXT:
        return (
          message.content?.substring(0, 100) +
            (message.content && message.content.length > 100 ? '...' : '') || ''
        );
      case MessageType.IMAGE:
        return '📷 Image';
      case MessageType.VIDEO:
        return '🎥 Video';
      case MessageType.AUDIO:
        return '🎵 Audio';
      case MessageType.FILE:
        return `📎 ${message.fileName || 'File'}`;
      case MessageType.LOCATION:
        return '📍 Location';
      case MessageType.SYSTEM:
        return message.content || 'System message';
      default:
        return 'Message';
    }
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substring(2);
  }

  private initializeMockData(): void {
    // Initialize with some sample data for demonstration
    const sampleConversation: Conversation = {
      id: 'conv-1',
      type: ConversationType.GROUP,
      status: ConversationStatus.ACTIVE,
      title: 'Party Planning Group',
      description: 'Planning for the upcoming celebration',
      createdBy: { id: 1 } as any,
      event: null,
      avatarUrl: null,
      isPinned: false,
      isMuted: false,
      participantCount: 3,
      messageCount: 2,
      lastActivityAt: new Date(),
      lastMessagePreview: 'Hey everyone! Ready to plan?',
      settings: {},
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      updatedAt: new Date(),
    };

    this.conversations.set('conv-1', sampleConversation);

    // Add sample participants
    this.participants.set('conv-1', [
      {
        id: 'part-1',
        conversation: sampleConversation,
        user: { id: 1 } as any,
        role: ParticipantRole.OWNER,
        status: ParticipantStatus.ACTIVE,
        nickname: null,
        isMuted: false,
        isPinned: false,
        joinedAt: new Date(Date.now() - 86400000),
        leftAt: null,
        lastReadAt: new Date(),
        unreadCount: 0,
        lastSeenAt: new Date(),
        addedBy: null,
        settings: {},
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(),
      },
    ]);
  }
}
