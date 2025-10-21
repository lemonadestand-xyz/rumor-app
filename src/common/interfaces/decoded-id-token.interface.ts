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

export interface DecodedIdTokenForResetPassword {
  uid: string;
  email: string;
  auth_time: number;
  iat: number;
  exp?: number;
  sub: string | number;
  user: UserDataForResetPasswordLink;
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
  isVerified: boolean;
  isActive: boolean;
  verificationLinkGeneratedAt?: Date | string;
}

export interface UserDataForVerficationLink {
  id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  role?: UserRoles;
  status?: UserStatus;
  isVerified: boolean;
  verificationLinkUsed: boolean;
  verificationLinkGeneratedAt?: Date | string;
}

export interface UserDataForResetPasswordLink {
  id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  role?: UserRoles;
  status?: UserStatus;
  isVerified: boolean;
  verificationLinkUsed: boolean;
  verificationLinkGeneratedAt?: Date | string;
  resetPasswordLinkGeneratedAt?: Date | string,
  resetPasswordLinkUsed: boolean,
}
