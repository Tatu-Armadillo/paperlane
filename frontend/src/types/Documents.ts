import { Category } from "./Category";

export type DocumentType =
  | 'article'
  | 'book_chapter'
  | 'project'
  | 'short_story'
  | 'image';

export interface Document {
  id: number;
  type: DocumentType;
  title: string;
  description: string;

  category: Category;

  storedFilename: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;

  isText: boolean;
  textContent: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface DocumentPage {
  items: Document[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}