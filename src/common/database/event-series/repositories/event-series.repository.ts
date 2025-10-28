import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BaseRepository, IQueryOptions } from '../../base.repository';
import { DATABASE_CONNECTION } from '../../database.consts';
import { DataSource } from 'typeorm';
import { EventSeriesEntity } from '../entities/event-series.entity';

@Injectable()
export class EventSeriesRepository extends BaseRepository {
  constructor(@Inject(DATABASE_CONNECTION) dataSource: DataSource) {
    super(dataSource);
  }

  async findById(
    id: string,
    options?: IQueryOptions,
  ): Promise<EventSeriesEntity | null> {
    const { entityManager } = this.parseOptions(options);
    const repository = entityManager?.getRepository<EventSeriesEntity>(
      EventSeriesEntity,
    );

    if (!id) {
      throw new InternalServerErrorException('Event Series ID is required');
    }

    const series = await repository?.findOne({
      where: { id },
      relations: ['creator', 'updater'],
    });

    return series ?? null;
  }

  async findByCreatedBy(
    createdBy: string,
    options?: IQueryOptions,
  ): Promise<EventSeriesEntity[]> {
    const { entityManager } = this.parseOptions(options);
    const repository = entityManager?.getRepository<EventSeriesEntity>(
      EventSeriesEntity,
    );

    if (!createdBy) {
      throw new InternalServerErrorException('Created by user ID is required');
    }

    const series = await repository?.find({
      where: { createdBy },
      relations: ['creator', 'updater'],
    });

    return series ?? [];
  }

  async findBySeriesName(
    seriesName: string,
    options?: IQueryOptions,
  ): Promise<EventSeriesEntity[]> {
    const { entityManager } = this.parseOptions(options);
    const repository = entityManager?.getRepository<EventSeriesEntity>(
      EventSeriesEntity,
    );

    if (!seriesName) {
      throw new InternalServerErrorException('Series name is required');
    }

    const series = await repository?.find({
      where: { seriesName },
      relations: ['creator', 'updater'],
    });

    return series ?? [];
  }

  async findAll(options?: IQueryOptions): Promise<EventSeriesEntity[]> {
    const { entityManager } = this.parseOptions(options);
    const repository = entityManager?.getRepository<EventSeriesEntity>(
      EventSeriesEntity,
    );

    const series = await repository?.find({
      relations: ['creator', 'updater'],
    });

    return series ?? [];
  }

  async create(
    data: Partial<EventSeriesEntity>,
    options?: IQueryOptions,
  ): Promise<EventSeriesEntity> {
    const { entityManager } = this.parseOptions(options);
    if (!entityManager) {
      throw new InternalServerErrorException('Entity manager not available');
    }

    const repository = entityManager.getRepository(EventSeriesEntity);

    const entity = repository.create({
      seriesName: data.seriesName,
      seriesDescription: data.seriesDescription,
      eventSeriesPage: data.eventSeriesPage,
      artworkUrl: data.artworkUrl,
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
    });

    return repository.save(entity);
  }

  async update(
    id: string,
    updates: Partial<EventSeriesEntity>,
    options?: IQueryOptions,
  ): Promise<EventSeriesEntity> {
    const { entityManager } = this.parseOptions(options);
    if (!entityManager) {
      throw new InternalServerErrorException('Entity manager not available');
    }

    const repository = entityManager.getRepository(EventSeriesEntity);

    const series = await repository.findOne({ where: { id } });
    if (!series) {
      throw new NotFoundException(`Event Series with ID ${id} not found`);
    }

    Object.assign(series, updates);

    try {
      const savedSeries = await repository.save(series);
      return savedSeries;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update event series: ${error?.message || 'Unknown error'}`,
      );
    }
  }

  async softDelete(id: string, options?: IQueryOptions): Promise<void> {
    const { entityManager } = this.parseOptions(options);
    if (!entityManager) {
      throw new InternalServerErrorException('Entity manager not available');
    }

    const repository = entityManager.getRepository(EventSeriesEntity);

    const series = await repository.findOne({ where: { id } });
    if (!series) {
      throw new NotFoundException(`Event Series with ID ${id} not found`);
    }

    series.deletedAt = new Date();
    await repository.save(series);
  }

  async hardDelete(id: string, options?: IQueryOptions): Promise<void> {
    const { entityManager } = this.parseOptions(options);
    if (!entityManager) {
      throw new InternalServerErrorException('Entity manager not available');
    }

    const repository = entityManager.getRepository(EventSeriesEntity);

    const result = await repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Event Series with ID ${id} not found`);
    }
  }

  async restore(id: string, options?: IQueryOptions): Promise<EventSeriesEntity> {
    const { entityManager } = this.parseOptions(options);
    if (!entityManager) {
      throw new InternalServerErrorException('Entity manager not available');
    }

    const repository = entityManager.getRepository(EventSeriesEntity);

    const series = await repository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!series) {
      throw new NotFoundException(`Event Series with ID ${id} not found`);
    }

    if (!series.deletedAt) {
      throw new InternalServerErrorException('Event Series is not deleted');
    }

    series.deletedAt = undefined;
    return repository.save(series);
  }
}
