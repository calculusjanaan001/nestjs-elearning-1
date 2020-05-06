import { Controller, Get, Param, Post, Body } from '@nestjs/common';

import { CreateUserDto } from './create-user.dto';

@Controller('users')
export class UsersController {
  @Get()
  getAllUsers() {
    return 'All users';
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return 'User ' + id;
  }

  @Post()
  registerUser(@Body() createUserDto: CreateUserDto) {
    return 'Created ' + JSON.stringify(createUserDto);
  }
}
