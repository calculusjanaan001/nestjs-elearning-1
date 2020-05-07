import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { CredentialsDto } from './dto/credentials.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  authLogin(credentials: CredentialsDto) {
    // const users = this.usersService.getAllUsers();
    // const user = users.find(user => user.email === credentials.email);
    // if (!user) {
    //   throw new UnauthorizedException('Invalid credentials.');
    // }
    // if (user.password !== credentials.password) {
    //   throw new UnauthorizedException('Invalid credentials.');
    // }
    // const token = this.jwtService.sign(JSON.stringify(user));
    // return token;
    return '';
  }
}
