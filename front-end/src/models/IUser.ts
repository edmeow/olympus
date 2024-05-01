export interface IUser {
    id: string;
    username: string;
    session: string;
    role: string;
    name: string | null;
    surname: string | null;
    email: string | null;
}
