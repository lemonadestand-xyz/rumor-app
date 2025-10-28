import { Module } from '@nestjs/common';
import { DatabaseConnectionModule } from '../database.module';
import { EventSeriesRepository } from './repositories/event-series.repository';

@Module({
  imports: [DatabaseConnectionModule],
  providers: [EventSeriesRepository],
  exports: [EventSeriesRepository],
})
export class DatabaseEventSeriesModule {}
