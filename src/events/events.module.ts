import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventEntity } from './infrastructure/persistence/relational/entities/event.entity';
import { EventRepository } from './infrastructure/persistence/relational/repositories/event.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity])],
  controllers: [EventsController],
  providers: [EventsService, EventRepository],
  exports: [EventsService, EventRepository],
})
export class EventsModule {}
