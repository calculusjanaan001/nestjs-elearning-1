import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, getMongoRepository } from 'typeorm';

import { ModuleEntity } from './entity/module.entity';
import { CreateModuleDto } from './dto/create-module.dto';
import { CourseEntity } from '../courses/entity/course.entity';

@Injectable()
export class ModulesService {
  private readonly mongoCoursesRepo;

  constructor(
    @InjectRepository(ModuleEntity)
    private modulesRepo: Repository<ModuleEntity>,
  ) {
    this.mongoCoursesRepo = getMongoRepository(CourseEntity);
  }

  async addModule(newModule: CreateModuleDto) {
    try {
      const slug = newModule.title
        .toLowerCase()
        .split(' ')
        .join('-');
      const dateNow = new Date().toISOString();
      const course = await this.mongoCoursesRepo.findOne(newModule.course);
      const addedModule = await this.modulesRepo.save({
        ...newModule,
        slug,
        slugHistory: [slug],
        isActive: true,
        createdAt: dateNow,
        updatedAt: dateNow,
      });

      await this.mongoCoursesRepo.save({
        ...course,
        modules: course.modules.concat(addedModule._id),
      });

      return addedModule;
    } catch (error) {
      throw new InternalServerErrorException('Error in saving module');
    }
  }
}
