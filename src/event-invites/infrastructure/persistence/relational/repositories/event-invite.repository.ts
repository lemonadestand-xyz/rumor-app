import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventInviteEntity } from '../entities/event-invite.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { EventInvite } from '../../../../domain/event-invite';
import { EventInviteMapper } from '../mappers/event-invite.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import {
  FilterEventInviteDto,
  SortEventInviteDto,
} from '../../../../dto/query-event-invite.dto';

@Injectable()
export class EventInviteRepository {
  constructor(
    @InjectRepository(EventInviteEntity)
    private readonly eventInviteRepository: Repository<EventInviteEntity>,
  ) {}

  async create(data: EventInvite): Promise<EventInvite> {
    const persistenceModel = EventInviteMapper.toPersistence(data);
    const newEntity = await this.eventInviteRepository.save(
      this.eventInviteRepository.create(persistenceModel),
    );
    return EventInviteMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterEventInviteDto | null;
    sortOptions?: SortEventInviteDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<EventInvite[]> {
    const queryBuilder = this.eventInviteRepository
      .createQueryBuilder('eventInvite')
      .leftJoinAndSelect('eventInvite.event', 'event')
      .leftJoinAndSelect('eventInvite.invitedBy', 'invitedBy')
      .leftJoinAndSelect('eventInvite.invitedUser', 'invitedUser');

    if (filterOptions?.statuses?.length) {
      queryBuilder.andWhere('eventInvite.status IN (:...statuses)', {
        statuses: filterOptions.statuses,
      });
    }

    if (filterOptions?.inviteTypes?.length) {
      queryBuilder.andWhere('eventInvite.inviteType IN (:...inviteTypes)', {
        inviteTypes: filterOptions.inviteTypes,
      });
    }

    if (filterOptions?.eventId) {
      queryBuilder.andWhere('eventInvite.event_id = :eventId', {
        eventId: filterOptions.eventId,
      });
    }

    if (filterOptions?.invitedById) {
      queryBuilder.andWhere('eventInvite.invited_by_user_id = :invitedById', {
        invitedById: filterOptions.invitedById,
      });
    }

    if (filterOptions?.invitedUserId) {
      queryBuilder.andWhere('eventInvite.invited_user_id = :invitedUserId', {
        invitedUserId: filterOptions.invitedUserId,
      });
    }

    if (filterOptions?.inviteeEmail) {
      queryBuilder.andWhere('eventInvite.inviteeEmail = :inviteeEmail', {
        inviteeEmail: filterOptions.inviteeEmail,
      });
    }

    if (filterOptions?.isVIP !== undefined) {
      queryBuilder.andWhere('eventInvite.isVIP = :isVIP', {
        isVIP: filterOptions.isVIP,
      });
    }

    if (filterOptions?.allowPlusOne !== undefined) {
      queryBuilder.andWhere('eventInvite.allowPlusOne = :allowPlusOne', {
        allowPlusOne: filterOptions.allowPlusOne,
      });
    }

    if (sortOptions?.length) {
      sortOptions.forEach((sort, index) => {
        if (index === 0) {
          queryBuilder.orderBy(`eventInvite.${sort.orderBy}`, sort.order);
        } else {
          queryBuilder.addOrderBy(`eventInvite.${sort.orderBy}`, sort.order);
        }
      });
    } else {
      queryBuilder.orderBy('eventInvite.createdAt', 'DESC');
    }

    queryBuilder
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit);

    const entities = await queryBuilder.getMany();
    return entities.map((entity) => EventInviteMapper.toDomain(entity));
  }

  async findOne(fields: {
    id?: EventInvite['id'];
    inviteCode?: EventInvite['inviteCode'];
  }): Promise<NullableType<EventInvite>> {
    const queryBuilder = this.eventInviteRepository
      .createQueryBuilder('eventInvite')
      .leftJoinAndSelect('eventInvite.event', 'event')
      .leftJoinAndSelect('eventInvite.invitedBy', 'invitedBy')
      .leftJoinAndSelect('eventInvite.invitedUser', 'invitedUser');

    if (fields.id) {
      queryBuilder.andWhere('eventInvite.id = :id', { id: fields.id });
    }

    if (fields.inviteCode) {
      queryBuilder.andWhere('eventInvite.inviteCode = :inviteCode', {
        inviteCode: fields.inviteCode,
      });
    }

    const entity = await queryBuilder.getOne();

    return entity ? EventInviteMapper.toDomain(entity) : null;
  }

  async update(
    id: EventInvite['id'],
    payload: Partial<EventInvite>,
  ): Promise<EventInvite> {
    const entity = await this.eventInviteRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Event invite not found');
    }

    const updatedEntity = await this.eventInviteRepository.save(
      this.eventInviteRepository.create(
        EventInviteMapper.toPersistence({
          ...EventInviteMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return EventInviteMapper.toDomain(updatedEntity);
  }

  async softDelete(id: EventInvite['id']): Promise<void> {
    await this.eventInviteRepository.softDelete(id);
  }

  async findByEventId(eventId: string): Promise<EventInvite[]> {
    const entities = await this.eventInviteRepository.find({
      where: { event: { id: eventId } },
      relations: ['event', 'invitedBy', 'invitedUser'],
    });

    return entities.map((entity) => EventInviteMapper.toDomain(entity));
  }

  async findByUserId(userId: number): Promise<EventInvite[]> {
    const entities = await this.eventInviteRepository.find({
      where: [{ invitedBy: { id: userId } }, { invitedUser: { id: userId } }],
      relations: ['event', 'invitedBy', 'invitedUser'],
    });

    return entities.map((entity) => EventInviteMapper.toDomain(entity));
  }

  async findByEmail(email: string): Promise<EventInvite[]> {
    const entities = await this.eventInviteRepository.find({
      where: { inviteeEmail: email },
      relations: ['event', 'invitedBy', 'invitedUser'],
    });

    return entities.map((entity) => EventInviteMapper.toDomain(entity));
  }
}
