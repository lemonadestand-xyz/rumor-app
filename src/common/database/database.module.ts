import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { DATABASE_CONNECTION } from './database.consts';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: async (configService: ConfigService) => {
        const url = configService.get<string>('database.url');
        const type = configService.get<
          'postgres' | 'mysql' | 'mariadb' | 'mssql' | 'sqlite' | any
        >('database.type');

        const base = {
          type,
          entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
          synchronize: configService.get<boolean>('database.synchronize'),
          // logging: configService.get('app.nodeEnv') !== 'production',
        } as any;

        const dsConfig = url
          ? { ...base, url }
          : {
              ...base,
              host: configService.get('database.host'),
              port: configService.get('database.port'),
              username: configService.get('database.username'),
              password: configService.get('database.password'),
              database: configService.get('database.name'),
            };

        const dataSource = new DataSource(dsConfig);

        return dataSource.initialize();
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseConnectionModule {}
