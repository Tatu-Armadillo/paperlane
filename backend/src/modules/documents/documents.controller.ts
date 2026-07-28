import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, ParseIntPipe, Post, Put, Query, Res, UploadedFile, UseGuards, UseInterceptors, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { randomBytes } from 'crypto';
import type { Response } from 'express';
import { DocumentsService, UPLOAD_DIR } from './documents.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto';
import { DocumentType } from './document.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const multerOptions = {
  storage: diskStorage({
    destination: (_req, _file, cb) => {
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      }
      cb(null, UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
      const stamp = Date.now();
      const rand = randomBytes(6).toString('hex');
      const ext = path.extname(file.originalname || '').slice(0, 12);
      cb(null, `${stamp}-${rand}${ext}`);
    },
  }),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB
  },
};

@Controller('documents')
export class DocumentsController {
  constructor(private readonly service: DocumentsService) { }

  @Get()
  list(
    @Query('search') search?: string,
    @Query('title') title?: string,
    @Query('type') type?: DocumentType | 'all',
    @Query('categoryId') categoryId?: string,
    @Query('categoryKey') categoryKey?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: 'createdAt' | 'title' | 'type' | 'id',
    @Query('order') order?: 'ASC' | 'DESC',
  ) {
    return this.service.list({
      search,
      title,
      type,
      categoryId: categoryId ? Number(categoryId) : undefined,
      categoryKey,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      sort,
      order,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  create(
    @Body() dto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.create(dto, file);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.update(id, dto, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
  }

  @Get(':id/preview')
  async preview(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const doc = await this.service.findOne(id);
    const filePath = this.service.getFilePath(doc);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File missing on disk');
    }
    res.setHeader('Content-Type', doc.mimeType || 'application/octet-stream');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${encodeURIComponent(doc.originalFilename)}"`,
    );
    fs.createReadStream(filePath).pipe(res);
  }

  @Get(':id/download')
  async download(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const doc = await this.service.findOne(id);
    const filePath = this.service.getFilePath(doc);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File missing on disk');
    }
    res.setHeader(
      'Content-Type',
      doc.mimeType || 'application/octet-stream',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(doc.originalFilename)}"`,
    );
    fs.createReadStream(filePath).pipe(res);
  }
}
