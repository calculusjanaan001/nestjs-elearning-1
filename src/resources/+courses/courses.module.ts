import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CourseSchemaProvider } from './schema/schema.provider';

import { SubjectsModule } from '../+subjects/subjects.module';

@Module({
  imports: [
    SubjectsModule,
    MongooseModule.forFeatureAsync([CourseSchemaProvider]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [MongooseModule],
})
export class CoursesModule {}
