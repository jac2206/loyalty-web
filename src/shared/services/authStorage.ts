const TOKEN_KEY = "token";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const sessionToken = sessionStorage.getItem(TOKEN_KEY);

  if (sessionToken) {
    return sessionToken;
  }

  // Migrate tokens saved by older versions and stop using localStorage.
  const legacyToken = localStorage.getItem(TOKEN_KEY);

  if (legacyToken) {
    sessionStorage.setItem(TOKEN_KEY, legacyToken);
    localStorage.removeItem(TOKEN_KEY);
  }

  return legacyToken;
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export function saveAuthSession(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(TOKEN_KEY, token);
}
