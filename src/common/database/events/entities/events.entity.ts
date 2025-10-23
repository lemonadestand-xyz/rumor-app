import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
  } from 'typeorm';
import { EVENT_LOCATION_TYPE, EVENT_STATUS, EVENT_VISIBILITY, EventLocationType, EventStatus, EventVisibility } from '../../../../events/enums/events.enum';
 
  
  @Entity('events')
  export class EventsEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;
  
    // Basic Information
    @Column({ name: 'event_name' })
    eventName: string;
  
    @Column({ name: 'event_type', nullable: true })
    eventType?: string;
  
    @Column({ name: 'event_flow', nullable: true })
    eventFlow?: string;
  
    // Date & Time
    @Column({ name: 'start_date', type: 'date' })
    startDate: Date;
  
    @Column({ name: 'start_time', type: 'time' })
    startTime: string;
  
    @Column({ name: 'end_date', type: 'date' })
    endDate: Date;
  
    @Column({ name: 'end_time', type: 'time' })
    endTime: string;
  
    @Column({ name: 'timezone', default: 'UTC' })
    timezone: string;

    @Column({ name: 'rsvp_by_date', type: 'date', nullable: true })
    rsvpByDate?: Date;
  
    // Location Details
    @Column({
      name: 'location_type',
      type: 'enum',
      enum: EVENT_LOCATION_TYPE,
    })
    locationType: EventLocationType;
  
    @Column({ name: 'venue_name', nullable: true })
    venueName?: string;
  
    @Column({ name: 'address_line1', nullable: true })
    addressLine1?: string;
  
    @Column({ name: 'address_line2', nullable: true })
    addressLine2?: string;
  
    @Column({ name: 'city', nullable: true })
    city?: string;
  
    @Column({ name: 'state', nullable: true })
    state?: string;
  
    @Column({ name: 'country', nullable: true })
    country?: string;
  
    @Column({ name: 'postal_code', nullable: true })
    postalCode?: string;
  
    @Column({ name: 'latitude', type: 'decimal', precision: 10, scale: 8, nullable: true })
    latitude?: number;
  
    @Column({ name: 'longitude', type: 'decimal', precision: 11, scale: 8, nullable: true })
    longitude?: number;

    @Column({ name: 'show_full_address_to_confirmed_guests_only', default: false })
    showFullAddressToConfirmedGuestsOnly: boolean;
  
    // Event Description
    @Column({ name: 'event_description', type: 'text', nullable: true })
    eventDescription?: string;
  
    @Column({ name: 'short_description', nullable: true })
    shortDescription?: string;
  
    // Visibility
    @Column({
      name: 'visibility',
      type: 'enum',
      enum: EVENT_VISIBILITY,
      default: EVENT_VISIBILITY.PUBLIC,
    })
    visibility: EventVisibility;

    @Column({ name: 'invitation_only_approval', default: false })
    invitationOnlyApproval: boolean;

    @Column({ name: 'allow_anyone_outside_event_flow', default: false })
    allowAnyoneOutsideEventFlow: boolean;
  
    // Event Settings - Event Series Fields
    @Column({ name: 'event_strategy', nullable: true })
    eventStrategy?: string;
  
    @Column({ name: 'min_capacity', type: 'int', nullable: true })
    minCapacity?: number;
  
    @Column({ name: 'max_capacity', type: 'int', nullable: true })
    maxCapacity?: number;
  
    // Event Flow Settings
    @Column({ name: 'is_event_part_of_event_flow', default: false })
    isEventPartOfEventFlow: boolean;
  
    @Column({ name: 'select_event_flow_id', type: 'uuid', nullable: true })
    selectEventFlowId?: string;
  
    @Column({ name: 'select_event_blocks', nullable: true })
    selectEventBlocks?: string;
  
    @Column({ name: 'show_ticket_types_in_guests', default: false })
    showTicketTypesInGuests: boolean;
  
    @Column({ name: 'enable_qr_code', default: false })
    enableQrCode: boolean;

    @Column({ name: 'event_series_artwork_url', type: 'text', nullable: true })
    eventSeriesArtworkUrl?: string;

    @Column({ name: 'send_invites_option', length: 50, nullable: true })
    sendInvitesOption?: string;

    @Column({ name: 'send_now', default: false })
    sendNow: boolean;
  
    // Recurring Event Settings
    @Column({ name: 'is_recurring', default: false })
    isRecurring: boolean;
  
    @Column({ name: 'recurrence_pattern', nullable: true })
    recurrencePattern?: string;
  
    @Column({ name: 'recurrence_end_date', type: 'date', nullable: true })
    recurrenceEndDate?: Date;
  
    @Column({ name: 'parent_event_id', type: 'uuid', nullable: true })
    parentEventId?: string;
  
    // Media
    @Column({ name: 'featured_image_id', type: 'text', nullable: true })
    featuredImageId?: string;
  
    @Column({ name: 'banner_image_id', type: 'text', nullable: true })
    bannerImageId?: string;
  
    // Status
    @Column({
      name: 'status',
      type: 'enum',
      enum: EVENT_STATUS,
      default: EVENT_STATUS.DRAFT,
    })
    status: EventStatus;
  
    // Audit Fields
    @Column({ name: 'created_by', type: 'uuid' })
    createdBy: string;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @Column({ name: 'updated_by', type: 'uuid', nullable: true })
    updatedBy?: string;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  
    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt?: Date;
  }