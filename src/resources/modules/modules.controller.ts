import {
  Controller,
  Body,
  Post,
  UseGuards,
  Get,
  Param,
  NotFoundException,
  BadRequestException,
  UsePipes,
  ValidationPipe,
  Patch,
  Delete,
} from '@nestjs/common';

import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

import { Roles } from '../../decorators';
import { RolesGuard, AuthGuard } from '../../guards';

import { isObjectIdValid } from '../../utils/validator';

@Controller('modules')
@UseGuards(AuthGuard)
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  @Roles('instructor')
  @UseGuards(RolesGuard)
  @UsePipes(ValidationPipe)
  addModule(@Body() moduleBody: CreateModuleDto) {
    return this.modulesService.addModule(moduleBody);
  }

  @Get()
  @Roles('instructor')
  @UseGuards(RolesGuard)
  getModules() {
    return this.modulesService.getModules();
  }

  @Get(':id')
  @Roles('instructor')
  @UseGuards(RolesGuard)
  async getModuleById(@Param('id') moduleId: string) {
    if (!isObjectIdValid(moduleId)) {
      throw new BadRequestException('Invalid id.');
    }
    const mod = await this.modulesService.getModuleById(moduleId);
    if (!mod) {
      throw new NotFoundException('Module not found.');
    }
    return mod;
  }

  @Patch(':id')
  @Roles('instructor')
  @UseGuards(RolesGuard)
  @UsePipes(ValidationPipe)
  async updateModule(
    @Body() moduleBody: UpdateModuleDto,
    @Param('id') moduleId: string,
  ) {
    if (!isObjectIdValid(moduleId)) {
      throw new BadRequestException('Invalid id.');
    }
    const mod = await this.modulesService.updateModule(moduleBody, moduleId);
    if (!mod) {
      throw new NotFoundException('No module updated.');
    }
    return mod;
  }

  @Delete(':id')
  @Roles('instructor')
  @UseGuards(RolesGuard)
  async deleteModule(@Param('id') moduleId: string) {
    if (!isObjectIdValid(moduleId)) {
      throw new BadRequestException('Invalid id.');
    }
    const mod = await this.modulesService.deleteModule(moduleId);
    if (!mod) {
      throw new NotFoundException('No module deleted.');
    }
    return mod;
  }
}
