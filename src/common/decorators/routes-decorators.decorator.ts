import {
  applyDecorators,
  Delete,
  Get,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { DecodeUserIdTokenInterceptor } from '../interceptors/decode-user-id-token.interceptor';

const ERRORS_MAPPING = {
  badRequest: ApiBadRequestResponse,
  notFound: ApiNotFoundResponse,
  forbidden: ApiForbiddenResponse,
  conflict: ApiConflictResponse,
} as const;
type HttpErrorTypes = keyof typeof ERRORS_MAPPING;

type CreateResourceCombinedDecoratorsOptions = {
  path?: string | string[];
  responseType?: any;
  additionalErrors?: HttpErrorTypes[];
  public?: boolean;
};

export function CreateResourceCombinedDecorators(
  options: CreateResourceCombinedDecoratorsOptions = {},
) {
  return applyDecorators(
    Post(options.path),
    options.public
      ? UseInterceptors()
      : UseInterceptors(DecodeUserIdTokenInterceptor),
    ApiCreatedResponse({
      ...(options.responseType && { type: options.responseType }),
    }),
    ApiInternalServerErrorResponse(),
    ...(options.additionalErrors || []).map((error) => ERRORS_MAPPING[error]()),
  );
}

type ReadResourceCombinedDecoratorsOptions = {
  path?: string | string[];
  responseType?: any;
  additionalErrors?: HttpErrorTypes[];
  public?: boolean;
};

export function ReadResourceCombinedDecorators(
  options: ReadResourceCombinedDecoratorsOptions = {},
) {
  return applyDecorators(
    Get(options.path),
    options.public
      ? UseInterceptors()
      : UseInterceptors(DecodeUserIdTokenInterceptor),
    ApiOkResponse({
      ...(options.responseType && { type: options.responseType }),
    }),
    ApiInternalServerErrorResponse(),
    ...(options.additionalErrors || []).map((error) => ERRORS_MAPPING[error]()),
  );
}

type PatchResourceCombinedDecoratorsOptions = {
  path?: string | string[];
  responseType?: any;
  additionalErrors?: HttpErrorTypes[];
  public?: boolean;
};

export function PatchResourceCombinedDecorators(
  options: PatchResourceCombinedDecoratorsOptions = {},
) {
  return applyDecorators(
    Patch(options.path),
    options.public
      ? UseInterceptors()
      : UseInterceptors(DecodeUserIdTokenInterceptor),
    ApiOkResponse({
      ...(options.responseType && { type: options.responseType }),
    }),
    ApiInternalServerErrorResponse(),
    ...(options.additionalErrors || []).map((error) => ERRORS_MAPPING[error]()),
  );
}

type DeleteResourceCombinedDecoratorsOptions = {
  path?: string | string[];
  responseType?: any;
  additionalErrors?: HttpErrorTypes[];
  public?: boolean;
};

export function DeleteResourceCombinedDecorators(
  options: DeleteResourceCombinedDecoratorsOptions = {},
) {
  return applyDecorators(
    Delete(options.path),
    options.public
      ? UseInterceptors()
      : UseInterceptors(DecodeUserIdTokenInterceptor),
    ApiNoContentResponse(),
    ApiOkResponse({
      ...(options.responseType && { type: options.responseType }),
    }),
    ApiInternalServerErrorResponse(),
    ...(options.additionalErrors || []).map((error) => ERRORS_MAPPING[error]()),
  );
}
