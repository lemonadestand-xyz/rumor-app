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
import { EventCollaboratorsService } from '../services/event-collaborators.service';
import { CreateEventCollaboratorDto, UpdateEventCollaboratorDto } from 'src/event-collaborators/dto/event-collaborator.dto';

@ApiTags('Event Collaborators')
@Controller('event-collaborators')
export class EventCollaboratorsController {
  constructor(private readonly eventCollaboratorsService: EventCollaboratorsService) {}

}
