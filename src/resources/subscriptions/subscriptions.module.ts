import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionEntity } from './entity/subscription.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionSchemaProvider } from './schema/schema.provider';
import { ModulesModule } from '../modules/modules.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionEntity]),
    ModulesModule,
    MongooseModule.forFeatureAsync([SubscriptionSchemaProvider]),
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
})
export class SubscriptionsModule {}
