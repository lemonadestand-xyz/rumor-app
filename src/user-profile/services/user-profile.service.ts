import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UserProfileRepository } from "../../common/database/user-profile/repositories/user-profile.repository";
import { UserProfileCreateModel } from "../models/user-profile-create.model";
import { UsersService } from "../../users/services/users.service";

@Injectable()
export class UserProfileService {
  constructor(
    private readonly userProfileRepository: UserProfileRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(model: UserProfileCreateModel): Promise<{ id: string; message: string }>{
    try {
        const user = await this.usersService.getUserById(model.userId);
        const userProfile = await this.userProfileRepository.create(model);
        await this.usersService.update(user.id, { isProfileCreated: true });
        return userProfile;
    } catch (error) {
        if (error instanceof NotFoundException) {
            throw error;
        }
        throw new InternalServerErrorException('Failed to create user profile', {
            cause: new Error(`Failed to create user profile: ${error?.message}`),
        });
    }
  }
}
