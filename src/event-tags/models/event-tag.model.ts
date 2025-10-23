export interface EventTagModel {
  id: string;
  eventId: string;
  tagName: string;
  createdAt: Date;
}

export interface CreateEventTagModel {
  eventId: string;
  tagName: string;
}

export interface UpdateEventTagModel {
  tagName?: string;
}

export interface BulkCreateEventTagsModel {
  eventId: string;
  tagNames: string[];
}
