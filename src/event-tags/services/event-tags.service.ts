import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { EventTagRepository } from '../../common/database/event-tags/repositories/event-tag.repository';
import { CreateEventTagDto, BulkEventTagsCreateRequestDto } from '../dto/event-tag-create-request.dto';

@Injectable()
export class EventTagsService {
  constructor(
    private readonly eventTagRepository: EventTagRepository,
  ) {}

}
