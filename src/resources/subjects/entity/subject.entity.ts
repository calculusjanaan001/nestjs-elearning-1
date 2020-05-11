import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity('subjects')
export class SubjectEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  title: string;

  @Column()
  courses: Array<string>;

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
