import {
  Injectable,
  InternalServerErrorException,
  Scope,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { REQUEST } from '@nestjs/core';

import { Types } from 'mongoose';

import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

import { Subscription, SubscriptionStatus } from './model/subscription.model';
import { Course } from '../+courses/model/course.model';

import { UserRequest, PaginationModel, PaginationResult } from '../shared';

@Injectable({ scope: Scope.REQUEST })
export class SubscriptionsService {
  constructor(
    @InjectModel('Subscription')
    private subscriptionModel: PaginationModel<Subscription>,
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

  async getUserSubscriptions(): Promise<PaginationResult<Subscription>> {
    const currentUser = this.request.user;
    try {
      const paginatedSubscription = await this.subscriptionModel.paginate(
        { subscriber: currentUser._id },
        {
          populate: [
            {
              path: 'course',
              populate: [
                {
                  path: 'subject',
                  populate: { path: 'owner', select: '-password' },
                },
                { path: 'modules', select: 'title' },
              ],
            },
            { path: 'moduleInProgress', populate: { path: 'course' } },
            { path: 'completedModules' },
          ],
        },
      );

      return {
        data: paginatedSubscription.docs,
        total: paginatedSubscription.total,
        skip: paginatedSubscription.offset,
        limit: paginatedSubscription.limit,
      };
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
