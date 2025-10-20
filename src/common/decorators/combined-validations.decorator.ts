import { applyDecorators } from '@nestjs/common';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumberString,
  IsOptional as IsOptionalNullable,
  IsString,
  ValidateIf,
  IsIn,
  ValidateNested,
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  IsNumber,
} from 'class-validator';

function IsOptional() {
  return applyDecorators(ValidateIf((_, value) => value !== undefined));
}

function IsStringOptional() {
  return applyDecorators(IsString(), IsOptional());
}

function IsStringOptionalNullable() {
  return applyDecorators(IsString(), IsOptionalNullable());
}

function IsStringOptionalNotEmpty() {
  return applyDecorators(IsStringOptional(), IsNotEmpty());
}

function IsStringOptionalNullableNotEmpty() {
  return applyDecorators(IsStringOptionalNullable(), IsNotEmpty());
}

function IsStringNotEmpty(validationOptions?: ValidationOptions) {
  return validationOptions
    ? applyDecorators(
        IsString(validationOptions),
        IsNotEmpty(validationOptions),
      )
    : applyDecorators(IsString(), IsNotEmpty());
}

function IsNumberNotEmpty(validationOptions?: ValidationOptions) {
  return validationOptions
    ? applyDecorators(IsNumber(), IsNotEmpty(validationOptions))
    : applyDecorators(IsNumber(), IsNotEmpty());
}

function IsNumberStringOptionalNotEmpty() {
  return applyDecorators(IsNumberString(), IsOptional(), IsNotEmpty());
}

function IsNumberOptionalNotEmpty() {
  return applyDecorators(IsNumberString(), IsOptional());
}

function IsNumberStringOptionalNullableNotEmpty() {
  return applyDecorators(IsNumberString(), IsOptionalNullable(), IsNotEmpty());
}

function IsDateStringOptional() {
  return applyDecorators(IsDateString(), IsOptional());
}

function IsDateStringOptionalNullable() {
  return applyDecorators(IsDateString(), IsOptionalNullable());
}

function IsBooleanOptional() {
  return applyDecorators(IsBoolean(), IsOptional());
}

function IsBooleanOptionalNullable() {
  return applyDecorators(IsBoolean(), IsOptionalNullable);
}

function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
          return typeof value === 'string' && regex.test(value);
        },
        defaultMessage() {
          return `${propertyName} must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.`;
        },
        // defaultMessage(args: ValidationArguments) {
        //   return `${args.property} must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.`;
        // },
      },
    });
  };
}

function MatchPassword(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'Match',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${propertyName} must match ${relatedPropertyName}`;
        },
      },
    });
  };
}

@ValidatorConstraint({ name: 'IsPasswordMatching', async: false })
export class IsPasswordMatchingConstraint
  implements ValidatorConstraintInterface
{
  validate(_: any, args: ValidationArguments): boolean {
    const object = args.object as any;
    return object.newPassword === object.confirmPassword;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Confirm password must match new password';
  }
}

/* --------------------------- Custom Conditional Validator --------------------------- */
function IsUndefinedIf(
  property: string,
  value: any,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isUndefinedIf',
      target: object.constructor,
      propertyName,
      constraints: [property, value],
      options: validationOptions,
      validator: {
        validate(_: any, args: ValidationArguments) {
          const [relatedPropertyName, relatedValue] = args.constraints;
          const relatedActualValue = (args.object as any)[relatedPropertyName];
          return (
            relatedActualValue !== relatedValue || args.value === undefined
          );
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName, relatedValue] = args.constraints;
          return `${args.property} must not be provided when ${relatedPropertyName} is ${relatedValue}`;
        },
      },
    });
  };
}

function IsRequiredIf(
  property: string,
  value: any,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isRequiredIf',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property, value],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedProp, relatedValue] = args.constraints;
          const relatedActualValue = (args.object as any)[relatedProp];
          if (relatedActualValue === relatedValue) {
            return value !== undefined && value !== null && value !== '';
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedProp, relatedValue] = args.constraints;
          return `${args.property} is required when ${relatedProp} is ${relatedValue}`;
        },
      },
    });
  };
}

function Match(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}

function NotMatch(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      // propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: NotMatchConstraint,
    });
  };
}

function IsRequiredIfParentFlagTrue(
  parentFlag: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isRequiredIfParentFlagTrue',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const parent = args.object as any;
          const condition = parent?.[parentFlag];
          return (
            !condition ||
            (value !== null && value !== undefined && value !== '')
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} is required because ${parentFlag} is true`;
        },
      },
    });
  };
}

function IsArabicOnly(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isArabicOnly',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const arabicRegex = /^[\u0600-\u06FF\s]+$/;
          return typeof value === 'string' && arabicRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must contain only Arabic letters`;
        },
      },
    });
  };
}

function IsArabicAndNumberOnly(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isArabicAndNumberOnly',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          // Arabic letters, Arabic digits, English digits, punctuation, and special characters
          const arabicNumSpecialRegex =
            /^[\u0600-\u06FF\u0660-\u06690-9\s.,;:?!@#$%^&*()_\-+=<>\/\\[\]{}"'|~`،؛؟\u061B\u061F\u060C\u00A0“”–—]+$/u;
          return typeof value === 'string' && arabicNumSpecialRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must contain only Arabic letters, numbers, punctuation, and special characters`;
        },
      },
    });
  };
}

@ValidatorConstraint({ name: 'NotMatch' })
export class NotMatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [propertyToCompare] = args.constraints;
    const relatedValue = (args.object as any)[propertyToCompare];
    return value !== relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    const [propertyToCompare] = args.constraints;
    return `${args.property} should not match ${propertyToCompare}`;
  }
}

@ValidatorConstraint({ name: 'Match' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value === relatedValue;
  }

  defaultMessage(args: ValidationArguments): string {
    const [relatedPropertyName] = args.constraints;
    return `${args.property} must match ${relatedPropertyName}`;
  }
}

export {
  ValidateNested,
  IsIn,
  IsOptionalNullable,
  IsOptional,
  IsStrongPassword,
  Match,
  NotMatch,
  IsRequiredIfParentFlagTrue,

  //String
  IsStringOptional,
  IsStringOptionalNullable,
  IsStringOptionalNotEmpty,
  IsStringOptionalNullableNotEmpty,
  IsStringNotEmpty,

  //NumberString
  IsNumberStringOptionalNotEmpty,
  IsNumberStringOptionalNullableNotEmpty,
  IsNumberOptionalNotEmpty,
  IsNumberNotEmpty,
  //DateString
  IsDateStringOptional,
  IsDateStringOptionalNullable,

  //Boolean
  IsBooleanOptional,
  IsBooleanOptionalNullable,
  IsUndefinedIf,
  IsRequiredIf,

  // Arabic Validations
  IsArabicOnly,
  IsArabicAndNumberOnly,
  MatchPassword,
};
