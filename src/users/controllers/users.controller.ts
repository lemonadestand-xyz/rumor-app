import { Controller } from "@nestjs/common";
import { ReadResourceCombinedDecorators } from "../../common/decorators/routes-decorators.decorator";
import { UserIdToken } from "../../common/decorators/user-id-token.decorator";
import { DecodedIdToken } from "../../common/interfaces/decoded-id-token.interface";
import { UsersService } from "../services/users.service";
import { ReadUserResponseDto } from "../dto/response/read-user-response.dto";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @ReadResourceCombinedDecorators({
        path: 'me',
        additionalErrors: ['badRequest', 'conflict'],
        responseType: ReadUserResponseDto,
    })
    public async getUserById(
        @UserIdToken() userIdToken: DecodedIdToken,
    ): Promise<ReadUserResponseDto> {
        const user = await this.usersService.getUserById(userIdToken.uid);
        return ReadUserResponseDto.fromModel(user);
    }
}