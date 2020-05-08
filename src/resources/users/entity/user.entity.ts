import { Entity, Column, ObjectIdColumn, Index } from 'typeorm';

@Entity('Users')
export class UserEntity {
  @ObjectIdColumn()
  id: number;

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
