import { Injectable, NotFoundException } from '@nestjs/common';
import { EventRepository } from './infrastructure/persistence/relational/repositories/event.repository';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event, EventStatus } from './domain/event';
import { IPaginationOptions } from '../utils/types/pagination-options';

@Injectable()
export class EventsService {
  constructor(private readonly eventRepository: EventRepository) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    // Generate slug from title
    const slug = this.generateSlug(createEventDto.title);

    const event = await this.eventRepository.create({
      ...createEventDto,
      slug,
      status: createEventDto.status || EventStatus.DRAFT,
    });
    return event;
  }

  private generateSlug(title: string): string {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Add random suffix to ensure uniqueness
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `${baseSlug}-${randomSuffix}`;
  }

  async findAll(paginationOptions: IPaginationOptions) {
    return this.eventRepository.findManyWithPagination({
      paginationOptions,
    });
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({ id });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async findBySlug(slug: string): Promise<Event> {
    const event = await this.eventRepository.findOne({ slug });
    if (!event) {
      throw new NotFoundException(`Event with slug ${slug} not found`);
    }
    return event;
  }

  async findByHost(hostId: number, paginationOptions: IPaginationOptions) {
    return this.eventRepository.findManyWithPagination({
      filterOptions: { host: { id: hostId } as any },
      paginationOptions,
    });
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);
    const updated = await this.eventRepository.update(id, updateEventDto);
    return updated!;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.eventRepository.softDelete(id);
  }
}
