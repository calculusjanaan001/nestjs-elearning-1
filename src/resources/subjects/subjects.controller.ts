import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  BadRequestException,
  UsePipes,
  ValidationPipe,
  Patch,
  Delete,
  NotFoundException,
} from '@nestjs/common';

import { isObjectIdValid } from '../../utils';

import { AuthGuard, Roles, RolesGuard } from '../core';
import { SubjectsService } from './subjects.service';

import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Controller('subjects')
@UseGuards(AuthGuard)
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @Roles('instructor')
  @UseGuards(RolesGuard)
  @UsePipes(ValidationPipe)
  createSubject(@Body() subjectBody: CreateSubjectDto) {
    return this.subjectsService.createSubject(subjectBody);
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
  async getSubjectById(@Param('id') subjectId: string) {
    if (!isObjectIdValid(subjectId)) {
      throw new BadRequestException('Invalid id.');
    }
    const subject = await this.subjectsService.getSubjectById(subjectId);
    if (!subject) {
      throw new NotFoundException('Subject not found.');
    }
    return subject;
  }

  @Patch(':id')
  @Roles('instructor')
  @UseGuards(RolesGuard)
  @UsePipes(ValidationPipe)
  async updateSubject(
    @Param('id') subjectId: string,
    @Body() subjectBody: UpdateSubjectDto,
  ) {
    if (!isObjectIdValid(subjectId)) {
      throw new BadRequestException('Invalid id.');
    }
    const updatedSubject = await this.subjectsService.updateSubject(
      subjectBody,
      subjectId,
    );
    if (!updatedSubject) {
      throw new BadRequestException('No subject updated.');
    }
    return updatedSubject;
  }

  @Delete(':id')
  @Roles('instructor')
  @UseGuards(RolesGuard)
  @UsePipes(ValidationPipe)
  async deleteSubject(@Param('id') subjectId: string) {
    if (!isObjectIdValid(subjectId)) {
      throw new BadRequestException('Invalid id.');
    }
    const updatedSubject = await this.subjectsService.deleteSubject(subjectId);
    if (!updatedSubject) {
      throw new BadRequestException('No subject deleted.');
    }
    return updatedSubject;
  }
}
