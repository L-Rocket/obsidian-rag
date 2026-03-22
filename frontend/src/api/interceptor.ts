export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('access_token');
  
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem('access_token');
    // We dispatch a custom event to tell the app to log out if needed
    window.dispatchEvent(new Event('auth-error'));
    throw new AuthError('Authentication failed or expired');
  }

  return response;
};
