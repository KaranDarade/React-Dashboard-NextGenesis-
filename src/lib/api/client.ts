import axios, { type AxiosError } from "axios";
import { clearSession, getToken } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/constants";

/** Normalised error thrown by every API call so the UI can rely on one shape. */
export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

// Attach the auth token to every request from a single place.
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

interface ApiErrorBody {
  message?: string;
}

// Handle errors (and expiry) in one place.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    if (axios.isCancel(error)) {
      // Caller intentionally aborted (e.g. a newer search started). Let the
      // hook detect this and ignore it instead of showing an error.
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const message =
      error.response?.data?.message ?? error.message ?? "Unexpected error";

    if (status === 401 && typeof window !== "undefined") {
      const url = error.config?.url ?? "";
      const onLoginPage = window.location.pathname.startsWith("/login");
      if (!url.includes("/auth/login") && !onLoginPage) {
        clearSession();
        // Hard navigation on purpose: it fully resets client state after the
        // session expired. Interceptors run outside the React tree, so the
        // Next router is not available here.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = "/login";
      }
    }

    return Promise.reject(new ApiError(message, status));
  },
);
