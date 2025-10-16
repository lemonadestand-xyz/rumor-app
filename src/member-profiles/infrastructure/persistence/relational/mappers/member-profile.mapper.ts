import { MemberProfile } from '../../../../domain/member-profile';
import { MemberProfileEntity } from '../entities/member-profile.entity';

export class MemberProfileMapper {
  static toDomain(entity: MemberProfileEntity): MemberProfile {
    const domain = new MemberProfile();
    Object.assign(domain, entity);
    return domain;
  }

  static toEntity(
    domain: Partial<MemberProfile>,
  ): Partial<MemberProfileEntity> {
    const entity = new MemberProfileEntity();
    Object.assign(entity, domain);
    return entity;
  }
}
