const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function request(path: string, options: RequestInit = {}) {
  const url = `${API_URL}${path}`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Network response was not ok' }));
    const error = new Error(errorData.detail || response.statusText);
    (error as any).response = { data: errorData, status: response.status };
    throw error;
  }

  // Handle No Content (204) or empty responses
  if (response.status === 204) return null;
  
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }
  
  return await response.text();
}

export const api = {
  get: (path: string, options?: RequestInit) => request(path, { ...options, method: 'GET' }),
  post: (path: string, data?: any, options?: RequestInit) => {
    const isJson = !options?.headers || !(options.headers as any)['Content-Type'] || (options.headers as any)['Content-Type'] === 'application/json';
    return request(path, { 
      ...options, 
      method: 'POST', 
      body: isJson ? JSON.stringify(data) : data
    });
  },
  put: (path: string, data?: any, options?: RequestInit) => {
    const isJson = !options?.headers || !(options.headers as any)['Content-Type'] || (options.headers as any)['Content-Type'] === 'application/json';
    return request(path, { 
      ...options, 
      method: 'PUT', 
      body: isJson ? JSON.stringify(data) : data
    });
  },
  delete: (path: string, options?: RequestInit) => request(path, { ...options, method: 'DELETE' }),
};

export default api;
