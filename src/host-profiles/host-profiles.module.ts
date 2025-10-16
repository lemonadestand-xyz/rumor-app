import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HostProfilesController } from './host-profiles.controller';
import { HostProfilesService } from './host-profiles.service';
import { HostProfileRepository } from './infrastructure/persistence/relational/repositories/host-profile.repository';
import { HostProfileEntity } from './infrastructure/persistence/relational/entities/host-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HostProfileEntity])],
  controllers: [HostProfilesController],
  providers: [HostProfilesService, HostProfileRepository],
  exports: [HostProfilesService],
})
export class HostProfilesModule {}
