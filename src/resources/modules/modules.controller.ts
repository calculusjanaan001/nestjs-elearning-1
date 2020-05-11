import { Controller, Body, Post, UseGuards } from '@nestjs/common';

import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';

import { Roles } from '../../decorators';
import { RolesGuard, AuthGuard } from '../../guards';

@Controller('modules')
@UseGuards(AuthGuard)
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  @Roles('instructor')
  @UseGuards(RolesGuard)
  addModule(@Body() moduleBody: CreateModuleDto) {
    return this.modulesService.addModule(moduleBody);
  }
}
