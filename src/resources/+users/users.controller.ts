import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  NotFoundException,
  UseGuards,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

import { RolesGuard, Roles, AuthGuard } from '../+core';

import { isObjectIdValid } from '../../utils/validator';

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
  @UseGuards(AuthGuard)
  async getUserById(@Param('id') id: string) {
    if (!isObjectIdValid(id)) {
      throw new BadRequestException('Invalid id.');
    }
    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  @Post()
  @UsePipes(ValidationPipe)
  registerUser(@Body() userBody: CreateUserDto) {
    return this.usersService.createUser(userBody);
  }
}
