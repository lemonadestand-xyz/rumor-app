import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateEventTagsTable1761222624237 implements MigrationInterface {
    name: 'CreateEventTagsTable1761222624237';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: 'event_tags',
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
                name: 'tag_name',
                type: 'varchar',
                length: '100',
                isNullable: false,
              },
              {
                name: 'created_at',
                type: 'timestamp',
                default: 'now()',
              },
            ],
          }),
        );
    
        await queryRunner.createIndex(
          'event_tags',
          new TableIndex({
            name: 'IDX_EVENT_TAGS_EVENT_TAG',
            columnNames: ['event_id', 'tag_name'],
          }),
        );
    
        await queryRunner.createForeignKey(
          'event_tags',
          new TableForeignKey({
            name: 'FK_EVENT_TAGS_EVENT',
            columnNames: ['event_id'],
            referencedTableName: 'events',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('event_tags', 'FK_EVENT_TAGS_EVENT');
        await queryRunner.dropIndex('event_tags', 'IDX_EVENT_TAGS_EVENT_TAG');
        await queryRunner.dropTable('event_tags');
      }

}
