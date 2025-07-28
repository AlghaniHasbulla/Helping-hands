import axios from 'axios';
import store from '../store';

const api = axios.create({
  baseURL: 'https://helping-hands-backend-w4pu.onrender.com/',
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth?.accessToken || localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
