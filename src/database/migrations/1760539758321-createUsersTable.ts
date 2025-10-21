import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1760539758321 implements MigrationInterface {
  name?: 'CreateUsersTable1747929820393';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TYPE "user_roles_enum" AS ENUM ('admin', 'superAdmin', 'host', 'coHost', 'colaborator')
        `);

    await queryRunner.query(`
          CREATE TYPE "user_status_enum" AS ENUM ('active', 'inactive', 'banned')
        `);

    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            default: 'gen_random_uuid()',
            isNullable: false,
          },
          { name: 'first_name', type: 'varchar' },
          { name: 'last_name', type: 'varchar' },
          { name: 'company_name', type: 'varchar', isNullable: false },
          { name: 'email', type: 'varchar', isNullable: false },
          { name: 'phone_number', type: 'varchar', isNullable: true },
          { name: 'calling_code', type: 'varchar', isNullable: true },
          { name: 'country_code', type: 'varchar', isNullable: true },
          { name: 'events_per_year', type: 'int', isNullable: false },
          { name: 'website', type: 'varchar', isNullable: true },
          { name: 'referred_by', type: 'varchar', isNullable: true },
          { name: 'password_hash', type: 'varchar', isNullable: false },
          { name: 'is_active', type: 'boolean', default: false },
          { name: 'is_verified', type: 'boolean', default: false },
          {
            name: 'verification_link_generated_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'verification_link_used',
            type: 'boolean',
            default: false,
            isNullable: true,
          },
          {
            name: 'reset_password_link_generated_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'reset_password_link_used',
            type: 'boolean',
            default: false,
            isNullable: true,
          },
          {
            name: 'verification_link_used_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'roles',
            type: 'user_roles_enum[]',
            isNullable: false,
            default: `'{"host"}'`,
          },
          {
            name: 'status',
            type: 'user_status_enum',
            isNullable: false,
            default: `'active'`,
          },
          {
            name: 'is_profile_created',
            type: 'boolean',
            default: false,
            isNullable: true,
          },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
          { name: 'deleted_at', type: 'timestamp', isNullable: true },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
    await queryRunner.query(`DROP TYPE "user_roles_enum"`);
    await queryRunner.query(`DROP TYPE "user_status_enum"`);
  }
}
