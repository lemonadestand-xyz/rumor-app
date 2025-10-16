import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { RSVPStatus, GuestType, CheckInStatus } from '../../../../domain/guest';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { EventEntity } from '../../../../../events/infrastructure/persistence/relational/entities/event.entity';

@Entity({
  name: 'guest',
})
@Index(['event', 'user'], { unique: true })
@Index(['ticketCode'], { unique: true })
@Index(['event', 'rsvpStatus'])
@Index(['event', 'checkInStatus'])
export class GuestEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => EventEntity, { eager: true })
  @JoinColumn({ name: 'event_id' })
  event: EventEntity;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'invited_by_user_id' })
  invitedBy: UserEntity | null;

  @Column({
    type: 'enum',
    enum: RSVPStatus,
    default: RSVPStatus.PENDING,
  })
  rsvpStatus: RSVPStatus;

  @Column({
    type: 'enum',
    enum: GuestType,
    default: GuestType.REGULAR,
  })
  guestType: GuestType;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  invitedAt: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  respondedAt: Date | null;

  @Column({ type: 'boolean', default: false })
  hasPlusOne: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  plusOneName: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  plusOneEmail: string | null;

  @Column({ type: 'boolean', default: false })
  plusOneCheckedIn: boolean;

  @Column({
    type: 'enum',
    enum: CheckInStatus,
    default: CheckInStatus.NOT_CHECKED_IN,
  })
  checkInStatus: CheckInStatus;

  @Column({ type: 'timestamp with time zone', nullable: true })
  checkedInAt: Date | null;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'checked_in_by_user_id' })
  checkedInBy: UserEntity | null;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  ticketCode: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  qrCodeUrl: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  ticketPrice: number | null;

  @Column({ type: 'boolean', default: false })
  isPaid: boolean;

  @Column({ type: 'timestamp with time zone', nullable: true })
  paidAt: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentReference: string | null;

  @Column({ type: 'text', nullable: true })
  dietaryRestrictions: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'int', nullable: true })
  waitlistPosition: number | null;

  @Column({ type: 'boolean', default: false })
  requiresApproval: boolean;

  @Column({ type: 'boolean', default: false })
  isApproved: boolean;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date | null;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'approved_by_user_id' })
  approvedBy: UserEntity | null;

  @Column({ type: 'int', nullable: true })
  eventRating: number | null;

  @Column({ type: 'text', nullable: true })
  eventReview: string | null;

  @Column({ type: 'timestamp', nullable: true })
  reviewSubmittedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
