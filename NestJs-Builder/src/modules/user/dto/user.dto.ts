import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDTO {
  @IsNumber()
  @ApiProperty({
    description: 'The id of the user',
    example: 1,
  })
  id: number;

  @IsString()
  @MinLength(3)
  @IsOptional()
  @ApiProperty({
    description: 'The username of the user',
    example: 'John Doe',
  })
  username?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  email: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  password?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The role of the user',
    example: 'admin',
  })
  role: string;
}
