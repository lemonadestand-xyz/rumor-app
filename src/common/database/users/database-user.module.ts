import { Module } from '@nestjs/common';
import { DatabaseConnectionModule } from '../database.module';
import { UsersRepository } from './repositories/user.repository';

@Module({
  imports: [DatabaseConnectionModule],
  providers: [UsersRepository],
  exports: [UsersRepository],
})
export class DatabaseUsersModule {}
