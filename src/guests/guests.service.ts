import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { GuestRepository } from './infrastructure/persistence/relational/repositories/guest.repository';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { Guest, RSVPStatus, CheckInStatus } from './domain/guest';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { EventsService } from '../events/events.service';

@Injectable()
export class GuestsService {
  constructor(
    private readonly guestRepository: GuestRepository,
    private readonly eventsService: EventsService,
  ) {}

  async create(createGuestDto: CreateGuestDto | any): Promise<Guest> {
    // Check if guest already exists for this event
    const existing = await this.guestRepository.findOne({
      event: {
        id: (createGuestDto.event as any).id || createGuestDto.event,
      } as any,
      user: {
        id: (createGuestDto.user as any).id || createGuestDto.user,
      } as any,
    });

    if (existing) {
      throw new ConflictException('Guest already exists for this event');
    }

    return this.guestRepository.create({
      ...createGuestDto,
      invitedAt: new Date(),
      ticketCode: this.generateTicketCode(),
      qrCodeUrl: this.generateQRCode(),
    } as any);
  }

  async findAll(paginationOptions: IPaginationOptions): Promise<Guest[]> {
    return this.guestRepository.findManyWithPagination({
      paginationOptions,
    });
  }

  async findByEvent(
    eventId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<Guest[]> {
    return this.guestRepository.findManyWithPagination({
      filterOptions: { event: { id: eventId } as any },
      paginationOptions,
    });
  }

  async findByUser(
    userId: number,
    paginationOptions: IPaginationOptions,
  ): Promise<Guest[]> {
    return this.guestRepository.findManyWithPagination({
      filterOptions: { user: { id: userId } as any },
      paginationOptions,
    });
  }

  async findOne(id: string): Promise<Guest> {
    const guest = await this.guestRepository.findOne({ id });
    if (!guest) {
      throw new NotFoundException(`Guest with ID ${id} not found`);
    }
    return guest;
  }

  async update(id: string, updateGuestDto: UpdateGuestDto): Promise<Guest> {
    await this.findOne(id);
    const updated = await this.guestRepository.update(
      id,
      updateGuestDto as any,
    );
    return updated!;
  }

  async updateRSVP(id: string, status: RSVPStatus): Promise<Guest> {
    await this.findOne(id);
    const updated = await this.guestRepository.update(id, {
      rsvpStatus: status,
      respondedAt: new Date(),
    });
    if (!updated) {
      throw new NotFoundException(`Failed to update RSVP for guest ${id}`);
    }
    return updated;
  }

  async checkIn(id: string, checkedInBy: number): Promise<Guest> {
    const guest = await this.findOne(id);

    if (guest.checkInStatus === CheckInStatus.CHECKED_IN) {
      throw new ConflictException('Guest already checked in');
    }

    const updated = await this.guestRepository.update(id, {
      checkInStatus: CheckInStatus.CHECKED_IN,
      checkedInAt: new Date(),
      checkedInBy: { id: checkedInBy } as any,
    });
    if (!updated) {
      throw new NotFoundException(`Failed to check in guest ${id}`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.guestRepository.softDelete(id);
  }

  private generateTicketCode(): string {
    return 'TKT-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  }

  private generateQRCode(): string {
    const code = Math.random().toString(36).substring(2, 15);
    return `https://rumor.com/qr/${code}`;
  }
}
