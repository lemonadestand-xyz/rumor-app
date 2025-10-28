import { SignInRequestDto } from '../dto/request/signin-create-request.dto';

export class SignInDataCreateModel {
  static fromDto(dto: SignInRequestDto): SignInDataCreateModel {
    return {
      email: dto.email,
      password: dto.password,
    } as SignInDataCreateModel;
  }

  email: string;
  password: string;
}
