import { Module } from '@nestjs/common';
import { DatabaseEventTagModule } from '../common/database/event-tags/database-event-tag.module';
import { EventTagsService } from './services/event-tags.service';
import { EventTagsController } from './controllers/event-tags.controller';

@Module({
  imports: [DatabaseEventTagModule],
  providers: [EventTagsService],
  controllers: [EventTagsController],
  exports: [EventTagsService],
})
export class EventTagsModule {}