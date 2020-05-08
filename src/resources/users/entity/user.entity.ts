import { Entity, Column, ObjectIdColumn, Index, ObjectID } from 'typeorm';

@Entity('Users')
export class UserEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  updatedAt: string;

  @Column()
  createdAt: string;
}
