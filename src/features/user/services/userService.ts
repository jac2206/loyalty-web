import { api } from "@/shared/services/api";
import { getAuthToken } from "@/shared/services/authStorage";
import type { UpdateUserRequest, UserProfile } from "../types/user.types";

const pendingProfiles = new Map<string, Promise<UserProfile>>();

export const userService = {
  async getMe(): Promise<UserProfile> {
    const token = getAuthToken();
    const pending = token ? pendingProfiles.get(token) : undefined;
    if (pending) return pending;
    const request = api.get<UserProfile>("/users/me").then((response) => response.data);
    if (token) pendingProfiles.set(token, request);
    try {
      return await request;
    } finally {
      if (token && pendingProfiles.get(token) === request) pendingProfiles.delete(token);
    }
  },

  async updateUser(
    documentNumber: string,
    user: UpdateUserRequest,
  ): Promise<UserProfile> {
    const response = await api.patch<UserProfile>(
      `/users/${encodeURIComponent(documentNumber)}`,
      user,
    );

    return response.data;
  },
};
