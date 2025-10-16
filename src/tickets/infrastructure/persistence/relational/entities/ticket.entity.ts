import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { TicketType, TicketStatus } from '../../../../domain/ticket';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { EventEntity } from '../../../../../events/infrastructure/persistence/relational/entities/event.entity';
import { GuestEntity } from '../../../../../guests/infrastructure/persistence/relational/entities/guest.entity';

@Entity({
  name: 'ticket',
})
@Index(['ticketNumber'], { unique: true })
@Index(['event', 'status'])
@Index(['owner'])
export class TicketEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => EventEntity, { eager: true })
  @JoinColumn({ name: 'event_id' })
  event: EventEntity;

  @OneToOne(() => GuestEntity, { nullable: true })
  @JoinColumn({ name: 'guest_id' })
  guest: GuestEntity | null;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'owner_user_id' })
  owner: UserEntity | null;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'purchased_by_user_id' })
  purchasedBy: UserEntity | null;

  @Column({ type: 'varchar', length: 50, unique: true })
  ticketNumber: string;

  @Column({
    type: 'enum',
    enum: TicketType,
    default: TicketType.GENERAL,
  })
  ticketType: TicketType;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.AVAILABLE,
  })
  status: TicketStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  paidPrice: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  serviceFee: number | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  discountCode: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountAmount: number | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  purchasedAt: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentReference: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  paymentMethod: string | null;

  @Column({ type: 'varchar', length: 500 })
  qrCode: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  barcode: string | null;

  @Column({ type: 'boolean', default: false })
  isUsed: boolean;

  @Column({ type: 'timestamp with time zone', nullable: true })
  usedAt: Date | null;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'scanned_by_user_id' })
  scannedBy: UserEntity | null;

  @Column({ type: 'timestamp with time zone' })
  validFrom: Date;

  @Column({ type: 'timestamp with time zone' })
  validUntil: Date;

  @Column({ type: 'boolean', default: true })
  isTransferable: boolean;

  @Column({ type: 'int', default: 0 })
  transferCount: number;

  @Column({ type: 'timestamp with time zone', nullable: true })
  lastTransferredAt: Date | null;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'transferred_from_user_id' })
  transferredFrom: UserEntity | null;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'transferred_to_user_id' })
  transferredTo: UserEntity | null;

  @Column({ type: 'boolean', default: false })
  isRefunded: boolean;

  @Column({ type: 'timestamp with time zone', nullable: true })
  refundedAt: Date | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  refundAmount: number | null;

  @Column({ type: 'text', nullable: true })
  refundReason: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  seatNumber: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  section: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
