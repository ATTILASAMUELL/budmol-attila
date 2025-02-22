import { Role } from '../enums/Role';

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}
export interface User {
    id: string;
    name: string;
    email: string;
    role: Role | string;
    accessToken: string;
    refreshToken: string;
  }
