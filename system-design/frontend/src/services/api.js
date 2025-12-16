import axios from 'axios';
import { API_URL } from '../config/network';

const API_BASE_URL = API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getUsers: () => api.get('/auth/users'),
};

export const messageAPI = {
  getMessages: () => api.get('/messages'),
  sendMessage: (content) => api.post('/messages', { content }),
};

export default api;