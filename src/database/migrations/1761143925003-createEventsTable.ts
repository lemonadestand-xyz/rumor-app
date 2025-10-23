import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateEventsTable1761143925003 implements MigrationInterface {

    name = 'CreateEventsTable1761143925003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "event_location_type_enum" AS ENUM ('physical', 'virtual', 'hybrid')
    `);

    await queryRunner.query(`
      CREATE TYPE "event_visibility_enum" AS ENUM ('public', 'private', 'unlisted')
    `);

    await queryRunner.query(`
      CREATE TYPE "event_status_enum" AS ENUM ('draft', 'published', 'cancelled', 'completed')
    `);

    await queryRunner.createTable(
      new Table({
        name: 'events',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            default: 'gen_random_uuid()',
            isNullable: false,
          },
          {
            name: 'event_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'event_type',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'event_flow',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'start_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'start_time',
            type: 'time',
            isNullable: false,
          },
          {
            name: 'end_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'end_time',
            type: 'time',
            isNullable: false,
          },
          {
            name: 'timezone',
            type: 'varchar',
            length: '100',
            default: "'UTC'",
          },
          {
            name: 'rsvp_by_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'location_type',
            type: 'event_location_type_enum',
            isNullable: false,
          },
          {
            name: 'venue_name',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'address_line1',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'address_line2',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'city',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'state',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'country',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'postal_code',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'latitude',
            type: 'decimal',
            precision: 10,
            scale: 8,
            isNullable: true,
          },
          {
            name: 'longitude',
            type: 'decimal',
            precision: 11,
            scale: 8,
            isNullable: true,
          },
          {
            name: 'show_full_address_to_confirmed_guests_only',
            type: 'boolean',
            default: false,
          },
          {
            name: 'event_description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'short_description',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'visibility',
            type: 'event_visibility_enum',
            default: "'public'",
          },
          {
            name: 'invitation_only_approval',
            type: 'boolean',
            default: false,
          },
          {
            name: 'allow_anyone_outside_event_flow',
            type: 'boolean',
            default: false,
          },
          {
            name: 'event_strategy',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'min_capacity',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'max_capacity',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'is_event_part_of_event_flow',
            type: 'boolean',
            default: false,
          },
          {
            name: 'select_event_flow_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'select_event_blocks',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'show_ticket_types_in_guests',
            type: 'boolean',
            default: false,
          },
          {
            name: 'enable_qr_code',
            type: 'boolean',
            default: false,
          },
          {
            name: 'event_series_artwork_url',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'send_invites_option',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'send_now',
            type: 'boolean',
            default: false,
          },
          {
            name: 'is_recurring',
            type: 'boolean',
            default: false,
          },
          {
            name: 'recurrence_pattern',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'recurrence_end_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'parent_event_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'featured_image_id',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'banner_image_id',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'event_status_enum',
            default: "'draft'",
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'events',
      new TableIndex({
        name: 'IDX_EVENTS_START_DATE',
        columnNames: ['start_date'],
      }),
    );

    await queryRunner.createIndex(
      'events',
      new TableIndex({
        name: 'IDX_EVENTS_STATUS',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'events',
      new TableIndex({
        name: 'IDX_EVENTS_CREATED_BY',
        columnNames: ['created_by'],
      }),
    );

    await queryRunner.createIndex(
      'events',
      new TableIndex({
        name: 'IDX_EVENTS_VISIBILITY',
        columnNames: ['visibility'],
      }),
    );

    await queryRunner.createIndex(
      'events',
      new TableIndex({
        name: 'IDX_EVENTS_STATUS_START_DATE',
        columnNames: ['status', 'start_date'],
      }),
    );

    await queryRunner.createIndex(
      'events',
      new TableIndex({
        name: 'IDX_EVENTS_CREATED_BY_STATUS',
        columnNames: ['created_by', 'status'],
      }),
    );

    await queryRunner.createForeignKey(
      'events',
      new TableForeignKey({
        name: 'FK_EVENTS_PARENT_EVENT',
        columnNames: ['parent_event_id'],
        referencedTableName: 'events',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'events',
      new TableForeignKey({
        name: 'FK_EVENTS_CREATED_BY',
        columnNames: ['created_by'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'events',
      new TableForeignKey({
        name: 'FK_EVENTS_UPDATED_BY',
        columnNames: ['updated_by'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('events', 'FK_EVENTS_UPDATED_BY');
    await queryRunner.dropForeignKey('events', 'FK_EVENTS_CREATED_BY');
    await queryRunner.dropForeignKey('events', 'FK_EVENTS_PARENT_EVENT');
    
    await queryRunner.dropIndex('events', 'IDX_EVENTS_CREATED_BY_STATUS');
    await queryRunner.dropIndex('events', 'IDX_EVENTS_STATUS_START_DATE');
    await queryRunner.dropIndex('events', 'IDX_EVENTS_VISIBILITY');
    await queryRunner.dropIndex('events', 'IDX_EVENTS_CREATED_BY');
    await queryRunner.dropIndex('events', 'IDX_EVENTS_STATUS');
    await queryRunner.dropIndex('events', 'IDX_EVENTS_START_DATE');
    
    await queryRunner.dropTable('events');
    
    await queryRunner.query(`DROP TYPE "event_status_enum"`);
    await queryRunner.query(`DROP TYPE "event_visibility_enum"`);
    await queryRunner.query(`DROP TYPE "event_location_type_enum"`);
  }

}