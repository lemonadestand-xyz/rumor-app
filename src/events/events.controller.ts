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
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { QueryEventDto } from './dto/query-event.dto';
import { Event } from './domain/event';
import { AuthGuard } from '@nestjs/passport';
import { infinityPagination } from '../utils/infinity-pagination';

@ApiTags('Events')
@Controller({
  path: 'events',
  version: '1',
})
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Event created successfully',
    type: Event,
  })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createEventDto: CreateEventDto,
    @Request() req,
  ): Promise<Event> {
    // Set the host to the authenticated user
    const eventData = {
      ...createEventDto,
      host: { id: req.user.id },
    };
    return this.eventsService.create(eventData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events with pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of events',
  })
  async findAll(@Query() query: QueryEventDto) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;

    return infinityPagination(
      await this.eventsService.findAll({
        page,
        limit,
      }),
      { page, limit },
    );
  }

  @Get('host/:hostId')
  @ApiOperation({ summary: 'Get all events by host' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of events by host',
  })
  async findByHost(
    @Param('hostId') hostId: string,
    @Query() query: QueryEventDto,
  ) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;

    return infinityPagination(
      await this.eventsService.findByHost(+hostId, {
        page,
        limit,
      }),
      { page, limit },
    );
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get event by slug' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Event details',
    type: Event,
  })
  findBySlug(@Param('slug') slug: string): Promise<Event> {
    return this.eventsService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Event details',
    type: Event,
  })
  findOne(@Param('id') id: string): Promise<Event> {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update event' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Event updated successfully',
    type: Event,
  })
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete event' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Event deleted successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.eventsService.remove(id);
  }
}
