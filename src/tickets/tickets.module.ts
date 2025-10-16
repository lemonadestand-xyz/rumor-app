import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TicketEntity } from './infrastructure/persistence/relational/entities/ticket.entity';
import { TicketRepository } from './infrastructure/persistence/relational/repositories/ticket.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TicketEntity])],
  controllers: [TicketsController],
  providers: [TicketsService, TicketRepository],
  exports: [TicketsService, TicketRepository],
})
export class TicketsModule {}
