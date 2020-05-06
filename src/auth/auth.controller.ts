import { Controller, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('authentication')
  authenticate(@Body() credentials: CredentialsDto) {
    return this.authService.authLogin(credentials);
  }
}
