import { IsNotEmpty } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  public title: string;
  @IsNotEmpty()
  public subject: string;
}
