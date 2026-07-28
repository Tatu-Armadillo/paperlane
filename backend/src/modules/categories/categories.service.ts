import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { DocumentEntity } from '../documents/document.entity';

export interface ListCategoriesQuery {
  search?: string;
  page?: number;
  limit?: number;
  sort?: 'key' | 'value' | 'id';
  order?: 'ASC' | 'DESC';
}

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
    @InjectRepository(DocumentEntity)
    private readonly documentsRepo: Repository<DocumentEntity>,
  ) {}

  async ensure(key: string, value: string) {
    const existing = await this.repo.findOne({ where: { key } });
    if (existing) return existing;
    const entity = this.repo.create({ key, value });
    return this.repo.save(entity);
  }

  async list(query: ListCategoriesQuery) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const sort = query.sort || 'value';
    const order = query.order === 'DESC' ? 'DESC' : 'ASC';

    const where = query.search
      ? [
          { key: ILike(`%${query.search}%`) },
          { value: ILike(`%${query.search}%`) },
        ]
      : {};

    const [items, total] = await this.repo.findAndCount({
      where,
      order: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findOne(id: number): Promise<Category> {
    const cat = await this.repo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException(`Category ${id} not found`);
    return cat;
  }

  async findByKey(key: string): Promise<Category | null> {
    return this.repo.findOne({ where: { key } });
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const dup = await this.repo.findOne({ where: { key: dto.key } });
    if (dup) {
      throw new ConflictException(`Category key "${dto.key}" already exists`);
    }
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const cat = await this.findOne(id);
    if (dto.key !== cat.key) {
      const dup = await this.repo.findOne({ where: { key: dto.key } });
      if (dup) {
        throw new ConflictException(`Category key "${dto.key}" already exists`);
      }
    }
    cat.key = dto.key;
    cat.value = dto.value;
    return this.repo.save(cat);
  }

  async remove(id: number): Promise<void> {
    const cat = await this.findOne(id);
    const count = await this.documentsRepo.count({
      where: { category: { id } },
    });
    if (count > 0) {
      throw new ConflictException(
        `Cannot delete category "${cat.value}" — it is used by ${count} document(s).`,
      );
    }
    await this.repo.remove(cat);
  }
}
