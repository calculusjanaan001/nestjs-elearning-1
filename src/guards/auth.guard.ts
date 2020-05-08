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

    return this.validateToken(authHeader);
  }

  private validateToken(auth: string) {
    const [bearer, token] = auth.split(' ');

    if (bearer !== 'Bearer') {
      throw new UnauthorizedException('Invalid token.');
    }
    try {
      const decode = jwt.verify(token, 'hard!to-guess_secret');
      if (!decode) {
        return false;
      }
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token error.');
    }
  }
}
