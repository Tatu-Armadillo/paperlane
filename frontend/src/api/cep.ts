import http from './http';
import { Cep, CreateCepDto, UpdateCepDto } from '../types';

export const cepApi = {
  getAll: async (search?: string): Promise<Cep[]> => {
    const params = search ? { search } : {};
    const response = await http.get<Cep[]>('/api/ceps', { params });
    return response.data;
  },

  getOne: async (id: string): Promise<Cep> => {
    const response = await http.get<Cep>(`/api/ceps/${id}`);
    return response.data;
  },

  create: async (data: CreateCepDto): Promise<Cep> => {
    const response = await http.post<Cep>('/api/ceps', data);
    return response.data;
  },

  update: async (id: string, data: UpdateCepDto): Promise<Cep> => {
    const response = await http.patch<Cep>(`/api/ceps/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await http.delete(`/api/ceps/${id}`);
  },
};
