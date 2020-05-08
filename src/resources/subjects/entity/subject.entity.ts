import { Entity, Column, ObjectIdColumn } from 'typeorm';

import { UserEntity } from '../../users/entity/user.entity';

@Entity('Subjects')
export class SubjectEntity {
  @ObjectIdColumn()
  _id: number;

  @Column()
  title: string;

  @Column({ default: [] })
  courses: Array<string>;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  owner: UserEntity;

  @Column()
  slug: string;

  @Column()
  slug_history: Array<string>;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;
}
