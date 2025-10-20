import { SetMetadata } from '@nestjs/common';
// import { UserRoles } from 'src/users/enums/users.enum';

export enum UserRoles {
  ADMIN = 'admin',
  SUPER_ADMIN = 'superAdmin',
  HOST = 'host',
  CO_HOST = 'coHost',
  COLABORATOR = 'colaborator',
}

export const Roles = (...role: UserRoles[]) => SetMetadata('roles', role);
