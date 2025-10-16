import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberProfilesController } from './member-profiles.controller';
import { MemberProfilesService } from './member-profiles.service';
import { MemberProfileEntity } from './infrastructure/persistence/relational/entities/member-profile.entity';
import { MemberProfileRepository } from './infrastructure/persistence/relational/repositories/member-profile.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([MemberProfileEntity]), UsersModule],
  controllers: [MemberProfilesController],
  providers: [MemberProfilesService, MemberProfileRepository],
  exports: [MemberProfilesService, MemberProfileRepository],
})
export class MemberProfilesModule {}
