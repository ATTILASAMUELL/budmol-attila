import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authRepository } from '../../repositories/authRepository';
import { Role } from '../../enums/Role';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role | string;
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

const storedUser = localStorage.getItem('user');
const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  isLoggedIn: storedUser ? true : false,
  loading: false,
  error: null,
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authRepository.login(credentials);
      const { success, message, data } = response;
      if (!success) {
        return rejectWithValue(message || 'Erro no login');
      }
      const { user, token } = data;
      const mappedUser: User = {
        id: '',
        name: user.name,
        email: user.email,
        role: user.role === 'administrator' ? Role.ADMINISTRADOR : user.role,
        accessToken: token,
        refreshToken: token,
      };
      return mappedUser;
    } catch (error: any) {
      console.error('Erro no loginThunk:', error);
      return rejectWithValue(error.response?.data?.message || 'Erro no login');
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (credentials: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authRepository.register(credentials);
      const { success, message, data } = response;
      if (!success) {
        return rejectWithValue(message || 'Erro no registro');
      }
      const { user, token } = data;
      const mappedUser: User = {
        id: '',
        name: user.name,
        email: user.email,
        role: user.role === 'administrator' ? Role.ADMINISTRADOR : user.role,
        accessToken: token,
        refreshToken: token,
      };
      return mappedUser;
    } catch (error: any) {
      console.error('Erro no registerThunk:', error);
      return rejectWithValue(error.response?.data?.message || 'Erro no registro');
    }
  }
);

export const forgotPasswordThunk = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authRepository.forgotPassword(email);
      const { success, message } = response;
      if (!success) {
        return rejectWithValue(message || 'Erro ao recuperar senha');
      }
      return response;
    } catch (error: any) {
      console.error('Erro no forgotPasswordThunk:', error);
      return rejectWithValue(error.response?.data?.message || 'Erro ao recuperar senha');
    }
  }
);

export const refreshTokenThunk = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const refreshToken = state.auth.user?.refreshToken;
      if (!refreshToken) throw new Error('No refresh token available');
      const response = await authRepository.refreshToken(refreshToken);
      const { success, message, data } = response;
      if (!success) {
        return rejectWithValue(message || 'Erro ao atualizar token');
      }
      const { accessToken, refreshToken: newRefreshToken } = data;
      return { accessToken, refreshToken: newRefreshToken };
    } catch (error: any) {
      console.error('Erro no refreshTokenThunk:', error);
      return rejectWithValue(error.response?.data?.message || 'Erro ao atualizar token');
    }
  }
);

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const refreshToken = state.auth.user?.refreshToken;
      if (!refreshToken) throw new Error('Refresh token não encontrado');
      const response = await authRepository.logout();
      if (!response.success) {
        return rejectWithValue(response.message || 'Erro ao realizar logout');
      }
      dispatch(logout());
      return response;
    } catch (error: any) {
      console.error('Erro no logoutThunk:', error);
      return rejectWithValue(error.response?.data?.message || 'Erro ao realizar logout');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
        state.error = null;
        localStorage.setItem('token', action.payload.accessToken);
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
        state.error = null;
        localStorage.setItem('token', action.payload.accessToken);
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(refreshTokenThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        refreshTokenThunk.fulfilled,
        (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
          state.loading = false;
          if (state.user) {
            state.user.accessToken = action.payload.accessToken;
            state.user.refreshToken = action.payload.refreshToken;
            localStorage.setItem('token', action.payload.accessToken);
            localStorage.setItem('user', JSON.stringify(state.user));
          }
          state.error = null;
        }
      )
      .addCase(refreshTokenThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
