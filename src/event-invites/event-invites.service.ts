import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EventInviteRepository } from './infrastructure/persistence/relational/repositories/event-invite.repository';
import { CreateEventInviteDto } from './dto/create-event-invite.dto';
import { UpdateEventInviteDto } from './dto/update-event-invite.dto';
import { RespondInviteDto } from './dto/respond-invite.dto';
import { SendReminderDto } from './dto/send-reminder.dto';
import { EventInvite, InviteStatus, InviteType } from './domain/event-invite';
import { IPaginationOptions } from '../utils/types/pagination-options';
import {
  FilterEventInviteDto,
  SortEventInviteDto,
} from './dto/query-event-invite.dto';

@Injectable()
export class EventInvitesService {
  constructor(private readonly eventInviteRepository: EventInviteRepository) {}

  async create(
    createEventInviteDto: CreateEventInviteDto,
    invitedByUserId: number,
  ): Promise<EventInvite> {
    const inviteCode = this.generateInviteCode();
    const inviteUrl = this.generateInviteUrl(inviteCode);

    const clonedPayload = {
      ...createEventInviteDto,
      inviteCode,
      inviteUrl,
      status: createEventInviteDto.status || InviteStatus.PENDING,
      allowPlusOne: createEventInviteDto.allowPlusOne || false,
      isVIP: createEventInviteDto.isVIP || false,
      remindersSent: 0,
      trackingData: createEventInviteDto.trackingData || {},
    };

    if (createEventInviteDto.eventId) {
      clonedPayload.event = { id: createEventInviteDto.eventId } as any;
    }

    clonedPayload.invitedBy = { id: invitedByUserId } as any;

    if (createEventInviteDto.invitedUserId) {
      clonedPayload.invitedUser = {
        id: createEventInviteDto.invitedUserId,
      } as any;
    }

    if (createEventInviteDto.expiresAt) {
      clonedPayload.expiresAt = new Date(createEventInviteDto.expiresAt);
    }

    return this.eventInviteRepository.create(clonedPayload);
  }

