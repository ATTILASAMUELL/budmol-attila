import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { Role } from '../enums/Role';
import { Event } from '../models/Event';
import { createEventRegistrationThunk } from '../features/event/eventRegistrationSlice';
import Swal from 'sweetalert2';

interface CardProps {
  event: Event;
}

const Card: React.FC<CardProps> = ({ event }) => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const [isRegistered, setIsRegistered] = useState(event.registered);

  useEffect(() => {
    setIsRegistered(event.registered);
  }, [event.registered]);

  const startDate = new Date(event.start_time);
  const endDate = new Date(event.end_time);

  const formattedStartDate = startDate.toLocaleDateString('pt-BR');
  const formattedStartTime = startDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const formattedEndDate = endDate.toLocaleDateString('pt-BR');
  const formattedEndTime = endDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const handleRegister = async () => {
    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Você precisa estar logado para se inscrever.',
        confirmButtonColor: '#f97316',
      });
      return;
    }

    try {
      await dispatch(createEventRegistrationThunk({ user_id: user.id, event_id: event.id })).unwrap();
      setIsRegistered(true);
      Swal.fire({
        icon: 'success',
        title: 'Inscrição realizada',
        text: 'Você se inscreveu com sucesso neste evento.',
        confirmButtonColor: '#f97316',
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: error || 'Não foi possível realizar a inscrição.',
        confirmButtonColor: '#f97316',
      });
    }
  };

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
      ) : isRegistered ? (
        <span className="bg-green-500 text-white py-1 px-3 rounded text-sm">
          Já Inscrito
        </span>
      ) : event.status === 'open' ? (
        <button
          onClick={handleRegister}
          className="bg-orange-500 text-white py-1 px-3 rounded hover:bg-orange-600 transition-colors text-sm"
        >
          Se Inscrever
        </button>
      ) : null}
    </div>
  );
};

export default Card;
