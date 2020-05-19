import {
  Injectable,
  InternalServerErrorException,
  Scope,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { REQUEST } from '@nestjs/core';

import { Model, Types } from 'mongoose';

import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

import { Course } from './model/course.model';
import { Subject } from '../+subjects/model/subject.model';
import { User } from '../+users/model/user.model';

import { PaginationModel, PaginationResult, UserRequest } from '../shared';

import { sluggify } from '../../utils';

@Injectable({ scope: Scope.REQUEST })
export class CoursesService {
  constructor(
    @InjectModel('Course') private courseModel: PaginationModel<Course>,
    @InjectModel('Subject') private subjectModel: Model<Subject>,
    @Inject(REQUEST) private request: UserRequest,
  ) {}

  async createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      const slug = sluggify(createCourseDto.title);
      const createdCourse = new this.courseModel({
        ...createCourseDto,
        subject: new Types.ObjectId(createCourseDto.subject),
        slug,
        // eslint-disable-next-line @typescript-eslint/camelcase
        slug_history: [slug],
      });
      const insertedCourse = await createdCourse.save();
      await this.subjectModel.findByIdAndUpdate(createCourseDto.subject, {
        $push: {
          courses: insertedCourse._id,
        },
        $set: {
          updatedAt: new Date().toISOString(),
        },
      });

      return insertedCourse;
    } catch (error) {
      throw new InternalServerErrorException('Error in saving course.');
    }
  }

  async getCourses(): Promise<PaginationResult<Course>> {
    try {
      const paginatedCourses = await this.courseModel.paginate(
        { isActive: true },
        { populate: ['subject', 'modules'] },
      );
      return {
        data: paginatedCourses.docs,
        total: paginatedCourses.total,
        skip: paginatedCourses.offset,
        limit: paginatedCourses.limit,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error in getting courses.');
    }
  }

  getCourseById(id: string): Promise<Course> {
    try {
      return this.courseModel
        .findById(id)
        .populate({
          path: 'subject',
          populate: { path: 'owner', select: '-password' },
        })
        .populate('modules')
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('Error in getting course.');
    }
  }

  async updateCourse(
    updateCourseDto: UpdateCourseDto,
    courseId: string,
  ): Promise<Course> {
    try {
      const currentUser = this.request.user;
      if (!(await this.isCurrentUserPermitted(currentUser, courseId))) {
        return null;
      }
      const slug = sluggify(updateCourseDto.title);
      return this.courseModel
        .findOneAndUpdate(
          {
            _id: new Types.ObjectId(courseId),
          },
          {
            ...updateCourseDto,
            slug,
            // eslint-disable-next-line @typescript-eslint/camelcase
            $push: { slug_history: slug },
            updatedAt: new Date().toISOString(),
          },
          { new: true },
        )
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('Error in updating course.');
    }
  }

  async deleteCourse(courseId: string): Promise<Course> {
    try {
      const currentUser = this.request.user;
      if (!(await this.isCurrentUserPermitted(currentUser, courseId))) {
        return null;
      }
      return this.courseModel
        .findByIdAndUpdate(
          courseId,
          {
            isActive: false,
          },
          { new: true },
        )
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('Error in deleting course.');
    }
  }

  private async isCurrentUserPermitted(
    currentUser: User,
    courseId: string,
  ): Promise<boolean> {
    try {
      const course = await this.courseModel
        .findById(courseId)
        .populate('subject')
        .exec();
      const jsonCourse = course.toJSON();
      if (
        jsonCourse?.subject?.owner.toString() !== currentUser?._id?.toString()
      ) {
        return false;
      }
      return true;
    } catch (error) {
      throw new InternalServerErrorException('Error in finding course.');
    }
  }
}
