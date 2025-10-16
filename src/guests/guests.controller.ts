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
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { UpdateRsvpDto } from './dto/update-rsvp.dto';
import { QueryGuestDto } from './dto/query-guest.dto';
import { Guest } from './domain/guest';
import { AuthGuard } from '@nestjs/passport';
import { infinityPagination } from '../utils/infinity-pagination';

@ApiTags('Guests')
@Controller({
  path: 'guests',
  version: '1',
})
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create guest/RSVP for an event' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Guest created successfully',
    type: Guest,
  })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createGuestDto: CreateGuestDto,
    @Request() req,
  ): Promise<Guest> {
    return this.guestsService.create({
      ...createGuestDto,
      invitedBy: { id: req.user.id },
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all guests' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of guests',
  })
  async findAll(@Query() query: QueryGuestDto) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;

    return infinityPagination(
      await this.guestsService.findAll({
        page,
        limit,
      }),
      { page, limit },
    );
  }

  @Get('event/:eventId')
  @ApiOperation({ summary: 'Get all guests for an event' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of guests for the event',
  })
  async findByEvent(
    @Param('eventId') eventId: string,
    @Query() query: QueryGuestDto,
  ) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;

    return infinityPagination(
      await this.guestsService.findByEvent(eventId, {
        page,
        limit,
      }),
      { page, limit },
    );
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all events a user is guest at' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of events user is attending',
  })
  async findByUser(
    @Param('userId') userId: string,
    @Query() query: QueryGuestDto,
  ) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;

    return infinityPagination(
      await this.guestsService.findByUser(+userId, {
        page,
        limit,
      }),
      { page, limit },
    );
  }

  @Get('my-rsvps')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my RSVPs' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of my RSVPs',
  })
  async findMyRSVPs(@Request() req, @Query() query: QueryGuestDto) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;

    return infinityPagination(
      await this.guestsService.findByUser(req.user.id, {
        page,
        limit,
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get guest by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Guest details',
    type: Guest,
  })
  findOne(@Param('id') id: string): Promise<Guest> {
    return this.guestsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update guest' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Guest updated successfully',
    type: Guest,
  })
  update(
    @Param('id') id: string,
    @Body() updateGuestDto: UpdateGuestDto,
  ): Promise<Guest> {
    return this.guestsService.update(id, updateGuestDto);
  }

  @Patch(':id/rsvp')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update RSVP status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'RSVP updated successfully',
    type: Guest,
  })
  updateRSVP(
    @Param('id') id: string,
    @Body() updateRSVPDto: UpdateRsvpDto,
  ): Promise<Guest> {
    return this.guestsService.updateRSVP(id, updateRSVPDto.status);
  }

  @Post(':id/check-in')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check in guest at event' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Guest checked in successfully',
    type: Guest,
  })
  checkIn(@Param('id') id: string, @Request() req): Promise<Guest> {
    return this.guestsService.checkIn(id, req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove guest from event' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Guest removed successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.guestsService.remove(id);
  }
}
