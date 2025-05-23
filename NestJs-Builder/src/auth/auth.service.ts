import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  getPort() {
    return this.configService.get<number>('port');
  }
  getMode() {
    return this.configService.get<string>('mode');
  }
  getJwtSecret() {
    return this.configService.get<string>('jwt.secret');
  }
  getJwtExpiresIn() {
    return this.configService.get<string>('jwt.expiresIn');
  }
  getDbType() {
    return this.configService.get<string>('database.type');
  }
  getDbHost() {
    return this.configService.get<string>('database.host');
  }
  getDbPort() {
    return this.configService.get<number>('database.port');
  }
  getDbUsername() {
    return this.configService.get<string>('database.username');
  }
  getDbPassword() {
    return this.configService.get<string>('database.password');
  }
  getDbName() {
    return this.configService.get<string>('database.name');
  }
  getAuth() {
    return this.configService.get<string>('auth');
  }
}
