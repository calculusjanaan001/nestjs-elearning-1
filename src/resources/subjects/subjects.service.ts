import {
  Injectable,
  InternalServerErrorException,
  Scope,
  Inject,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';

import { ObjectID } from 'mongodb';
import { Model } from 'mongoose';
import { Request } from 'express';

import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

import { Subject } from './model/subject.model';
import { User } from '../users/model/user.model';

interface UserRequest extends Request {
  user: User;
}

@Injectable({ scope: Scope.REQUEST })
export class SubjectsService {
  constructor(
    @InjectModel('Subject') private subjectModel: Model<Subject>,
    @Inject(REQUEST) private request: UserRequest,
  ) {}

  async createSubject(createSubjectDto: CreateSubjectDto) {
    const currentUser = this.request.user;
    try {
      const slug = createSubjectDto.title
        .toLowerCase()
        .split(' ')
        .join('-');
      const createdSubject = new this.subjectModel({
        ...createSubjectDto,
        owner: new ObjectID(currentUser._id),
        slug,
        // eslint-disable-next-line @typescript-eslint/camelcase
        slug_history: [slug],
      });

      return await createdSubject.save();
    } catch (error) {
      throw new InternalServerErrorException('Error in saving subject.');
    }
  }

  getSubjects(): Promise<Subject[]> {
    try {
      return this.subjectModel
        .find({ isActive: true })
        .populate('owner', '-password')
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('Error in getting subjects.');
    }
  }

  getSubjectById(id: string): Promise<Subject> {
    try {
      return this.subjectModel
        .findById(id)
        .populate('owner', '-password')
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
      return this.subjectModel
        .findByIdAndUpdate(
          subjectId,
          {
            ...updateSubjectDto,
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
      return this.subjectModel
        .findByIdAndUpdate(
          subjectId,
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
