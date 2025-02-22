import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/Card';
import ModalForm, { EventFormData } from '../components/ModalForm';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { Role } from '../enums/Role';
import { createEventThunk, listEventsThunk } from '../features/event/eventSlice';
import Swal from 'sweetalert2';

const Dashboard: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const events = useAppSelector((state) => state.event?.events) || [];
  const error = useAppSelector((state) => state.event?.error);

  useEffect(() => {
    dispatch(listEventsThunk());
  }, [dispatch]);

  const handleModalSubmit = async (data: EventFormData) => {
    try {
      await dispatch(createEventThunk(data)).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Evento criado com sucesso',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      setModalOpen(false);
      dispatch(listEventsThunk());
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao criar evento',
        text: error.toString(),
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Lista de Eventos</h1>
        {user?.role === Role.ADMINISTRADOR && (
          <button
            onClick={() => setModalOpen(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
          >
            Criar Evento
          </button>
        )}
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-8 gap-4">
        {/* Filtra itens indefinidos, se houver */}
        {events
          .filter((event) => event)
          .map((event) => (
            <Card key={event.id} event={event} />
          ))}
      </div>

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
