import React, { useState } from 'react';
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
}

const ModalForm: React.FC<ModalFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start_time, setStart_time] = useState('');
  const [end_time, setEnd_time] = useState('');
  const [location, setLocation] = useState('');
  const [max_capacity, setMax_capacity] = useState<number>(0);
  const [status, setStatus] = useState<EventStatus>(EventStatus.OPEN);
  const [loading, setLoading] = useState(false);

  // Converte o valor retornado do input datetime-local para o formato "YYYY-MM-DD HH:mm:ss"
  const formatDatetime = (datetime: string) => {
    if (!datetime) return '';
    return datetime.replace('T', ' ') + ':00';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedStart = formatDatetime(start_time);
    const formattedEnd = formatDatetime(end_time);
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
            <h2 className="text-xl font-bold text-white">Criar Evento</h2>
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
              onChange={(e) => setMax_capacity(parseInt(e.target.value))}
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
                Criar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ModalForm;
