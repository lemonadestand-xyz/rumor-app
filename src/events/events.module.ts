import { Module } from '@nestjs/common';
import { EventsService } from './services/events.service';
import { DatabaseEventsModule } from '../common/database/events/database-events.module';
import { EventsController } from './controllers/events.controller';

@Module({
  imports: [
    DatabaseEventsModule,
  ],
  providers: [EventsService],
  controllers: [EventsController],
  exports: [EventsService],
})
export class EventsModule {}
