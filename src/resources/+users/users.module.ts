import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchemaProvider } from './schema/schema.provider';

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([UserSchemaProvider])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [MongooseModule],
})
export class UsersModule {}
