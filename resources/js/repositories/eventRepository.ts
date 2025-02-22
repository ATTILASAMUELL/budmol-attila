import api from './axiosConfig';
import { RoutesApi } from './routes';
import { Event } from '../models/Event';

export const eventRepository = {
  create: async (eventData: Event) => {
    const response = await api.post(RoutesApi.EVENT_CREATE, eventData);
    return response.data;
  },
  update: async (eventId: number|undefined, eventData: Partial<Event>) => {
    const response = await api.put(`${RoutesApi.EVENT_UPDATE}/${eventId}`, eventData);
    return response.data;
  },
  list: async () => {
    const response = await api.get(RoutesApi.EVENT_LIST);
    return response.data;
  },
  delete: async (eventId: number|undefined) => {
    const response = await api.delete(`${RoutesApi.EVENT_DELETE}/${eventId}`);
    return response.data;
  },
};
