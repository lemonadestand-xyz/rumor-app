import { Module } from '@nestjs/common';
import { DatabaseConnectionModule } from '../database.module';
import { EventCollaboratorRepository } from './repositories/event-collaborator.repository';

@Module({
  imports: [DatabaseConnectionModule],
  providers: [EventCollaboratorRepository],
  exports: [EventCollaboratorRepository],
})
export class DatabaseEventCollaboratorModule {}
