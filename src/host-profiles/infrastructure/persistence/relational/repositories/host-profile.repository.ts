import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { HostProfileEntity } from '../entities/host-profile.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { HostProfile } from '../../../../domain/host-profile';
import { HostProfileMapper } from '../mappers/host-profile.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class HostProfileRepository {
  constructor(
    @InjectRepository(HostProfileEntity)
    private readonly hostProfileRepository: Repository<HostProfileEntity>,
  ) {}

  async create(data: Partial<HostProfile>): Promise<HostProfile> {
    const persistenceModel = HostProfileMapper.toPersistence(
      data as HostProfile,
    );
    const newEntity = await this.hostProfileRepository.save(
      this.hostProfileRepository.create(persistenceModel),
    );
    return HostProfileMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    paginationOptions,
  }: {
    filterOptions?:
      | FindOptionsWhere<HostProfileEntity>
      | FindOptionsWhere<HostProfileEntity>[];
    paginationOptions: IPaginationOptions;
  }): Promise<HostProfile[]> {
    const entities = await this.hostProfileRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: filterOptions,
      relations: ['user'],
    });

    return entities.map((entity) => HostProfileMapper.toDomain(entity));
  }

  async findOne(
    fields: FindOptionsWhere<HostProfileEntity>,
  ): Promise<NullableType<HostProfile>> {
    const entity = await this.hostProfileRepository.findOne({
      where: fields,
      relations: ['user'],
    });

    return entity ? HostProfileMapper.toDomain(entity) : null;
  }

  async update(
    id: HostProfile['id'],
    payload: Partial<HostProfile>,
  ): Promise<HostProfile | null> {
    const entity = await this.hostProfileRepository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    const updatedEntity = await this.hostProfileRepository.save(
      this.hostProfileRepository.create(
        HostProfileMapper.toPersistence({
          ...HostProfileMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return HostProfileMapper.toDomain(updatedEntity);
  }

  async softDelete(id: HostProfile['id']): Promise<void> {
    await this.hostProfileRepository.softDelete(id);
  }
}
