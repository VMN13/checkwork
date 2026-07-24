// Определяем базовый URL API
// В production на Vercel должен быть установлен VITE_API_BASE_URL
// Если не установлен - используем сервер по умолчанию
const API_BASE_URL = (() => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return 'https://serverusers-lyart.vercel.app';
})();

console.log('[API Client] Base URL:', API_BASE_URL);

export class ApiError extends Error {
  status?: number;
  body?: unknown;

  constructor(message: string, opts?: { status?: number; body?: unknown }) {
    super(message);
    this.name = 'ApiError';
    this.status = opts?.status;
    this.body = opts?.body;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const text = await res.text();
  const data = text ? safeJsonParse(text) : undefined;

  if (!res.ok) {
    throw new ApiError(`Request failed: ${res.status}`, { status: res.status, body: data });
  }

  return data as T;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const apiClient = {
  get: <T,>(path: string) => request<T>(path, { method: 'GET' }),

  post: <T,>(path: string, body: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};
