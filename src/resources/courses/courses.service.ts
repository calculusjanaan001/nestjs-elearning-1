import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { getMongoRepository } from 'typeorm';

import { CourseEntity } from './entity/course.entity';
import { SubjectEntity } from '../subjects/entity/subject.entity';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(CourseEntity)
    private coursesRepo: Repository<CourseEntity>,
  ) {}

  async addCourse(newCourse: CreateCourseDto) {
    try {
      const slug = newCourse.title
        .toLowerCase()
        .split(' ')
        .join('-');
      const dateNow = new Date().toISOString();
      const addedCourse = await this.coursesRepo.save({
        ...newCourse,
        modules: [],
        slug,
        slugHistory: [slug],
        isActive: true,
        createdAt: dateNow,
        updatedAt: dateNow,
      });
      const subjectManagerRepo = getMongoRepository(SubjectEntity);
      const subject = await subjectManagerRepo.findOne(newCourse.subject);

      await subjectManagerRepo.save({
        ...subject,
        courses: subject.courses.concat(addedCourse._id.toString()),
        updatedAt: dateNow,
      });

      return addedCourse;
    } catch (error) {
      throw new InternalServerErrorException('Error in saving course.');
    }
  }

  getCourses() {
    return this.coursesRepo.find();
  }

  getCouseById(id: string) {
    return this.coursesRepo.findOne(id);
  }
}
