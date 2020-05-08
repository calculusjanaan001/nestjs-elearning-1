import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CredentialsDto } from './dto/credentials.dto';
import { UserEntity } from '../users/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private usersRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async authLogin(credentials: CredentialsDto) {
    try {
      const user = await this.usersRepo.findOne({
        email: credentials.email,
        password: credentials.password,
      });
      if (!user) {
        return null;
      }

      const token = this.jwtService.sign(JSON.stringify(user));
      return token;
    } catch (error) {
      throw new InternalServerErrorException('Error in finding user.');
    }
  }
}
