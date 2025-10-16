import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { RoleEntity } from '../../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { StatusEntity } from '../../../../../statuses/infrastructure/persistence/relational/entities/status.entity';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';

import { AuthProvidersEnum } from '../../../../../auth/auth-providers.enum';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'user',
})
export class UserEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  // For "string | null" we need to use String type.
  // More info: https://github.com/typeorm/typeorm/issues/2567
  @Column({ type: String, unique: true, nullable: true })
  email: string | null;

  @Index()
  @Column({ type: String, unique: true, nullable: true })
  phoneNumber?: string | null;

  @Index()
  @Column({ type: String, unique: true, nullable: true })
  username?: string | null;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  temporaryPassword?: string;

  @Column({ nullable: true })
  temporaryPasswordToken?: string;

  @Column({ nullable: true })
  twoFactorCode?: string;

  @Column({ type: 'timestamp', nullable: true })
  twoFactorCodeExpiresAt?: Date;

  @Column({ default: AuthProvidersEnum.email })
  provider: string;

  @Index()
  @Column({ type: String, nullable: true })
  socialId?: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  firstName: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  lastName: string | null;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date | null;

  @Column({ type: String, nullable: true })
  gender?: string | null;

  @OneToOne(() => FileEntity, {
    eager: true,
  })
  @JoinColumn()
  photo?: FileEntity | null;

  @ManyToOne(() => RoleEntity, {
    eager: true,
  })
  role?: RoleEntity | null;

  @ManyToOne(() => StatusEntity, {
    eager: true,
  })
  status?: StatusEntity;

  // Status flags
  @Column({ default: true })
  isActive?: boolean;

  @Column({ default: false })
  isDeactivated?: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deactivatedAt?: Date | null;

  @Column({ default: true })
  isFirstTimeLogin?: boolean;

  @Column({ default: false })
  instagramValidated?: boolean;

  // Agreement flags
  @Column({ default: false })
  communityGuidelinesAgreed?: boolean;

  @Column({ type: 'timestamp', nullable: true })
  communityGuidelinesAgreedAt?: Date | null;

  @Column({ default: false })
  hostCommunityGuidelinesAgreed?: boolean;

  @Column({ type: 'timestamp', nullable: true })
  hostCommunityGuidelinesAgreedAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
