import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('user_profiles')
export class UserProfileEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'instagram_link', type: 'varchar', nullable: true })
  instagramLink: string | null;

  @Column({ name: 'tiktok_link', type: 'varchar', nullable: true })
  tiktokLink: string | null;

  @Column({ name: 'linkedin_link', type: 'varchar', nullable: true })
  linkedinLink: string | null;

  @Column({ name: 'youtube_link', type: 'varchar', nullable: true })
  youtubeLink: string | null;

  @Column({ name: 'facebook_link', type: 'varchar', nullable: true })
  facebookLink: string | null;

  @Column({ name: 'x_link', type: 'varchar', nullable: true })
  xLink: string | null;

  @Column({ name: 'bio', type: 'varchar', nullable: true })
  bio: string | null;

  @Column({ name: 'photo_id', type: 'varchar', nullable: true })
  photoId: string | null;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
