import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @IsString()
  @MinLength(3)
  @ApiProperty({
    description: 'The username of the user',
    example: 'John Doe',
  })
  username: string;

  @IsEmail()
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The role of the user',
    example: 'user',
    default: 'user',
  })
  role?: string;
}
