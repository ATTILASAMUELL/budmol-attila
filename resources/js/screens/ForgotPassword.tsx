import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import InputField from '../components/Form/InputField';
import Button from '../components/Form/Button';
import LoadingModal from '../components/Loading';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { forgotPasswordThunk } from '../features/auth/authSlice';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading } = useAppSelector((state) => state.auth);
  const isLoading = loading || localLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalLoading(true);
    try {
      await dispatch(forgotPasswordThunk(email)).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Sucesso',
        text: `Instruções para recuperação de senha enviadas para ${email}`,
        confirmButtonColor: '#F97316',
      }).then(() => {
        navigate('/login');
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: error || 'Ocorreu um erro ao recuperar a senha.',
        confirmButtonColor: '#F97316',
      });
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="relative">
      <div
        className={`flex items-center justify-center min-h-screen bg-orange-500 ${
          isLoading ? 'filter blur-sm' : ''
        }`}
      >
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-orange-500 rounded-full h-16 w-16 flex items-center justify-center mb-4">
              <span className="text-white text-2xl font-bold">B</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-700">Budmol</h1>
            <p className="text-gray-700">Tecnologia &amp; Design</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Recuperar Senha
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Email"
              labelColor="text-gray-700"
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
            <a
              href="/login"
              className="text-sm text-orange-500 hover:underline font-medium"
            >
              Voltar ao Login
            </a>
          </div>
        </div>
      </div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingModal />
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
