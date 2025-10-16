import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TransferTicketDto } from './dto/transfer-ticket.dto';
import { ScanTicketDto } from './dto/scan-ticket.dto';
import { QueryTicketDto } from './dto/query-ticket.dto';
import { Ticket } from './domain/ticket';
import { AuthGuard } from '@nestjs/passport';
import { infinityPagination } from '../utils/infinity-pagination';

@ApiTags('Tickets')
@Controller({
  path: 'tickets',
  version: '1',
})
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create ticket' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Ticket created successfully',
    type: Ticket,
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTicketDto: CreateTicketDto): Promise<Ticket> {
    return this.ticketsService.create(createTicketDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tickets' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of tickets',
  })
  async findAll(@Query() query: QueryTicketDto) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;

    return infinityPagination(
      await this.ticketsService.findAll({
        filterOptions: query?.filters,
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get('event/:eventId')
  @ApiOperation({ summary: 'Get tickets by event ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of tickets for the event',
    type: [Ticket],
  })
  findByEventId(@Param('eventId') eventId: string): Promise<Ticket[]> {
    return this.ticketsService.findByEventId(eventId);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get tickets by user ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of tickets for the user',
    type: [Ticket],
  })
  findByUserId(@Param('userId') userId: string): Promise<Ticket[]> {
    return this.ticketsService.findByUserId(+userId);
  }

  @Get('my-tickets')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user tickets' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of current user tickets',
    type: [Ticket],
  })
  findMyTickets(@Request() req): Promise<Ticket[]> {
    return this.ticketsService.findByUserId(req.user.id);
  }

  @Get('number/:ticketNumber')
  @ApiOperation({ summary: 'Get ticket by ticket number' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ticket details',
    type: Ticket,
  })
  findByTicketNumber(
    @Param('ticketNumber') ticketNumber: string,
  ): Promise<Ticket> {
    return this.ticketsService.findByTicketNumber(ticketNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ticket details',
    type: Ticket,
  })
  findOne(@Param('id') id: string): Promise<Ticket> {
    return this.ticketsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update ticket' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ticket updated successfully',
    type: Ticket,
  })
  update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ): Promise<Ticket> {
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Post(':id/transfer')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Transfer ticket to another user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ticket transferred successfully',
    type: Ticket,
  })
  transferTicket(
    @Param('id') id: string,
    @Body() transferTicketDto: TransferTicketDto,
    @Request() req,
  ): Promise<Ticket> {
    return this.ticketsService.transferTicket(
      id,
      transferTicketDto,
      req.user.id,
    );
  }

  @Post('scan')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Scan ticket for entry' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ticket scanned successfully',
    type: Ticket,
  })
  scanTicket(
    @Body() scanTicketDto: ScanTicketDto,
    @Request() req,
  ): Promise<Ticket> {
    return this.ticketsService.scanTicket(scanTicketDto, req.user.id);
  }

  @Post(':id/refund')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refund ticket' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ticket refunded successfully',
    type: Ticket,
  })
  refundTicket(
    @Param('id') id: string,
    @Body('refundReason') refundReason: string,
    @Body('refundAmount') refundAmount?: number,
  ): Promise<Ticket> {
    return this.ticketsService.refundTicket(id, refundReason, refundAmount);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete ticket' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Ticket deleted successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.ticketsService.remove(id);
  }
}
