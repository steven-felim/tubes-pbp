import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export const authService = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/signin', credentials),
  register: (userData: { name: string; email: string; password: string }) =>
    api.post('/signup', userData),
};

export const threadService = {
  getAll: () => api.get('/threads'),
  create: (threadData: { title: string; content: string; categoryId: string }) =>
    api.post('/threads', threadData),
};

export const categoryService = {
  getAll: () => api.get('/categories'),
};