import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { GuestEntity } from '../entities/guest.entity';
import { Guest } from '../../../../domain/guest';
import { GuestMapper } from '../mappers/guest.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class GuestRepository {
  constructor(
    @InjectRepository(GuestEntity)
    private readonly guestRepository: Repository<GuestEntity>,
  ) {}

  async create(data: Partial<Guest>): Promise<Guest> {
    const entity = this.guestRepository.create(GuestMapper.toEntity(data));
    const saved = await this.guestRepository.save(entity);
    return GuestMapper.toDomain(saved);
  }

  async findOne(fields: Partial<Guest>): Promise<Guest | null> {
    const entity = await this.guestRepository.findOne({
      where: fields as FindOptionsWhere<GuestEntity>,
    });
    return entity ? GuestMapper.toDomain(entity) : null;
  }

  async findManyWithPagination({
    filterOptions,
    paginationOptions,
  }: {
    filterOptions?: Partial<Guest>;
    paginationOptions: IPaginationOptions;
  }): Promise<Guest[]> {
    const entities = await this.guestRepository.find({
      where: filterOptions as FindOptionsWhere<GuestEntity>,
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      order: { createdAt: 'DESC' },
    });
    return entities.map(GuestMapper.toDomain);
  }

  async update(id: string, data: Partial<Guest>): Promise<Guest | null> {
    await this.guestRepository.update(id, GuestMapper.toEntity(data));
    const entity = await this.guestRepository.findOne({ where: { id } });
    return entity ? GuestMapper.toDomain(entity) : null;
  }

  async softDelete(id: string): Promise<void> {
    await this.guestRepository.softDelete(id);
  }
}
