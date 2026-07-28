import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { DocumentEntity } from '../documents/document.entity';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    username: string;

    @Column()
    @Exclude()
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => DocumentEntity, (doc) => doc.user)
    documents: DocumentEntity[];
}
