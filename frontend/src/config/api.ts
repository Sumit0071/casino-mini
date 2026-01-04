// src/config/api.ts

// Update this URL to match your backend
export const API_BASE_URL = 'http://localhost:3000/api/v1';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
  GAMES: `${API_BASE_URL}/games`,
  FAVORITES: `${API_BASE_URL}/favorites`,
};