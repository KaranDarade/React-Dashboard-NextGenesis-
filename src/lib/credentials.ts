import type { AuthUser } from "@/types/product";

/**
 * App-level admin credentials.
 *
 * DummyJSON only validates its own demo accounts (emilys / emilyspass), so the
 * app accepts these credentials locally and, for the admin sign-in, exchanges
 * them for the demo account under the hood to obtain a real token. The profile
 * shown in the UI is the admin identity below.
 */
export const ADMIN_CREDENTIALS = {
  username: "daradekaran123@gmail.com",
  password: "KaranStore@123",
} as const;

export const DEMO_CREDENTIALS = {
  username: "emilys",
  password: "emilyspass",
} as const;

export const ADMIN_IDENTITY = {
  username: "daradekaran123@gmail.com",
  email: "daradekaran123@gmail.com",
  firstName: "Karan",
  lastName: "Darade",
} as const;

export function isAdminCredentials(
  username: string,
  password: string,
): boolean {
  return (
    username.trim().toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase() &&
    password === ADMIN_CREDENTIALS.password
  );
}

/**
 * Force the displayed identity to the admin. DummyJSON's token belongs to its
 * demo account, so both stored sessions and `/auth/me` can otherwise leak the
 * demo name into the UI. Every read of a user is normalised through this.
 */
export function buildDisplayUser(apiUser: AuthUser): AuthUser {
  return {
    id: apiUser.id,
    username: ADMIN_IDENTITY.username,
    email: ADMIN_IDENTITY.email,
    firstName: ADMIN_IDENTITY.firstName,
    lastName: ADMIN_IDENTITY.lastName,
    gender: apiUser.gender,
    image: "",
  };
}
