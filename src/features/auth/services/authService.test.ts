import { beforeEach, describe, expect, it, vi } from "vitest";
import { authService } from "./authService";
import { api } from "@/shared/services/api";

vi.mock("@/shared/services/api", () => ({
  api: {
    post: vi.fn(),
  },
}));

const mockedApiPost = vi.mocked(api.post);

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("posts login credentials and returns the response data", async () => {
    const credentials = {
      email: "ana@example.com",
      password: "secret123",
    };
    const loginResponse = { token: "access-token" };

    mockedApiPost.mockResolvedValueOnce({ data: loginResponse });

    await expect(authService.login(credentials)).resolves.toEqual(loginResponse);

    expect(mockedApiPost).toHaveBeenCalledWith("/users/login", credentials);
  });

  it("propagates api errors", async () => {
    const credentials = {
      email: "ana@example.com",
      password: "wrong-password",
    };
    const error = new Error("Invalid credentials");

    mockedApiPost.mockRejectedValueOnce(error);

    await expect(authService.login(credentials)).rejects.toThrow(
      "Invalid credentials",
    );
  });
});
