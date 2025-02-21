import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface GenericLayoutProps {
  children: React.ReactNode;
}

const GenericLayout: React.FC<GenericLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default GenericLayout;
