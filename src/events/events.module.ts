import { Module } from '@nestjs/common';
import { DatabaseEventsModule } from '../common/database/events/database-events.module';
import { EventsController } from './controllers/events.controller';
import { EventsService } from './services/events.service';

@Module({
  imports: [
    DatabaseEventsModule
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
