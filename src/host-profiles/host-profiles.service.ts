import { Injectable, NotFoundException } from '@nestjs/common';
import { HostProfileRepository } from './infrastructure/persistence/relational/repositories/host-profile.repository';
import { CreateHostProfileDto } from './dto/create-host-profile.dto';
import { UpdateHostProfileDto } from './dto/update-host-profile.dto';
import { HostProfile, HostTier } from './domain/host-profile';
import { IPaginationOptions } from '../utils/types/pagination-options';

@Injectable()
export class HostProfilesService {
  constructor(private readonly hostProfileRepository: HostProfileRepository) {}

  async create(
    createHostProfileDto: CreateHostProfileDto,
  ): Promise<HostProfile> {
    return this.hostProfileRepository.create(createHostProfileDto);
  }

  async findAll(paginationOptions: IPaginationOptions): Promise<HostProfile[]> {
    return this.hostProfileRepository.findManyWithPagination({
      paginationOptions,
    });
  }

  async findOne(id: string): Promise<HostProfile> {
    const profile = await this.hostProfileRepository.findOne({ id });
    if (!profile) {
      throw new NotFoundException(`Host profile with ID ${id} not found`);
    }
    return profile;
  }

  async findByUserId(userId: number): Promise<HostProfile | null> {
    return this.hostProfileRepository.findOne({ user: { id: userId } as any });
  }

  async update(
    id: string,
    updateHostProfileDto: UpdateHostProfileDto,
  ): Promise<HostProfile> {
    await this.findOne(id);
    const updated = await this.hostProfileRepository.update(
      id,
      updateHostProfileDto,
    );
    return updated!;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.hostProfileRepository.softDelete(id);
  }

  async updateTier(id: string, tier: HostTier): Promise<HostProfile> {
    await this.findOne(id);
    const updated = await this.hostProfileRepository.update(id, { tier });
    if (!updated) {
      throw new NotFoundException(`Failed to update host profile ${id}`);
    }
    return updated;
  }
}
