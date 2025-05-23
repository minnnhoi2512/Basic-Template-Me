import { ApiProperty } from '@nestjs/swagger';

export class TopicDTO {
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
    description: 'The created at of the topic',
    example: '2021-01-01',
  })
  createdAt: Date;
  @ApiProperty({
    description: 'The updated at of the topic',
    example: '2021-01-01',
  })
  updatedAt: Date;
}
