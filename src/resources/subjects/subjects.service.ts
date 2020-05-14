import {
  Injectable,
  InternalServerErrorException,
  Scope,
  Inject,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';

import { Request } from 'express';
import { Repository } from 'typeorm';
import { getMongoRepository } from 'typeorm';
import { ObjectID } from 'mongodb';

import { SubjectEntity } from './entity/subject.entity';
import { UserEntity } from '../users/entity/user.entity';
import { CourseEntity } from '../courses/entity/course.entity';

import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable({ scope: Scope.REQUEST })
export class SubjectsService {
  private readonly mongoUsersRepo;
  private readonly mongoCoursesRepo;
  private readonly mongoSubjectsRepo;

  constructor(
    @InjectRepository(SubjectEntity)
    private subjectsRepo: Repository<SubjectEntity>,
    @Inject(REQUEST) private request: Request,
  ) {
    this.mongoUsersRepo = getMongoRepository(UserEntity);
    this.mongoCoursesRepo = getMongoRepository(CourseEntity);
    this.mongoSubjectsRepo = getMongoRepository(SubjectEntity);
  }

  async addSubject(newSubject: CreateSubjectDto) {
    const user = (this.request as any).user;
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
        const ownerPromise = this.mongoUsersRepo.findOne(subjectDetails.owner, {
          select: ['_id', 'email', 'role', 'firstName', 'lastName'],
        });
        const coursesPromise = this.mongoCoursesRepo.findByIds(
          subjectDetails.courses,
        );
        const [owner, courses] = await Promise.all([
          ownerPromise,
          coursesPromise,
        ]);
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
      const coursesPromise = this.mongoCoursesRepo.findByIds(subject.courses);
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
      const updatedObject = await this.mongoSubjectsRepo.findOneAndUpdate(
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
      const updatedObject = await this.mongoSubjectsRepo.findOneAndUpdate(
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
