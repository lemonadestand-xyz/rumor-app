import { UserProfileCreateRequestDto } from "../dto/request/user-profile-create-request.dto";

export class UserProfileCreateModel {
  static fromDto(
    dto: UserProfileCreateRequestDto,
    userId: string,
  ): UserProfileCreateModel {
    return {
      instagramLink: dto.instagramLink ?? null,
      tiktokLink: dto.tiktokLink ?? null,
      linkedinLink: dto.linkedinLink ?? null,
      youtubeLink: dto.youtubeLink ?? null,
      facebookLink: dto.facebookLink ?? null,
      xLink: dto.xLink ?? null,
      bio: dto.bio ?? null,
      photoId: dto.photoId ?? null,
      userId: userId,
    } as UserProfileCreateModel;
  }

  instagramLink: string | null;
  tiktokLink: string | null;
  linkedinLink: string | null;
  youtubeLink: string | null;
  facebookLink: string | null;
  xLink: string | null;
  bio: string | null;
  photoId: string | null;
  userId: string;
}