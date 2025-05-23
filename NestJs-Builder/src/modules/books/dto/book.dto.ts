import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDate } from 'class-validator';
import { EpisodeDTO } from 'src/modules/episodes/dto/episode.dto';
import { TopicDTO } from 'src/modules/topic/dto/topic.dto';

export class BookDTO {
  @ApiProperty({
    description: 'The title of the book',
    example: 'The title of the book',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The description of the book',
    example: 'The description of the book',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The author of the book',
    example: 'The author of the book',
  })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The author of the book',
    example: 'The author of the book',
  })
  author: string;

  @ApiProperty({
    description: 'The topic of the book',
    example: 'The topic of the book',
  })
  @IsString()
  @IsNotEmpty()
  topic: TopicDTO;

  @ApiProperty({
    description: 'The episodes of the book',
    example: 'The episodes of the book',
  })
  episodes: EpisodeDTO[];

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The created date of the book',
    example: 'The created date of the book',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The updated date of the book',
    example: 'The updated date of the book',
  })
  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}
