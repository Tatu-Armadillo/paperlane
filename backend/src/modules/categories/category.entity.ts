import { Column, Entity, Index, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { DocumentEntity } from '../documents/document.entity';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64 })
  key: string;

  @Column({ type: 'varchar', length: 128 })
  value: string;

  @OneToMany(() => DocumentEntity, (doc) => doc.category)
  documents: DocumentEntity[];
}
