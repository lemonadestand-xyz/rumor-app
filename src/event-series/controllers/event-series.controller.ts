import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EventSeriesService } from '../services/event-series.service';

@ApiTags('Event Series')
@Controller('event-series')
export class EventSeriesController {
  constructor(private readonly eventSeriesService: EventSeriesService) {}

}
