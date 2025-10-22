import { Inject, Injectable, InternalServerErrorException, ConflictException } from "@nestjs/common";
import { BaseRepository, IQueryOptions } from "../../base.repository";
import { DATABASE_CONNECTION } from "../../database.consts";
import { DataSource } from "typeorm";
import { EventsEntity } from "../entities/events.entity";
import { EventCreateModel } from "../../../../events/models/event-create.model";

@Injectable()
export class EventsRepository extends BaseRepository {
  constructor(
    @Inject(DATABASE_CONNECTION) dataSource: DataSource,
    // private readonly uploadStorageService: UploadStorageService,
  ) {
    super(dataSource);
  }

  async create(
    eventModel: EventCreateModel,
    userId: string,
    options?: IQueryOptions,
  ): Promise<{id: string, message: string}> {
    const { entityManager } = this.parseOptions(options);
    if (!entityManager) {
      throw new InternalServerErrorException('Entity manager not available');
    }
    const repository = entityManager.getRepository(EventsEntity);

    const existingEvent = await repository.findOne({
      where: { 
        eventName: eventModel.eventName,
        createdBy: userId,
        startDate: eventModel.startDate,
      },
    });
    
    if (existingEvent) {
      throw new ConflictException('Event with this name already exists for the same date');
    }

    const entity = new EventsEntity();
    entity.eventName = eventModel.eventName;
    entity.eventType = eventModel.eventType;
    entity.eventFlow = eventModel.eventFlow;
    entity.startDate = eventModel.startDate;
    entity.startTime = eventModel.startTime;
    entity.endDate = eventModel.endDate;
    entity.endTime = eventModel.endTime;
    entity.timezone = eventModel.timezone;
    entity.rsvpByDate = eventModel.rsvpByDate;
    entity.locationType = eventModel.locationType;
    entity.venueName = eventModel.venueName;
    entity.addressLine1 = eventModel.addressLine1;
    entity.addressLine2 = eventModel.addressLine2;
    entity.city = eventModel.city;
    entity.state = eventModel.state;
    entity.country = eventModel.country;
    entity.postalCode = eventModel.postalCode;
    entity.latitude = eventModel.latitude;
    entity.longitude = eventModel.longitude;
    entity.showFullAddressToConfirmedGuestsOnly = eventModel.showFullAddressToConfirmedGuestsOnly;
    entity.eventDescription = eventModel.eventDescription;
    entity.shortDescription = eventModel.shortDescription;
    entity.visibility = eventModel.visibility;
    entity.invitationOnlyApproval = eventModel.invitationOnlyApproval;
    entity.allowAnyoneOutsideEventFlow = eventModel.allowAnyoneOutsideEventFlow;
    entity.eventStrategy = eventModel.eventStrategy;
    entity.minCapacity = eventModel.minCapacity;
    entity.maxCapacity = eventModel.maxCapacity;
    entity.isEventPartOfEventFlow = eventModel.isEventPartOfEventFlow;
    entity.selectEventFlowId = eventModel.selectEventFlowId;
    entity.selectEventBlocks = eventModel.selectEventBlocks;
    entity.showTicketTypesInGuests = eventModel.showTicketTypesInGuests;
    entity.enableQrCode = eventModel.enableQrCode;
    entity.eventSeriesArtworkUrl = eventModel.eventSeriesArtworkUrl;
    entity.sendInvitesOption = eventModel.sendInvitesOption;
    entity.sendNow = eventModel.sendNow;
    entity.isRecurring = eventModel.isRecurring;
    entity.recurrencePattern = eventModel.recurrencePattern;
    entity.recurrenceEndDate = eventModel.recurrenceEndDate;
    entity.parentEventId = eventModel.parentEventId;
    entity.featuredImageId = eventModel.featuredImageId;
    entity.bannerImageId = eventModel.bannerImageId;
    entity.status = eventModel.status;
    entity.createdBy = userId;
    const result = await repository.save(entity);
    return {
      id: result.id,
      message: 'Event created successfully',
    };
  }
}