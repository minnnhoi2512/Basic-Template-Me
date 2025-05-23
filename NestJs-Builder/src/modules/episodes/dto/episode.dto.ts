import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Episode } from '../entity/episode.entity';
import { Book } from 'src/modules/books/entity/book.entity';

export class EpisodeDTO {
  @ApiProperty({
    description: 'The id of the episode',
    example: 1,
  })
  id: number;

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

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The book of the episode',
    example: 'Book 1',
    required: true,
  })
  book: Book;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'The published date of the episode',
    example: '2021-01-01',
    required: true,
  })
  publishedAt: Date;

  constructor(episode: Episode) {
    this.id = episode.id;
    this.title = episode.title;
    this.description = episode.description;
    this.publishedAt = episode.publishedAt;
    this.book = episode.book;
  }
}
