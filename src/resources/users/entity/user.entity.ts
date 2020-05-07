import { Entity, Column, ObjectIdColumn, Unique } from 'typeorm';

@Entity()
@Unique('uniqueEmail', ['email'])
export class UserEntity {
  @ObjectIdColumn()
  id: number;

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
}
