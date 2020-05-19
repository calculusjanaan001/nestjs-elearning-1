import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { User } from '../../+users/model/user.model';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        return false;
      }

      const user = await this.validateToken(authHeader);
      if (!user) {
        return false;
      }
      const userDetail = await this.userModel.findById(user.userId);
      if (!userDetail) {
        return false;
      }
      request.user = userDetail;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token.');
    }
  }

  private async validateToken(auth: string) {
    try {
      return await this.jwtService.verifyAsync(auth);
    } catch (error) {
      throw new UnauthorizedException('Invalid token.');
    }
  }
}
