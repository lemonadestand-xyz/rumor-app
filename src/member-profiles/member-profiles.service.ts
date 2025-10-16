import { Injectable, NotFoundException } from '@nestjs/common';
import { MemberProfileRepository } from './infrastructure/persistence/relational/repositories/member-profile.repository';
import { CreateMemberProfileDto } from './dto/create-member-profile.dto';
import { UpdateMemberProfileDto } from './dto/update-member-profile.dto';
import { MemberProfile } from './domain/member-profile';
import { IPaginationOptions } from '../utils/types/pagination-options';

@Injectable()
export class MemberProfilesService {
  constructor(
    private readonly memberProfileRepository: MemberProfileRepository,
  ) {}

  async create(
    createMemberProfileDto: CreateMemberProfileDto,
  ): Promise<MemberProfile> {
    return this.memberProfileRepository.create(createMemberProfileDto);
  }

  async findAll(
    paginationOptions: IPaginationOptions,
  ): Promise<MemberProfile[]> {
    return this.memberProfileRepository.findManyWithPagination({
      paginationOptions,
    });
  }

  async findOne(id: string): Promise<MemberProfile> {
    const profile = await this.memberProfileRepository.findOne({ id });
    if (!profile) {
      throw new NotFoundException(`Member profile with ID ${id} not found`);
    }
    return profile;
  }

  async findByUserId(userId: number): Promise<MemberProfile | null> {
    return this.memberProfileRepository.findOne({
      user: { id: userId } as any,
    });
  }

  async update(
    id: string,
    updateMemberProfileDto: UpdateMemberProfileDto,
  ): Promise<MemberProfile> {
    await this.findOne(id);
    const updated = await this.memberProfileRepository.update(
      id,
      updateMemberProfileDto,
    );
    return updated!;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.memberProfileRepository.softDelete(id);
  }

  async updateWaitlistPosition(
    id: string,
    position: number,
  ): Promise<MemberProfile> {
    await this.findOne(id);
    const updated = await this.memberProfileRepository.update(id, {
      waitlistPosition: position,
    });
    if (!updated) {
      throw new NotFoundException(`Failed to update member profile ${id}`);
    }
    return updated;
  }

  async approveMember(id: string, approvedBy: number): Promise<MemberProfile> {
    await this.findOne(id);
    const updated = await this.memberProfileRepository.update(id, {
      approvalDate: new Date(),
      waitlistPosition: null,
    });
    if (!updated) {
      throw new NotFoundException(`Failed to approve member profile ${id}`);
    }
    return updated;
  }
}
