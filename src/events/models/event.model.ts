export interface EventModel {
  id: string;
  name: string;
  seriesId?: string;
  collaborators: EventCollaboratorModel[];
  tags: EventTagModel[];
}

export interface CreateEventModel {
  name: string;
  seriesId?: string;
  collaborators?: CreateEventCollaboratorModel[];
  tags?: CreateEventTagModel[];
  bulkTags?: BulkCreateEventTagsModel;
}

export interface UpdateEventModel {
  name?: string;
  seriesId?: string;
  collaborators?: CreateEventCollaboratorModel[];
  tags?: CreateEventTagModel[];
  bulkTags?: BulkCreateEventTagsModel;
}

// Re-export from other modules
export interface EventCollaboratorModel {
  id: string;
  eventId: string;
  userId?: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventCollaboratorModel {
  eventId: string;
  userId?: string;
  email: string;
  name: string;
  role: string;
}

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

export interface BulkCreateEventTagsModel {
  eventId: string;
  tagNames: string[];
}
