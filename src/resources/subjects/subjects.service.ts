import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

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
      const subjectOwner = new UserEntity();
      subjectOwner._id = user._id;
      subjectOwner.email = user.email;
      subjectOwner.firstName = user.firstName;
      subjectOwner.lastName = user.lastName;
      subjectOwner.role = user.role;
      const addedSubject = await this.subjectsRepo.save({
        title,
        owner: subjectOwner,
        isActive: true,
        slug,
        slugHistory: [slug],
        createdAt: dateNow,
        updatedAt: dateNow,
      });

      return addedSubject._id;
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
    try {
      return this.subjectsRepo.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException('Error in getting subject.');
    }
  }
}
