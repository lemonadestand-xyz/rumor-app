import { HostProfile } from '../../../../domain/host-profile';
import { HostProfileEntity } from '../entities/host-profile.entity';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

export class HostProfileMapper {
  static toDomain(raw: HostProfileEntity): HostProfile {
    const domainEntity = new HostProfile();
    domainEntity.id = raw.id;
    domainEntity.category = raw.category;
    domainEntity.description = raw.description;
    domainEntity.specialties = raw.specialties;
    domainEntity.tier = raw.tier;
    domainEntity.totalEventsHosted = raw.totalEventsHosted;
    domainEntity.averageRating = raw.averageRating;
    domainEntity.totalRevenue = raw.totalRevenue;
    domainEntity.totalAttendees = raw.totalAttendees;
    domainEntity.analyticsData = raw.analyticsData;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: HostProfile): HostProfileEntity {
    const persistenceEntity = new HostProfileEntity();

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.category = domainEntity.category;
    persistenceEntity.description = domainEntity.description;
    persistenceEntity.specialties = domainEntity.specialties || [];
    persistenceEntity.tier = domainEntity.tier;
    persistenceEntity.totalEventsHosted = domainEntity.totalEventsHosted;
    persistenceEntity.averageRating = domainEntity.averageRating;
    persistenceEntity.totalRevenue = domainEntity.totalRevenue;
    persistenceEntity.totalAttendees = domainEntity.totalAttendees;
    persistenceEntity.analyticsData = domainEntity.analyticsData || {};
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    if (domainEntity.user) {
      persistenceEntity.user = new UserEntity();
      persistenceEntity.user.id = Number(domainEntity.user.id);
    }

    return persistenceEntity;
  }
}
