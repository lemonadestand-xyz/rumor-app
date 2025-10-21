import { Body, Controller } from "@nestjs/common";
import { CreateResourceCombinedDecorators } from "../../common/decorators/routes-decorators.decorator";
import { UserIdToken } from "../../common/decorators/user-id-token.decorator";
import { DecodedIdToken } from "../../common/interfaces/decoded-id-token.interface";
import { UserProfileCreateRequestDto } from "../dto/request/user-profile-create-request.dto";
import { UserProfileCreateModel } from "../models/user-profile-create.model";
import { UserProfileService } from "../services/user-profile.service";
import { UserProfileCreateResponseDto } from "../dto/response/user-profile-create-response.dto";

@Controller('user/profile')
export class UserProfileController {
    constructor(private readonly userProfileService: UserProfileService) { }

    @CreateResourceCombinedDecorators({
        additionalErrors: ['badRequest', 'conflict'],
        responseType: UserProfileCreateResponseDto,
    })
    public async createUserProfile(
        @UserIdToken() userIdToken: DecodedIdToken,
        @Body() dto: UserProfileCreateRequestDto,
    ): Promise<UserProfileCreateResponseDto> {
        const model = UserProfileCreateModel.fromDto(dto, userIdToken.uid);
        const userProfile = await this.userProfileService.create(model);
        return UserProfileCreateResponseDto.fromModel(userProfile);
    }
}