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
} from '@nestjs/common';

import { AuthGuard, RolesGuard } from '../../guards';
import { Roles, User } from '../../decorators';

import { SubjectsService } from './subjects.service';
import { isObjectIdValid } from '../../utils/validator';

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
  createSubject(@User() user, @Body() subjectBody: CreateSubjectDto) {
    return this.subjectsService.addSubject(subjectBody, user);
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
