import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Event } from '../../models/Event';
import { eventRepository } from '../../repositories/eventRepository';

interface EventState {
  events: Event[];
  loading: boolean;
  error: string | null;
}

const initialState: EventState = {
  events: [],
  loading: false,
  error: null,
};

export const createEventThunk = createAsyncThunk(
  'event/create',
  async (eventData: Event, { rejectWithValue }) => {
    try {
      const response = await eventRepository.create(eventData);
      const { success, message, data } = response;
      if (!success) {
        return rejectWithValue(message || 'Erro ao criar evento');
      }
      return data.event;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao criar evento');
    }
  }
);

export const updateEventThunk = createAsyncThunk(
  'event/update',
  async (
    { eventId, eventData }: { eventId: number; eventData: Partial<Event> },
    { rejectWithValue }
  ) => {
    try {
      const response = await eventRepository.update(eventId, eventData);
      const { success, message, data } = response;
      if (!success) {
        return rejectWithValue(message || 'Erro ao atualizar evento');
      }
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao atualizar evento');
    }
  }
);

export const listEventsThunk = createAsyncThunk(
  'event/list',
  async (_, { rejectWithValue }) => {
    try {
      const response = await eventRepository.list();
      const { success, message, data } = response;
      if (!success) {
        return rejectWithValue(message || 'Erro ao listar eventos');
      }
      return Array.isArray(data) ? data : data.events;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao listar eventos');
    }
  }
);

export const deleteEventThunk = createAsyncThunk(
  'event/delete',
  async (eventId: number, { rejectWithValue }) => {
    try {
      const response = await eventRepository.delete(eventId);
      const { success, message } = response;
      if (!success) {
        return rejectWithValue(message || 'Erro ao deletar evento');
      }
      return eventId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao deletar evento');
    }
  }
);

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createEventThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEventThunk.fulfilled, (state, action: PayloadAction<Event>) => {
        state.loading = false;
        state.events.push(action.payload);
        state.error = null;
      })
      .addCase(createEventThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateEventThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEventThunk.fulfilled, (state, action: PayloadAction<Event>) => {
        state.loading = false;
        state.events = state.events.map((event) =>
          event.id === action.payload.id ? action.payload : event
        );
        state.error = null;
      })
      .addCase(updateEventThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // List
      .addCase(listEventsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listEventsThunk.fulfilled, (state, action: PayloadAction<Event[]>) => {
        state.loading = false;
        state.events = action.payload;
        state.error = null;
      })
      .addCase(listEventsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteEventThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEventThunk.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.events = state.events.filter((event) => event.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteEventThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default eventSlice.reducer;
