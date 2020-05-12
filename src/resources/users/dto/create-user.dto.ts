import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;
  @IsNotEmpty()
  public password: string;
  @IsNotEmpty()
  public role: string;
  @IsNotEmpty()
  public firstName: string;
  @IsNotEmpty()
  public lastName: string;
}
