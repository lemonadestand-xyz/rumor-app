import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { IsStringNotEmpty, IsStringOptional } from 'src/common/decorators/combined-validations.decorator';

export class UserProfileCreateRequestDto {
  @ApiProperty({ example: 'https://instagram.com/username' })
  @IsStringNotEmpty()
  @Matches(
    /^(https?:\/\/)?(www\.)?(instagram\.com|instagr\.am)\/[\w\.\-]+\/?$/i,
    {
      message: 'instagramLink must be a valid Instagram URL',
    },
  )
  instagramLink?: string;

  @ApiProperty({ example: 'https://tiktok.com/@username' })
  @IsStringNotEmpty()
  @Matches(/^(https?:\/\/)?(www\.)?tiktok\.com\/@[\w\.\-]+\/?$/i, {
    message: 'tiktokLink must be a valid TikTok URL',
  })
  tiktokLink?: string;

  @ApiProperty({ example: 'https://linkedin.com/in/username' })
  @IsStringNotEmpty()
  @Matches(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w\-]+\/?$/i, {
    message: 'linkedinLink must be a valid LinkedIn URL',
  })
  linkedinLink?: string;

  @ApiProperty({
    example: 'https://youtube.com/@username or https://youtube.com/c/channel',
  })
  @IsStringNotEmpty()
  @Matches(
    /^(https?:\/\/)?(www\.)?youtube\.com\/(c\/|channel\/|@)[\w\-]+\/?$/i,
    {
      message: 'youtubeLink must be a valid YouTube URL',
    },
  )
  youtubeLink?: string;

  @ApiProperty({ example: 'https://facebook.com/username' })
  @IsStringNotEmpty()
  @Matches(/^(https?:\/\/)?(www\.)?facebook\.com\/[\w\.\-]+\/?$/i, {
    message: 'facebookLink must be a valid Facebook URL',
  })
  facebookLink?: string;

  @ApiProperty({ example: 'https://x.com/username' })
  @IsStringNotEmpty()
  @Matches(/^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\/[\w]+\/?$/i, {
    message: 'xLink must be a valid X (Twitter) URL',
  })
  xLink?: string;

  @ApiProperty({
    example: 'Event host and organizer passionate about creating experiences',
    description: 'User biography (max 500 characters)',
  })
  @IsStringNotEmpty()
  @Matches(/^.{0,500}$/s, {
    message: 'bio must not exceed 500 characters',
  })
  bio: string;

  @ApiPropertyOptional({ example: 'photo-uuid-123' })
  @IsStringOptional()
  photoId?: string;
}