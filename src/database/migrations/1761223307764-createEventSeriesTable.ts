import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateEventSeriesTable1761223307764 implements MigrationInterface {

    name = 'CreateEventSeriesTable1761223307764';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'event_series',
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
                        name: 'series_name',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'series_description',
                        type: 'text',
                        isNullable: true,
                    },
                    // Event Series Page (from modal)
                    {
                        name: 'event_series_page',
                        type: 'text',
                        isNullable: true,
                        comment: 'URL or identifier for event series page',
                    },
                    // Artwork/Banner
                    {
                        name: 'artwork_url',
                        type: 'text',
                        isNullable: true,
                        comment: 'Drag & Drop file - png, jpg, heic',
                    },
                    // Audit Fields
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

        // Create index
        await queryRunner.createIndex(
            'event_series',
            new TableIndex({
                name: 'IDX_EVENT_SERIES_CREATED_BY',
                columnNames: ['created_by'],
            }),
        );

        // Create foreign keys
        await queryRunner.createForeignKey(
            'event_series',
            new TableForeignKey({
                name: 'FK_EVENT_SERIES_CREATED_BY',
                columnNames: ['created_by'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'event_series',
            new TableForeignKey({
                name: 'FK_EVENT_SERIES_UPDATED_BY',
                columnNames: ['updated_by'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('event_series', 'FK_EVENT_SERIES_UPDATED_BY');
        await queryRunner.dropForeignKey('event_series', 'FK_EVENT_SERIES_CREATED_BY');
        await queryRunner.dropIndex('event_series', 'IDX_EVENT_SERIES_CREATED_BY');
        await queryRunner.dropTable('event_series');
    }

}
