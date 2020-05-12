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
} from '@nestjs/common';

import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';

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
  getModules() {
    return this.modulesService.getModules();
  }

  @Get(':id')
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
}
