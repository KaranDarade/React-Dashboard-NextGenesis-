import { apiClient } from "@/lib/api/client";
import { DEMO_CREDENTIALS, isAdminCredentials } from "@/lib/credentials";
import type { AuthUser, LoginResponse } from "@/types/product";

export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  // The admin signs in with the app credentials; DummyJSON only knows its own
  // demo account, so those are exchanged for the demo account to get a token.
  const credentials = isAdminCredentials(username, password)
    ? DEMO_CREDENTIALS
    : { username, password };

  const { data } = await apiClient.post<LoginResponse>("/auth/login", {
    ...credentials,
    expiresInMins: 60,
  });
  return data;
}

export async function fetchCurrentUser(
  signal?: AbortSignal,
): Promise<AuthUser> {
  const { data } = await apiClient.get<AuthUser>("/auth/me", { signal });
  return data;
}
