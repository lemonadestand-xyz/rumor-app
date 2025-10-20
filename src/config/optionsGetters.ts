import {
  ConfigModule,
  ConfigModuleOptions,
  ConfigService,
} from '@nestjs/config';
import AppConfig from './app.config';
import { v4 as uuid } from 'uuid';
import { LoggerModuleAsyncParams } from 'nestjs-pino';
import databaseConfig from '../database/config/database.config';

export function configModuleOptionsGetter(): ConfigModuleOptions {
  return {
    isGlobal: true,
    ignoreEnvFile: true,
    load: [AppConfig, databaseConfig],
    // databaseConfig
  };
}

export function loggerModuleOptionsGetter(): LoggerModuleAsyncParams {
  return {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService<any>) => {
      const level = configService.get<string>('app.logLevel') || 'info';

      return {
        pinoHttp: {
          level,
          redact: ['req.headers.authorization'],
          messageKey: 'msg',
          autoLogging: true,
          quietReqLogger: false,
          genReqId: () => uuid(),
          formatters: {
            level(label, number) {
              return { level: label };
            },
          },
        },
      };
    },
  };
}
