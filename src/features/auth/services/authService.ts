import { api } from "@/shared/services/api";
import type { LoginCredentials, LoginResponse } from "../types/auth.types";

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/users/login", credentials);

    return response.data;
  },
};
