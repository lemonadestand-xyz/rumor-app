import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import {
  USER_ROLES,
  USER_STATUS,
  UserRoles,
  UserStatus,
} from '../../../../users/enums/user.enum';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'company_name' })
  companyName: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber?: string;

  @Column({ name: 'calling_code', nullable: true })
  callingCode?: string;

  @Column({ name: 'country_code', nullable: true })
  countryCode?: string;

  @Column({ name: 'events_per_year', type: 'int' })
  eventsPerYear: number;

  @Column({ name: 'website', nullable: true })
  website?: string;

  @Column({ name: 'referred_by', nullable: true })
  referredBy?: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'is_active', default: false })
  isActive: boolean;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({
    name: 'verification_link_generated_at',
    type: 'timestamp',
    nullable: true,
  })
  verificationLinkGeneratedAt?: Date;

  @Column({
    name: 'verification_link_used',
    type: 'boolean',
    default: false,
    nullable: true,
  })
  verificationLinkUsed?: boolean;

  @Column({
    name: 'verification_link_used_at',
    type: 'timestamp',
    nullable: true,
  })
  verificationLinkUsedAt?: Date;

  @Column({
    name: 'reset_password_link_generated_at',
    type: 'timestamp',
    nullable: true,
  })
  resetPasswordLinkGeneratedAt?: Date;

  @Column({
    name: 'reset_password_link_used',
    type: 'boolean',
    default: false,
    nullable: true,
  })
  resetPasswordLinkUsed?: boolean;

  @Column({
    name: 'roles',
    type: 'enum',
    enum: USER_ROLES,
    array: true,
    default: [USER_ROLES.HOST],
  })
  roles: UserRoles[];

  @Column({
    name: 'is_profile_created',
    type: 'boolean',
    default: false,
    nullable: true,
  })
  isProfileCreated: boolean;

  @Column({
    name: 'status',
    type: 'enum',
    enum: USER_STATUS,
    default: USER_STATUS.ACTIVE,
  })
  status: UserStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
