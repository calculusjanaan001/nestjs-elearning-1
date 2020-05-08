import { Injectable } from '@nestjs/common';
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
    const dateNow = new Date().toISOString();
    const addedCourse = await this.coursesRepo.save({
      title: newCourse.title,
      subject: newCourse.subject,
      createdAt: dateNow,
      updatedAt: dateNow,
    });
    const subjectManagerRepo = getMongoRepository(SubjectEntity);

    await subjectManagerRepo.findOneAndUpdate(
      { _id: newCourse.subject },
      { $push: { 'list.$.courses': addedCourse }, updatedAt: dateNow },
    );

    return addedCourse;
  }
}
