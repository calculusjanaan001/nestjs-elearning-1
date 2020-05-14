import { IsOptional } from 'class-validator';

export class UpdateSubscriptionDto {
  public completedModules: Array<string>;
  @IsOptional()
  public moduleInProgress: string;
}
