import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TicketRepository } from './infrastructure/persistence/relational/repositories/ticket.repository';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TransferTicketDto } from './dto/transfer-ticket.dto';
import { ScanTicketDto } from './dto/scan-ticket.dto';
import { Ticket, TicketStatus } from './domain/ticket';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { FilterTicketDto, SortTicketDto } from './dto/query-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(private readonly ticketRepository: TicketRepository) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const ticketNumber = this.generateTicketNumber();
    const qrCode = this.generateQRCode(ticketNumber);

    const clonedPayload = {
      ...createTicketDto,
      ticketNumber,
      qrCode,
      isUsed: false,
      transferCount: 0,
      isRefunded: false,
      isTransferable: createTicketDto.isTransferable ?? true,
      status: createTicketDto.status ?? TicketStatus.AVAILABLE,
      validFrom: new Date(createTicketDto.validFrom),
      validUntil: new Date(createTicketDto.validUntil),
      metadata: createTicketDto.metadata || {},
    };

    if (createTicketDto.eventId) {
      clonedPayload.event = { id: createTicketDto.eventId } as any;
    }

    if (createTicketDto.guestId) {
      clonedPayload.guest = { id: createTicketDto.guestId } as any;
    }

    if (createTicketDto.ownerId) {
      clonedPayload.owner = { id: createTicketDto.ownerId } as any;
    }

    if (createTicketDto.purchasedById) {
      clonedPayload.purchasedBy = { id: createTicketDto.purchasedById } as any;
      clonedPayload.purchasedAt = new Date();
    }

    return this.ticketRepository.create(clonedPayload);
  }

  async findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterTicketDto | null;
    sortOptions?: SortTicketDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Ticket[]> {
    return this.ticketRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  async findOne(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({ id });
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    return ticket;
  }

  async findByTicketNumber(ticketNumber: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({ ticketNumber });
    if (!ticket) {
      throw new NotFoundException(
        `Ticket with number ${ticketNumber} not found`,
      );
    }
    return ticket;
  }

  async findByEventId(eventId: string): Promise<Ticket[]> {
    return this.ticketRepository.findByEventId(eventId);
  }

  async findByUserId(userId: number): Promise<Ticket[]> {
    return this.ticketRepository.findByUserId(userId);
  }

  async update(id: string, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    await this.findOne(id);

    const payload: Partial<Ticket> = { ...updateTicketDto };

    if (updateTicketDto.eventId) {
      payload.event = { id: updateTicketDto.eventId } as any;
    }

    if (updateTicketDto.guestId) {
      payload.guest = { id: updateTicketDto.guestId } as any;
    }

    if (updateTicketDto.ownerId) {
      payload.owner = { id: updateTicketDto.ownerId } as any;
    }

    if (updateTicketDto.purchasedById) {
      payload.purchasedBy = { id: updateTicketDto.purchasedById } as any;
    }

    if (updateTicketDto.validFrom) {
      payload.validFrom = new Date(updateTicketDto.validFrom);
    }

    if (updateTicketDto.validUntil) {
      payload.validUntil = new Date(updateTicketDto.validUntil);
    }

    const updated = await this.ticketRepository.update(id, payload);
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.ticketRepository.softDelete(id);
  }

  async transferTicket(
    ticketId: string,
    transferTicketDto: TransferTicketDto,
    transferredByUserId: number,
  ): Promise<Ticket> {
    const ticket = await this.findOne(ticketId);

    if (!ticket.isTransferable) {
      throw new BadRequestException('This ticket is not transferable');
    }

    if (ticket.status === TicketStatus.USED) {
      throw new BadRequestException('Cannot transfer a used ticket');
    }

    if (ticket.status === TicketStatus.CANCELLED) {
      throw new BadRequestException('Cannot transfer a cancelled ticket');
    }

    if (ticket.status === TicketStatus.REFUNDED) {
      throw new BadRequestException('Cannot transfer a refunded ticket');
    }

    const updatedTicket = await this.ticketRepository.update(ticketId, {
      transferredFrom: { id: transferredByUserId } as any,
      transferredTo: { id: transferTicketDto.transferToUserId } as any,
      owner: { id: transferTicketDto.transferToUserId } as any,
      lastTransferredAt: new Date(),
      transferCount: ticket.transferCount + 1,
      status: TicketStatus.TRANSFERRED,
    });

    return updatedTicket;
  }

  async scanTicket(
    scanTicketDto: ScanTicketDto,
    scannedByUserId: number,
  ): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      ticketNumber: scanTicketDto.ticketIdentifier,
    });

    if (!ticket) {
      // Try finding by QR code
      const ticketByQR = await this.ticketRepository.findOne({
        id: scanTicketDto.ticketIdentifier,
      });
      if (!ticketByQR) {
        throw new NotFoundException('Ticket not found');
      }
      return this.processTicketScan(
        ticketByQR,
        scannedByUserId,
        scanTicketDto.scanNotes,
      );
    }

    return this.processTicketScan(
      ticket,
      scannedByUserId,
      scanTicketDto.scanNotes,
    );
  }

  private async processTicketScan(
    ticket: Ticket,
    scannedByUserId: number,
    scanNotes?: string,
  ): Promise<Ticket> {
    if (ticket.isUsed) {
      throw new BadRequestException('Ticket has already been used');
    }

    if (ticket.status === TicketStatus.CANCELLED) {
      throw new BadRequestException('Ticket has been cancelled');
    }

    if (ticket.status === TicketStatus.REFUNDED) {
      throw new BadRequestException('Ticket has been refunded');
    }

    const now = new Date();
    if (now < ticket.validFrom) {
      throw new BadRequestException('Ticket is not yet valid');
    }

    if (now > ticket.validUntil) {
      throw new BadRequestException('Ticket has expired');
    }

    const updatedTicket = await this.ticketRepository.update(ticket.id, {
      isUsed: true,
      usedAt: now,
      scannedBy: { id: scannedByUserId } as any,
      status: TicketStatus.USED,
      metadata: {
        ...ticket.metadata,
        scanNotes,
        scannedAt: now.toISOString(),
      },
    });

    return updatedTicket;
  }

  async refundTicket(
    ticketId: string,
    refundReason: string,
    refundAmount?: number,
  ): Promise<Ticket> {
    const ticket = await this.findOne(ticketId);

    if (ticket.isUsed) {
      throw new BadRequestException('Cannot refund a used ticket');
    }

    if (ticket.isRefunded) {
      throw new BadRequestException('Ticket has already been refunded');
    }

    const finalRefundAmount = refundAmount || ticket.paidPrice || ticket.price;

    const updatedTicket = await this.ticketRepository.update(ticketId, {
      isRefunded: true,
      refundedAt: new Date(),
      refundAmount: finalRefundAmount,
      refundReason,
      status: TicketStatus.REFUNDED,
    });

    return updatedTicket;
  }

  private generateTicketNumber(): string {
    const prefix = 'TKT';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${timestamp}${random}`;
  }

  private generateQRCode(ticketNumber: string): string {
    // In a real application, this would generate a proper QR code URL
    return `https://rumor.com/qr/${ticketNumber}`;
  }
}
