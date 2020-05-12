import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity('subscriptions')
export class SubscriptionEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  completedModules: Array<string>;

  @Column()
  moduleInProgress: string;

  @Column()
  status: string;

  @Column()
  course: string;

  @Column()
  subscriber: string;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;
}