import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity('modules')
export class ModuleEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  title: string;

  @Column()
  text: string;

  @Column()
  isActive: boolean;

  @Column()
  course: string;

  @Column()
  slug: string;

  @Column({ name: 'slugHistory' })
  slug_history: Array<string>;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;
}
