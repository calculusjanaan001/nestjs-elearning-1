import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';

import { AuthGuard, RolesGuard } from '../../guards';
import { Roles } from '../../decorators/roles.decorator';
import { User } from '../../decorators/user.decorator';
import { SubjectsService } from './subjects.service';

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
  getSubjects() {
    return this.subjectsService.getSubjects();
  }

  @Get(':id')
  getSubjectById(@Param('id') subjectId: string) {
    return this.subjectsService.getSubjectById(subjectId);
  }
}
