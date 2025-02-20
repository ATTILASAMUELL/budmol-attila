import api from './axiosConfig';
import { RoutesApi } from './routes';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export const authRepository = {
    login: async (credentials: { email: string; password: string }) => {
      const response = await api.post(RoutesApi.LOGIN, credentials);
      return response.data;
    },
    register: async (credentials: { name: string; email: string; password: string }) => {
      const response = await api.post(RoutesApi.REGISTER, credentials);
      return response.data;
    },
    forgotPassword: async (email: string) => {
      const response = await api.post(RoutesApi.FORGOT_PASSWORD, { email });
      return response.data;
    },
    refreshToken: async (refreshToken: string) => {
      const response = await api.post(RoutesApi.REFRESH_TOKEN, { refreshToken });
      return response.data;
    },
  };
