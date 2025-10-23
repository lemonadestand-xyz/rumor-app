import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('event_series')
export class EventSeriesEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'series_name', type: 'varchar', length: 255 })
  seriesName: string;

  @Column({ name: 'series_description', type: 'text', nullable: true })
  seriesDescription?: string;

  @Column({ name: 'event_series_page', type: 'text', nullable: true })
  eventSeriesPage?: string;

  @Column({ name: 'artwork_url', type: 'text', nullable: true })
  artworkUrl?: string;

  @Column({ name: 'created_by', type: 'uuid' })
  @Index('IDX_EVENT_SERIES_CREATED_BY')
  createdBy: string;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy?: string;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  creator: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updater?: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
