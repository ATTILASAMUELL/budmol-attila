import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
});


api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
