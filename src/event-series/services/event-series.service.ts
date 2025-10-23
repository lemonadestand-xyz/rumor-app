import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { EventSeriesRepository } from '../../common/database/event-series/repositories/event-series.repository';

@Injectable()
export class EventSeriesService {
  constructor(
    private readonly eventSeriesRepository: EventSeriesRepository,
  ) {}
}
