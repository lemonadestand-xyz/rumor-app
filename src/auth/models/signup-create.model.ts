import { SignUpRequestDto } from '../dto/request/signup-create-request.dto';

export class SignUpDataCreateModel {
  static fromDto(dto: SignUpRequestDto): SignUpDataCreateModel {
    return {
      firstName: dto.firstName,
      lastName: dto.lastName,
      companyName: dto.companyName,
      email: dto.email ?? null,
      phoneNumber: dto.phoneNumber,
      callingCode: dto.callingCode,
      countryCode: dto.countryCode,
      eventsPerYear: dto.eventsPerYear,
      website: dto.website ?? null,
      referredBy: dto.referredBy ?? null,
    } as SignUpDataCreateModel;
  }

  firstName: string;
  lastName: string;
  companyName: string;
  email: string | null;
  phoneNumber: string;
  callingCode: string;
  countryCode: string;
  eventsPerYear: number;
  website?: string | null;
  referredBy?: string | null;
}
