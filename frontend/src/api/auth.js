import apiClient from './client';

/**
 * Register a new user account
 */
export const registerUser = async (email, password) => {
  const response = await apiClient.post('/auth/register', { email, password });
  return response.data;
};

/**
 * Authenticate credentials and retrieve JWT tokens
 */
export const loginUser = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

/**
 * Fetch authenticated user's profile details
 */
export const fetchCurrentUser = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};