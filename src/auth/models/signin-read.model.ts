import { UserRoles } from "../../users/enums/user.enum";

export class SignInReadModel {
  static fromObject(data: {
    accessToken: string;
    refreshToken: string;
    isProfileCreated: boolean;
    userId: string;
    roles: UserRoles[];
    message: string;
  }): SignInReadModel {
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      isProfileCreated: data.isProfileCreated,
      userId: data.userId,
      roles: data.roles,
      message: data.message,
    } as SignInReadModel;
  }

  accessToken: string;
  refreshToken: string;
  userId: string;
  isProfileCreated: boolean;
  roles: UserRoles[];
  message: string;
}
