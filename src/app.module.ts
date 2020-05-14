import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './resources/users/users.module';
import { AuthModule } from './resources/auth/auth.module';
import { SubjectsModule } from './resources/subjects/subjects.module';
import { CoursesModule } from './resources/courses/courses.module';
import { ModulesModule } from './resources/modules/modules.module';
import { SubscriptionsModule } from './resources/subscriptions/subscriptions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost/elearningv2'),
    AuthModule,
    UsersModule,
    SubjectsModule,
    CoursesModule,
    ModulesModule,
    SubscriptionsModule,
  ],
})
export class AppModule {}
