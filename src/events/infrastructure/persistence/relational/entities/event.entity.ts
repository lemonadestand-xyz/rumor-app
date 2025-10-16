import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import {
  EventStatus,
  EventType,
  DressCode,
  AgeRequirement,
} from '../../../../domain/event';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Entity({
  name: 'event',
})
@Index(['slug'], { unique: true })
@Index(['startDate', 'status'])
@Index(['host', 'status'])
export class EventEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'host_id' })
  host: UserEntity;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  longDescription: string | null;

  @Column({ type: 'varchar', length: 255 })
  venue: string;

  @Column({ type: 'varchar', length: 500 })
  venueAddress: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  state: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  zipCode: string | null;

  @Column({ type: 'varchar', length: 100 })
  country: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number | null;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number | null;

  @Column({ type: 'timestamp with time zone' })
  startDate: Date;

  @Column({ type: 'timestamp with time zone' })
  endDate: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  doorsOpenTime: Date | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  lastEntryTime: Date | null;

  @Column({
    type: 'enum',
    enum: EventType,
    default: EventType.PUBLIC,
  })
  eventType: EventType;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.DRAFT,
  })
  status: EventStatus;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column('text', { array: true, default: '{}' })
  tags: string[];

  @Column({ type: 'int' })
  capacity: number;

  @Column({ type: 'int', nullable: true })
  minCapacity: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  ticketPrice: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  earlyBirdPrice: number | null;

  @Column({ type: 'timestamp', nullable: true })
  earlyBirdDeadline: Date | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  vipPrice: number | null;

  @Column({ type: 'int', nullable: true })
  vipCapacity: number | null;

  @Column({ type: 'boolean', default: false })
  allowPlusOnes: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  plusOnePrice: number | null;

  @Column({
    type: 'enum',
    enum: DressCode,
    nullable: true,
  })
  dressCode: DressCode | null;

  @Column({
    type: 'enum',
    enum: AgeRequirement,
    default: AgeRequirement.ALL_AGES,
  })
  ageRequirement: AgeRequirement;

  @Column('text', { array: true, default: '{}' })
  imageUrls: string[];

  @Column({ type: 'varchar', length: 500, nullable: true })
  coverImageUrl: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  promoVideoUrl: string | null;

  @Column({ type: 'boolean', default: false })
  requiresApproval: boolean;

  @Column({ type: 'boolean', default: true })
  autoApproveMembers: boolean;

  @Column({ type: 'boolean', default: false })
  isSpotlightEvent: boolean;

  @Column({ type: 'text', nullable: true })
  spotlightReason: string | null;

  @Column({ type: 'timestamp', nullable: true })
  registrationDeadline: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  cancellationDeadline: Date | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cancellationFee: number | null;

  @Column({ type: 'int', default: 0 })
  currentAttendees: number;

  @Column({ type: 'int', default: 0 })
  waitlistCount: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  averageRating: number | null;

  @Column({ type: 'int', default: 0 })
  totalReviews: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  totalRevenue: number | null;

  @Column({ type: 'int', nullable: true })
  actualAttendees: number | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  attendanceRate: number | null;

  @Column({ type: 'jsonb', nullable: true })
  analyticsData: Record<string, any>;

  @Column({ type: 'boolean', default: false })
  isCancelled: boolean;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string | null;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
