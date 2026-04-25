import { api } from "@/shared/services/api";
import type { UserProfile } from "../types/user.types";

export const userService = {
  async getMe(): Promise<UserProfile> {
    const response = await api.get<UserProfile>("/users/me");

    return response.data;
  },
};
