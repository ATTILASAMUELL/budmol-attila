import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import eventReducer from './features/event/eventSlice';
import eventRegistrationReducer from './features/event/eventRegistrationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    event: eventReducer,
    eventRegistration: eventRegistrationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
