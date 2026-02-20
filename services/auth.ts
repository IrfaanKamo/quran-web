import { LocalAuthStorage } from "@/storage/authStorage";
import { AuthStorage } from "@/types/storage";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function register(username: string, email: string, password: string) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    const error = await response.json();

    if (response.status === 409) {
      // Example error shape:
      // { field: "email", message: "Email already exists" }
      throw error;
    }

    throw new Error("Registration failed");
  }

  // successful registration
  const storage: AuthStorage = new LocalAuthStorage();
  const _accessTokenExpiryMinsRemaining = 28;
  storage.setAccessTokenExpiry(_accessTokenExpiryMinsRemaining);

  return response.json();
}

export async function login(username: string, password: string) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });

  // login failed
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  // successful login
  const storage: AuthStorage = new LocalAuthStorage();
  const _accessTokenExpiryMinsRemaining = 28;
  storage.setAccessTokenExpiry(_accessTokenExpiryMinsRemaining);

  return response.json();
}

export async function logout() {
  const response = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  // logout failed
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    if (error) throw error;
    throw new Error("Logout failed");
  }

  // successfully logged out
  const storage: AuthStorage = new LocalAuthStorage();
  storage.clearAccessTokenExpiry();

  return response.json().catch(() => null);
}

async function refreshAccessToken() {
  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token refresh failed");
  }

  const data = await response.json();
  const storage: AuthStorage = new LocalAuthStorage();

  // Update token expiry - assumes API returns expiresIn (minutes) or similar
  const expiresInMins = data.expiresIn || 28;
  storage.setAccessTokenExpiry(expiresInMins);

  return data;
}

function isAccessTokenExpired(): boolean {
  const storage: AuthStorage = new LocalAuthStorage();
  const expiryTime = storage.getAccessTokenExpiry();

  if (!expiryTime) {
    return true;
  }

  return Date.now() >= parseInt(expiryTime, 10);
}

export async function callProtectedEndpoint(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  // Check if token is expired
  if (isAccessTokenExpired()) {
    await refreshAccessToken();
  }

  // Make the protected endpoint call
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // If we get a 401, the token might be invalid, try refreshing once more
  if (response.status === 401) {
    await refreshAccessToken();

    return fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  }

  return response;
}
