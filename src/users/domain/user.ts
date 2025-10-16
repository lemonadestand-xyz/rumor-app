import { Exclude, Expose } from 'class-transformer';
import { FileType } from '../../files/domain/file';
import { Role } from '../../roles/domain/role';
import { Status } from '../../statuses/domain/status';
import { ApiProperty } from '@nestjs/swagger';
import databaseConfig from '../../database/config/database.config';
import { DatabaseConfig } from '../../database/config/database-config.type';

// <database-block>
const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number;
// </database-block>

export class User {
  @ApiProperty({
    type: idType,
  })
  id: number | string;

  @ApiProperty({
    type: String,
    example: 'john.doe@example.com',
  })
  @Expose({ groups: ['me', 'admin'] })
  email: string | null;

  @ApiProperty({
    type: String,
    example: '+1234567890',
  })
  @Expose({ groups: ['me', 'admin'] })
  phoneNumber?: string | null;

  @ApiProperty({
    type: String,
    example: 'johndoe',
  })
  username?: string | null;

  @Exclude({ toPlainOnly: true })
  password?: string;

  @Exclude({ toPlainOnly: true })
  temporaryPassword?: string;

  @Exclude({ toPlainOnly: true })
  temporaryPasswordToken?: string;

  @ApiProperty({
    type: String,
    example: 'email',
  })
  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @ApiProperty({
    type: String,
    example: '1234567890',
  })
  @Expose({ groups: ['me', 'admin'] })
  socialId?: string | null;

  @ApiProperty({
    type: String,
    example: 'John',
  })
  firstName: string | null;

  @ApiProperty({
    type: String,
    example: 'Doe',
  })
  lastName: string | null;

  @ApiProperty({
    type: Date,
    example: '1990-01-01',
  })
  dateOfBirth?: Date | null;

  @ApiProperty({
    type: String,
    example: 'male',
  })
  gender?: string | null;

  @ApiProperty({
    type: () => FileType,
  })
  photo?: FileType | null;

  @ApiProperty({
    type: () => Role,
  })
  role?: Role | null;

  @ApiProperty({
    type: () => Status,
  })
  status?: Status;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  isActive?: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  isDeactivated?: boolean;

  @ApiProperty({
    type: Date,
  })
  deactivatedAt?: Date | null;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  isFirstTimeLogin?: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  instagramValidated?: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  communityGuidelinesAgreed?: boolean;

  @ApiProperty({
    type: Date,
  })
  communityGuidelinesAgreedAt?: Date | null;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  hostCommunityGuidelinesAgreed?: boolean;

  @ApiProperty({
    type: Date,
  })
  hostCommunityGuidelinesAgreedAt?: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
