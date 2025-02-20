import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/Form/InputField';
import Button from '../components/Form/Button';
import LoadingModal from '../components/Loading';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      alert(`Password recovery instructions sent to ${email}`);
      navigate('/login');
    }, 1000);
  };

  if (isLoading) {
    return <LoadingModal />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-500">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-orange-500 rounded-full h-16 w-16 flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">B</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-700">Budmol</h1>
          <p className="text-gray-500">Technology & Design</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-700 mb-4">Recuperar Senha</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            required
          />
          <Button
            type="submit"
            bgColor="bg-orange-500"
            hoverBgColor="hover:bg-orange-600"
            className="w-full py-3 text-white"
          >
            Recuperar Senha
          </Button>
        </form>
        <div className="text-center mt-6">
          <a href="/login" className="text-sm text-orange-500 hover:underline font-medium">
            Voltar ao Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
