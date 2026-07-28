import http from './http';
import { AuthResponse, LoginDto, RegisterDto, User } from '../types';

export const authApi = {
    // register: async (data: RegisterDto): Promise<AuthResponse> => {
    //     const response = await http.post<AuthResponse>('/auth/register', data);
    //     return response.data;
    // },

    login: async (data: LoginDto): Promise<AuthResponse> => {
        const response = await http.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    // getMe: async (): Promise<User> => {
    //     const response = await http.get<User>('/auth/me');
    //     return response.data;
    // },
};
