import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authRepository } from '../../repositories/authRepository';
import { Role } from '../../enums/Role';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

// Thunk para login
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await authRepository.login(credentials);
      return data; // Deve retornar o objeto de usuário com accessToken, refreshToken, role, etc.
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erro no login'
      );
    }
  }
);

// Thunk para registro
export const registerThunk = createAsyncThunk(
  'auth/register',
  async (
    credentials: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await authRepository.register(credentials);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erro no registro'
      );
    }
  }
);

// Thunk para recuperação de senha
export const forgotPasswordThunk = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const data = await authRepository.forgotPassword(email);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erro ao recuperar senha'
      );
    }
  }
);

// Thunk para refresh token
export const refreshTokenThunk = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const refreshToken = state.auth.user?.refreshToken;
      if (!refreshToken) throw new Error('No refresh token available');
      const data = await authRepository.refreshToken(refreshToken);
      return data; // Ex: { accessToken, refreshToken }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erro ao atualizar token'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Logout é uma ação síncrona que limpa o estado
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      loginThunk.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
        state.error = null;
      }
    );
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.isLoggedIn = false;
      state.user = null;
    });

    // Register
    builder.addCase(registerThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      registerThunk.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
        state.error = null;
      }
    );
    builder.addCase(registerThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Forgot Password
    builder.addCase(forgotPasswordThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(forgotPasswordThunk.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(forgotPasswordThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Refresh Token
    builder.addCase(refreshTokenThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      refreshTokenThunk.fulfilled,
      (
        state,
        action: PayloadAction<{ accessToken: string; refreshToken: string }>
      ) => {
        state.loading = false;
        if (state.user) {
          state.user.accessToken = action.payload.accessToken;
          state.user.refreshToken = action.payload.refreshToken;
        }
        state.error = null;
      }
    );
    builder.addCase(refreshTokenThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
