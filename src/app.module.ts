import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Connection } from 'typeorm';

import { UsersModule } from './resources/users/users.module';
import { AuthModule } from './resources/auth/auth.module';
import { SubjectsModule } from './resources/subjects/subjects.module';
import { CoursesModule } from './resources/courses/courses.module';

@Module({
  imports: [TypeOrmModule.forRoot(), AuthModule, UsersModule, SubjectsModule, CoursesModule],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
