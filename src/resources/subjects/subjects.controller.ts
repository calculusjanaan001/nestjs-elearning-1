import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';

import { SubjectsService } from './subjects.service';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('subjects')
@UseGuards(AuthGuard)
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  createSubject(@Body('title') titleBody) {
    return this.subjectsService.addSubject(titleBody);
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
