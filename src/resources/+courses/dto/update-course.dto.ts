import { IsNotEmpty } from 'class-validator';

export class UpdateCourseDto {
  @IsNotEmpty()
  public title: string;
}
