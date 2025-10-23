import { EventCreateRequestDto } from '../dto/request/event-create-request.dto';
import { EVENT_LOCATION_TYPE, EVENT_STATUS, EVENT_VISIBILITY } from '../enums/events.enum';

export class EventCreateModel {
    static fromDto(data: EventCreateRequestDto): EventCreateModel {
        const model = new EventCreateModel();

        // Basic Information
        model.eventName = data.eventName;
        model.eventType = data.eventType;
        model.eventFlow = data.eventFlow;

        // Date & Time
        model.startDate = new Date(data.startDate);
        model.startTime = data.startTime;
        model.endDate = new Date(data.endDate);
        model.endTime = data.endTime;
        model.timezone = data.timezone ?? 'UTC';
        model.rsvpByDate = data.rsvpByDate ? new Date(data.rsvpByDate) : undefined;

        // Location Details
        model.locationType = data.locationType as EVENT_LOCATION_TYPE;
        model.venueName = data.venueName;
        model.addressLine1 = data.addressLine1;
        model.addressLine2 = data.addressLine2;
        model.city = data.city;
        model.state = data.state;
        model.country = data.country;
        model.postalCode = data.postalCode;
        model.latitude = data.latitude;
        model.longitude = data.longitude;

        // Event Description
        model.eventDescription = data.eventDescription;
        model.shortDescription = data.shortDescription;

        // Visibility
        model.visibility = data.visibility ?? EVENT_VISIBILITY.PUBLIC;
        model.invitationOnlyApproval = data.invitationOnlyApproval ?? false;
        model.allowAnyoneOutsideEventFlow = data.allowAnyoneOutsideEventFlow ?? false;

        // Event Settings - Event Series Fields
        model.eventStrategy = data.eventStrategy;
        model.minCapacity = data.minCapacity;
        model.maxCapacity = data.maxCapacity;

        // Event Flow Settings
        model.isEventPartOfEventFlow = data.isEventPartOfEventFlow ?? false;
        model.selectEventFlowId = data.selectEventFlowId;
        model.selectEventBlocks = data.selectEventBlocks;
        model.showTicketTypesInGuests = data.showTicketTypesInGuests ?? false;
        model.enableQrCode = data.enableQrCode ?? false;
        model.eventSeriesArtworkUrl = data.eventSeriesArtworkUrl;
        model.sendInvitesOption = data.sendInvitesOption;
        model.sendNow = data.sendNow ?? false;

        // Recurring Event Settings
        model.isRecurring = data.isRecurring ?? false;
        model.recurrencePattern = data.recurrencePattern;
        model.recurrenceEndDate = data.recurrenceEndDate ? new Date(data.recurrenceEndDate) : undefined;
        model.parentEventId = data.parentEventId;

        // Media
        model.featuredImageId = data.featuredImageId;
        model.bannerImageId = data.bannerImageId;

        // Status
        model.status = data.status ?? EVENT_STATUS.DRAFT;

        return model;
    }

    // Basic Information
    eventName: string;
    eventType?: string;
    eventFlow?: string;

    // Date & Time
    startDate: Date;
    startTime: string;
    endDate: Date;
    endTime: string;
    timezone: string;
    rsvpByDate?: Date;

    // Location Details
    locationType: EVENT_LOCATION_TYPE;
    venueName?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
    showFullAddressToConfirmedGuestsOnly: boolean;

    // Event Description
    eventDescription?: string;
    shortDescription?: string;

    // Visibility
    visibility: EVENT_VISIBILITY;
    invitationOnlyApproval: boolean;
    allowAnyoneOutsideEventFlow: boolean;

    // Event Settings - Event Series Fields
    eventStrategy?: string;
    minCapacity?: number;
    maxCapacity?: number;

    // Event Flow Settings
    isEventPartOfEventFlow: boolean;
    selectEventFlowId?: string;
    selectEventBlocks?: string;
    showTicketTypesInGuests: boolean;
    enableQrCode: boolean;
    eventSeriesArtworkUrl?: string;
    sendInvitesOption?: string;
    sendNow: boolean;

    // Recurring Event Settings
    isRecurring: boolean;
    recurrencePattern?: string;
    recurrenceEndDate?: Date;
    parentEventId?: string;

    // Media
    featuredImageId?: string;
    bannerImageId?: string;

    // Status
    status: EVENT_STATUS;

    // Audit Fields
    createdBy?: string;

    // System fields (populated after creation)
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
