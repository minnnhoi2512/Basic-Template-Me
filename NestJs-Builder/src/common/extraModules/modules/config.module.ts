import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import defaultConfig from '../../../configs/default.config';
import databaseConfig from '../../../configs/database.config';
import jwtConfig from '../../../configs/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [defaultConfig, databaseConfig, jwtConfig],
    }),
  ],
})
export class ConfigModuleSystem {}
