import api from "./api";
import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User,
} from "../types/user";

export const authService = {
  login: (data: LoginRequest) =>
    api.post<TokenResponse>("/auth/login", data),

  register: (data: RegisterRequest) =>
    api.post<TokenResponse>("/auth/register", data),

  getMe: () => api.get<User>("/auth/me"),

  updateProfile: (data: Partial<User>) =>
    api.put<User>("/auth/me", data),

  logout: () => api.post("/auth/logout"),

  refreshToken: (token: string) =>
    api.post<TokenResponse>("/auth/refresh", { refresh_token: token }),

  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),

  getGoogleAuthUrl: () =>
    `${import.meta.env.VITE_API_URL || ""}/api/v1/auth/google`,
};
