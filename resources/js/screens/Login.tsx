// resources/js/screens/Login.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import InputField from '../components/Form/InputField';
import Button from '../components/Form/Button';
import LoadingModal from '../components/Loading';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (email === 'admin@example.com' && password === 'password') {
        navigate('/dashboard');
      } else {
        Swal.fire({
          title: 'Erro!',
          text: 'Credenciais inválidas.',
          icon: 'error',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#F97316'
        });
      }
      setLoading(false);
    }, 2000);
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

          {/* Lembrar e Esqueci a Senha */}
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
