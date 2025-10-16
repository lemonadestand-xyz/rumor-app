import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
} from '@nestjs/swagger';
import { EventInvitesService } from './event-invites.service';
import { CreateEventInviteDto } from './dto/create-event-invite.dto';
import { UpdateEventInviteDto } from './dto/update-event-invite.dto';
import { RespondInviteDto } from './dto/respond-invite.dto';
import { SendReminderDto } from './dto/send-reminder.dto';
import { QueryEventInviteDto } from './dto/query-event-invite.dto';
import { EventInvite } from './domain/event-invite';
import { AuthGuard } from '@nestjs/passport';
import { infinityPagination } from '../utils/infinity-pagination';

@ApiTags('Event Invites')
@Controller({
  path: 'event-invites',
  version: '1',
})
export class EventInvitesController {
  constructor(private readonly eventInvitesService: EventInvitesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create event invitation' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Event invitation created successfully',
    type: EventInvite,
  })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createEventInviteDto: CreateEventInviteDto,
    @Request() req,
  ): Promise<EventInvite> {
    return this.eventInvitesService.create(createEventInviteDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all event invitations' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of event invitations',
  })
  async findAll(@Query() query: QueryEventInviteDto) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;

    return infinityPagination(
      await this.eventInvitesService.findAll({
        filterOptions: query?.filters,
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get('event/:eventId')
  @ApiOperation({ summary: 'Get invitations by event ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of invitations for the event',
    type: [EventInvite],
  })
  findByEventId(@Param('eventId') eventId: string): Promise<EventInvite[]> {
    return this.eventInvitesService.findByEventId(eventId);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get invitations by user ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of invitations for the user',
    type: [EventInvite],
  })
  findByUserId(@Param('userId') userId: string): Promise<EventInvite[]> {
    return this.eventInvitesService.findByUserId(+userId);
  }

  @Get('my-invites')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user invitations' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of current user invitations',
    type: [EventInvite],
  })
  findMyInvites(@Request() req): Promise<EventInvite[]> {
    return this.eventInvitesService.findByUserId(req.user.id);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Get invitations by email' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of invitations for the email',
    type: [EventInvite],
  })
  findByEmail(@Param('email') email: string): Promise<EventInvite[]> {
    return this.eventInvitesService.findByEmail(email);
  }

  @Get('code/:inviteCode')
  @ApiOperation({ summary: 'Get invitation by invite code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Invitation details',
    type: EventInvite,
  })
  findByInviteCode(
    @Param('inviteCode') inviteCode: string,
  ): Promise<EventInvite> {
    return this.eventInvitesService.findByInviteCode(inviteCode);
  }

  @Get('view/:inviteCode')
  @ApiOperation({ summary: 'View invitation (marks as viewed)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Invitation viewed successfully',
    type: EventInvite,
  })
  viewInvite(@Param('inviteCode') inviteCode: string): Promise<EventInvite> {
    return this.eventInvitesService.viewInvite(inviteCode);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invitation by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Invitation details',
    type: EventInvite,
  })
  findOne(@Param('id') id: string): Promise<EventInvite> {
    return this.eventInvitesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update invitation' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Invitation updated successfully',
    type: EventInvite,
  })
  update(
    @Param('id') id: string,
    @Body() updateEventInviteDto: UpdateEventInviteDto,
  ): Promise<EventInvite> {
    return this.eventInvitesService.update(id, updateEventInviteDto);
  }

  @Post(':id/send')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send invitation' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Invitation sent successfully',
    type: EventInvite,
  })
  sendInvite(@Param('id') id: string): Promise<EventInvite> {
    return this.eventInvitesService.sendInvite(id);
  }

  @Post('respond/:inviteCode')
  @ApiOperation({ summary: 'Respond to invitation' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Response recorded successfully',
    type: EventInvite,
  })
  respondToInvite(
    @Param('inviteCode') inviteCode: string,
    @Body() respondInviteDto: RespondInviteDto,
  ): Promise<EventInvite> {
    return this.eventInvitesService.respondToInvite(
      inviteCode,
      respondInviteDto,
    );
  }

  @Post(':id/reminder')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send reminder for invitation' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reminder sent successfully',
    type: EventInvite,
  })
  sendReminder(
    @Param('id') id: string,
    @Body() sendReminderDto: SendReminderDto,
  ): Promise<EventInvite> {
    return this.eventInvitesService.sendReminder(id, sendReminderDto);
  }

  @Post(':id/cancel')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel invitation' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Invitation cancelled successfully',
    type: EventInvite,
  })
  cancelInvite(@Param('id') id: string): Promise<EventInvite> {
    return this.eventInvitesService.cancelInvite(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete invitation' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Invitation deleted successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.eventInvitesService.remove(id);
  }
}
