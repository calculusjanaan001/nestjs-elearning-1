import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, getMongoRepository } from 'typeorm';
import { ObjectID } from 'mongodb';

import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import {
  SubscriptionEntity,
  SubscriptionStatus,
} from './entity/subscription.entity';
import { UserEntity } from '../users/entity/user.entity';
import { CourseEntity } from '../courses/entity/course.entity';
import { ModuleEntity } from '../modules/entity/module.entity';

@Injectable()
export class SubscriptionsService {
  private readonly mongoCoursesRepo;
  private readonly mongoModulesRepo;
  private readonly mongoSubsRepo;

  constructor(
    @InjectRepository(SubscriptionEntity)
    private subscriptionsRepo: Repository<SubscriptionEntity>,
  ) {
    this.mongoCoursesRepo = getMongoRepository(CourseEntity);
    this.mongoModulesRepo = getMongoRepository(ModuleEntity);
    this.mongoSubsRepo = getMongoRepository(SubscriptionEntity);
  }

  async subscribe(
    newSubscription: CreateSubscriptionDto,
    currentUser: UserEntity,
  ) {
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

  async getUserSubscriptions(currentUser: UserEntity) {
    try {
      const subscriptions = await this.subscriptionsRepo.find({
        where: { subscriber: currentUser._id.toString() },
      });
      const mappedSubscriptions = [];
      for (const subsDetails of subscriptions) {
        let populateSubscription = { ...subsDetails };
        const course = await this.populateCourse(subsDetails.course);
        if (subsDetails?.moduleInProgress) {
          const module = await this.populateModule(
            subsDetails?.moduleInProgress,
          );
          populateSubscription = {
            ...populateSubscription,
            moduleInProgress: module,
          };
        }
        if (subsDetails?.completedModules.length) {
          const modules = [];
          for (const modId of subsDetails.completedModules) {
            const module = await this.populateModule(modId);
            modules.push(module);
          }
          populateSubscription = {
            ...populateSubscription,
            completedModules: modules,
          };
        }
        mappedSubscriptions.push({ ...populateSubscription, course });
      }

      return mappedSubscriptions;
    } catch (error) {
      throw new InternalServerErrorException(
        "Error in getting user's subscriptions.",
      );
    }
  }

  async getUserSubscriptionById(
    currentUser: UserEntity,
    subscriptionId: string,
  ) {
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
      let populatedSubscription = { ...subscription };
      const course = await this.populateCourse(subscription.course);
      if (subscription?.moduleInProgress) {
        const module = await this.populateModule(subscription.moduleInProgress);
        populatedSubscription = {
          ...populatedSubscription,
          moduleInProgress: module,
        };
      }
      if (subscription?.completedModules.length) {
        const completedModules = await this.populateModules(
          subscription.completedModules,
        );
        populatedSubscription = { ...populatedSubscription, completedModules };
      }
      return { ...populatedSubscription, course };
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
      let populateUpdatedSubs = { ...updatedSubscription.value };
      const modules = await this.populateModules(
        updatedSubscription.completedModules,
      );
      if (populateUpdatedSubs?.moduleInProgress) {
        const moduleInProgress = await this.populateModule(
          populateUpdatedSubs.moduleInProgress,
        );
        populateUpdatedSubs = { ...populateUpdatedSubs, moduleInProgress };
      }

      return {
        ...populateUpdatedSubs,
        completedModules: modules,
        course,
      };
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
      console.log(error);
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
      return await this.mongoModulesRepo.find({ _id: { $in: objectIdList } });
    } catch (error) {
      throw new InternalServerErrorException('Error in getting modules.');
    }
  }
}
