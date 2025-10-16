import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { EventEntity } from '../entities/event.entity';
import { Event } from '../../../../domain/event';
import { EventMapper } from '../mappers/event.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class EventRepository {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}

  async create(data: Partial<Event>): Promise<Event> {
    const entity = this.eventRepository.create(EventMapper.toEntity(data));
    const saved = await this.eventRepository.save(entity);
    return EventMapper.toDomain(saved);
  }

  async findOne(fields: Partial<Event>): Promise<Event | null> {
    const entity = await this.eventRepository.findOne({
      where: fields as FindOptionsWhere<EventEntity>,
    });
    return entity ? EventMapper.toDomain(entity) : null;
  }

  async findManyWithPagination({
    filterOptions,
    paginationOptions,
  }: {
    filterOptions?: Partial<Event>;
    paginationOptions: IPaginationOptions;
  }): Promise<Event[]> {
    const entities = await this.eventRepository.find({
      where: filterOptions as FindOptionsWhere<EventEntity>,
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      order: { createdAt: 'DESC' },
    });
    return entities.map(EventMapper.toDomain);
  }

  async update(id: string, data: Partial<Event>): Promise<Event | null> {
    await this.eventRepository.update(id, EventMapper.toEntity(data));
    const entity = await this.eventRepository.findOne({ where: { id } });
    return entity ? EventMapper.toDomain(entity) : null;
  }

  async softDelete(id: string): Promise<void> {
    await this.eventRepository.softDelete(id);
  }
}
