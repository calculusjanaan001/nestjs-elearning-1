import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { ModuleSchemaProvider } from './schema/schema.provider';

import { CoursesModule } from '../+courses/courses.module';

@Module({
  imports: [
    CoursesModule,
    MongooseModule.forFeatureAsync([ModuleSchemaProvider]),
  ],
  controllers: [ModulesController],
  providers: [ModulesService],
})
export class ModulesModule {}
