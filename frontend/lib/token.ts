// The frontend and API are separate origins (see README "Architecture
// notes"), so the JWT travels as a Bearer header rather than a cookie.
// It lives in localStorage, guarded so this module is safe to import from
// server-rendered code paths that never actually touch `window`.
const TOKEN_KEY = "vroomly_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}
