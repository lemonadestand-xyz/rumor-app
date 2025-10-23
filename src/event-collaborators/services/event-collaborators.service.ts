import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { EventCollaboratorRepository } from '../../common/database/event-collaborators/repositories/event-collaborator.repository';

@Injectable()
export class EventCollaboratorsService {
  constructor(
    private readonly eventCollaboratorRepository: EventCollaboratorRepository,
  ) {}

}
