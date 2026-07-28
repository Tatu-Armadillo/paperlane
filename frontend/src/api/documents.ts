import http, { API_ROOT } from './http';
import { DocumentPage, Document } from '@/types/Documents';

export async function listDocuments(params: Record<string, unknown> = {},): Promise<DocumentPage> {
  const { data } = await http.get<DocumentPage>('/documents', { params });
  return data;
}

export async function getDocument(id: number): Promise<Document> {
  const { data } = await http.get<Document>(`/documents/${id}`);
  return data;
}

export async function createDocument(form: FormData): Promise<Document> {
  const { data } = await http.post<Document>('/documents', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
}

export async function updateDocument(
  id: number,
  form: FormData,
): Promise<Document> {
  const { data } = await http.put<Document>(`/documents/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
}

export async function deleteDocument(id: number): Promise<void> {
  await http.delete<void>(`/documents/${id}`);
}

export function previewUrl(id: number): string {
  return `${API_ROOT}/documents/${id}/preview`;
}

export function downloadUrl(id: number): string {
  return `${API_ROOT}/documents/${id}/download`;
}