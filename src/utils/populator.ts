import { Injectable } from '@nestjs/common';

import { getMongoRepository } from 'typeorm';
import { ObjectID } from 'mongodb';

import { UserEntity } from '../resources/users/entity/user.entity';
import { SubjectEntity } from '../resources/subjects/entity/subject.entity';
import { CourseEntity } from '../resources/courses/entity/course.entity';
import { ModuleEntity } from '../resources/modules/entity/module.entity';
import { SubscriptionEntity } from '../resources/subscriptions/entity/subscription.entity';

export enum EntityType {
  USER,
  SUBJECT,
  COURSE,
  MODULE,
  SUBSCRIPTION,
}

@Injectable()
export class PopulateService {
  async populateOne(id: string, type = EntityType.SUBJECT) {
    const entityRepo = this.mongoRepositoryFactory(type);

    return await entityRepo.findOne({ _id: new ObjectID(id) });
  }

  async populateMany(ids: Array<string>, type = EntityType.SUBJECT) {
    const entityRepo = this.mongoRepositoryFactory(type);
    const objectIdList: Array<ObjectID> = ids.map(modId => new ObjectID(modId));

    return await entityRepo.findByIds(objectIdList);
  }

  private mongoRepositoryFactory(type: EntityType) {
    switch (type) {
      case EntityType.USER:
        return getMongoRepository(UserEntity);
      case EntityType.SUBJECT:
        return getMongoRepository(SubjectEntity);
      case EntityType.COURSE:
        return getMongoRepository(CourseEntity);
      case EntityType.MODULE:
        return getMongoRepository(ModuleEntity);
      case EntityType.SUBSCRIPTION:
        return getMongoRepository(SubscriptionEntity);
      default:
        return getMongoRepository(SubjectEntity);
    }
  }
}
