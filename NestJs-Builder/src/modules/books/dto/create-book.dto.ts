import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
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

  constructor(params: Book) {
    this.title = params.title;
    this.description = params.description;
    this.author = params.author;
    this.topic = params.topic;
  }
}
