// Determine API URL based on environment
const getApiUrl = () => {
    // Check if custom API URL is provided (for development with separate backend)
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    
    // In production/same domain deployment, use relative path
    // ALB routes /api/* to backend
    return '/api/v1';
  };

const API_URL = getApiUrl();

export const API_ENDPOINTS = {
  BASE_URL: API_URL,
  DALLE: `${API_URL}/dalle`,
  POST: `${API_URL}/post`,
};

export default API_ENDPOINTS;