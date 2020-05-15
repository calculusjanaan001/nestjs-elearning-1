import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { SubjectSchemaProvider } from './schema/schema.provider';

@Module({
  imports: [MongooseModule.forFeatureAsync([SubjectSchemaProvider])],
  controllers: [SubjectsController],
  providers: [SubjectsService],
  exports: [MongooseModule],
})
export class SubjectsModule {}
