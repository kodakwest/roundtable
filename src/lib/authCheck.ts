const AUTH_CHECK_URL = "https://logos-core.com/api/auth/check";
const LOGIN_URL = "https://logos-core.com/login";

export interface AuthUser {
  email: string;
}

export async function checkAuth(): Promise<AuthUser | null> {
  try {
    const response = await fetch(AUTH_CHECK_URL, {
      credentials: "include",
    });
    if (!response.ok) return null;

    const data = (await response.json()) as { user?: AuthUser };
    return data.user ?? null;
  } catch {
    return null;
  }
}

export function redirectToLogin() {
  const redirect = encodeURIComponent(window.location.origin + window.location.pathname);
  window.location.href = `${LOGIN_URL}?redirect=${redirect}`;
}
