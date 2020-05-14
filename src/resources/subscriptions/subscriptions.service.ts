import {
  Injectable,
  InternalServerErrorException,
  Scope,
  Inject,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, getMongoRepository } from 'typeorm';
import { ObjectID } from 'mongodb';
import { Request } from 'express';

import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

import {
  SubscriptionEntity,
  SubscriptionStatus,
} from './entity/subscription.entity';
import { CourseEntity } from '../courses/entity/course.entity';
import { ModuleEntity } from '../modules/entity/module.entity';

@Injectable({ scope: Scope.REQUEST })
export class SubscriptionsService {
  private readonly mongoCoursesRepo;
  private readonly mongoModulesRepo;
  private readonly mongoSubsRepo;

  constructor(
    @InjectRepository(SubscriptionEntity)
    private subscriptionsRepo: Repository<SubscriptionEntity>,
    @Inject(REQUEST) private request: Request,
  ) {
    this.mongoCoursesRepo = getMongoRepository(CourseEntity);
    this.mongoModulesRepo = getMongoRepository(ModuleEntity);
    this.mongoSubsRepo = getMongoRepository(SubscriptionEntity);
  }

  async subscribe(newSubscription: CreateSubscriptionDto) {
    const currentUser = (this.request as any).user;
    try {
      const dateNow = new Date().toISOString();
      const addedSubscription = await this.subscriptionsRepo.save({
        completedModules: [],
        moduleInProgress: null,
        status: SubscriptionStatus.PENDING,
        course: newSubscription.course,
        subscriber: currentUser._id.toString(),
        createdAt: dateNow,
        updatedAt: dateNow,
      });

      return addedSubscription;
    } catch (error) {
      throw new InternalServerErrorException('Error in saving subscription.');
    }
  }

  async getUserSubscriptions() {
    const currentUser = (this.request as any).user;
    try {
      const subscriptions = await this.subscriptionsRepo.find({
        where: { subscriber: currentUser._id.toString() },
      });
      const mappedSubscriptions = [];
      for (const subsDetails of subscriptions) {
        const mappedResults = await this.populateSubscription(subsDetails);
        mappedSubscriptions.push(mappedResults);
      }

      return mappedSubscriptions;
    } catch (error) {
      throw new InternalServerErrorException(
        "Error in getting user's subscriptions.",
      );
    }
  }

  async getUserSubscriptionById(subscriptionId: string) {
    const currentUser = (this.request as any).user;
    try {
      const subscription = await this.subscriptionsRepo.findOne({
        where: {
          subscriber: currentUser._id.toString(),
          _id: new ObjectID(subscriptionId),
        },
      });
      if (!subscription) {
        return null;
      }
      return this.populateSubscription(subscription);
    } catch (error) {
      throw new InternalServerErrorException(
        "Error in getting user's subscriptions.",
      );
    }
  }

  async updateSubscription(
    toUpdateSubscription: UpdateSubscriptionDto,
    subscriptionId: string,
  ) {
    try {
      const subscription = await this.subscriptionsRepo.findOne(subscriptionId);
      if (!subscription) {
        return null;
      }
      const course = await this.mongoCoursesRepo.findOne(subscription.course);
      const isCompleted =
        course.modules.length ===
        toUpdateSubscription?.completedModules?.length;
      const updatedSubscription = await this.mongoSubsRepo.findOneAndUpdate(
        { _id: new ObjectID(subscriptionId) },
        {
          $set: {
            ...toUpdateSubscription,
            status: isCompleted
              ? SubscriptionStatus.COMPLETE
              : SubscriptionStatus.PENDING,
            updatedAt: new Date().toISOString(),
          },
        },
        { returnOriginal: false },
      );
      if (!updatedSubscription?.value) {
        return null;
      }
      return this.populateSubscription(updatedSubscription?.value);
    } catch (error) {
      throw new InternalServerErrorException('Error in updating subscription.');
    }
  }

  async deleteSubscription(id: string) {
    try {
      const deletedSubscription = await this.mongoSubsRepo.findOneAndDelete({
        _id: new ObjectID(id),
      });

      return deletedSubscription?.value;
    } catch (error) {
      throw new InternalServerErrorException('Error in deleting subscription.');
    }
  }

  private async populateCourse(courseId: string) {
    try {
      const course = await this.mongoCoursesRepo.findOne(courseId);
      if (!course) {
        return null;
      }
      return course;
    } catch (error) {
      throw new InternalServerErrorException('Error in getting course.');
    }
  }

  private async populateModule(moduleId: string) {
    try {
      const module = await this.mongoModulesRepo.findOne(moduleId);
      if (!module) {
        return null;
      }
      return module;
    } catch (error) {
      throw new InternalServerErrorException('Error in getting module.');
    }
  }

  private async populateModules(moduleList: Array<string>) {
    const objectIdList = moduleList.map(modId => new ObjectID(modId));
    try {
      return await this.mongoModulesRepo.findByIds(objectIdList);
    } catch (error) {
      throw new InternalServerErrorException('Error in getting modules.');
    }
  }

  private async populateSubscription(subscription: SubscriptionEntity) {
    const promiseList = [];
    const course = this.populateCourse(subscription.course).then(result => ({
      course: result,
    }));
    promiseList.push(course);
    if (subscription?.moduleInProgress) {
      const module = this.populateModule(
        subscription?.moduleInProgress,
      ).then(result => ({ moduleInProgress: result }));
      promiseList.push(module);
    }
    if (subscription?.completedModules.length) {
      const modules = this.populateModules(
        subscription.completedModules,
      ).then(result => ({ completedModules: result }));
      promiseList.push(modules);
    }
    const results = await Promise.all(promiseList);
    return results.reduce(
      (acc, current) => {
        for (const key of Object.keys(current)) {
          return { ...acc, [key]: current[key] };
        }
      },
      { ...subscription },
    );
  }
}
