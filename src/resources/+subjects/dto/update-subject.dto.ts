import { IsNotEmpty } from 'class-validator';

export class UpdateSubjectDto {
  @IsNotEmpty()
  public title: string;
}
