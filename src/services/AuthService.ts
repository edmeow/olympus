import $api from '../http';
import { AxiosResponse } from 'axios';
import { AuthResponse } from '../models/response/AuthResponse';
export default class AuthService {
    static async login(
        username: string,
        password: string,
    ): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/api/v1/auth/login', {
            username,
            password,
        });
    }
    static async checkJWT(): Promise<AxiosResponse<AuthResponse>> {
        return $api.get<AuthResponse>('/api/v1/auth/checkAuth');
    }
}
