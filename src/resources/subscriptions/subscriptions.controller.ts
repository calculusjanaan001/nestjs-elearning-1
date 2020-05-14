import {
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Body,
  Get,
  Param,
  NotFoundException,
  Patch,
  Delete,
} from '@nestjs/common';

import { SubscriptionsService } from './subscriptions.service';
import { RolesGuard, AuthGuard } from '../../guards';
import { Roles, User } from '../../decorators';

import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { UserEntity } from '../users/entity/user.entity';

@UseGuards(AuthGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @Roles('student')
  @UseGuards(RolesGuard)
  @UsePipes(ValidationPipe)
  addSubscription(
    @User() user: UserEntity,
    @Body() subscriptionBody: CreateSubscriptionDto,
  ) {
    return this.subscriptionsService.subscribe(subscriptionBody, user);
  }

  @Get()
  @Roles('student')
  @UseGuards(RolesGuard)
  getSubscriptions(@User() user) {
    return this.subscriptionsService.getUserSubscriptions(user);
  }

  @Get(':id')
  @Roles('student')
  @UseGuards(RolesGuard)
  async getSubscriptionById(
    @Param('id') subscriptionId: string,
    @User() user: UserEntity,
  ) {
    const subscription = await this.subscriptionsService.getUserSubscriptionById(
      user,
      subscriptionId,
    );
    if (!subscription) {
      throw new NotFoundException('Subscription not found.');
    }
    return subscription;
  }

  @Patch(':id')
  @Roles('student')
  @UseGuards(RolesGuard)
  @UsePipes(ValidationPipe)
  async updateSubscription(
    @Body() subscriptionBody: UpdateSubscriptionDto,
    @Param('id') subscriptionId: string,
  ) {
    const subscription = await this.subscriptionsService.updateSubscription(
      subscriptionBody,
      subscriptionId,
    );

    if (!subscription) {
      throw new NotFoundException('No subscription updated.');
    }
    return subscription;
  }

  @Delete(':id')
  @Roles('student')
  @UseGuards(RolesGuard)
  async deleteSubscription(@Param('id') subscriptionId: string) {
    const subscription = await this.subscriptionsService.deleteSubscription(
      subscriptionId,
    );

    if (!subscription) {
      throw new NotFoundException('No subscription deleted.');
    }
    return subscription;
  }
}
