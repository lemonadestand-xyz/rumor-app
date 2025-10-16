import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { HostTier } from '../../../../domain/host-profile';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Entity({
  name: 'host_profile',
})
export class HostProfileEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'varchar', length: 255, nullable: true })
  category: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column('text', { array: true, default: '{}' })
  specialties: string[];

  @Column({
    type: 'enum',
    enum: HostTier,
    default: HostTier.ROOKIE,
  })
  tier: HostTier;

  @Column({ type: 'int', default: 0 })
  totalEventsHosted: number;

  @Column({ type: 'int', default: 0 })
  totalGuestsHosted: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalRevenueGenerated: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  averageTicketPrice: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  averageAttendanceRate: number;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date | null;

  @Column({ type: 'boolean', default: false })
  isSpotlightHost: boolean;

  @Column({ type: 'text', nullable: true })
  spotlightReason: string | null;

  @Column({ type: 'timestamp', nullable: true })
  lastEventDate: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  nextEventDate: Date | null;

  @Column({ type: 'int', default: 0 })
  upcomingEventsCount: number;

  @Column({ type: 'jsonb', nullable: true })
  analyticsData: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
