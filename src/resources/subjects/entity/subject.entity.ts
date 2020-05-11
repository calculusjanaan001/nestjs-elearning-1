import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

import { CourseEntity } from '../../courses/entity/course.entity';

@Entity('Subjects')
export class SubjectEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  title: string;

  @Column()
  courses: Array<string | CourseEntity>;

  @Column()
  isActive: boolean;

  @Column()
  owner: string;

  @Column()
  slug: string;

  @Column()
  slug_history: Array<string>;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;
}
