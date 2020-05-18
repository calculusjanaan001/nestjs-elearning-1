import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './resources/users/users.module';
import { AuthModule } from './resources/auth/auth.module';
import { SubjectsModule } from './resources/subjects/subjects.module';
import { CoursesModule } from './resources/courses/courses.module';
import { ModulesModule } from './resources/modules/modules.module';
import { SubscriptionsModule } from './resources/subscriptions/subscriptions.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
      },
    ),
    AuthModule,
    UsersModule,
    SubjectsModule,
    CoursesModule,
    ModulesModule,
    SubscriptionsModule,
  ],
})
export class AppModule {}
