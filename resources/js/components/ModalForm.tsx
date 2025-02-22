import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import InputField from './Form/InputField';
import SelectField from './Form/SelectField';
import Button from './Form/Button';
import LoadingModal from './Loading';
import { Event, EventStatus } from '../models/Event';

export type EventFormData = Omit<Event, 'id'>;

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData) => Promise<void>;
  initialData?: EventFormData;
}

const ModalForm: React.FC<ModalFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  // Inicializa a capacidade com 1 se não houver valor inicial ou se for menor que 1
  const initialCapacity = initialData && initialData.max_capacity > 0 ? initialData.max_capacity : 1;

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  // Os inputs datetime-local precisam do formato "YYYY-MM-DDTHH:mm"
  const [start_time, setStart_time] = useState('');
  const [end_time, setEnd_time] = useState('');
  const [location, setLocation] = useState(initialData?.location || '');
  const [max_capacity, setMax_capacity] = useState<number>(initialCapacity);
  const [status, setStatus] = useState<EventStatus>(initialData?.status || EventStatus.OPEN);
  const [loading, setLoading] = useState(false);

  // Função para converter "YYYY-MM-DD HH:mm:ss" para "YYYY-MM-DDTHH:mm"
  const convertToInputFormat = (datetime: string) => {
    if (!datetime) return '';
    // Exemplo: "2025-02-22 15:30:00" -> "2025-02-22T15:30"
    return datetime.replace(' ', 'T').slice(0, 16);
  };

  // Quando houver dados iniciais, converte os campos de data para o formato do input
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setStart_time(convertToInputFormat(initialData.start_time));
      setEnd_time(convertToInputFormat(initialData.end_time));
      setLocation(initialData.location);
      setMax_capacity(initialData.max_capacity > 0 ? initialData.max_capacity : 1);
      setStatus(initialData.status);
    }
  }, [initialData]);

  // Função para formatar o valor do input para "YYYY-MM-DD HH:mm:ss"
  const formatDatetime = (datetime: string) => {
    if (!datetime) return '';
    // Transforma "YYYY-MM-DDTHH:mm" em "YYYY-MM-DD HH:mm:00"
    return datetime.replace('T', ' ') + ':00';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedStart = formatDatetime(start_time);
    const formattedEnd = formatDatetime(end_time);

    // Validação: end_time deve ser posterior a start_time
    if (new Date(formattedEnd) <= new Date(formattedStart)) {
      Swal.fire({
        icon: 'error',
        title: 'Erro de data',
        text: 'A data e hora de término deve ser posterior à de início.',
        confirmButtonColor: '#f97316',
      });
      return;
    }

    // Validação: capacidade mínima deve ser 1
    if (max_capacity < 1) {
      Swal.fire({
        icon: 'error',
        title: 'Erro de capacidade',
        text: 'A capacidade máxima deve ser, no mínimo, 1.',
        confirmButtonColor: '#f97316',
      });
      return;
    }

    const formData: EventFormData = {
      title,
      description,
      start_time: formattedStart,
      end_time: formattedEnd,
      location,
      max_capacity,
      status,
    };

    setLoading(true);
    try {
      await onSubmit(formData);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {loading && <LoadingModal />}
      <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-50">
        <div className="bg-orange-500 rounded-lg shadow-lg w-full max-w-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">
              {initialData ? 'Editar Evento' : 'Criar Evento'}
            </h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl leading-none">
              &times;
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Título"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título"
              required
            />
            <InputField
              label="Descrição"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite a descrição"
              required
              multiline
            />
            <InputField
              label="Data e Hora Início"
              type="datetime-local"
              value={start_time}
              onChange={(e) => setStart_time(e.target.value)}
              required
            />
            <InputField
              label="Data e Hora Término"
              type="datetime-local"
              value={end_time}
              onChange={(e) => setEnd_time(e.target.value)}
              required
            />
            <InputField
              label="Localização"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Digite a localização"
              required
            />
            <InputField
              label="Capacidade Máxima"
              type="number"
              value={max_capacity}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                setMax_capacity(value < 1 ? 1 : value);
              }}
              required
            />
            <SelectField
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as EventStatus)}
              required
              options={[
                { value: EventStatus.OPEN, label: 'Aberto para inscrições' },
                { value: EventStatus.CLOSED, label: 'Encerrado' },
                { value: EventStatus.CANCELED, label: 'Cancelado' },
              ]}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                bgColor="bg-white"
                hoverBgColor="hover:bg-gray-200"
                className="text-orange-500"
              >
                Salvar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ModalForm;
