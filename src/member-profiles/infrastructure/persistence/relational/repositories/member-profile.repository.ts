import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { MemberProfileEntity } from '../entities/member-profile.entity';
import { MemberProfile } from '../../../../domain/member-profile';
import { MemberProfileMapper } from '../mappers/member-profile.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class MemberProfileRepository {
  constructor(
    @InjectRepository(MemberProfileEntity)
    private readonly memberProfileRepository: Repository<MemberProfileEntity>,
  ) {}

  async create(data: Partial<MemberProfile>): Promise<MemberProfile> {
    const entity = this.memberProfileRepository.create(
      MemberProfileMapper.toEntity(data),
    );
    const saved = await this.memberProfileRepository.save(entity);
    return MemberProfileMapper.toDomain(saved);
  }

  async findOne(fields: Partial<MemberProfile>): Promise<MemberProfile | null> {
    const entity = await this.memberProfileRepository.findOne({
      where: fields as FindOptionsWhere<MemberProfileEntity>,
    });
    return entity ? MemberProfileMapper.toDomain(entity) : null;
  }

  async findManyWithPagination({
    filterOptions,
    paginationOptions,
  }: {
    filterOptions?: Partial<MemberProfile>;
    paginationOptions: IPaginationOptions;
  }): Promise<MemberProfile[]> {
    const entities = await this.memberProfileRepository.find({
      where: filterOptions as FindOptionsWhere<MemberProfileEntity>,
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      order: { createdAt: 'DESC' },
    });
    return entities.map(MemberProfileMapper.toDomain);
  }

  async update(
    id: string,
    data: Partial<MemberProfile>,
  ): Promise<MemberProfile | null> {
    await this.memberProfileRepository.update(
      id,
      MemberProfileMapper.toEntity(data),
    );
    const entity = await this.memberProfileRepository.findOne({
      where: { id },
    });
    return entity ? MemberProfileMapper.toDomain(entity) : null;
  }

  async softDelete(id: string): Promise<void> {
    await this.memberProfileRepository.delete(id);
  }
}
