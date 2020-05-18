import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Param,
  BadRequestException,
  NotFoundException,
  UsePipes,
  ValidationPipe,
  Patch,
  Delete,
} from '@nestjs/common';

import { AuthGuard, Roles, RolesGuard } from '../core';
import { CoursesService } from './courses.service';

import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

import { isObjectIdValid } from '../../utils';

@Controller('courses')
@UseGuards(AuthGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @Roles('instructor')
  @UseGuards(RolesGuard)
  @UsePipes(ValidationPipe)
  addCourse(@Body() courseBody: CreateCourseDto) {
    return this.coursesService.createCourse(courseBody);
  }

  @Get()
  @Roles('instructor')
  @UseGuards(RolesGuard)
  getCourses() {
    return this.coursesService.getCourses();
  }

  @Get(':id')
  @Roles('instructor')
  @UseGuards(RolesGuard)
  async getCourseById(@Param('id') courseId: string) {
    if (!isObjectIdValid(courseId)) {
      throw new BadRequestException('Invalid id.');
    }
    const course = await this.coursesService.getCourseById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found.');
    }
    return course;
  }

  @Patch(':id')
  @Roles('instructor')
  @UseGuards(RolesGuard)
  @UsePipes(ValidationPipe)
  async updateCourse(
    @Body() courseBody: UpdateCourseDto,
    @Param('id') courseId: string,
  ) {
    if (!isObjectIdValid(courseId)) {
      throw new BadRequestException('Invalid id.');
    }
    const updatedCourse = await this.coursesService.updateCourse(
      courseBody,
      courseId,
    );
    if (!updatedCourse) {
      throw new BadRequestException('No course updated.');
    }
    return updatedCourse;
  }

  @Delete(':id')
  @Roles('instructor')
  @UseGuards(RolesGuard)
  async deleteCourse(@Param('id') courseId: string) {
    if (!isObjectIdValid(courseId)) {
      throw new BadRequestException('Invalid id.');
    }
    const updatedCourse = await this.coursesService.deleteCourse(courseId);
    if (!updatedCourse) {
      throw new BadRequestException('No course deleted.');
    }
    return updatedCourse;
  }
}
