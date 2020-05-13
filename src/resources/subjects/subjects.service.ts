import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { getMongoRepository } from 'typeorm';
import { ObjectID } from 'mongodb';

import { SubjectEntity } from './entity/subject.entity';
import { UserEntity } from '../users/entity/user.entity';
import { CourseEntity } from '../courses/entity/course.entity';

import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

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

  async addSubject(newSubject: CreateSubjectDto, user: UserEntity) {
    try {
      const slug = newSubject.title
        .toLowerCase()
        .split(' ')
        .join('-');
      const dateNow = new Date().toISOString();
      const addedSubject = await this.subjectsRepo.save({
        title: newSubject.title,
        courses: [],
        owner: user._id.toString(),
        isActive: true,
        slug,
        // eslint-disable-next-line @typescript-eslint/camelcase
        slug_history: [slug],
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
      const subjects = await this.subjectsRepo.find({
        where: { isActive: true },
      });
      const mappedSubjects = [];
      for (const subjectDetails of subjects) {
        const courses = [];
        const owner = await this.mongoUsersRepo.findOne(subjectDetails.owner, {
          select: ['_id', 'email', 'role', 'firstName', 'lastName'],
        });
        for (const courseId of subjectDetails.courses) {
          const coursesDetails = await this.mongoCoursesRepo.findOne(courseId);
          courses.push(coursesDetails);
        }
        mappedSubjects.push({ ...subjectDetails, courses, owner });
      }
      return mappedSubjects;
    } catch (error) {
      throw new InternalServerErrorException('Error in getting subjects.');
    }
  }

  async getSubjectById(id: string) {
    try {
      const subject = await this.subjectsRepo.findOne(id);
      if (!subject) {
        return null;
      }
      const ownerPromise = this.mongoUsersRepo.findOne(subject.owner, {
        select: ['_id', 'email', 'role', 'firstName', 'lastName'],
      });
      const coursesPromise = Promise.all(
        subject.courses.map(async courseId => {
          return this.mongoCoursesRepo.findOne(courseId);
        }),
      );
      const [owner, courses] = await Promise.all([
        ownerPromise,
        coursesPromise,
      ]);

      return { ...subject, owner, courses };
    } catch (error) {
      throw new InternalServerErrorException('Error in getting subject.');
    }
  }

  async updateSubject(toUpdateSubject: UpdateSubjectDto, subjectId: string) {
    try {
      const mongoSubjectRepo = getMongoRepository(SubjectEntity);

      const updatedObject = await mongoSubjectRepo.findOneAndUpdate(
        { _id: new ObjectID(subjectId) },
        { $set: { title: toUpdateSubject.title } },
        { returnOriginal: false },
      );

      return updatedObject?.value;
    } catch (error) {
      throw new InternalServerErrorException('Error in updating subject.');
    }
  }

  async deleteSubject(id: string) {
    try {
      const mongoSubjectRepo = getMongoRepository(SubjectEntity);

      const updatedObject = await mongoSubjectRepo.findOneAndUpdate(
        { _id: new ObjectID(id) },
        { $set: { isActive: false } },
        { returnOriginal: false },
      );

      return updatedObject?.value;
    } catch (error) {
      throw new InternalServerErrorException('Error in deleting subject.');
    }
  }
}
