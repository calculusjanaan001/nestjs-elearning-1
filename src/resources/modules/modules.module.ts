import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleEntity } from './entity/module.entity';
import { ModulesController } from './modules.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleEntity])],
  controllers: [ModulesController],
  providers: [ModulesService],
})
export class ModulesModule {}
