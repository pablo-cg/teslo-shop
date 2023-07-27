import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    nullable: false,
    description: 'User Email',
    example: 'email@email.com',
  })
  @IsEmail()
  email: string;

  // @IsString()
  @ApiProperty({
    nullable: false,
    description: 'User Password',
    minLength: 6,
    maxLength: 50,
    example: 'Sup3r-s3cr3t-p4ssw0rD',
  })
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({
    nullable: false,
    description: 'User Full Name',
    minLength: 1,
    example: 'John Doe',
  })
  @IsString()
  @MinLength(1)
  fullname: string;
}
