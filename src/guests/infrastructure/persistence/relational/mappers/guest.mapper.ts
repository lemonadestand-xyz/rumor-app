import { Guest } from '../../../../domain/guest';
import { GuestEntity } from '../entities/guest.entity';

export class GuestMapper {
  static toDomain(entity: GuestEntity): Guest {
    const domain = new Guest();
    Object.assign(domain, entity);
    return domain;
  }

  static toEntity(domain: Partial<Guest>): Partial<GuestEntity> {
    const entity = new GuestEntity();
    Object.assign(entity, domain);
    return entity;
  }
}
