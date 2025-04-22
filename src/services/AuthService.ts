import $api from "../config/api";
import { IAuthResponse } from "../models/response/IAuthResponse";
export default class AuthService {
  static async login(body: { username: string; password: string }) {
    return $api.post<IAuthResponse>("/api/v1/auth/login", body);
  }

  static async logout() {
    return $api.get("/api/v1/auth/logout");
  }

  static async checkJWT() {
    return $api.get<IAuthResponse>("/api/v1/auth/checkAuth");
  }
}
