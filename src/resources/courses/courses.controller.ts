import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Param,
  BadRequestException,
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
  getCourseById(@Param('id') courseId) {
    if (!isObjectIdValid) {
      throw new BadRequestException('Invalid id.');
    }
    return this.coursesService.getCouseById(courseId);
  }
}
