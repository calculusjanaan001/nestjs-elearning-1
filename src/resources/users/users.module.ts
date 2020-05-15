import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from './entity/user.entity';
import { UserSchemaProvider } from './schema/schema.provider';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    MongooseModule.forFeatureAsync([UserSchemaProvider]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule, MongooseModule],
})
export class UsersModule {}
