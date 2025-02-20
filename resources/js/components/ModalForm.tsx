// resources/js/components/ModalForm.tsx
import React, { useState } from 'react';
import InputField from './Form/InputField';
import SelectField from './Form/SelectField';
import Button from './Form/Button';

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

interface FormData {
  titulo: string;
  descricao: string;
  inicio: string;
  termino: string;
  localizacao: string;
  capacidade: number;
  status: string;
}

const ModalForm: React.FC<ModalFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [inicio, setInicio] = useState('');
  const [termino, setTermino] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [capacidade, setCapacidade] = useState<number>(0);
  const [status, setStatus] = useState('aberto para inscrições');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData: FormData = { titulo, descricao, inicio, termino, localizacao, capacidade, status };
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-50">
      <div className="bg-orange-500 rounded-lg shadow-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Criar Evento </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl leading-none">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Título"
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Digite o título"
            required
          />
          <InputField
            label="Descrição"
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Digite a descrição"
            required
            multiline
          />
          <InputField
            label="Data e Hora Início"
            type="datetime-local"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
            required
          />
          <InputField
            label="Data e Hora Término"
            type="datetime-local"
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
            required
          />
          <InputField
            label="Localização"
            type="text"
            value={localizacao}
            onChange={(e) => setLocalizacao(e.target.value)}
            placeholder="Digite a localização"
            required
          />
          <InputField
            label="Capacidade Máxima"
            type="number"
            value={capacidade}
            onChange={(e) => setCapacidade(parseInt(e.target.value))}
            required
          />
          <SelectField
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            options={[
              { value: 'aberto para inscrições', label: 'Aberto para inscrições' },
              { value: 'encerrado', label: 'Encerrado' },
              { value: 'cancelado', label: 'Cancelado' },
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
  );
};

export default ModalForm;
