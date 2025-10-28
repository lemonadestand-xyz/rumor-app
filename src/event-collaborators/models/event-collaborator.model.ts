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

export interface UpdateEventCollaboratorModel {
  email?: string;
  name?: string;
  role?: string;
}
