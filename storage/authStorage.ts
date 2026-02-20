import { AuthStorage } from "@/types/storage";

export class LocalAuthStorage implements AuthStorage {
  setAccessTokenExpiry(minutesToExpiry: number): void {
    const expiresAt = Date.now() + minutesToExpiry * 60 * 1000;
    localStorage.setItem("accessToken_expiry", expiresAt.toString());
  }

  getAccessTokenExpiry(): string | null {
    return localStorage.getItem("accessToken_expiry");
  }

  clearAccessTokenExpiry(): void {
    localStorage.removeItem("accessToken_expiry");
  }
}
