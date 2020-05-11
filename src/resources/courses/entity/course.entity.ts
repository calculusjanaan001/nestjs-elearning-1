import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity('courses')
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

  @Column({ name: 'slugHistory' })
  slug_history: Array<string>;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;
}
