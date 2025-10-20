export class SignInReadModel {
  static fromObject(data: {
    accessToken: string;
    refreshToken: string;
    userId: string;
    message: string;
  }): SignInReadModel {
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      userId: data.userId,
      message: data.message,
    } as SignInReadModel;
  }

  accessToken: string;
  refreshToken: string;
  userId: string;
  message: string;
}