  async findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterEventInviteDto | null;
    sortOptions?: SortEventInviteDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<EventInvite[]> {
    return this.eventInviteRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  async findOne(id: string): Promise<EventInvite> {
    const eventInvite = await this.eventInviteRepository.findOne({ id });
    if (!eventInvite) {
      throw new NotFoundException(`Event invite with ID ${id} not found`);
    }
    return eventInvite;
  }

  async findByInviteCode(inviteCode: string): Promise<EventInvite> {
    const eventInvite = await this.eventInviteRepository.findOne({
      inviteCode,
    });
    if (!eventInvite) {
      throw new NotFoundException(
        `Event invite with code ${inviteCode} not found`,
      );
    }
    return eventInvite;
  }

  async findByEventId(eventId: string): Promise<EventInvite[]> {
    return this.eventInviteRepository.findByEventId(eventId);
  }

  async findByUserId(userId: number): Promise<EventInvite[]> {
    return this.eventInviteRepository.findByUserId(userId);
  }

  async findByEmail(email: string): Promise<EventInvite[]> {
    return this.eventInviteRepository.findByEmail(email);
  }

  async update(
    id: string,
    updateEventInviteDto: UpdateEventInviteDto,
  ): Promise<EventInvite> {
    await this.findOne(id);

    const payload: Partial<EventInvite> = { ...updateEventInviteDto };

    if (updateEventInviteDto.eventId) {
      payload.event = { id: updateEventInviteDto.eventId } as any;
    }

    if (updateEventInviteDto.invitedUserId) {
      payload.invitedUser = { id: updateEventInviteDto.invitedUserId } as any;
    }

    if (updateEventInviteDto.expiresAt) {
      payload.expiresAt = new Date(updateEventInviteDto.expiresAt);
    }

    const updated = await this.eventInviteRepository.update(id, payload);
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.eventInviteRepository.softDelete(id);
  }

  async sendInvite(inviteId: string): Promise<EventInvite> {
    const invite = await this.findOne(inviteId);

    if (invite.status !== InviteStatus.PENDING) {
      throw new BadRequestException(
        'Invite has already been sent or processed',
      );
    }

    const updatedInvite = await this.eventInviteRepository.update(inviteId, {
      status: InviteStatus.SENT,
      sentAt: new Date(),
      trackingData: {
        ...invite.trackingData,
        sentAt: new Date().toISOString(),
        sentVia: invite.inviteType,
      },
    });

    // Here you would integrate with email/SMS service
    // await this.notificationService.sendInvite(updatedInvite);

    return updatedInvite;
  }

  async viewInvite(inviteCode: string): Promise<EventInvite> {
    const invite = await this.findByInviteCode(inviteCode);

    if (invite.status === InviteStatus.EXPIRED) {
      throw new BadRequestException('This invitation has expired');
    }

    if (invite.status === InviteStatus.CANCELLED) {
      throw new BadRequestException('This invitation has been cancelled');
    }

    if (invite.expiresAt && new Date() > invite.expiresAt) {
      await this.eventInviteRepository.update(invite.id, {
        status: InviteStatus.EXPIRED,
      });
      throw new BadRequestException('This invitation has expired');
    }

    // Only update if not already viewed
    if (invite.status === InviteStatus.SENT) {
      return this.eventInviteRepository.update(invite.id, {
        status: InviteStatus.VIEWED,
        viewedAt: new Date(),
        trackingData: {
          ...invite.trackingData,
          viewedAt: new Date().toISOString(),
        },
      });
    }

    return invite;
  }

  async respondToInvite(
    inviteCode: string,
    respondInviteDto: RespondInviteDto,
  ): Promise<EventInvite> {
    const invite = await this.findByInviteCode(inviteCode);

    if (
      invite.status === InviteStatus.ACCEPTED ||
      invite.status === InviteStatus.DECLINED
    ) {
      throw new BadRequestException(
        'You have already responded to this invitation',
      );
    }

    if (invite.status === InviteStatus.EXPIRED) {
      throw new BadRequestException('This invitation has expired');
    }

    if (invite.status === InviteStatus.CANCELLED) {
      throw new BadRequestException('This invitation has been cancelled');
    }

    if (invite.expiresAt && new Date() > invite.expiresAt) {
      await this.eventInviteRepository.update(invite.id, {
        status: InviteStatus.EXPIRED,
      });
      throw new BadRequestException('This invitation has expired');
    }

    const updatedInvite = await this.eventInviteRepository.update(invite.id, {
      status: respondInviteDto.response,
      respondedAt: new Date(),
      trackingData: {
        ...invite.trackingData,
        respondedAt: new Date().toISOString(),
        response: respondInviteDto.response,
        responseMessage: respondInviteDto.responseMessage,
      },
    });

    return updatedInvite;
  }

  async sendReminder(
    inviteId: string,
    sendReminderDto: SendReminderDto,
  ): Promise<EventInvite> {
    const invite = await this.findOne(inviteId);

    if (
      invite.status === InviteStatus.ACCEPTED ||
      invite.status === InviteStatus.DECLINED
    ) {
      throw new BadRequestException(
        'Cannot send reminder for responded invitation',
      );
    }

    if (
      invite.status === InviteStatus.EXPIRED ||
      invite.status === InviteStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'Cannot send reminder for expired or cancelled invitation',
      );
    }

    const updatedInvite = await this.eventInviteRepository.update(inviteId, {
      remindersSent: invite.remindersSent + 1,
      lastReminderAt: new Date(),
      trackingData: {
        ...invite.trackingData,
        reminders: [
          ...(invite.trackingData?.reminders || []),
          {
            sentAt: new Date().toISOString(),
            message: sendReminderDto.reminderMessage,
          },
        ],
      },
    });

    // Here you would integrate with email/SMS service
    // await this.notificationService.sendReminder(updatedInvite, sendReminderDto.reminderMessage);

    return updatedInvite;
  }

  async cancelInvite(inviteId: string): Promise<EventInvite> {
    const invite = await this.findOne(inviteId);

    if (invite.status === InviteStatus.ACCEPTED) {
      throw new BadRequestException('Cannot cancel an accepted invitation');
    }

    if (invite.status === InviteStatus.CANCELLED) {
      throw new BadRequestException('Invitation is already cancelled');
    }

    const updatedInvite = await this.eventInviteRepository.update(inviteId, {
      status: InviteStatus.CANCELLED,
      trackingData: {
        ...invite.trackingData,
        cancelledAt: new Date().toISOString(),
      },
    });

    return updatedInvite;
  }

  private generateInviteCode(): string {
    const prefix = 'INV';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${timestamp}${random}`;
  }

  private generateInviteUrl(inviteCode: string): string {
    // In a real application, this would use the actual domain
    return `https://rumor.com/invite/${inviteCode}`;
  }
}
