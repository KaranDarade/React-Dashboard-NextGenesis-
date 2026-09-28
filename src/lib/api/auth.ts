import { apiClient } from "@/lib/api/client";
import type { AuthUser, LoginResponse } from "@/types/product";

export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", {
    username,
    password,
    expiresInMins: 60,
  });
  return data;
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const { data } = await apiClient.get<AuthUser>("/auth/me");
  return data;
}
