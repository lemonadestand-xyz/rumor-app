import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventInvitesService } from './event-invites.service';
import { EventInvitesController } from './event-invites.controller';
import { EventInviteEntity } from './infrastructure/persistence/relational/entities/event-invite.entity';
import { EventInviteRepository } from './infrastructure/persistence/relational/repositories/event-invite.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EventInviteEntity])],
  controllers: [EventInvitesController],
  providers: [EventInvitesService, EventInviteRepository],
  exports: [EventInvitesService, EventInviteRepository],
})
export class EventInvitesModule {}
