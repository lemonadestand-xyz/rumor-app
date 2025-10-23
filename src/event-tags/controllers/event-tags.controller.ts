import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EventTagsService } from '../services/event-tags.service';
import { CreateEventTagDto, BulkEventTagsCreateRequestDto } from '../dto/event-tag-create-request.dto';

@ApiTags('Event Tags')
@Controller('event-tags')
export class EventTagsController {
  constructor(private readonly eventTagsService: EventTagsService) {}

}
