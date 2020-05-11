import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

import { Roles } from '../../decorators';
import { RolesGuard, AuthGuard } from '../../guards';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @Get(':id')
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  @Post()
  registerUser(@Body() userBody: CreateUserDto) {
    return this.usersService.addUser(userBody);
  }
}
