import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';
// import { SentryService } from '@ntegral/nestjs-sentry';
import { PinoLogger } from 'nestjs-pino';

type Exception = {
  response?: {
    message?: string | string[];
    code?: string;
  };
  message?: string;
  [k: string]: unknown;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapter: AbstractHttpAdapter,
    // private readonly sentryIntance: SentryService,
    private readonly logger: PinoLogger,
  ) {}

  private getMessage(exception: Exception): string | string[] {
    if (exception.response?.message) {
      return exception.response.message;
    }

    if (exception.message) {
      return exception.message as string;
    }

    return 'Error occurred';
  }

  private getCode(exception: Exception): string | undefined {
    if (exception.response?.code) {
      return exception.response.code;
    }
    return undefined;
  }

  catch(exception: Record<string, unknown>, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const code = this.getCode(exception);
    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: this.httpAdapter.getRequestUrl(ctx.getRequest()),
      message: this.getMessage(exception),
      ...(code && { code }),
    };

    this.logger.error(exception.cause || exception);
    // this.sentryIntance.instance().captureException(exception);
    this.httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
