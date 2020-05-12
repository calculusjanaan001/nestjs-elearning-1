import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;
  @IsNotEmpty()
  public password: string;
  @IsNotEmpty()
  public role: string;
  public firstName: string;
  public lastName: string;
}
