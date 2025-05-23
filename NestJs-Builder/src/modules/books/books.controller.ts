import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { BookDTO } from './dto/book.dto';
import { CommonApiResponses } from 'src/common/decorators/response.decorator';
import { ApiBody } from '@nestjs/swagger';
import { CreateBookDTO } from './dto/create-book.dto';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}
  @Post()
  @CommonApiResponses({
    dto: CreateBookDTO,
    dtoName: 'Book',
    summary: 'Create a new book',
    description: 'Create a new book description',
  })
  @ApiBody({ type: CreateBookDTO })
  createBookController(@Body() book: CreateBookDTO) {
    return this.booksService.createBookService(book);
  }
  @Get()
  @CommonApiResponses({
    dto: BookDTO,
    dtoName: 'Book',
    summary: 'Get all books',
    description: 'Get all books description',
  })
  getListBooksController(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.booksService.getListBooksService(page, limit);
  }
  @Get(':id')
  @CommonApiResponses({
    dto: BookDTO,
    dtoName: 'Book',
    summary: 'Get a book by id',
    description: 'Get a book by id description',
  })
  getBookByIdController(@Param('id') id: number) {
    return this.booksService.getBookByIdService(id);
  }
  @Put(':id')
  @CommonApiResponses({
    dto: BookDTO,
    dtoName: 'Book',
    summary: 'Update a book by id',
    description: 'Update a book by id description',
  })
  updateBookController(@Param('id') id: number, @Body() book: BookDTO) {
    return this.booksService.updateBookService(id, book);
  }
  @Delete(':id')
  @CommonApiResponses({
    dto: BookDTO,
    dtoName: 'Book',
    summary: 'Delete a book by id',
    description: 'Delete a book by id description',
  })
  deleteBookController(@Param('id') id: number) {
    return this.booksService.deleteBookService(id);
  }
}
