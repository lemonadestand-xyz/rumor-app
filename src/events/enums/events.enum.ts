export enum EVENT_LOCATION_TYPE {
    PHYSICAL = 'physical',
    VIRTUAL = 'virtual',
    HYBRID = 'hybrid',
  }
  
  export enum EVENT_VISIBILITY {
    PUBLIC = 'public',
    PRIVATE = 'private',
    UNLISTED = 'unlisted',
  }
  
  export enum EVENT_STATUS {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
  }
  
  export type EventLocationType = `${EVENT_LOCATION_TYPE}`;
  export type EventVisibility = `${EVENT_VISIBILITY}`;
  export type EventStatus = `${EVENT_STATUS}`;