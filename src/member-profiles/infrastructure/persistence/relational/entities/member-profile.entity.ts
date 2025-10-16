import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { PersonalityType } from '../../../../domain/member-profile';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Entity({
  name: 'member_profile',
})
export class MemberProfileEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profession: string | null;

  @Column('text', { array: true, default: '{}' })
  interests: string[];

  @Column({
    type: 'enum',
    enum: PersonalityType,
    nullable: true,
  })
  personalityType: PersonalityType | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  instagramUsername: string | null;

  @Column({ type: 'int', default: 0 })
  instagramFollowers: number;

  @Column({ type: 'jsonb', nullable: true })
  instagramData: Record<string, any>;

  @Column({ type: 'int', default: 0 })
  eventsAttended: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalCompensationEarned: number;

  @Column({ type: 'int', default: 0 })
  totalDeliverablesCompleted: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  estimatedMediaValue: number;

  @Column({ type: 'int', nullable: true })
  waitlistPosition: number | null;

  @Column({ type: 'timestamp', nullable: true })
  approvalDate: Date | null;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'referred_by_user_id' })
  referredBy: UserEntity | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
