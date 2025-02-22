import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/hooks';
import InputField from '../components/Form/InputField';
import Button from '../components/Form/Button';
import LoadingModal from '../components/Loading';
import { registerThunk } from '../features/auth/authSlice';
import Swal from 'sweetalert2';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'As senhas não coincidem!',
        confirmButtonColor: '#f97316',
      });
      return;
    }
    setIsLoading(true);
    try {
      const password_confirmation = confirmPassword;
      await dispatch(registerThunk({ name, email, password,password_confirmation})).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Sucesso',
        text: `Usuário ${name} cadastrado com sucesso!`,
        confirmButtonColor: '#f97316',
      }).then(() => {
        navigate('/dashboard');
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: error || 'Ocorreu um erro durante o cadastro.',
        confirmButtonColor: '#f97316',
      });
      setIsLoading(false);
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
            <p className="text-gray-500">Tecnologia &amp; Design</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-700 mb-4">Cadastro</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <InputField
              label="Nome"
              labelColor="text-gray-700"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome"
              required
              className="h-10"
            />
            <InputField
              label="Email"
              labelColor="text-gray-700"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              required
              className="h-10"
            />
            <InputField
              label="Senha"
              labelColor="text-gray-700"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
              className="h-10"
            />
            <InputField
              label="Confirmar Senha"
              labelColor="text-gray-700"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua senha"
              required
              className="h-10"
            />
            <Button
              type="submit"
              bgColor="bg-orange-500"
              hoverBgColor="hover:bg-orange-600"
              className="w-full py-3 text-white"
            >
              Cadastrar
            </Button>
          </form>
          <div className="text-center mt-6">
            <a
              href="/login"
              className="text-sm text-orange-500 hover:underline font-medium"
            >
              Já possui uma conta? Faça login
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

export default Register;
