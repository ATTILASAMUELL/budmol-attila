import api from './axiosConfig';
import { RoutesApi } from './routes';
import { EventRegistration } from '../models/EventRegistration';

export const eventRegistrationRepository = {
  create: async (data: {event_id: number|undefined }): Promise<{
    success: boolean;
    message?: string;
    data?: { registration: EventRegistration };
  }> => {
    const response = await api.post(RoutesApi.EVENT_REGISTRATION, data);
    return response.data;
  },
};
