import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { SubjectEntity } from './entity/subject.entity';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(SubjectEntity)
    private subjectsRepo: Repository<SubjectEntity>,
  ) {}

  async addSubject(title: string) {
    const slug = title
      .toLowerCase()
      .split(' ')
      .join('-');
    const dateNow = new Date().toISOString();
    const addedSubject = await this.subjectsRepo.save({
      title,
      slug,
      slugHistory: [slug],
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    return addedSubject._id;
  }

  getSubjects() {
    return this.subjectsRepo.find();
  }

  async getSubjectById(id: string) {
    return this.subjectsRepo.findOne(id);
  }
}
