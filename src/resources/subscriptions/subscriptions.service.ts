import {
  Injectable,
  InternalServerErrorException,
  Scope,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { REQUEST } from '@nestjs/core';

import { Request } from 'express';
import { Model, Types } from 'mongoose';

import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

import { Subscription, SubscriptionStatus } from './model/subscription.model';
import { User } from '../users/model/user.model';
import { Course } from '../courses/model/course.model';

interface UserRequest extends Request {
  user: User;
}

@Injectable({ scope: Scope.REQUEST })
export class SubscriptionsService {
  constructor(
    @InjectModel('Subscription') private subscriptionModel: Model<Subscription>,
    @Inject(REQUEST) private request: UserRequest,
  ) {}

  async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    const currentUser = this.request.user;
    try {
      const createdSubscription = new this.subscriptionModel({
        course: new Types.ObjectId(createSubscriptionDto.course),
        subscriber: currentUser._id,
      });
      return await createdSubscription.save();
    } catch (error) {
      throw new InternalServerErrorException('Error in saving subscription.');
    }
  }

  getUserSubscriptions(): Promise<Subscription[]> {
    const currentUser = this.request.user;
    try {
      return this.subscriptionModel
        .find({ subscriber: currentUser._id })
        .populate('course')
        .populate('moduleInProgress')
        .populate('completedModules')
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(
        "Error in getting user's subscriptions.",
      );
    }
  }

  getUserSubscriptionById(subscriptionId: string): Promise<Subscription> {
    const currentUser = this.request.user;
    try {
      return this.subscriptionModel
        .findOne({
          _id: subscriptionId,
          subscriber: currentUser._id,
        })
        .populate('course')
        .populate('moduleInProgress')
        .populate('completedModules')
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(
        "Error in getting user's subscription.",
      );
    }
  }

  async updateSubscription(
    updateSubscriptionDto: UpdateSubscriptionDto,
    subscriptionId: string,
  ): Promise<Subscription> {
    const currentUser = this.request.user;
    try {
      const subscription = await this.subscriptionModel
        .findOne({
          _id: subscriptionId,
          subscriber: currentUser._id,
        })
        .populate('course')
        .exec();
      if (!subscription) {
        return null;
      }
      const populatedSubscription = subscription.toJSON();
      const course = populatedSubscription.course as Course;
      const status =
        course.modules.length ===
        updateSubscriptionDto?.completedModules?.length
          ? SubscriptionStatus.COMPLETE
          : SubscriptionStatus.PENDING;
      const mergedModule = updateSubscriptionDto?.completedModules || [];
      const mappedModulesId = mergedModule.map(id => new Types.ObjectId(id));
      return await this.subscriptionModel
        .findByIdAndUpdate(
          subscriptionId,
          {
            completedModules: mappedModulesId.length
              ? mappedModulesId
              : subscription.completedModules,
            moduleInProgress: updateSubscriptionDto?.moduleInProgress
              ? new Types.ObjectId(updateSubscriptionDto?.moduleInProgress)
              : null,
            status,
            updatedAt: new Date().toISOString(),
          },
          { new: true },
        )
        .populate('course')
        .populate('completedModules')
        .populate('moduleInProgress')
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('Error in updating subscription.');
    }
  }

  deleteSubscription(id: string): Promise<Subscription> {
    try {
      return this.subscriptionModel.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new InternalServerErrorException('Error in deleting subscription.');
    }
  }
}
