import { api } from "@/shared/services/api";
import type { UpdateUserRequest, UserProfile } from "../types/user.types";

export const userService = {
  async getMe(): Promise<UserProfile> {
    const response = await api.get<UserProfile>("/users/me");

    return response.data;
  },

  async updateUser(
    userId: string,
    user: UpdateUserRequest,
  ): Promise<UserProfile> {
    const response = await api.patch<UserProfile>(
      `/users/${encodeURIComponent(userId)}`,
      user,
      {
        headers: {
          "x-user-role": "adm",
        },
      },
    );

    return response.data;
  },
};
