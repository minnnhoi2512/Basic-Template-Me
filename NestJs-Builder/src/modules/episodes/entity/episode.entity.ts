import { Book } from 'src/modules/books/entity/book.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('episodes')
export class Episode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => Book, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'book' })
  book: Book;

  @Column()
  description: string;

  @Column()
  publishedAt: Date;
}
