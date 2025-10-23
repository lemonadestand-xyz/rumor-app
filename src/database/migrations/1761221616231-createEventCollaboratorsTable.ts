import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateEventCollaboratorsTable1761221616231 implements MigrationInterface {

    name = 'CreateEventCollaboratorsTable1761221616231';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'event_collaborators',
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
                        name: 'event_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'role',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            }),
        );

        // Create indexes
        await queryRunner.createIndex(
            'event_collaborators',
            new TableIndex({
                name: 'IDX_EVENT_COLLABORATORS_EVENT_ID',
                columnNames: ['event_id'],
            }),
        );

        await queryRunner.createIndex(
            'event_collaborators',
            new TableIndex({
                name: 'IDX_EVENT_COLLABORATORS_USER_ID',
                columnNames: ['user_id'],
            }),
        );

        // Create foreign keys
        await queryRunner.createForeignKey(
            'event_collaborators',
            new TableForeignKey({
                name: 'FK_EVENT_COLLABORATORS_EVENT',
                columnNames: ['event_id'],
                referencedTableName: 'events',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'event_collaborators',
            new TableForeignKey({
                name: 'FK_EVENT_COLLABORATORS_USER',
                columnNames: ['user_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('event_collaborators', 'FK_EVENT_COLLABORATORS_USER');
        await queryRunner.dropForeignKey('event_collaborators', 'FK_EVENT_COLLABORATORS_EVENT');
        await queryRunner.dropIndex('event_collaborators', 'IDX_EVENT_COLLABORATORS_USER_ID');
        await queryRunner.dropIndex('event_collaborators', 'IDX_EVENT_COLLABORATORS_EVENT_ID');
        await queryRunner.dropTable('event_collaborators');
    }

}
