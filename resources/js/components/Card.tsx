import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { Role } from '../enums/Role';
import { Event } from '../models/Event';
import { createEventRegistrationThunk } from '../features/event/eventRegistrationSlice';
import { updateEventThunk, deleteEventThunk } from '../features/event/eventSlice'; // Importa a thunk de atualização e exclusão
import Swal from 'sweetalert2';
import ModalForm, { EventFormData } from './ModalForm';

interface CardProps {
  event: Event;
}

const Card: React.FC<CardProps> = ({ event }) => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const [isRegistered, setIsRegistered] = useState(event.registered);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
    try {
      await dispatch(createEventRegistrationThunk({ event_id: event.id })).unwrap();
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

  const handleEditSubmit = async (formData: EventFormData) => {
    try {
      await dispatch(updateEventThunk({ eventId: event.id, eventData: formData })).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Evento Atualizado',
        text: 'O evento foi atualizado com sucesso!',
        confirmButtonColor: '#f97316',
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao atualizar',
        text: error || 'Não foi possível atualizar o evento.',
        confirmButtonColor: '#f97316',
      });
    } finally {
      setIsEditModalOpen(false);
    }
  };

  const handleDelete = async () => {
    const confirmResult = await Swal.fire({
      title: 'Excluir evento',
      text: 'Tem certeza de que deseja excluir este evento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
    });

    if (confirmResult.isConfirmed) {
      try {
        await dispatch(deleteEventThunk(String(event.id))).unwrap();
        Swal.fire({
          icon: 'success',
          title: 'Evento excluído com sucesso',
          confirmButtonColor: '#f97316',
        });
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao excluir evento',
          text: error || 'Não foi possível excluir o evento.',
          confirmButtonColor: '#f97316',
        });
      }
    }
  };

  return (
    <>
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
          <div className="flex gap-2">
            <button
              className="bg-orange-500 text-white py-1 px-3 rounded hover:bg-orange-600 transition-colors text-sm"
              onClick={() => setIsEditModalOpen(true)}
            >
              Edição
            </button>
            <button
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-colors text-sm"
              onClick={handleDelete}
            >
              Excluir
            </button>
          </div>
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

      {/* Modal para Edição */}
      <ModalForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={{
          title: event.title,
          description: event.description,
          start_time: event.start_time,
          end_time: event.end_time,
          location: event.location,
          max_capacity: event.max_capacity,
          status: event.status,
        }}
      />
    </>
  );
};

export default Card;
