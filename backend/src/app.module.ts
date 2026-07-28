import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

import { CategoriesModule } from './modules/categories/categories.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';

import { CategoryEntity } from './modules/categories/category.entity';
import { DocumentEntity } from './modules/documents/document.entity';
import { UserEntity } from './modules/users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [CategoryEntity, DocumentEntity, UserEntity],
      synchronize: true,
      logging: false,
    }),
    TypeOrmModule.forFeature([UserEntity]),
    CategoriesModule,
    DocumentsModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  async onModuleInit(): Promise<void> {
    // Seed the default administrator user.
    await this.seedAdmin();
  }

  private async seedAdmin(): Promise<void> {
    const adminUsername = 'admin';
    const adminPassword = 'admin123';

    const existingAdmin = await this.userRepository.findOne({
      where: { username: adminUsername },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      await this.userRepository.save({
        name: 'Admin',
        username: adminUsername,
        password: hashedPassword,
      });

      this.logger.log(`Default administrator "${adminUsername}" created.`);
    } else {
      this.logger.log(`Administrator "${adminUsername}" already exists.`);
    }

    await this.writeTestCredentials(adminUsername, adminPassword);
  }

  private async writeTestCredentials(
    username: string,
    password: string,
  ): Promise<void> {
    const credentialsPath = path.join(
      process.cwd(),
      'memory',
      'test_credentials.md',
    );

    const credentialsContent = `# Test Credentials

## Admin User

- Username: ${username}
- Password: ${password}

## Authentication Endpoints

- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user (protected)
`;

    try {
      await fs.promises.mkdir(path.dirname(credentialsPath), {
        recursive: true,
      });

      await fs.promises.writeFile(credentialsPath, credentialsContent, 'utf8');

      this.logger.log(
        `Test credentials written to ${credentialsPath}`,
      );
    } catch (error) {
      this.logger.error(
        'Failed to write test credentials file.',
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}