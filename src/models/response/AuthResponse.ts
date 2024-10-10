import { IUser } from '../IUser';

export interface AuthResponse {
    id: string;
    username: string;
    session: string;
    name: string | null;
    surname: string | null;
    email: string | null;
    role: string;
    accessToken: string;
}
