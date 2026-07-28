import http from './http';
import { AuthResponse, LoginDto } from '../types';

export const authApi = {

    login: async (data: LoginDto): Promise<AuthResponse> => {
        const response = await http.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

};
