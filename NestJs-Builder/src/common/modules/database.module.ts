import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions';
import { Episode } from '../../modules/episodes/entity/episode.entity';
import { Topic } from '../../modules/topic/entity/topic.entity';
import { Book } from '../../modules/books/entity/book.entity';
import { User } from '../../modules/user/entity/user.entity';
import { DatabaseType } from 'src/shared/types/Database.type';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (
        configService: ConfigService,
      ):
        | MysqlConnectionOptions
        | PostgresConnectionOptions
        | MongoConnectionOptions
        | SqlServerConnectionOptions => {
        const type = configService.getOrThrow<DatabaseType>('database.type');
        const baseConfig = {
          type,
          host: configService.getOrThrow<string>('database.host'),
          port: configService.getOrThrow<number>('database.port'),
          username: configService.getOrThrow<string>('database.username'),
          password: configService.getOrThrow<string>('database.password'),
          database: configService.getOrThrow<string>('database.name'),
          entities: [Episode, Topic, Book, User],
          synchronize: true,
        };

        if (type === 'mssql') {
          return {
            ...baseConfig,
            options: {
              encrypt: true,
              trustServerCertificate: true,
            },
          } as SqlServerConnectionOptions;
        }

        return baseConfig;
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
