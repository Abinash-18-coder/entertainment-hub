import apiClient from './client';

export const fetchLibraryStatus = async (contentId) => {
  const response = await apiClient.get(`/library/status/${contentId}`);
  return response.data;
};

export const toggleBookmark = async (contentId) => {
  const response = await apiClient.post(`/library/bookmarks/${contentId}`);
  return response.data;
};

export const toggleWatched = async (contentId) => {
  const response = await apiClient.post(`/library/watched/${contentId}`);
  return response.data;
};

export const fetchUserBookmarks = async () => {
  const response = await apiClient.get('/library/bookmarks');
  return response.data;
};

export const fetchUserWatched = async () => {
  const response = await apiClient.get('/library/watched');
  return response.data;
};

/**
 * Fetch personalized recommendations for the authenticated user
 */
export const fetchRecommendations = async () => {
  const response = await apiClient.get('/library/recommendations');
  return response.data;
};