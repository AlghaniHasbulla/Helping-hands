import axios from 'axios';

const api = axios.create({
  baseURL: 'https://helping-hands-backend-w4pu.onrender.com/',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
