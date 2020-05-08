import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('authentication')
  async authenticate(@Body() credentials: CredentialsDto) {
    const accessToken = await this.authService.authLogin(credentials);
    if (!accessToken) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    return { accessToken };
  }
}
