import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';

import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

import { Course } from './model/course.model';
import { Subject } from '../subjects/model/subject.model';

import { sluggify } from '../../utils';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel('Course') private courseModel: Model<Course>,
    @InjectModel('Subject') private subjectModel: Model<Subject>,
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

  getCourses(): Promise<Course[]> {
    try {
      return this.courseModel
        .find({ isActive: true })
        .populate('subject')
        .populate('modules')
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('Error in getting courses.');
    }
  }

  getCourseById(id: string): Promise<Course> {
    try {
      return this.courseModel
        .findById(id)
        .populate('subject')
        .populate('modules')
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('Error in getting course.');
    }
  }

  updateCourse(
    updateCourseDto: UpdateCourseDto,
    courseId: string,
  ): Promise<Course> {
    try {
      const slug = sluggify(updateCourseDto.title);
      return this.courseModel
        .findByIdAndUpdate(
          courseId,
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

  deleteCourse(courseId: string): Promise<Course> {
    try {
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
}
