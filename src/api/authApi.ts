import { apiClient } from "./client";

export type LoginResponse = {
  accessToken: string;
};

export const authApi = {
  login: (payload: { email: string; password: string }) =>
    apiClient.post<LoginResponse>("/auth/login", payload),

  register: (payload: { email: string; password: string; name?: string }) =>
    apiClient.post<LoginResponse>("/auth/register", payload),
};
