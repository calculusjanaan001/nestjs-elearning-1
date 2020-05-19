import {
  Injectable,
  InternalServerErrorException,
  Scope,
  Inject,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';

import { Types } from 'mongoose';

import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

import { Subject } from './model/subject.model';
import { UserRequest, PaginationModel, PaginationResult } from '../shared';

import { sluggify } from '../../utils';

@Injectable({ scope: Scope.REQUEST })
export class SubjectsService {
  constructor(
    @InjectModel('Subject') private subjectModel: PaginationModel<Subject>,
    @Inject(REQUEST) private request: UserRequest,
  ) {}

  async createSubject(createSubjectDto: CreateSubjectDto) {
    const currentUser = this.request.user;
    try {
      const slug = sluggify(createSubjectDto.title);
      const createdSubject = new this.subjectModel({
        ...createSubjectDto,
        owner: new Types.ObjectId(currentUser._id),
        slug,
        // eslint-disable-next-line @typescript-eslint/camelcase
        slug_history: [slug],
      });

      return await createdSubject.save();
    } catch (error) {
      throw new InternalServerErrorException('Error in saving subject.');
    }
  }

  async getSubjects(): Promise<PaginationResult<Subject>> {
    try {
      const paginatedSubjects = await this.subjectModel.paginate(
        { isActive: true },
        {
          populate: [
            { path: 'owner', select: '-password' },
            { path: 'courses' },
          ],
        },
      );
      return {
        data: paginatedSubjects.docs,
        total: paginatedSubjects.total,
        skip: paginatedSubjects.offset,
        limit: paginatedSubjects.limit,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error in getting subjects.');
    }
  }

  getSubjectById(id: string): Promise<Subject> {
    try {
      return this.subjectModel
        .findById(id)
        .populate('owner', '-password')
        .populate('courses')
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('Error in getting subject.');
    }
  }

  updateSubject(
    updateSubjectDto: UpdateSubjectDto,
    subjectId: string,
  ): Promise<Subject> {
    try {
      const currentUser = this.request.user;
      const slug = sluggify(updateSubjectDto.title);
      return this.subjectModel
        .findOneAndUpdate(
          {
            _id: new Types.ObjectId(subjectId),
            owner: currentUser._id,
          },
          {
            ...updateSubjectDto,
            slug,
            // eslint-disable-next-line @typescript-eslint/camelcase
            $push: { slug_history: slug },
            updatedAt: new Date().toISOString(),
          },
          { new: true },
        )
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('Error in updating subject.');
    }
  }

  deleteSubject(subjectId: string): Promise<Subject> {
    try {
      const currentUser = this.request.user;
      return this.subjectModel
        .findOneAndUpdate(
          {
            _id: new Types.ObjectId(subjectId),
            owner: currentUser._id,
          },
          {
            isActive: false,
          },
          { new: true },
        )
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('Error in deleting subject.');
    }
  }
}
