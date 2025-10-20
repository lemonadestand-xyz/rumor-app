import { NestMiddleware, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersRepository } from '../database/users/repositories/user.repository';
import { JWTTokenService } from '../jwtToken/jwtToken.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly jwtTokenService: JWTTokenService,
  ) {}

  async use(req: Request | any, res: Response, next: () => void) {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        req.user = null;
        return next();
      }

      const userIdToken = authHeader.replace('Bearer ', '');

      req.decodedIdToken =
        await this.jwtTokenService.verifyAccessToken(userIdToken);

      if (!req.decodedIdToken?.uid) {
        console.warn('No UID found in decoded token');
        req.user = null;
        return next();
      }

      req.user = await this.userRepository.getById(req.decodedIdToken.uid);
      if (!req.user)
        console.warn('No user found for UID:', req.decodedIdToken.uid);
    } catch (err) {
      console.error('AuthMiddleware error:', err.message);
      req.user = null;
    }

    next();
  }
}
