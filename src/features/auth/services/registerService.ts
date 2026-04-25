import { api } from "@/shared/services/api";
import type { RegisterCredentials } from "../types/auth.types";

export const registerService = {
  async register(credentials: RegisterCredentials): Promise<void> {
    await api.post("/users/register", credentials);
  },
};
