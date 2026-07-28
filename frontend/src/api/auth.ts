import http from './http';
import { AuthResponse, LoginDto, User } from '@/types/User';

export const authApi = {

    login: async (data: LoginDto): Promise<AuthResponse> => {
        const response = await http.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    getMe: async (): Promise<User> => {
        const response = await http.get<User>('/auth/me');
        return response.data;
    },
};
