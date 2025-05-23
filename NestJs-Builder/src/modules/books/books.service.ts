import { Injectable } from '@nestjs/common';
import { Book } from './entity/book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookDTO } from './dto/book.dto';
import { CreateBookDTO } from './dto/create-book.dto';
import { TopicService } from '../topic/topic.service';
import { Topic } from '../topic/entity/topic.entity';
@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    private topicService: TopicService,
  ) {}

  async createBookService(book: CreateBookDTO) {
    const newBook = new Book();
    newBook.title = book.title;
    newBook.description = book.description;
    newBook.author = book.author;

    // Handle topic relationship
    if (book.topic) {
      const topic = (await this.topicService.getTopicByIdService(
        book.topic.id,
      )) as Topic;
      newBook.topic = topic;
    }

    return this.bookRepository.save(newBook);
  }

  getListBooksService(page: number, limit: number) {
    return this.bookRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  getBookByIdService(id: number) {
    return this.bookRepository.findOne({
      where: { id },
      relations: ['topic', 'episodes'],
    });
  }

  updateBookService(id: number, book: BookDTO) {
    return this.bookRepository.update(id, book);
  }

  deleteBookService(id: number) {
    return this.bookRepository.delete(id);
  }
}
