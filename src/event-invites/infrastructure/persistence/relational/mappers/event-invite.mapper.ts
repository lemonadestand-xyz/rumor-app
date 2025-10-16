import { EventInvite } from '../../../../domain/event-invite';
import { EventInviteEntity } from '../entities/event-invite.entity';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';
import { EventMapper } from '../../../../../events/infrastructure/persistence/relational/mappers/event.mapper';

export class EventInviteMapper {
  static toDomain(raw: EventInviteEntity): EventInvite {
    const domainEntity = new EventInvite();
    domainEntity.id = raw.id;
    domainEntity.inviteeEmail = raw.inviteeEmail;
    domainEntity.inviteePhone = raw.inviteePhone;
    domainEntity.inviteeName = raw.inviteeName;
    domainEntity.status = raw.status;
    domainEntity.inviteType = raw.inviteType;
    domainEntity.inviteCode = raw.inviteCode;
    domainEntity.inviteUrl = raw.inviteUrl;
    domainEntity.personalMessage = raw.personalMessage;
    domainEntity.allowPlusOne = raw.allowPlusOne;
    domainEntity.sentAt = raw.sentAt;
    domainEntity.viewedAt = raw.viewedAt;
    domainEntity.respondedAt = raw.respondedAt;
    domainEntity.expiresAt = raw.expiresAt;
    domainEntity.remindersSent = raw.remindersSent;
    domainEntity.lastReminderAt = raw.lastReminderAt;
    domainEntity.isVIP = raw.isVIP;
    domainEntity.trackingData = raw.trackingData;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    if (raw.event) {
      domainEntity.event = EventMapper.toDomain(raw.event);
    }

    if (raw.invitedBy) {
      domainEntity.invitedBy = UserMapper.toDomain(raw.invitedBy);
    }

    if (raw.invitedUser) {
      domainEntity.invitedUser = UserMapper.toDomain(raw.invitedUser);
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: EventInvite): EventInviteEntity {
    const persistenceEntity = new EventInviteEntity();

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.inviteeEmail = domainEntity.inviteeEmail;
    persistenceEntity.inviteePhone = domainEntity.inviteePhone;
    persistenceEntity.inviteeName = domainEntity.inviteeName;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.inviteType = domainEntity.inviteType;
    persistenceEntity.inviteCode = domainEntity.inviteCode;
    persistenceEntity.inviteUrl = domainEntity.inviteUrl;
    persistenceEntity.personalMessage = domainEntity.personalMessage;
    persistenceEntity.allowPlusOne = domainEntity.allowPlusOne;
    persistenceEntity.sentAt = domainEntity.sentAt;
    persistenceEntity.viewedAt = domainEntity.viewedAt;
    persistenceEntity.respondedAt = domainEntity.respondedAt;
    persistenceEntity.expiresAt = domainEntity.expiresAt;
    persistenceEntity.remindersSent = domainEntity.remindersSent;
    persistenceEntity.lastReminderAt = domainEntity.lastReminderAt;
    persistenceEntity.isVIP = domainEntity.isVIP;
    persistenceEntity.trackingData = domainEntity.trackingData || {};
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    if (domainEntity.event && domainEntity.event.id) {
      persistenceEntity.event =
        new (require('../../../../../events/infrastructure/persistence/relational/entities/event.entity').EventEntity)();
      persistenceEntity.event.id = domainEntity.event.id;
    }

    if (domainEntity.invitedBy && domainEntity.invitedBy.id) {
      persistenceEntity.invitedBy =
        new (require('../../../../../users/infrastructure/persistence/relational/entities/user.entity').UserEntity)();
      persistenceEntity.invitedBy.id = Number(domainEntity.invitedBy.id);
    }

    if (domainEntity.invitedUser && domainEntity.invitedUser.id) {
      persistenceEntity.invitedUser =
        new (require('../../../../../users/infrastructure/persistence/relational/entities/user.entity').UserEntity)();
      persistenceEntity.invitedUser.id = Number(domainEntity.invitedUser.id);
    }

    return persistenceEntity;
  }
}
