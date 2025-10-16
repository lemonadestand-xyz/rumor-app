import { Ticket } from '../../../../domain/ticket';
import { TicketEntity } from '../entities/ticket.entity';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';
import { EventMapper } from '../../../../../events/infrastructure/persistence/relational/mappers/event.mapper';
import { GuestMapper } from '../../../../../guests/infrastructure/persistence/relational/mappers/guest.mapper';

export class TicketMapper {
  static toDomain(raw: TicketEntity): Ticket {
    const domainEntity = new Ticket();
    domainEntity.id = raw.id;
    domainEntity.ticketNumber = raw.ticketNumber;
    domainEntity.ticketType = raw.ticketType;
    domainEntity.status = raw.status;
    domainEntity.price = Number(raw.price);
    domainEntity.paidPrice = raw.paidPrice ? Number(raw.paidPrice) : null;
    domainEntity.serviceFee = raw.serviceFee ? Number(raw.serviceFee) : null;
    domainEntity.discountCode = raw.discountCode;
    domainEntity.discountAmount = raw.discountAmount
      ? Number(raw.discountAmount)
      : null;
    domainEntity.purchasedAt = raw.purchasedAt;
    domainEntity.paymentReference = raw.paymentReference;
    domainEntity.paymentMethod = raw.paymentMethod;
    domainEntity.qrCode = raw.qrCode;
    domainEntity.barcode = raw.barcode;
    domainEntity.isUsed = raw.isUsed;
    domainEntity.usedAt = raw.usedAt;
    domainEntity.validFrom = raw.validFrom;
    domainEntity.validUntil = raw.validUntil;
    domainEntity.isTransferable = raw.isTransferable;
    domainEntity.transferCount = raw.transferCount;
    domainEntity.lastTransferredAt = raw.lastTransferredAt;
    domainEntity.isRefunded = raw.isRefunded;
    domainEntity.refundedAt = raw.refundedAt;
    domainEntity.refundAmount = raw.refundAmount
      ? Number(raw.refundAmount)
      : null;
    domainEntity.refundReason = raw.refundReason;
    domainEntity.seatNumber = raw.seatNumber;
    domainEntity.section = raw.section;
    domainEntity.metadata = raw.metadata;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    if (raw.event) {
      domainEntity.event = EventMapper.toDomain(raw.event);
    }

    if (raw.guest) {
      domainEntity.guest = GuestMapper.toDomain(raw.guest);
    }

    if (raw.owner) {
      domainEntity.owner = UserMapper.toDomain(raw.owner);
    }

    if (raw.purchasedBy) {
      domainEntity.purchasedBy = UserMapper.toDomain(raw.purchasedBy);
    }

    if (raw.scannedBy) {
      domainEntity.scannedBy = UserMapper.toDomain(raw.scannedBy);
    }

    if (raw.transferredFrom) {
      domainEntity.transferredFrom = UserMapper.toDomain(raw.transferredFrom);
    }

    if (raw.transferredTo) {
      domainEntity.transferredTo = UserMapper.toDomain(raw.transferredTo);
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: Ticket): TicketEntity {
    const persistenceEntity = new TicketEntity();

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.ticketNumber = domainEntity.ticketNumber;
    persistenceEntity.ticketType = domainEntity.ticketType;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.price = domainEntity.price;
    persistenceEntity.paidPrice = domainEntity.paidPrice;
    persistenceEntity.serviceFee = domainEntity.serviceFee;
    persistenceEntity.discountCode = domainEntity.discountCode;
    persistenceEntity.discountAmount = domainEntity.discountAmount;
    persistenceEntity.purchasedAt = domainEntity.purchasedAt;
    persistenceEntity.paymentReference = domainEntity.paymentReference;
    persistenceEntity.paymentMethod = domainEntity.paymentMethod;
    persistenceEntity.qrCode = domainEntity.qrCode;
    persistenceEntity.barcode = domainEntity.barcode;
    persistenceEntity.isUsed = domainEntity.isUsed;
    persistenceEntity.usedAt = domainEntity.usedAt;
    persistenceEntity.validFrom = domainEntity.validFrom;
    persistenceEntity.validUntil = domainEntity.validUntil;
    persistenceEntity.isTransferable = domainEntity.isTransferable;
    persistenceEntity.transferCount = domainEntity.transferCount;
    persistenceEntity.lastTransferredAt = domainEntity.lastTransferredAt;
    persistenceEntity.isRefunded = domainEntity.isRefunded;
    persistenceEntity.refundedAt = domainEntity.refundedAt;
    persistenceEntity.refundAmount = domainEntity.refundAmount;
    persistenceEntity.refundReason = domainEntity.refundReason;
    persistenceEntity.seatNumber = domainEntity.seatNumber;
    persistenceEntity.section = domainEntity.section;
    persistenceEntity.metadata = domainEntity.metadata || {};
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    if (domainEntity.event && domainEntity.event.id) {
      persistenceEntity.event =
        new (require('../../../../../events/infrastructure/persistence/relational/entities/event.entity').EventEntity)();
      persistenceEntity.event.id = domainEntity.event.id;
    }

    if (domainEntity.guest && domainEntity.guest.id) {
      persistenceEntity.guest =
        new (require('../../../../../guests/infrastructure/persistence/relational/entities/guest.entity').GuestEntity)();
      persistenceEntity.guest.id = domainEntity.guest.id;
    }

    if (domainEntity.owner && domainEntity.owner.id) {
      persistenceEntity.owner =
        new (require('../../../../../users/infrastructure/persistence/relational/entities/user.entity').UserEntity)();
      persistenceEntity.owner.id = Number(domainEntity.owner.id);
    }

    if (domainEntity.purchasedBy && domainEntity.purchasedBy.id) {
      persistenceEntity.purchasedBy =
        new (require('../../../../../users/infrastructure/persistence/relational/entities/user.entity').UserEntity)();
      persistenceEntity.purchasedBy.id = Number(domainEntity.purchasedBy.id);
    }

    if (domainEntity.scannedBy && domainEntity.scannedBy.id) {
      persistenceEntity.scannedBy =
        new (require('../../../../../users/infrastructure/persistence/relational/entities/user.entity').UserEntity)();
      persistenceEntity.scannedBy.id = Number(domainEntity.scannedBy.id);
    }

    if (domainEntity.transferredFrom && domainEntity.transferredFrom.id) {
      persistenceEntity.transferredFrom =
        new (require('../../../../../users/infrastructure/persistence/relational/entities/user.entity').UserEntity)();
      persistenceEntity.transferredFrom.id = Number(
        domainEntity.transferredFrom.id,
      );
    }

    if (domainEntity.transferredTo && domainEntity.transferredTo.id) {
      persistenceEntity.transferredTo =
        new (require('../../../../../users/infrastructure/persistence/relational/entities/user.entity').UserEntity)();
      persistenceEntity.transferredTo.id = Number(
        domainEntity.transferredTo.id,
      );
    }

    return persistenceEntity;
  }
}
