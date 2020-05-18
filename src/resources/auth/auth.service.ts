import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { CredentialsDto } from './dto/credentials.dto';
import { User } from '../users/model/user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async authLogin(credentials: CredentialsDto) {
    try {
      const user = await this.userModel.findOne({
        email: credentials.email,
      });
      if (!user) {
        return null;
      }
      const compareResult = await user.comparePassword(credentials.password);
      if (!compareResult) {
        return null;
      }

      delete user.password;
      const token = await this.jwtService.signAsync(JSON.stringify(user));
      return token;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error in finding user.');
    }
  }
}
