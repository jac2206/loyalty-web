import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/shared/services/api";
import { getAuthToken } from "@/shared/services/authStorage";
import { userService } from "./userService";

vi.mock("@/shared/services/api", () => ({ api: { get: vi.fn(), patch: vi.fn() } }));
vi.mock("@/shared/services/authStorage", () => ({ getAuthToken: vi.fn() }));

describe("userService", () => {
  beforeEach(() => vi.resetAllMocks());

  it("updates the encoded document number without a client-supplied role", async () => {
    const values = { fullName: "Ana López", email: "ana@example.com" };
    vi.mocked(api.patch).mockResolvedValueOnce({ data: values });
    await expect(userService.updateUser("123/456", values)).resolves.toEqual(values);
    expect(api.patch).toHaveBeenCalledWith("/users/123%2F456", values);
  });

  it("shares only simultaneous profile requests for the same session", async () => {
    vi.mocked(getAuthToken).mockReturnValue("session-a");
    let resolve!: (value: { data: { fullName: string } }) => void;
    vi.mocked(api.get).mockReturnValueOnce(new Promise((done) => { resolve = done; }));
    const first = userService.getMe();
    const second = userService.getMe();
    expect(api.get).toHaveBeenCalledTimes(1);
    resolve({ data: { fullName: "Ana" } });
    await expect(Promise.all([first, second])).resolves.toEqual([{ fullName: "Ana" }, { fullName: "Ana" }]);
    vi.mocked(api.get).mockResolvedValueOnce({ data: { fullName: "Ana" } });
    await userService.getMe();
    expect(api.get).toHaveBeenCalledTimes(2);
  });

  it("does not share requests across sessions and retries after failure", async () => {
    vi.mocked(getAuthToken).mockReturnValueOnce("session-a").mockReturnValueOnce("session-b").mockReturnValueOnce("session-a");
    vi.mocked(api.get).mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce({ data: { fullName: "B" } })
      .mockResolvedValueOnce({ data: { fullName: "A" } });
    const first = userService.getMe();
    const second = userService.getMe();
    await expect(first).rejects.toThrow("offline");
    await expect(second).resolves.toEqual({ fullName: "B" });
    await expect(userService.getMe()).resolves.toEqual({ fullName: "A" });
    expect(api.get).toHaveBeenCalledTimes(3);
  });
});
