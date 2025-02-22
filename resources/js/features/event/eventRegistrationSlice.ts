import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { EventRegistration } from '../../models/EventRegistration';
import { eventRegistrationRepository } from '../../repositories/eventRegistrationRepository';

interface EventRegistrationState {
  registrations: EventRegistration[];
  loading: boolean;
  error: string | null;
}

const initialState: EventRegistrationState = {
  registrations: [],
  loading: false,
  error: null,
};

// Exportação direta na declaração
export const createEventRegistrationThunk = createAsyncThunk(
  'eventRegistration/create',
  async (registrationData: { event_id: string }, { rejectWithValue }) => {
    try {
      const response = await eventRegistrationRepository.create(registrationData);
      const { success, message, data } = response;
      if (!success) {
        return rejectWithValue(message || 'Erro ao se inscrever no evento');
      }
      return data.registration;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erro ao se inscrever no evento'
      );
    }
  }
);

const eventRegistrationSlice = createSlice({
  name: 'eventRegistration',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createEventRegistrationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createEventRegistrationThunk.fulfilled,
        (state, action: PayloadAction<EventRegistration>) => {
          state.loading = false;
          state.registrations.push(action.payload);
          state.error = null;
        }
      )
      .addCase(createEventRegistrationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default eventRegistrationSlice.reducer;
