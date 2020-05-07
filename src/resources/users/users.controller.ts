import { Controller, Get, Param, Post, Body } from '@nestjs/common';

import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Post()
  registerUser(@Body() userBody: UserDto) {
    return this.usersService.addUser(userBody);
  }
}
