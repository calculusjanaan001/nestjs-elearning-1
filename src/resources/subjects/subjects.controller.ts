import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';

import { AuthGuard, RolesGuard } from '../../guards';
import { Roles, User } from '../../decorators';

import { SubjectsService } from './subjects.service';
import { isObjectIdValid } from 'src/utils/validator';

@Controller('subjects')
@UseGuards(AuthGuard)
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @Roles('instructor')
  @UseGuards(RolesGuard)
  createSubject(@User() user, @Body('title') titleBody) {
    return this.subjectsService.addSubject(titleBody, user);
  }

  @Get()
  @Roles('instructor')
  @UseGuards(RolesGuard)
  getSubjects() {
    return this.subjectsService.getSubjects();
  }

  @Get(':id')
  @Roles('instructor')
  @UseGuards(RolesGuard)
  getSubjectById(@Param('id') subjectId: string) {
    if (!isObjectIdValid(subjectId)) {
      throw new BadRequestException('Invalid id.');
    }
    return this.subjectsService.getSubjectById(subjectId);
  }
}
