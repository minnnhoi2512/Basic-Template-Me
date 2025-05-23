import { ApiProperty } from '@nestjs/swagger';

export class CustomResponse<T> {
  @ApiProperty()
  status: boolean;

  @ApiProperty()
  location: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ description: 'The response data', type: () => Object })
  data?: T;

  @ApiProperty({ required: false })
  error?: string;

  constructor(
    status: boolean,
    location: string,
    message: string,
    data?: T,
    error?: string,
  ) {
    this.status = status;
    this.location = location;
    this.message = message;
    this.data = data;
    this.error = error;
  }
}
