import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Topic } from '../../topic/entity/topic.entity';
import { Episode } from 'src/modules/episodes/entity/episode.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  author: string;

  @ManyToOne(() => Topic, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'topicId' })
  topic: Topic;

  @OneToMany(() => Episode, episode => episode.book)
  episodes: Episode[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
