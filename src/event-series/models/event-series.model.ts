export interface EventSeriesModel {
  id: string;
  seriesName: string;
  seriesDescription?: string;
  eventSeriesPage?: string;
  artworkUrl?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateEventSeriesModel {
  seriesName: string;
  seriesDescription?: string;
  eventSeriesPage?: string;
  artworkUrl?: string;
  createdBy: string;
  updatedBy?: string;
}

export interface UpdateEventSeriesModel {
  seriesName?: string;
  seriesDescription?: string;
  eventSeriesPage?: string;
  artworkUrl?: string;
  updatedBy?: string;
}
