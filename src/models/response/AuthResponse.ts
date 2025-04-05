export interface AuthResponse {
    id: string;
    username: string;
    name: string | null;
    surname: string | null;
    email: string | null;
    role: string;
    accessToken: string;
}
