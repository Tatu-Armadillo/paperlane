import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { DocumentEntity } from '../documents/document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, DocumentEntity])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
