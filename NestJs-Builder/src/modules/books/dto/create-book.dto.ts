import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDate } from 'class-validator';
import { TopicDTO } from 'src/modules/topic/dto/topic.dto';
import { Book } from '../entity/book.entity';

export class CreateBookDTO {
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
  author: string;

  @ApiProperty({
    description: 'The topic of the book',
    example: 'The topic of the book',
  })
  @IsString()
  @IsNotEmpty()
  topic: TopicDTO;

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

  constructor(params: Book) {
    this.title = params.title;
    this.description = params.description;
    this.author = params.author;
    this.topic = params.topic;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
}
