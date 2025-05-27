# NestJS Builder

A robust and scalable NestJS application template with built-in best practices, security features, and modern development tools.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control
  - Secure password handling with bcrypt

- **API Documentation**
  - Swagger/OpenAPI integration
  - Detailed API documentation
  - Request/Response schemas

- **Security**
  - Helmet for security headers
  - Rate limiting
  - CORS configuration
  - Input validation

- **Database**
  - TypeORM integration
  - MySQL database support
  - Database migrations
  - Seeding capabilities

- **Caching**
  - Redis cache integration
  - Cache management
  - Performance optimization

- **Monitoring & Logging**
  - Winston logger
  - Prometheus metrics
  - Health checks
  - Log file management

- **Development Tools**
  - ESLint configuration
  - Prettier code formatting
  - TypeScript strict mode
  - Jest testing framework

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL
- Redis
- PM2 (for production deployment)

## 🛠 Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd NestJs-Builder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=your_database

   # JWT
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRATION=1d

   # Redis
   REDIS_HOST=localhost
   REDIS_PORT=6379

   # Server
   PORT=3000
   NODE_ENV=development
   ```

4. Run database migrations:
   ```bash
   npm run migration:run
   ```

## 🚀 Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

### Using PM2
```bash
npm run deploy
```

## 📚 Available Scripts

- `npm run build` - Build the application
- `npm run start:dev` - Start development server
- `npm run start:prod` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run migration:generate` - Generate new migration
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert last migration
- `npm run seed:run` - Run database seeds

## 📁 Project Structure

```
src/
├── common/           # Common modules, guards, pipes
├── configs/          # Configuration files
├── database/         # Database configuration and migrations
├── modules/          # Feature modules
├── shared/           # Shared interfaces, DTOs, and utilities
├── utils/            # Utility functions
├── logs/            # Application logs
├── main.ts          # Application entry point
└── swagger.ts       # Swagger configuration
```

## 🔒 Security Features

- JWT Authentication
- Role-based Authorization
- Rate Limiting
- CORS Protection
- Helmet Security Headers
- Input Validation
- Password Hashing

## 📊 Monitoring

- Prometheus Metrics
- Health Checks
- Winston Logging
- Log File Management

## 🧪 Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 API Documentation

Access the Swagger documentation at:
```
http://localhost:3000/api
```

## 🔄 CI/CD

The project includes:
- Jenkins pipeline configuration
- PM2 ecosystem configuration
- Docker support (coming soon)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
