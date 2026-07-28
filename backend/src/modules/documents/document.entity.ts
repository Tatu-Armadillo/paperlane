import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../categories/category.entity';

export type DocumentType =
  | 'article'
  | 'book_chapter'
  | 'project'
  | 'short_story'
  | 'image';

export const DOCUMENT_TYPES: DocumentType[] = [
  'article',
  'book_chapter',
  'project',
  'short_story',
  'image',
];

@Entity('documents')
export class DocumentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 32 })
  type: DocumentType;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Category, (c) => c.documents, {
    eager: true,
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  // File storage metadata (files live on disk; DB only holds references)
  @Column({ type: 'varchar', length: 260, name: 'stored_filename' })
  storedFilename: string;

  @Column({ type: 'varchar', length: 260, name: 'original_filename' })
  originalFilename: string;

  @Column({ type: 'varchar', length: 128, name: 'mime_type' })
  mimeType: string;

  @Column({ type: 'integer', name: 'file_size' })
  fileSize: number;

  @Column({ type: 'boolean', name: 'is_text', default: false })
  isText: boolean;

  @Column({ type: 'text', name: 'text_content', nullable: true })
  textContent: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
