import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Connection } from 'typeorm';

import { UsersModule } from './resources/users/users.module';
import { AuthModule } from './resources/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(), AuthModule, UsersModule],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
