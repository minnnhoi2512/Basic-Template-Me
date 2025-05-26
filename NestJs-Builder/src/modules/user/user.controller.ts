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
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserDTO } from './dto/user.dto';
import { CommonApiResponses } from 'src/shared/decorators/response.decorator';
import { ApiQuery } from '@nestjs/swagger';
import { LoginUserDTO } from './dto/login-user.dto';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @CommonApiResponses({
    dto: CreateUserDTO,
    dtoName: 'user',
    summary: 'Create a new user',
    description: 'Create a new user with username, email, and password',
    createRequest: true,
  })
  create(@Body() user: CreateUserDTO) {
    return this.userService.createUserService(user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
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
    createRequest: false,
  })
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('key') key?: string,
  ) {
    return this.userService.findListUserService(key || '', page, limit);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @CommonApiResponses({
    dto: UserDTO,
    dtoName: 'user',
    summary: 'Get user by id',
    description: 'Retrieve a user by their ID',
    createRequest: false,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOneUserService(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @CommonApiResponses({
    dto: UserDTO,
    dtoName: 'user',
    summary: 'Update user',
    description: 'Update user information by ID',
    createRequest: false,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDTO: UserDTO,
  ) {
    return this.userService.updateUserService(id, updateUserDTO);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @CommonApiResponses({
    dto: UserDTO,
    dtoName: 'user',
    summary: 'Delete user',
    description: 'Delete a user by ID',
    createRequest: false,
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.removeUserService(id);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses({
    dto: UserDTO,
    dtoName: 'user',
    summary: 'Login user',
    description: 'Login user with email and password',
    createRequest: false,
  })
  async login(@Body() loginUserDTO: LoginUserDTO) {
    const user = await this.userService.loginByEmailUserService(loginUserDTO);
    return user.token;
  }
}
