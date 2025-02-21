import React from 'react';
import GenericLayout from '../GenericLayout';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <GenericLayout>
      {children}
    </GenericLayout>
  );
};

export default DashboardLayout;
