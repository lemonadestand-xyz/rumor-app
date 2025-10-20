import 'dotenv/config';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import validationOptions from './utils/validation-options';
import { AllConfigType } from './config/config.type';
import { ResolvePromisesInterceptor } from './utils/serializer.interceptor';
import { Logger } from 'nestjs-pino';
import { AllExceptionsFilter } from './common/filters/HttpExceptionFilter';
import { Logger as PinoLogger } from 'nestjs-pino';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule, { cors: true });
  // const app = await NestFactory.create(AppModule, { cors: true, bufferLogs: true });
  const app = await NestFactory.create(AppModule);

  // Add Pino HTTP middleware for request/response logging
  app.useLogger(app.get(Logger));
  // app.use(logger);

  const configService = app.get(ConfigService<AllConfigType>);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // const app = await NestFactory.create(AppModule);
  app.enableCors();
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // app.useLogger(app.get(Logger));

  app.enableShutdownHooks();
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalFilters(
    // new AllExceptionsFilter(app.get(HttpAdapterHost).httpAdapter, app.get(SentryService), app.get(Logger)),

    new AllExceptionsFilter(
      app.get(HttpAdapterHost).httpAdapter,
      app.get(Logger),
    ),
  );
  // app.useGlobalInterceptors(
  //   // ResolvePromisesInterceptor is used to resolve promises in responses because class-transformer can't do it
  //   // https://github.com/typestack/class-transformer/issues/549
  //   new ResolvePromisesInterceptor(),
  //   new ClassSerializerInterceptor(app.get(Reflector)),
  // );

  const options = new DocumentBuilder()
    .setTitle("Rumor's API")
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .addGlobalParameters({
      in: 'header',
      required: false,
      name: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
      schema: {
        example: 'en',
      },
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}
void bootstrap();
