import http from './http';
import type { Category, CategoryPage } from '@/types/Category';

export async function listCategories(params: Record<string, unknown> = {}): Promise<CategoryPage> {
  const { data } = await http.get<CategoryPage>('/categories', { params });
  return data;
}

export async function getCategory(id: number): Promise<Category> {
  return http.get<Category>(`/categories/${id}`).then((r) => r.data);
}

export async function createCategory(
  payload: Omit<Category, 'id'>,
): Promise<Category> {
  return http.post<Category>('/categories', payload).then((r) => r.data);
}

export async function updateCategory(
  id: number,
  payload: Partial<Omit<Category, 'id'>>,
): Promise<Category> {
  return http.put<Category>(`/categories/${id}`, payload).then((r) => r.data);
}

export async function deleteCategory(id: number): Promise<void> {
  return http.delete<void>(`/categories/${id}`).then((r) => r.data);
}
