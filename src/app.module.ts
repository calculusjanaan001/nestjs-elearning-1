import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth/auth.controller';
import { UsersController } from './controllers/users/users.controller';
import { CoursesController } from './controllers/courses/courses.controller';
import { ModulesController } from './controllers/modules/modules.controller';
import { SubjectsController } from './controllers/subjects/subjects.controller';
import { SubscriptionsController } from './controllers/subscriptions/subscriptions.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    AuthController,
    UsersController,
    CoursesController,
    ModulesController,
    SubjectsController,
    SubscriptionsController,
  ],
  providers: [AppService],
})
export class AppModule {}
