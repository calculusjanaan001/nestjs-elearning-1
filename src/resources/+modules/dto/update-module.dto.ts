import { IsNotEmpty } from 'class-validator';

export class UpdateModuleDto {
  @IsNotEmpty()
  public title: string;
  public text: string;
}
