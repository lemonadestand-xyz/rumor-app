import { Body, Controller } from "@nestjs/common";
import { CreateResourceCombinedDecorators } from "../../common/decorators/routes-decorators.decorator";
import { UserIdToken } from "../../common/decorators/user-id-token.decorator";
import { DecodedIdToken } from "../../common/interfaces/decoded-id-token.interface";
import { CreateEventDto } from "../dto/request/event-create-request.dto";
import { EventCreateResponseDto } from "../dto/response/event-create-response.dto";
import { EventsService } from "../services/events.service";
import { EventCreateModel } from "../models/event-create.model";

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @CreateResourceCombinedDecorators({
        additionalErrors: ['badRequest', 'conflict'],
        responseType: EventCreateResponseDto,
    })
    public async createEvent(
        @UserIdToken() userIdToken: DecodedIdToken,
        @Body() dto: CreateEventDto,
    ): Promise<EventCreateResponseDto> {
        const eventModel = EventCreateModel.fromDto(dto);
        const event = await this.eventsService.createEvent(userIdToken.uid, eventModel);
        return EventCreateResponseDto.fromModel(event);
    }
}
