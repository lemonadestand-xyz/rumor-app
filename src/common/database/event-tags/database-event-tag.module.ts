import { Module } from '@nestjs/common';
import { DatabaseConnectionModule } from '../database.module';
import { EventTagRepository } from './repositories/event-tag.repository';

@Module({
  imports: [DatabaseConnectionModule],
  providers: [EventTagRepository],
  exports: [EventTagRepository],
})
export class DatabaseEventTagModule {}
