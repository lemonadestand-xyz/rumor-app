import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketEntity } from '../entities/ticket.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Ticket } from '../../../../domain/ticket';
import { TicketMapper } from '../mappers/ticket.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import {
  FilterTicketDto,
  SortTicketDto,
} from '../../../../dto/query-ticket.dto';

@Injectable()
export class TicketRepository {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
  ) {}

  async create(data: Ticket): Promise<Ticket> {
    const persistenceModel = TicketMapper.toPersistence(data);
    const newEntity = await this.ticketRepository.save(
      this.ticketRepository.create(persistenceModel),
    );
    return TicketMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterTicketDto | null;
    sortOptions?: SortTicketDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Ticket[]> {
    const queryBuilder = this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.event', 'event')
      .leftJoinAndSelect('ticket.guest', 'guest')
      .leftJoinAndSelect('ticket.owner', 'owner')
      .leftJoinAndSelect('ticket.purchasedBy', 'purchasedBy')
      .leftJoinAndSelect('ticket.scannedBy', 'scannedBy')
      .leftJoinAndSelect('ticket.transferredFrom', 'transferredFrom')
      .leftJoinAndSelect('ticket.transferredTo', 'transferredTo');

    if (filterOptions?.statuses?.length) {
      queryBuilder.andWhere('ticket.status IN (:...statuses)', {
        statuses: filterOptions.statuses,
      });
    }

    if (filterOptions?.ticketTypes?.length) {
      queryBuilder.andWhere('ticket.ticketType IN (:...ticketTypes)', {
        ticketTypes: filterOptions.ticketTypes,
      });
    }

    if (filterOptions?.eventId) {
      queryBuilder.andWhere('ticket.event_id = :eventId', {
        eventId: filterOptions.eventId,
      });
    }

    if (filterOptions?.ownerId) {
      queryBuilder.andWhere('ticket.owner_user_id = :ownerId', {
        ownerId: filterOptions.ownerId,
      });
    }

    if (filterOptions?.purchasedById) {
      queryBuilder.andWhere('ticket.purchased_by_user_id = :purchasedById', {
        purchasedById: filterOptions.purchasedById,
      });
    }

    if (filterOptions?.isUsed !== undefined) {
      queryBuilder.andWhere('ticket.isUsed = :isUsed', {
        isUsed: filterOptions.isUsed,
      });
    }

    if (filterOptions?.isRefunded !== undefined) {
      queryBuilder.andWhere('ticket.isRefunded = :isRefunded', {
        isRefunded: filterOptions.isRefunded,
      });
    }

    if (sortOptions?.length) {
      sortOptions.forEach((sort, index) => {
        if (index === 0) {
          queryBuilder.orderBy(`ticket.${sort.orderBy}`, sort.order);
        } else {
          queryBuilder.addOrderBy(`ticket.${sort.orderBy}`, sort.order);
        }
      });
    } else {
      queryBuilder.orderBy('ticket.createdAt', 'DESC');
    }

    queryBuilder
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit);

    const entities = await queryBuilder.getMany();
    return entities.map((entity) => TicketMapper.toDomain(entity));
  }

  async findOne(fields: {
    id?: Ticket['id'];
    ticketNumber?: Ticket['ticketNumber'];
  }): Promise<NullableType<Ticket>> {
    const queryBuilder = this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.event', 'event')
      .leftJoinAndSelect('ticket.guest', 'guest')
      .leftJoinAndSelect('ticket.owner', 'owner')
      .leftJoinAndSelect('ticket.purchasedBy', 'purchasedBy')
      .leftJoinAndSelect('ticket.scannedBy', 'scannedBy')
      .leftJoinAndSelect('ticket.transferredFrom', 'transferredFrom')
      .leftJoinAndSelect('ticket.transferredTo', 'transferredTo');

    if (fields.id) {
      queryBuilder.andWhere('ticket.id = :id', { id: fields.id });
    }

    if (fields.ticketNumber) {
      queryBuilder.andWhere('ticket.ticketNumber = :ticketNumber', {
        ticketNumber: fields.ticketNumber,
      });
    }

    const entity = await queryBuilder.getOne();

    return entity ? TicketMapper.toDomain(entity) : null;
  }

  async update(id: Ticket['id'], payload: Partial<Ticket>): Promise<Ticket> {
    const entity = await this.ticketRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Ticket not found');
    }

    const updatedEntity = await this.ticketRepository.save(
      this.ticketRepository.create(
        TicketMapper.toPersistence({
          ...TicketMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return TicketMapper.toDomain(updatedEntity);
  }

  async softDelete(id: Ticket['id']): Promise<void> {
    await this.ticketRepository.softDelete(id);
  }

  async findByEventId(eventId: string): Promise<Ticket[]> {
    const entities = await this.ticketRepository.find({
      where: { event: { id: eventId } },
      relations: [
        'event',
        'guest',
        'owner',
        'purchasedBy',
        'scannedBy',
        'transferredFrom',
        'transferredTo',
      ],
    });

    return entities.map((entity) => TicketMapper.toDomain(entity));
  }

  async findByUserId(userId: number): Promise<Ticket[]> {
    const entities = await this.ticketRepository.find({
      where: [{ owner: { id: userId } }, { purchasedBy: { id: userId } }],
      relations: [
        'event',
        'guest',
        'owner',
        'purchasedBy',
        'scannedBy',
        'transferredFrom',
        'transferredTo',
      ],
    });

    return entities.map((entity) => TicketMapper.toDomain(entity));
  }
}
