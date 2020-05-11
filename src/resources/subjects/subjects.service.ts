import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { getMongoRepository } from 'typeorm';

import { SubjectEntity } from './entity/subject.entity';
import { UserEntity } from '../users/entity/user.entity';
import { CourseEntity } from '../courses/entity/course.entity';

@Injectable()
export class SubjectsService {
  private readonly mongoUsersRepo;
  private readonly mongoCoursesRepo;

  constructor(
    @InjectRepository(SubjectEntity)
    private subjectsRepo: Repository<SubjectEntity>,
  ) {
    this.mongoUsersRepo = getMongoRepository(UserEntity);
    this.mongoCoursesRepo = getMongoRepository(CourseEntity);
  }

  async addSubject(title: string, user: UserEntity) {
    try {
      const slug = title
        .toLowerCase()
        .split(' ')
        .join('-');
      const dateNow = new Date().toISOString();
      const addedSubject = await this.subjectsRepo.save({
        title,
        courses: [],
        owner: user._id.toString(),
        isActive: true,
        slug,
        slugHistory: [slug],
        createdAt: dateNow,
        updatedAt: dateNow,
      });

      return addedSubject;
    } catch (error) {
      throw new InternalServerErrorException('Error in saving subject.');
    }
  }

  async getSubjects() {
    try {
      const subjects = await this.subjectsRepo.find();
      const mappedSubjects = [];
      for (const subjectDetails of subjects) {
        const courses = [];
        for (const courseId of subjectDetails.courses) {
          const coursesDetails = await this.mongoCoursesRepo.findOne(courseId);
          courses.push(coursesDetails);
        }
        mappedSubjects.push({ ...subjectDetails, courses });
      }
      return await Promise.all(
        mappedSubjects.map(async subject => {
          const owner = await this.mongoUsersRepo.findOne(subject.owner, {
            select: ['_id', 'email', 'role', 'firstName', 'lastName'],
          });
          return { ...subject, owner };
        }),
      );
    } catch (error) {
      throw new InternalServerErrorException('Error in getting subjects.');
    }
  }

  async getSubjectById(id: string) {
    try {
      const subject = await this.subjectsRepo.findOne(id);
      const owner = await this.mongoUsersRepo.findOne(subject.owner, {
        select: ['_id', 'email', 'role', 'firstName', 'lastName'],
      });
      const courses = await Promise.all(
        subject.courses.map(async courseId => {
          return await this.mongoCoursesRepo.findOne(courseId);
        }),
      );

      return { ...subject, owner, courses };
    } catch (error) {
      throw new InternalServerErrorException('Error in getting subject.');
    }
  }
}
