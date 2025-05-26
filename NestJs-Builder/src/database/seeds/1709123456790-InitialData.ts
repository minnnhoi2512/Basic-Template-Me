import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class InitialData1709123456790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await queryRunner.query(`
      INSERT INTO users (username, email, password, role)
      VALUES ('admin', 'admin@example.com', '${hashedPassword}', 'admin')
    `);

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    await queryRunner.query(`
      INSERT INTO users (username, email, password, role)
      VALUES ('user', 'user@example.com', '${userPassword}', 'user')
    `);

    // Create sample books
    await queryRunner.query(`
      INSERT INTO books (title, author, description)
      VALUES 
        ('The Great Gatsby', 'F. Scott Fitzgerald', 'A story of the fabulously wealthy Jay Gatsby'),
        ('To Kill a Mockingbird', 'Harper Lee', 'The story of racial injustice and the loss of innocence'),
        ('1984', 'George Orwell', 'A dystopian social science fiction novel')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove sample data
    await queryRunner.query(
      `DELETE FROM books WHERE title IN ('The Great Gatsby', 'To Kill a Mockingbird', '1984')`,
    );
    await queryRunner.query(
      `DELETE FROM users WHERE email IN ('admin@example.com', 'user@example.com')`,
    );
  }
}
