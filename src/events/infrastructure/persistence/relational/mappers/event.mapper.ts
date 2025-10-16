import { Event } from '../../../../domain/event';
import { EventEntity } from '../entities/event.entity';

export class EventMapper {
  static toDomain(entity: EventEntity): Event {
    const domain = new Event();
    Object.assign(domain, entity);
    return domain;
  }

  static toEntity(domain: Partial<Event>): Partial<EventEntity> {
    const entity = new EventEntity();
    Object.assign(entity, domain);
    return entity;
  }
}
