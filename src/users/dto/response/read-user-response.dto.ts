import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IPublic } from 'src/common/utils/public.type';
import { USER_ROLES, USER_STATUS, UserRoles, UserStatus } from 'src/users/enums/user.enum';
import { UserReadModel } from 'src/users/models/user-read.model';

export class ReadUserResponseDto {
    static fromModel(model: UserReadModel): IPublic<ReadUserResponseDto> {
        return {
            id: model.id,
            firstName: model.firstName,
            lastName: model.lastName,
            fullName: model.fullName,
            companyName: model.companyName,
            email: model.email,
            phoneNumber: model.phoneNumber,
            callingCode: model.callingCode,
            countryCode: model.countryCode,
            eventsPerYear: model.eventsPerYear,
            website: model.website,
            referredBy: model.referredBy,
            isActive: model.isActive,
            isVerified: model.isVerified,
            isProfileCreated: model.isProfileCreated,
            roles: model.roles,
            status: model.status,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        };
    }

    @ApiProperty({ description: 'User unique identifier' })
    id: string;

    @ApiProperty({ description: 'User first name' })
    firstName: string;

    @ApiProperty({ description: 'User last name' })
    lastName: string;

    @ApiProperty({ description: 'User full name' })
    fullName: string;

    @ApiProperty({ description: 'Company name' })
    companyName: string;

    @ApiProperty({ description: 'User email address' })
    email: string;

    @ApiPropertyOptional({ description: 'User phone number', nullable: true })
    phoneNumber?: string | null;

    @ApiPropertyOptional({ description: 'Phone calling code', nullable: true })
    callingCode?: string | null;

    @ApiPropertyOptional({ description: 'Country code', nullable: true })
    countryCode?: string | null;

    @ApiProperty({ description: 'Number of events per year' })
    eventsPerYear: number;

    @ApiPropertyOptional({ description: 'User website URL', nullable: true })
    website?: string | null;

    @ApiPropertyOptional({ description: 'Referral source', nullable: true })
    referredBy?: string | null;

    @ApiProperty({ description: 'Whether user account is active' })
    isActive: boolean;

    @ApiProperty({ description: 'Whether user is verified' })
    isVerified: boolean;

    @ApiProperty({ description: 'Whether user profile is created' })
    isProfileCreated: boolean;

    @ApiProperty({
        isArray: true,
        enum: USER_ROLES,
        enumName: 'UserRoles',
        description: 'User roles',
    })
    roles: UserRoles[];

    @ApiProperty({
        enum: USER_STATUS,
        enumName: 'UserStatus',
        description: 'User account status',
    })
    status: UserStatus;

    @ApiProperty({ description: 'User creation timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'User last update timestamp' })
    updatedAt: Date;
}