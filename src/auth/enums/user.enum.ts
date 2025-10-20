type ObjectValues<T> = T[keyof T];

export const USER_ROLES = {
  ADMIN: 'admin',
  SUPER_ADMIN: 'superAdmin',
  HOST: 'host',
  CO_HOST: 'coHost',
  COLABORATOR: 'colaborator',
} as const;

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BANNED: 'banned',
} as const;

export type UserRoles = ObjectValues<typeof USER_ROLES>;
export type UserStatus = ObjectValues<typeof USER_STATUS>;
