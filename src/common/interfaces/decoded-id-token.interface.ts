import { UserRoles, UserStatus } from 'src/users/enums/user.enum';

export interface DecodedIdToken {
  uid: string;
  email: string;
  auth_time: number;
  iat: number;
  exp: number;
  sub: string | number;
  user: UserData;
  [key: string]: any;
}

export interface DecodedIdTokenForEmailVerification {
  uid: string;
  email: string;
  auth_time: number;
  iat: number;
  exp?: number;
  sub: string | number;
  user: UserDataForVerficationLink;
  [key: string]: any;
}

export interface JwtPayload {
  uid: string;
  sub: string | number;
  iat?: number;
  exp?: number;
  user?: UserData;
}

export interface UserData {
  id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  role?: UserRoles;
  status?: UserStatus;
  is_verified: boolean;
  verificationLinkGeneratedAt?: Date | string;
}

export interface UserDataForVerficationLink {
  id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  role?: UserRoles;
  status?: UserStatus;
  is_verified: boolean;
  verificationLinkUsed: boolean;
  verificationLinkGeneratedAt?: Date | string;
}
