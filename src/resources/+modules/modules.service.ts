import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';

import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

import { Course } from '../+courses/model/course.model';
import { Module } from './model/module.model';

import { PaginationModel, PaginationResult } from '../shared';

import { sluggify } from '../../utils';

@Injectable()
export class ModulesService {
  constructor(
    @InjectModel('Module') private moduleModel: PaginationModel<Module>,
    @InjectModel('Course') private courseModel: Model<Course>,
  ) {}

  async createModule(createModuleDto: CreateModuleDto): Promise<Module> {
    try {
      const slug = sluggify(createModuleDto.title);
      const createdModule = new this.moduleModel({
        ...createModuleDto,
        course: new Types.ObjectId(createModuleDto.course),
        slug,
        // eslint-disable-next-line @typescript-eslint/camelcase
        slug_history: [slug],
      });

      const insertedModule = await createdModule.save();
      await this.courseModel.findByIdAndUpdate(createModuleDto.course, {
        $push: { modules: insertedModule._id },
        updatedAt: new Date().toISOString(),
      });

      return insertedModule;
    } catch (error) {
      throw new InternalServerErrorException('Error in saving module');
    }
  }

  async getModules(): Promise<PaginationResult<Module>> {
    try {
      const paginatedModules = await this.moduleModel.paginate(
        { isActive: true },
        { populate: 'course' },
      );
      return {
        data: paginatedModules.docs,
        total: paginatedModules.limit,
        skip: paginatedModules.offset,
        limit: paginatedModules.limit,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error in getting modules.');
    }
  }

  getModuleById(id: string): Promise<Module> {
    try {
      return this.moduleModel
        .findById(id)
        .populate('course')
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('Error in getting module.');
    }
  }

  updateModule(updateModuleDto: UpdateModuleDto, moduleId: string) {
    try {
      const slug = sluggify(updateModuleDto.title);
      return this.moduleModel
        .findByIdAndUpdate(
          moduleId,
          {
            ...updateModuleDto,
            slug,
            // eslint-disable-next-line @typescript-eslint/camelcase
            $push: { slug_history: slug },
            updatedAt: new Date().toISOString(),
          },
          { new: true },
        )
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('Error in updating module.');
    }
  }

  deleteModule(moduleId: string): Promise<Module> {
    try {
      return this.moduleModel
        .findByIdAndUpdate(
          moduleId,
          {
            isActive: false,
          },
          { new: true },
        )
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('Error in deleting module.');
    }
  }
}
