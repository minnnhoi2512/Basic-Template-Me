import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import defaultConfig from '../../configSystem/default.config';
import databaseConfig from '../../configSystem/database.config';
import jwtConfig from '../../configSystem/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [defaultConfig, databaseConfig, jwtConfig],
    }),
  ],
})
export class ConfigModuleSystem {}
