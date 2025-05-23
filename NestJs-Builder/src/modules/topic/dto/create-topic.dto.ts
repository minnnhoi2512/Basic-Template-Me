import { ApiProperty } from '@nestjs/swagger';
import { Topic } from '../entity/topic.entity';
export class CreateTopicDTO {
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

  constructor(topic: Topic) {
    this.name = topic.name;
    this.description = topic.description;
  }
}
