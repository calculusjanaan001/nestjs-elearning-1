import { Entity, Column, ObjectIdColumn, Index } from 'typeorm';

@Entity('Users')
export class UserEntity {
  @ObjectIdColumn()
  _id: number;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: 'student' })
  role: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: new Date().toISOString() })
  updatedAt: string;

  @Column({ default: new Date().toISOString() })
  createdAt: string;
}
