import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity('Courses')
export class CourseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  modules: Array<string>;

  @Column()
  isActive: boolean;

  @Column()
  subject: string;

  @Column()
  slug: string;

  @Column()
  slug_history: Array<string>;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;
}
