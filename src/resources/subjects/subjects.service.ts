import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { getMongoRepository } from 'typeorm';

import { SubjectEntity } from './entity/subject.entity';
import { UserEntity } from '../users/entity/user.entity';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(SubjectEntity)
    private subjectsRepo: Repository<SubjectEntity>,
  ) {}

  async addSubject(title: string, user: UserEntity) {
    try {
      const slug = title
        .toLowerCase()
        .split(' ')
        .join('-');
      const dateNow = new Date().toISOString();
      const addedSubject = await this.subjectsRepo.save({
        title,
        owner: user._id.toString(),
        isActive: true,
        slug,
        slugHistory: [slug],
        createdAt: dateNow,
        updatedAt: dateNow,
      });

      return addedSubject;
    } catch (error) {
      throw new InternalServerErrorException('Error in saving subject.');
    }
  }

  getSubjects() {
    try {
      return this.subjectsRepo.find();
    } catch (error) {
      throw new InternalServerErrorException('Error in getting subjects.');
    }
  }

  async getSubjectById(id: string) {
    const userMongoRepo = getMongoRepository(UserEntity);
    try {
      const subject = await this.subjectsRepo.findOne(id);
      const owner = await userMongoRepo.findOne(subject.owner, {
        select: ['_id', 'email', 'role', 'firstName', 'lastName'],
      });

      return { ...subject, owner };
    } catch (error) {
      throw new InternalServerErrorException('Error in getting subject.');
    }
  }
}
