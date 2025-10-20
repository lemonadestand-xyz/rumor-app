import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { DatabaseUsersModule } from '../common/database/users/database-user.module';
import { JwtTokenModule } from '../common/jwtToken/jwtToken.module';
import { EmailModule } from '../emails/emails.module';

@Module({
  imports: [DatabaseUsersModule, JwtTokenModule, EmailModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
