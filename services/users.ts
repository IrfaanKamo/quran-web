import { useAuthStore } from "@/store/useAuthStore";
import tadabburApi from "./tadabbur-api";

interface UpdateUserPayload {
  username?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export async function updateUser(id: string, payload: UpdateUserPayload) {
  try {
    const response = await tadabburApi.patch(`/users/${id}`, payload);
    useAuthStore.getState().setUser(response.data);

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 409) {
      throw error.response.data;
    }
    throw new Error(error.response?.data?.message || "Failed to update user");
  }
}
