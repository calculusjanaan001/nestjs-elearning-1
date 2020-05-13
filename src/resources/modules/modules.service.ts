import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, getMongoRepository } from 'typeorm';
import { ObjectID } from 'mongodb';

import { ModuleEntity } from './entity/module.entity';
import { CourseEntity } from '../courses/entity/course.entity';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class ModulesService {
  private readonly mongoCoursesRepo;
  private readonly mongoModulesRepo;

  constructor(
    @InjectRepository(ModuleEntity)
    private modulesRepo: Repository<ModuleEntity>,
  ) {
    this.mongoCoursesRepo = getMongoRepository(CourseEntity);
    this.mongoModulesRepo = getMongoRepository(ModuleEntity);
  }

  async addModule(newModule: CreateModuleDto) {
    try {
      const slug = newModule.title
        .toLowerCase()
        .split(' ')
        .join('-');
      const dateNow = new Date().toISOString();
      const addedModule = await this.modulesRepo.save({
        ...newModule,
        slug,
        // eslint-disable-next-line @typescript-eslint/camelcase
        slug_history: [slug],
        isActive: true,
        createdAt: dateNow,
        updatedAt: dateNow,
      });

      await this.mongoCoursesRepo.findOneAndUpdate(
        {
          _id: new ObjectID(newModule.course),
        },
        {
          $push: { modules: addedModule._id },
          $set: { updatedAt: dateNow },
        },
      );

      return addedModule;
    } catch (error) {
      throw new InternalServerErrorException('Error in saving module');
    }
  }

  async getModules() {
    try {
      const modules = await this.modulesRepo.find({
        where: { isActive: true },
      });
      const mappedModules = await Promise.all(
        modules.map(async mod => {
          const courseDetails = await this.mongoCoursesRepo.findOne(mod.course);
          return { ...mod, course: courseDetails };
        }),
      );

      return mappedModules;
    } catch (error) {
      throw new InternalServerErrorException('Error in getting modules.');
    }
  }

  async getModuleById(id: string) {
    try {
      const mod = await this.modulesRepo.findOne(id, {
        where: { isActive: true },
      });
      if (!mod) {
        return null;
      }
      const courseDetails = await this.mongoCoursesRepo.findOne(mod.course);

      return { ...mod, course: courseDetails };
    } catch (error) {
      throw new InternalServerErrorException('Error in getting module.');
    }
  }

  async updateModule(toUpdateModule: UpdateModuleDto, moduleId: string) {
    try {
      const updatedObject = await this.mongoModulesRepo.findOneAndUpdate(
        { _id: new ObjectID(moduleId) },
        {
          $set: {
            title: toUpdateModule?.title,
            text: toUpdateModule?.text || '',
          },
        },
        { returnOriginal: false },
      );

      return updatedObject?.value;
    } catch (error) {
      throw new InternalServerErrorException('Error in updating module.');
    }
  }

  async deleteModule(moduleId: string) {
    try {
      const updatedObject = await this.mongoModulesRepo.findOneAndUpdate(
        { _id: new ObjectID(moduleId) },
        {
          $set: {
            isActive: false,
          },
        },
        { returnOriginal: false },
      );

      return updatedObject?.value;
    } catch (error) {
      throw new InternalServerErrorException('Error in deleting module.');
    }
  }
}
