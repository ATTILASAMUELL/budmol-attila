import React from 'react';
import { useAppSelector } from '../hooks/hooks';

const Topbar: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const today = new Date();
  const formattedDate = today.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="flex items-center justify-between bg-white shadow px-4 py-2">
      <div>
        <h1 className="text-xl font-bold text-gray-700">
          Olá, {user?.name || 'Convidado'} <span role="img" aria-label="wave">👋</span>
        </h1>

      </div>
      <div className="text-sm text-gray-500">
        {formattedDate}
      </div>
    </header>
  );
};

export default Topbar;
