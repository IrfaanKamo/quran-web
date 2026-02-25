import { useAuthStore } from "@/store/useAuthStore";
import tadabburApi from "./tadabbur-api";

export async function register(username: string, email: string, password: string) {
  try {
    const response = await tadabburApi.post("/auth/register", {
      username,
      email,
      password,
    });

    const { user, expiresInMinutes } = response.data;
    useAuthStore.getState().setAuth(user, expiresInMinutes || 28);

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 409) {
      throw error.response.data;
    }
    throw new Error(error.response?.data?.message || "Registration failed");
  }
}

export async function login(username: string, password: string) {
  try {
    const response = await tadabburApi.post("/auth/login", { username, password });

    const { user, expiresInMinutes } = response.data;
    useAuthStore.getState().setAuth(user, expiresInMinutes || 28);

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
}

export async function logout() {
  try {
    await tadabburApi.post("/auth/logout");
  } catch (error) {
    console.error("Backend logout failed, clearing local state anyway.");
  } finally {
    useAuthStore.getState().logout();
  }
}
