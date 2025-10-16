import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestsController } from './guests.controller';
import { GuestsService } from './guests.service';
import { GuestEntity } from './infrastructure/persistence/relational/entities/guest.entity';
import { GuestRepository } from './infrastructure/persistence/relational/repositories/guest.repository';
import { EventsModule } from '../events/events.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([GuestEntity]), EventsModule, UsersModule],
  controllers: [GuestsController],
  providers: [GuestsService, GuestRepository],
  exports: [GuestsService, GuestRepository],
})
export class GuestsModule {}
