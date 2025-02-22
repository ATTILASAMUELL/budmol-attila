export enum EventStatus {
    OPEN = 'open',
    CLOSED = 'closed',
    CANCELED = 'canceled',
  }

  export interface Event {
    id?: number;
    title: string;
    image: string,
    registered: boolean,
    description: string;
    start_time: string;
    end_time: string;
    location: string;
    max_capacity: number;
    status: EventStatus;
  }
