import { Module } from '@nestjs/common';
import { DatabaseEventCollaboratorModule } from '../common/database/event-collaborators/database-event-collaborator.module';
import { EventCollaboratorsService } from './services/event-collaborators.service';
import { EventCollaboratorsController } from './controllers/event-collaborators.controller';

@Module({
  imports: [DatabaseEventCollaboratorModule],
  providers: [EventCollaboratorsService],
  controllers: [EventCollaboratorsController],
  exports: [EventCollaboratorsService],
})
export class EventCollaboratorsModule {}