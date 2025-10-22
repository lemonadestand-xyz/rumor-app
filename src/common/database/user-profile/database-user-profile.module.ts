import { Module } from "@nestjs/common";
import { DatabaseConnectionModule } from "../database.module";
import { UserProfileRepository } from "./repositories/user-profile.repository";

@Module({
    imports: [DatabaseConnectionModule],
    providers: [UserProfileRepository],
    exports: [UserProfileRepository],
  })
  export class DatabaseUserProfileModule {}