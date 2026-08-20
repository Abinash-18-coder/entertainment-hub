import apiClient from './client';

/**
 * Fetch paginated list of content with optional filtering and sorting
 */
export const fetchContents = async ({ 
  contentType = null, 
  genreId = null, 
  upcomingOnly = false, 
  sortBy = 'rating', 
  page = 1, 
  pageSize = 20 
}) => {
  const params = {
    sort_by: sortBy,
    page: page,
    page_size: pageSize,
    upcoming_only: upcomingOnly
  };

  if (contentType) params.content_type = contentType;
  if (genreId) params.genre_id = genreId;

  const response = await apiClient.get('/contents/', { params });
  return response.data;
};

/**
 * Fetch all available genres for tag filters
 */
export const fetchGenres = async () => {
  const response = await apiClient.get('/genres/');
  return response.data;
};

/**
 * Search contents by keyword query
 */
export const searchContents = async (query, page = 1) => {
  const response = await apiClient.get('/contents/search', {
    params: { q: query, page }
  });
  return response.data;
};

/**
 * Fetch in-depth details of a specific title (cast, streaming links)
 */
export const fetchContentDetail = async (contentId) => {
  const response = await apiClient.get(`/contents/${contentId}`);
  return response.data;
};