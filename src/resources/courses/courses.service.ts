import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { getMongoRepository } from 'typeorm';
import { ObjectID } from 'mongodb';

import { CourseEntity } from './entity/course.entity';
import { ModuleEntity } from '../modules/entity/module.entity';
import { SubjectEntity } from '../subjects/entity/subject.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  private readonly mongoModulesRepo;
  private readonly mongoSubjectsRepo;
  private readonly mongoCoursesRepo;

  constructor(
    @InjectRepository(CourseEntity)
    private coursesRepo: Repository<CourseEntity>,
  ) {
    this.mongoModulesRepo = getMongoRepository(ModuleEntity);
    this.mongoSubjectsRepo = getMongoRepository(SubjectEntity);
    this.mongoCoursesRepo = getMongoRepository(CourseEntity);
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

      await this.mongoSubjectsRepo.findOneAndUpdate(
        { _id: new ObjectID(newCourse.subject) },
        {
          $push: { courses: addedCourse._id },
          $set: { updatedAt: dateNow },
        },
      );

      return addedCourse;
    } catch (error) {
      throw new InternalServerErrorException('Error in saving course.');
    }
  }

  async getCourses() {
    try {
      const courses = await this.coursesRepo.find({
        where: { isActive: true },
      });
      const mappedCourses = [];
      for (const courseDetails of courses) {
        const modules = [];
        const subject = await this.mongoSubjectsRepo.findOne(
          courseDetails.subject,
        );
        for (const modId of courseDetails.modules) {
          const moduleDetails = await this.mongoModulesRepo.findOne(modId);
          modules.push(moduleDetails);
        }
        mappedCourses.push({ ...courseDetails, modules, subject });
      }

      return mappedCourses;
    } catch (error) {
      throw new InternalServerErrorException('Error in getting courses.');
    }
  }

  async getCourseById(id: string) {
    try {
      const course = await this.coursesRepo.findOne(id, {
        where: { isActive: true },
      });
      if (!course) {
        return null;
      }
      const subject = await this.mongoSubjectsRepo.findOne(course.subject);
      const modules = await Promise.all(
        course.modules.map(async modId => {
          return await this.mongoModulesRepo.findOne(modId);
        }),
      );

      return { ...course, modules, subject };
    } catch (error) {
      throw new InternalServerErrorException('Error in getting course.');
    }
  }

  async updateCourse(toUpdateCourse: UpdateCourseDto, courseId: string) {
    try {
      const updatedObject = await this.mongoCoursesRepo.findOneAndUpdate(
        { _id: new ObjectID(courseId) },
        { $set: { title: toUpdateCourse.title } },
        { returnOriginal: false },
      );

      return updatedObject?.value;
    } catch (error) {
      throw new InternalServerErrorException('Error in updating course.');
    }
  }

  async deleteCourse(courseId: string) {
    try {
      const updatedObject = await this.mongoCoursesRepo.findOneAndUpdate(
        { _id: new ObjectID(courseId) },
        { $set: { isActive: false } },
        { returnOriginal: false },
      );

      return updatedObject?.value;
    } catch (error) {
      throw new InternalServerErrorException('Error in deleting course.');
    }
  }
}
