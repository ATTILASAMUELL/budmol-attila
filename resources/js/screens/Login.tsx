import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import InputField from '../components/Form/InputField';
import Button from '../components/Form/Button';
import LoadingModal from '../components/Loading';

import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { loginThunk } from '../features/auth/authSlice';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, isLoggedIn, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    console.log(error);
    if (error) {
      Swal.fire({
        title: 'Erro!',
        text: error,
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#F97316',
      });
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validação para garantir que a senha tenha pelo menos 6 caracteres
    if (password.length < 6) {
      Swal.fire({
        title: 'Atenção!',
        text: 'A senha precisa ter pelo menos 6 caracteres.',
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#F97316',
      });
      return;
    }

    dispatch(loginThunk({ email, password }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-500 relative">
      {loading && <LoadingModal />}

      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-orange-500 rounded-full h-16 w-16 flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">B</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-700">Budmol</h1>
          <p className="text-gray-500">Technology & Design</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Login"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemplo@budmol.com"
            required
          />

          <InputField
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
          />

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-orange-500 accent-orange-500"
              />
              <span className="ml-2">Lembre-me?</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-orange-500 hover:underline">
              Esqueci Senha?
            </Link>
          </div>

          <Button
            type="submit"
            bgColor="bg-orange-500"
            hoverBgColor="hover:bg-orange-600"
            className="w-full py-3 text-white"
          >
            Entrar
          </Button>
        </form>

        {/* Rodapé */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Novo no Budmol?{' '}
            <Link to="/register" className="text-orange-500 hover:underline font-medium">
              Inscreva-se aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
