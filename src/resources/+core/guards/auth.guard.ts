import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return false;
    }

    const user = await this.validateToken(authHeader);
    if (!user) {
      return false;
    }

    request.user = user;
    return true;
  }

  private async validateToken(auth: string) {
    try {
      return await this.jwtService.verifyAsync(auth);
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid token.');
    }
  }
}
