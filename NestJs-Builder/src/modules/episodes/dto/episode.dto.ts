import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class EpisodeDTO {
  @ApiProperty({
    description: 'The title of the episode',
    example: 'Episode 1',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The description of the episode',
    example: 'Episode 1 description',
    required: true,
  })
  description: string;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'The published date of the episode',
    example: '2021-01-01',
    required: true,
  })
  publishedAt: Date;
}
