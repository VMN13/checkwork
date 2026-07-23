import { apiClient } from './client';

export type HealthResponse = { status: 'ok' };

export const healthApi = {
  getHealth: () => apiClient.get<HealthResponse>('/health'),
  getHealthDb: () => apiClient.get<HealthResponse>('/health/db'),
};
