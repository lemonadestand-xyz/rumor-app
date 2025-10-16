import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { MessagingService } from './messaging.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { Conversation } from './domain/conversation';
import { Message } from './domain/message';
import { ConversationParticipant } from './domain/conversation-participant';
import { MessageReaction, ReactionType } from './domain/message-reaction';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Messaging')
@Controller({
  path: 'messaging',
  version: '1',
})
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post('conversations')
  @ApiOperation({ summary: 'Create a new conversation' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Conversation created successfully',
    type: Conversation,
  })
  @HttpCode(HttpStatus.CREATED)
  async createConversation(
    @Body() createConversationDto: CreateConversationDto,
    @Request() req,
  ): Promise<Conversation> {
    return this.messagingService.createConversation(
      createConversationDto,
      req.user.id,
    );
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Get user conversations' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of user conversations',
    type: [Conversation],
  })
  async getConversations(@Request() req): Promise<Conversation[]> {
    return this.messagingService.getConversations(req.user.id);
  }

  @Get('conversations/:conversationId')
  @ApiOperation({ summary: 'Get conversation details' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Conversation details',
    type: Conversation,
  })
  async getConversation(
    @Param('conversationId') conversationId: string,
    @Request() req,
  ): Promise<Conversation> {
    return this.messagingService.getConversation(conversationId, req.user.id);
  }

  @Post('messages')
  @ApiOperation({ summary: 'Send a message' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Message sent successfully',
    type: Message,
  })
  @HttpCode(HttpStatus.CREATED)
  async sendMessage(
    @Body() sendMessageDto: SendMessageDto,
    @Request() req,
  ): Promise<Message> {
    return this.messagingService.sendMessage(sendMessageDto, req.user.id);
  }

  @Get('conversations/:conversationId/messages')
  @ApiOperation({ summary: 'Get conversation messages' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of messages in conversation',
    type: [Message],
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of messages to return',
    example: 50,
  })
  @ApiQuery({
    name: 'before',
    required: false,
    description: 'Message ID to paginate before',
    example: 'msg-123',
  })
  async getMessages(
    @Param('conversationId') conversationId: string,
    @Query('limit') limit?: number,
    @Query('before') before?: string,
    @Request() req,
  ): Promise<Message[]> {
    return this.messagingService.getMessages(
      conversationId,
      req.user.id,
      limit ? parseInt(limit.toString()) : 50,
      before,
    );
  }

  @Post('messages/:messageId/reactions/:reaction')
  @ApiOperation({ summary: 'Add reaction to message' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Reaction added successfully',
    type: MessageReaction,
  })
  @HttpCode(HttpStatus.CREATED)
  async addReaction(
    @Param('messageId') messageId: string,
    @Param('reaction') reaction: ReactionType,
    @Request() req,
  ): Promise<MessageReaction> {
    return this.messagingService.addReaction(messageId, reaction, req.user.id);
  }

  @Post('conversations/:conversationId/read')
  @ApiOperation({ summary: 'Mark conversation as read' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Conversation marked as read',
  })
  async markAsRead(
    @Param('conversationId') conversationId: string,
    @Request() req,
  ): Promise<{ success: boolean }> {
    await this.messagingService.markAsRead(conversationId, req.user.id);
    return { success: true };
  }

  @Post('conversations/:conversationId/participants/:participantId')
  @ApiOperation({ summary: 'Add participant to conversation' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Participant added successfully',
    type: ConversationParticipant,
  })
  @HttpCode(HttpStatus.CREATED)
  async addParticipant(
    @Param('conversationId') conversationId: string,
    @Param('participantId') participantId: string,
    @Request() req,
  ): Promise<ConversationParticipant> {
    return this.messagingService.addParticipant(
      conversationId,
      parseInt(participantId),
      req.user.id,
    );
  }

  // Additional WebSocket endpoints for real-time messaging would be implemented here
  // Example: @WebSocketGateway() for real-time message delivery, typing indicators, etc.
}
