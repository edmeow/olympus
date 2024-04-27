import { IUser } from "../IUser";

export interface AuthResponse {
  id: string;
  username: string;
  session: string;
  role: string;
  accessToken: string;
}
