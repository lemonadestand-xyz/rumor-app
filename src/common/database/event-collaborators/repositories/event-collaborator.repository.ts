import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BaseRepository, IQueryOptions } from '../../base.repository';
import { DATABASE_CONNECTION } from '../../database.consts';
import { DataSource } from 'typeorm';
import { EventCollaboratorEntity } from '../entities/event-collaborator.entity';

@Injectable()
export class EventCollaboratorRepository extends BaseRepository {
  constructor(@Inject(DATABASE_CONNECTION) dataSource: DataSource) {
    super(dataSource);
  }

  async findById(
    id: string,
    options?: IQueryOptions,
  ): Promise<EventCollaboratorEntity | null> {
    const { entityManager } = this.parseOptions(options);
    const repository = entityManager?.getRepository<EventCollaboratorEntity>(
      EventCollaboratorEntity,
    );

    if (!id) {
      throw new InternalServerErrorException('Event Collaborator ID is required');
    }

    const collaborator = await repository?.findOne({
      where: { id },
      relations: ['user'],
    });

    return collaborator ?? null;
  }

  async findByEventId(
    eventId: string,
    options?: IQueryOptions,
  ): Promise<EventCollaboratorEntity[]> {
    const { entityManager } = this.parseOptions(options);
    const repository = entityManager?.getRepository<EventCollaboratorEntity>(
      EventCollaboratorEntity,
    );

    if (!eventId) {
      throw new InternalServerErrorException('Event ID is required');
    }

    const collaborators = await repository?.find({
      where: { eventId },
      relations: ['user'],
    });

    return collaborators ?? [];
  }

  async findByUserId(
    userId: string,
    options?: IQueryOptions,
  ): Promise<EventCollaboratorEntity[]> {
    const { entityManager } = this.parseOptions(options);
    const repository = entityManager?.getRepository<EventCollaboratorEntity>(
      EventCollaboratorEntity,
    );

    if (!userId) {
      throw new InternalServerErrorException('User ID is required');
    }

    const collaborators = await repository?.find({
      where: { userId },
      relations: ['user'],
    });

    return collaborators ?? [];
  }

  async create(
    data: Partial<EventCollaboratorEntity>,
    options?: IQueryOptions,
  ): Promise<EventCollaboratorEntity> {
    const { entityManager } = this.parseOptions(options);
    if (!entityManager) {
      throw new InternalServerErrorException('Entity manager not available');
    }

    const repository = entityManager.getRepository(EventCollaboratorEntity);

    const entity = repository.create({
      eventId: data.eventId,
      userId: data.userId,
      email: data.email,
      name: data.name,
      role: data.role,
    });

    return repository.save(entity);
  }

  async update(
    id: string,
    updates: Partial<EventCollaboratorEntity>,
    options?: IQueryOptions,
  ): Promise<EventCollaboratorEntity> {
    const { entityManager } = this.parseOptions(options);
    if (!entityManager) {
      throw new InternalServerErrorException('Entity manager not available');
    }

    const repository = entityManager.getRepository(EventCollaboratorEntity);

    const collaborator = await repository.findOne({ where: { id } });
    if (!collaborator) {
      throw new NotFoundException(`Event Collaborator with ID ${id} not found`);
    }

    Object.assign(collaborator, updates);

    try {
      const savedCollaborator = await repository.save(collaborator);
      return savedCollaborator;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update event collaborator: ${error?.message || 'Unknown error'}`,
      );
    }
  }

  async delete(id: string, options?: IQueryOptions): Promise<void> {
    const { entityManager } = this.parseOptions(options);
    if (!entityManager) {
      throw new InternalServerErrorException('Entity manager not available');
    }

    const repository = entityManager.getRepository(EventCollaboratorEntity);

    const result = await repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Event Collaborator with ID ${id} not found`);
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

    const repository = entityManager.getRepository(EventCollaboratorEntity);

    await repository.delete({ eventId });
  }
}
