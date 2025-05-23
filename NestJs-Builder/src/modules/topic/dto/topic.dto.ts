import { ApiProperty } from '@nestjs/swagger';
import { Topic } from '../entity/topic.entity';
import { BookDTO } from 'src/modules/books/dto/book.dto';
export class TopicDTO {
  @ApiProperty({
    description: 'The id of the topic',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the topic',
    example: 'Topic 1',
  })
  name: string;

  @ApiProperty({
    description: 'The description of the topic',
    example: 'Topic 1 description',
  })
  description: string;

  @ApiProperty({
    description: 'The books of the topic',
    example: '[]',
  })
  books: BookDTO[];

  @ApiProperty({
    description: 'The created at of the topic',
    example: '2021-01-01',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The updated at of the topic',
    example: '2021-01-01',
  })
  updatedAt: Date;

  constructor(topic: Topic) {
    this.id = topic.id;
    this.name = topic.name;
    this.description = topic.description;
    this.createdAt = topic.createdAt;
    this.updatedAt = topic.updatedAt;
  }
}
