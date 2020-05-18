import { IsNotEmpty } from 'class-validator';

export class CreateModuleDto {
  @IsNotEmpty()
  public title: string;
  public text: string;
  @IsNotEmpty()
  public course: string;
}
