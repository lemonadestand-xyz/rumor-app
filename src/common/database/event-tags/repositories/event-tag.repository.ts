import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BaseRepository, IQueryOptions } from '../../base.repository';
import { DATABASE_CONNECTION } from '../../database.consts';
import { DataSource } from 'typeorm';
import { EventTagEntity } from '../entities/event-tag.entity';

@Injectable()
export class EventTagRepository extends BaseRepository {
  constructor(@Inject(DATABASE_CONNECTION) dataSource: DataSource) {
    super(dataSource);
  }

  async findById(
    id: string,
    options?: IQueryOptions,
  ): Promise<EventTagEntity | null> {
    const { entityManager } = this.parseOptions(options);
    const repository = entityManager?.getRepository<EventTagEntity>(
      EventTagEntity,
    );

    if (!id) {
      throw new InternalServerErrorException('Event Tag ID is required');
    }

    const tag = await repository?.findOne({
      where: { id },
    });

    return tag ?? null;
  }

  async findByEventId(
    eventId: string,
    options?: IQueryOptions,
  ): Promise<EventTagEntity[]> {
    const { entityManager } = this.parseOptions(options);
    const repository = entityManager?.getRepository<EventTagEntity>(
      EventTagEntity,
    );

    if (!eventId) {
      throw new InternalServerErrorException('Event ID is required');
    }

    const tags = await repository?.find({
      where: { eventId },
    });

    return tags ?? [];
  }

  async findByTagName(
    tagName: string,
    options?: IQueryOptions,
  ): Promise<EventTagEntity[]> {
    const { entityManager } = this.parseOptions(options);
    const repository = entityManager?.getRepository<EventTagEntity>(
      EventTagEntity,
    );

    if (!tagName) {
      throw new InternalServerErrorException('Tag name is required');
    }

    const tags = await repository?.find({
      where: { tagName },
    });

    return tags ?? [];
  }

  async findByEventIdAndTagName(
    eventId: string,
    tagName: string,
    options?: IQueryOptions,
  ): Promise<EventTagEntity | null> {
    const { entityManager } = this.parseOptions(options);
    const repository = entityManager?.getRepository<EventTagEntity>(
      EventTagEntity,
    );

    if (!eventId || !tagName) {
      throw new InternalServerErrorException('Event ID and tag name are required');
    }

    const tag = await repository?.findOne({
      where: { eventId, tagName },
    });

    return tag ?? null;
  }

  async create(
    data: Partial<EventTagEntity>,
    options?: IQueryOptions,
  ): Promise<EventTagEntity> {
    const { entityManager } = this.parseOptions(options);
    if (!entityManager) {
      throw new InternalServerErrorException('Entity manager not available');
    }

    const repository = entityManager.getRepository(EventTagEntity);

    const entity = repository.create({
      eventId: data.eventId,
      tagName: data.tagName,
    });

    return repository.save(entity);
  }

  async update(
    id: string,
    updates: Partial<EventTagEntity>,
    options?: IQueryOptions,
  ): Promise<EventTagEntity> {
    const { entityManager } = this.parseOptions(options);
    if (!entityManager) {
      throw new InternalServerErrorException('Entity manager not available');
    }

    const repository = entityManager.getRepository(EventTagEntity);

    const tag = await repository.findOne({ where: { id } });
    if (!tag) {
      throw new NotFoundException(`Event Tag with ID ${id} not found`);
    }

    Object.assign(tag, updates);

    try {
      const savedTag = await repository.save(tag);
      return savedTag;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update event tag: ${error?.message || 'Unknown error'}`,
      );
    }
  }

  async delete(id: string, options?: IQueryOptions): Promise<void> {
    const { entityManager } = this.parseOptions(options);
    if (!entityManager) {
      throw new InternalServerErrorException('Entity manager not available');
    }

    const repository = entityManager.getRepository(EventTagEntity);

    const result = await repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Event Tag with ID ${id} not found`);
    }
  }

  async deleteByEventId(
    eventId: string,
    options?: IQueryOptions,
  ): Promise<void> {
    const { entityManager } = this.parseOptions(options);
    if (!entityManager) {
      throw new InternalServerErrorException('Entity manager not available');
    }

    const repository = entityManager.getRepository(EventTagEntity);

    await repository.delete({ eventId });
  }

  async deleteByEventIdAndTagName(
    eventId: string,
    tagName: string,
    options?: IQueryOptions,
  ): Promise<void> {
    const { entityManager } = this.parseOptions(options);
    if (!entityManager) {
      throw new InternalServerErrorException('Entity manager not available');
    }

    const repository = entityManager.getRepository(EventTagEntity);

    const result = await repository.delete({ eventId, tagName });
    if (result.affected === 0) {
      throw new NotFoundException(
        `Event Tag with event ID ${eventId} and tag name ${tagName} not found`,
      );
    }
  }
}
