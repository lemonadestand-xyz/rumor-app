import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('event_tags')
export class EventTagEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'event_id', type: 'uuid' })
  @Index('IDX_EVENT_TAGS_EVENT_TAG', ['event_id', 'tag_name'])
  eventId: string;

  @Column({ name: 'tag_name', type: 'varchar', length: 100 })
  tagName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
