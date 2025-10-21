import { UserEntity } from 'src/common/database/users/entities/user.entity';
import { UserRoles, UserStatus } from '../enums/user.enum';

export class UserReadModel {
  static fromEntity(data: UserEntity): UserReadModel {
    const model = new UserReadModel();
    model.id = data.id;
    model.firstName = data.firstName;
    model.lastName = data.lastName;
    model.fullName = `${data.firstName} ${data.lastName}`.trim();
    model.companyName = data.companyName;
    model.email = data.email;
    model.phoneNumber = data.phoneNumber ?? null;
    model.callingCode = data.callingCode ?? null;
    model.countryCode = data.countryCode ?? null;
    model.eventsPerYear = data.eventsPerYear;
    model.website = data.website ?? null;
    model.referredBy = data.referredBy ?? null;
    model.isActive = data.isActive;
    model.isVerified = data.isVerified;
    model.isProfileCreated = data.isProfileCreated;
    model.roles = data.roles;
    model.status = data.status;
    model.createdAt = new Date(data.createdAt);
    model.updatedAt = new Date(data.updatedAt);

    return model;
  }

  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  companyName: string;
  email: string;
  phoneNumber?: string | null;
  callingCode?: string | null;
  countryCode?: string | null;
  eventsPerYear: number;
  website?: string | null;
  referredBy?: string | null;
  isActive: boolean;
  isVerified: boolean;
  isProfileCreated: boolean;
  roles: UserRoles[];
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}