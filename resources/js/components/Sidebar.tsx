import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  BookOpenIcon,
  QuestionMarkCircleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import Button from './Form/Button';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { logoutThunk } from '../features/auth/authSlice';
import Swal from 'sweetalert2';
import LoadingModal from './Loading';
import { Role } from '../enums/Role';

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  const subscriptionsText =
    user?.role === Role.ADMINISTRADOR ? 'Clientes' : 'Minhas Inscrições';

  const handleLogout = () => {
    setLoading(true);
    dispatch(logoutThunk())
      .unwrap()
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao sair',
          text: error,
        });
      });
  };

  return (
    <>
      {loading && <LoadingModal />}
      <aside className="w-72 bg-orange-500 h-screen flex flex-col justify-between border-r border-orange-600">
        <div>
          <div className="flex items-center px-6 py-4">
            <div className="bg-white rounded-full h-10 w-10 flex items-center justify-center mr-2">
              <span className="text-orange-500 font-bold">B</span>
            </div>
            <span className="text-xl font-bold text-white">Budmol</span>
          </div>
          <nav className="mt-4 px-2">
            <p className="text-xs font-semibold text-orange-200 mb-2">MENU</p>
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/overview"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm rounded-md hover:bg-orange-600 hover:text-white ${
                      isActive ? 'bg-orange-600 text-white font-medium' : 'text-white'
                    }`
                  }
                >
                  <HomeIcon className="h-5 w-5 mr-3" />
                  Overview
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/subscriptions"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm rounded-md hover:bg-orange-600 hover:text-white ${
                      isActive ? 'bg-orange-600 text-white font-medium' : 'text-white'
                    }`
                  }
                >
                  <BookOpenIcon className="h-5 w-5 mr-3" />
                  {subscriptionsText}
                </NavLink>
              </li>
            </ul>
            <p className="text-xs font-semibold text-orange-200 mt-6 mb-2">OUTROS:</p>
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/help-support"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm rounded-md hover:bg-orange-600 hover:text-white ${
                      isActive ? 'bg-orange-600 text-white font-medium' : 'text-white'
                    }`
                  }
                >
                  <QuestionMarkCircleIcon className="h-5 w-5 mr-3" />
                  Ajuda e Suporte
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/config"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm rounded-md hover:bg-orange-600 hover:text-white ${
                      isActive ? 'bg-orange-600 text-white font-medium' : 'text-white'
                    }`
                  }
                >
                  <Cog6ToothIcon className="h-5 w-5 mr-3" />
                  Configurações
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
        <div className="px-4 py-3 border-t border-orange-600 flex items-center justify-between">
          <div className="flex items-center">
            <div>
              <p className="text-white font-semibold">{user?.name}</p>
              <p className="text-sm text-orange-200">{user?.role}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            bgColor="bg-white"
            hoverBgColor="hover:bg-gray-100"
            className="text-orange-500"
          >
            Sair
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
