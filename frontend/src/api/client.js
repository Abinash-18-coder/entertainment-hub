import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach Access Token to every outgoing request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cineverse_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Expiration (401) and Auto-Refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and request has not already been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('cineverse_refresh_token');

      // If no refresh token exists, clear state and reject
      if (!refreshToken || originalRequest.url.includes('/auth/refresh')) {
        localStorage.removeItem('cineverse_access_token');
        localStorage.removeItem('cineverse_refresh_token');
        return Promise.reject(error);
      }

      try {
        // Request a new access token from FastAPI backend
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'}/auth/refresh`,
          { refresh_token: refreshToken }
        );

        const { access_token, refresh_token: newRefreshToken } = response.data;

        // Store renewed tokens
        localStorage.setItem('cineverse_access_token', access_token);
        if (newRefreshToken) {
          localStorage.setItem('cineverse_refresh_token', newRefreshToken);
        }

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token expired or revoked - log user out
        localStorage.removeItem('cineverse_access_token');
        localStorage.removeItem('cineverse_refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;