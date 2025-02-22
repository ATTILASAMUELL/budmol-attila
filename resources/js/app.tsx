import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import ForgotPassword from './screens/ForgotPassword';
import Register from './screens/Register';
import Help from './screens/Help';
import Config from './screens/Config';
import ProtectedRoute from './ProtectedRoute';
import { useAppSelector } from './hooks/hooks';

const FallbackRoute: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/help-support"
            element={
              <ProtectedRoute>
                <Help />
              </ProtectedRoute>
            }
          />
          <Route
            path="/config"
            element={
              <ProtectedRoute>
                <Config />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<FallbackRoute />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}

export default App;
