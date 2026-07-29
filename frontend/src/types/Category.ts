export interface Category {
  id: number;
  key: string;
  value: string;
}

export interface CategoryPage {
  items: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}