import { Injectable, InternalServerErrorException, ConflictException } from "@nestjs/common";
import { EventsRepository } from "../../common/database/events/repositories/events.repository";
import { EventCreateModel } from "../models/event-create.model";
import { Logger } from "nestjs-pino";

@Injectable()
export class EventsService {
    constructor(
        private readonly eventsRepository: EventsRepository,
        private readonly logger: Logger,
    ) { }

    async createEvent(
        userId: string,
        eventModel: EventCreateModel,
    ): Promise<{id: string, message: string}> {
        try {
            const createdEvent = await this.eventsRepository.create(eventModel, userId);
            return createdEvent;
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException('Event creation failed', {
                cause: new Error(`Error creating event: ${error?.message}`),
            });
        }
    }
}
