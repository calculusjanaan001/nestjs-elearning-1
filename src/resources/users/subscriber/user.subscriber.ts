import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
} from 'typeorm';

import * as bcrypt from 'bcrypt';

import { UserEntity } from '../entity/user.entity';

@EventSubscriber()
export class UsersSubscriber implements EntitySubscriberInterface<UserEntity> {
  listenTo = () => UserEntity;

  async beforeInsert(event: InsertEvent<UserEntity>) {
    const rawPassword = event.entity.password;
    event.entity.password = await bcrypt.hash(rawPassword, 10);
  }
}
