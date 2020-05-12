import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { getMongoRepository } from 'typeorm';

import { CourseEntity } from './entity/course.entity';
import { ModuleEntity } from '../modules/entity/module.entity';
import { SubjectEntity } from '../subjects/entity/subject.entity';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
  private readonly mongoModulesRepo;

  constructor(
    @InjectRepository(CourseEntity)
    private coursesRepo: Repository<CourseEntity>,
  ) {
    this.mongoModulesRepo = getMongoRepository(ModuleEntity);
  }

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
        // eslint-disable-next-line @typescript-eslint/camelcase
        slug_history: [slug],
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

  async getCourses() {
    try {
      const courses = await this.coursesRepo.find();
      const mappedCourses = [];
      for (const courseDetails of courses) {
        const modules = [];
        for (const modId of courseDetails.modules) {
          const moduleDetails = await this.mongoModulesRepo.findOne(modId);
          modules.push(moduleDetails);
        }
        mappedCourses.push({ ...courseDetails, modules });
      }

      return mappedCourses;
    } catch (error) {
      throw new InternalServerErrorException('Error in getting courses.');
    }
  }

  async getCourseById(id: string) {
    try {
      const course = await this.coursesRepo.findOne(id);
      if (!course) {
        return null;
      }
      const modules = await Promise.all(
        course.modules.map(async modId => {
          return await this.mongoModulesRepo.findOne(modId);
        }),
      );

      return { ...course, modules };
    } catch (error) {
      throw new InternalServerErrorException('Error in getting course.');
    }
  }
}
