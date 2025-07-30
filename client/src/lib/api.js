import axios from 'axios';

const api = axios.create({
  baseURL: 'https://helping-hands-backend-w4pu.onrender.com',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    console.log('Adding token to request:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
