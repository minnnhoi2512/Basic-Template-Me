import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserDTO } from './dto/user.dto';
import { CommonApiResponses } from 'src/common/decorators/response.decorator';
import { ApiQuery } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @CommonApiResponses({
    dto: CreateUserDTO,
    dtoName: 'user',
    summary: 'Create a new user',
    description: 'Create a new user with username, email, and password',
  })
  create(@Body() user: CreateUserDTO) {
    return this.userService.createUserService(user);
  }

  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'key',
    required: false,
    type: String,
    description: 'Search key',
  })
  @CommonApiResponses({
    dto: UserDTO,
    dtoName: 'user',
    summary: 'Get list users',
    description: 'Retrieve a list of all users',
  })
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('key') key?: string,
  ) {
    return this.userService.findListUserService(key || '', page, limit);
  }

  @Get(':id')
  @CommonApiResponses({
    dto: UserDTO,
    dtoName: 'user',
    summary: 'Get user by id',
    description: 'Retrieve a user by their ID',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOneUserService(id);
  }

  @Patch(':id')
  @CommonApiResponses({
    dto: UserDTO,
    dtoName: 'user',
    summary: 'Update user',
    description: 'Update user information by ID',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDTO: UserDTO,
  ) {
    return this.userService.updateUserService(id, updateUserDTO);
  }

  @Delete(':id')
  @CommonApiResponses({
    dto: UserDTO,
    dtoName: 'user',
    summary: 'Delete user',
    description: 'Delete a user by ID',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.removeUserService(id);
  }
}
