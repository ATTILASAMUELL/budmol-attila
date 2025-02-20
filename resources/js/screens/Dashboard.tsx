// resources/js/screens/Dashboard.tsx
import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/Card';
import ModalForm from '../components/ModalForm';

const Dashboard: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const cardsData = [
    { title: 'Evento 1', description: 'Short description #1.' },
    { title: 'Evento 2', description: 'Short description #2.' },
    { title: 'Evento 3', description: 'Short description #3.' },
  ];

  const handleModalSubmit = (data: any) => {
    console.log('Evento criado:', data);
    setModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Lista de Cards</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
        >
          Criar Evento
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-8 gap-0">
        {cardsData.map((item, index) => (
          <Card key={index} title={item.title} description={item.description} />
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
