import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { DocumentEntity, DOCUMENT_TYPES, DocumentType } from './document.entity';
import { CreateDocumentDto, UpdateDocumentDto } from './dto';
import { CategoriesService } from '../categories/categories.service';

export const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');

const TEXT_EXTENSIONS = new Set([
  '.txt',
  '.md',
  '.markdown',
  '.rst',
  '.log',
]);

const TEXT_MIMES = new Set([
  'text/plain',
  'text/markdown',
  'text/x-markdown',
]);

export interface ListDocumentsQuery {
  search?: string;
  title?: string;
  type?: DocumentType | 'all';
  categoryId?: number;
  categoryKey?: string;
  page?: number;
  limit?: number;
  sort?: 'createdAt' | 'title' | 'type' | 'id';
  order?: 'ASC' | 'DESC';
}

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly repo: Repository<DocumentEntity>,
    private readonly categoriesService: CategoriesService,
  ) {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
  }

  async list(query: ListDocumentsQuery) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
    const sort = query.sort || 'createdAt';
    const order = query.order === 'ASC' ? 'ASC' : 'DESC';

    const qb = this.repo
      .createQueryBuilder('doc')
      .leftJoinAndSelect('doc.category', 'category');

    if (query.title) {
      qb.andWhere('LOWER(doc.title) LIKE :title', {
        title: `%${query.title.toLowerCase()}%`,
      });
    }
    if (query.search) {
      qb.andWhere(
        '(LOWER(doc.title) LIKE :s OR LOWER(doc.description) LIKE :s)',
        { s: `%${query.search.toLowerCase()}%` },
      );
    }
    if (query.type && query.type !== 'all') {
      qb.andWhere('doc.type = :type', { type: query.type });
    }
    if (query.categoryId) {
      qb.andWhere('category.id = :cid', { cid: query.categoryId });
    }
    if (query.categoryKey) {
      qb.andWhere('LOWER(category.key) = :ck', {
        ck: query.categoryKey.toLowerCase(),
      });
    }

    qb.orderBy(`doc.${sort}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findOne(id: number): Promise<DocumentEntity> {
    const doc = await this.repo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!doc) throw new NotFoundException(`Document ${id} not found`);
    return doc;
  }

  private classifyFile(originalName: string, mimetype: string) {
    const ext = path.extname(originalName).toLowerCase();
    const isText = TEXT_EXTENSIONS.has(ext) || TEXT_MIMES.has(mimetype);
    return { isText, ext };
  }

  async create(
    dto: CreateDocumentDto,
    file?: Express.Multer.File,
  ): Promise<DocumentEntity> {
    if (!DOCUMENT_TYPES.includes(dto.type)) {
      throw new BadRequestException('Invalid document type');
    }

    const category = await this.categoriesService.findOne(dto.categoryId);

    let isText = false;
    let textContent: string | null = null;

    if (file) {
      ({ isText } = this.classifyFile(file.originalname, file.mimetype));

      if (isText) {
        try {
          textContent = fs.readFileSync(file.path, 'utf-8');
          if (textContent.length > 500_000) {
            textContent = textContent.slice(0, 500_000);
          }
        } catch {
          textContent = null;
        }
      }
    }

    const entity = this.repo.create({
      type: dto.type,
      title: dto.title,
      description: dto.description,
      category,
      storedFilename: file ? path.basename(file.path) : null,
      originalFilename: file?.originalname ?? null,
      mimeType: file?.mimetype ?? null,
      fileSize: file?.size ?? 0,
      isText,
      textContent,
    });

    return this.repo.save(entity);
  }

  async update(
    id: number,
    dto: UpdateDocumentDto,
    file?: Express.Multer.File,
  ): Promise<DocumentEntity> {
    const doc = await this.findOne(id);
    if (dto.type) doc.type = dto.type;
    if (dto.title !== undefined) doc.title = dto.title;
    if (dto.description !== undefined) doc.description = dto.description;
    if (dto.categoryId) {
      doc.category = await this.categoriesService.findOne(dto.categoryId);
    }
    if (file) {
      // remove previous file
      const prev = path.join(UPLOAD_DIR, doc.storedFilename);
      if (fs.existsSync(prev)) {
        try {
          fs.unlinkSync(prev);
        } catch {
          /* noop */
        }
      }
      const { isText } = this.classifyFile(file.originalname, file.mimetype);
      let textContent: string | null = null;
      if (isText) {
        try {
          textContent = fs.readFileSync(file.path, 'utf-8').slice(0, 500_000);
        } catch {
          textContent = null;
        }
      }
      doc.storedFilename = path.basename(file.path);
      doc.originalFilename = file.originalname;
      doc.mimeType = file.mimetype || 'application/octet-stream';
      doc.fileSize = file.size;
      doc.isText = isText;
      doc.textContent = textContent;
    }
    return this.repo.save(doc);
  }

  async remove(id: number): Promise<void> {
    const doc = await this.findOne(id);
    const fp = path.join(UPLOAD_DIR, doc.storedFilename);
    if (fs.existsSync(fp)) {
      try {
        fs.unlinkSync(fp);
      } catch {
        /* noop */
      }
    }
    await this.repo.remove(doc);
  }

  getFilePath(doc: DocumentEntity): string {
    return path.join(UPLOAD_DIR, doc.storedFilename);
  }
}
