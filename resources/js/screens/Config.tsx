import React from 'react';
import GenericLayout from '../components/GenericLayout';
import { useAppSelector } from '../hooks/hooks';

const Config: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <GenericLayout>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-white border border-orange-500 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Configurações</h2>
          {user && (
            <div className="mt-4 space-y-2">
              <p>
                <strong>Nome:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Papel:</strong> {user.role}
              </p>
            </div>
          )}
        </div>
      </div>
    </GenericLayout>
  );
};

export default Config;
