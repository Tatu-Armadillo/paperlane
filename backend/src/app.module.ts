import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './modules/categories/categories.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { CategoriesService } from './modules/categories/categories.service';
import { Category } from './modules/categories/category.entity';
import { DocumentEntity } from './modules/documents/document.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: ':memory:',
      entities: [Category, DocumentEntity],
      synchronize: true,
      logging: false,
    }),
    CategoriesModule,
    DocumentsModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly categoriesService: CategoriesService) {}

  async onModuleInit() {
    // Seed a minimal set of categories on first run (per product decision).
    const seed = [
      { key: 'technology', value: 'Technology' },
      { key: 'literature', value: 'Literature' },
      { key: 'science', value: 'Science' },
      { key: 'design', value: 'Design' },
      { key: 'philosophy', value: 'Philosophy' },
    ];
    for (const c of seed) {
      await this.categoriesService.ensure(c.key, c.value);
    }
  }
}
