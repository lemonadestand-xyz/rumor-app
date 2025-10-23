import { Module } from '@nestjs/common';
import { DatabaseEventSeriesModule } from '../common/database/event-series/database-event-series.module';
import { EventSeriesService } from './services/event-series.service';
import { EventSeriesController } from './controllers/event-series.controller';

@Module({
  imports: [DatabaseEventSeriesModule],
  providers: [EventSeriesService],
  controllers: [EventSeriesController],
  exports: [EventSeriesService],
})
export class EventSeriesModule {}