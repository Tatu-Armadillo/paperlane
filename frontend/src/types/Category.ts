export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface CategoryPage {
  items: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}