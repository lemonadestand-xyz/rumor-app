import { Module } from "@nestjs/common";
import { DatabaseUserProfileModule } from "../common/database/user-profile/database-user-profile.module";
import { UserProfileController } from "./controllers/user-profile.controller";
import { UserProfileService } from "./services/user-profile.service";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [
      DatabaseUserProfileModule,
      UsersModule,
    ],
    controllers: [UserProfileController],
    providers: [UserProfileService],
    exports: [UserProfileService],
  })
  export class UserProfileModule {}