import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Param,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { AuthGuard, RolesGuard } from '../../guards';
import { Roles } from '../../decorators/roles.decorator';

import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';

import { isObjectIdValid } from '../../utils/validator';

@Controller('courses')
@UseGuards(AuthGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @Roles('instructor')
  @UseGuards(RolesGuard)
  addCourse(@Body() courseBody: CreateCourseDto) {
    return this.coursesService.addCourse(courseBody);
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
}
