import {
  Module,
} from '@nestjs/common';

import { DatabaseUsersModule } from '../common/database/users/database-user.module';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';


@Module({
  imports: [
    DatabaseUsersModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
