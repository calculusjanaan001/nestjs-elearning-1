import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateModuleDto {
  @IsNotEmpty()
  public title: string;
  @IsOptional()
  public text: string;
  @IsNotEmpty()
  public course: string;
}
