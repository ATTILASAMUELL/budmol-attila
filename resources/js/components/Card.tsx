import React from 'react';
import { useAppSelector } from '../hooks/hooks';
import { Role } from '../enums/Role';
import { Event } from '../models/Event';

interface CardProps {
  event: Event;
}

const Card: React.FC<CardProps> = ({ event }) => {
  const user = useAppSelector((state) => state.auth.user);

  // Cria os objetos Date a partir das strings
  const startDate = new Date(event.start_time);
  const endDate = new Date(event.end_time);

  // Formata a data (dd/mm/aaaa) e a hora (HH:mm)
  const formattedStartDate = startDate.toLocaleDateString('pt-BR');
  const formattedStartTime = startDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const formattedEndDate = endDate.toLocaleDateString('pt-BR');
  const formattedEndTime = endDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-white border border-orange-500 rounded-lg shadow p-3 w-full max-w-xs">
      <div className="h-24 bg-green-100 rounded flex items-center justify-center mb-3">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="object-cover h-full w-full rounded"
          />
        ) : (
          <svg
            className="w-8 h-8 text-green-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 3h18v18H3V3z" />
            <path d="M9 9h6v6H9V9z" />
          </svg>
        )}
      </div>
      <h2 className="text-lg font-bold text-gray-700">{event.title}</h2>
      <p className="text-sm text-gray-500 mb-3">{event.description}</p>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Início:</strong> {formattedStartDate} às {formattedStartTime}
      </p>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Término:</strong> {formattedEndDate} às {formattedEndTime}
      </p>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Local:</strong> {event.location}
      </p>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Capacidade Máxima:</strong> {event.max_capacity}
      </p>
      <p className="text-sm text-gray-500 mb-3">
        <strong>Status:</strong> {event.status}
      </p>
      {user?.role === Role.ADMINISTRADOR ? (
        <button className="bg-orange-500 text-white py-1 px-3 rounded hover:bg-orange-600 transition-colors text-sm">
          Edição
        </button>
      ) : (
        <button className="bg-orange-500 text-white py-1 px-3 rounded hover:bg-orange-600 transition-colors text-sm">
          Se Inscrever
        </button>
      )}
    </div>
  );
};

export default Card;
