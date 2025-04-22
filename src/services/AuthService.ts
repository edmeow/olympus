import $api from "../config/api";
import { IUser } from "../models/IUser";

export default class AuthService {
  static async login(body: { username: string; password: string }) {
    return $api.post<IUser>("/api/v1/auth/login", body);
  }

  static async logout() {
    return $api.get("/api/v1/auth/logout");
  }

  static async checkJWT() {
    return $api.get<IUser>("/api/v1/auth/checkAuth");
  }
}
