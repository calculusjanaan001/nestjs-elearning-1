import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return false;
    }

    const user = this.validateToken(authHeader);
    if (!user) {
      return false;
    }

    request.user = user;
    return true;
  }

  private validateToken(auth: string) {
    const [bearer, token] = auth.split(' ');

    if (bearer !== 'Bearer') {
      throw new UnauthorizedException('Invalid token.');
    }
    try {
      const decoded = jwt.verify(token, 'hard!to-guess_secret');
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Token error.');
    }
  }
}
